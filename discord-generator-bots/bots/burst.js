import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { RateLimiter } from '../rate-limiter.js';
import { messagePool, getRandomMessage, randomDelay } from '../message-pool.js';

class BurstCollaborator {
  constructor(token, channelId) {
    this.token = token;
    this.channelId = channelId;
    this.rateLimiter = new RateLimiter();
    this.isRunning = false;
    this.messageCount = 0;

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
    });

    this.client.on('ready', () => this.onReady());
  }

  async start() {
    await this.client.login(this.token);
  }

  onReady() {
    console.log(`[BURST] Ready as ${this.client.user.tag}`);
    this.isRunning = true;
    this.burstLoop();
  }

  async burstLoop() {
    while (this.isRunning) {
      try {
        const channel = await this.client.channels.fetch(this.channelId);
        // Smaller, clearer bursts: 2-5 messages
        const burstSize = Math.floor(Math.random() * 4) + 2;

        console.log(`[BURST] Starting burst of ${burstSize} messages`);

        for (let i = 0; i < burstSize; i++) {
          const message = getRandomMessage(messagePool.burst);

          await this.rateLimiter.waitIfNeeded();
          await channel.send(message);

          this.rateLimiter.recordSend();
          this.messageCount++;

          console.log(`[BURST] Sent #${this.messageCount}: "${message}"`);

          if (i < burstSize - 1) {
            // Variable delay between burst messages
            await new Promise(resolve => setTimeout(resolve, randomDelay(800, 2500)));
          }
        }

        // Longer cooldown: 60s to 120s (1-2 minutes between bursts)
        // 15% chance for extended cooldown (3-5 minutes) for dramatic valleys
        const shouldExtendedCool = Math.random() < 0.15;
        const cooldown = shouldExtendedCool
          ? randomDelay(180000, 300000)  // 3-5 minute extended cooldown
          : randomDelay(60000, 120000);  // Normal 1-2 minute cooldown

        if (shouldExtendedCool) {
          console.log(`[BURST] 💤 Extended cooldown: ${(cooldown/1000).toFixed(0)}s`);
        } else {
          console.log(`[BURST] Cooldown for ${(cooldown/1000).toFixed(1)}s`);
        }
        await new Promise(resolve => setTimeout(resolve, cooldown));

      } catch (error) {
        console.error(`[BURST-ERROR]`, error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async stop() {
    this.isRunning = false;
    await this.client.destroy();
    console.log(`[BURST] Stopped. Total messages sent: ${this.messageCount}`);
  }
}

const bot = new BurstCollaborator(process.env.BOT2_TOKEN, process.env.CHANNEL_ID);

process.on('SIGINT', () => bot.stop().then(() => process.exit(0)));
process.on('SIGTERM', () => bot.stop().then(() => process.exit(0)));

bot.start().catch(console.error);
