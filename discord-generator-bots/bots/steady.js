import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { RateLimiter } from '../rate-limiter.js';
import { messagePool, getRandomMessage, randomDelay } from '../message-pool.js';

class SteadyContributor {
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
    console.log(`[STEADY] Ready as ${this.client.user.tag}`);
    this.isRunning = true;
    this.sendLoop();
  }

  async sendLoop() {
    while (this.isRunning) {
      try {
        const channel = await this.client.channels.fetch(this.channelId);
        const message = getRandomMessage(messagePool.steady);

        await this.rateLimiter.waitIfNeeded();
        await channel.send(message);

        this.rateLimiter.recordSend();
        this.messageCount++;

        const status = this.rateLimiter.getStatus();
        console.log(`[STEADY] Sent #${this.messageCount}: "${message}" (${status.available} slots available)`);

        // Slower, more fluctuating: 15s to 90s (fewer messages per minute)
        // 10% chance to take a longer break (2-4 minutes) for dramatic graph dips
        const shouldRest = Math.random() < 0.1;
        const delay = shouldRest
          ? randomDelay(120000, 240000)  // 2-4 minute break
          : randomDelay(15000, 90000);   // Normal 15-90s delay

        if (shouldRest) {
          console.log(`[STEADY] 💤 Taking a break... ${(delay/1000).toFixed(0)}s`);
        } else {
          console.log(`[STEADY] Next message in ${(delay/1000).toFixed(1)}s`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));

      } catch (error) {
        console.error(`[STEADY-ERROR]`, error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  async stop() {
    this.isRunning = false;
    await this.client.destroy();
    console.log(`[STEADY] Stopped. Total messages sent: ${this.messageCount}`);
  }
}

const bot = new SteadyContributor(process.env.BOT1_TOKEN, process.env.CHANNEL_ID);

process.on('SIGINT', () => bot.stop().then(() => process.exit(0)));
process.on('SIGTERM', () => bot.stop().then(() => process.exit(0)));

bot.start().catch(console.error);
