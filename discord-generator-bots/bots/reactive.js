import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { RateLimiter } from '../rate-limiter.js';
import { messagePool, getRandomMessage, randomDelay } from '../message-pool.js';

class ReactiveParticipant {
  constructor(token, channelId, replyChance = 0.3) {
    this.token = token;
    this.channelId = channelId;
    this.replyChance = replyChance;
    this.rateLimiter = new RateLimiter();
    this.messageCount = 0;

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.client.on('ready', () => this.onReady());
    this.client.on('messageCreate', (msg) => this.onMessage(msg));
  }

  async start() {
    await this.client.login(this.token);
  }

  onReady() {
    console.log(`[REACTIVE] Ready as ${this.client.user.tag}`);
    console.log(`[REACTIVE] Reply chance: ${(this.replyChance * 100).toFixed(0)}%`);
  }

  async onMessage(message) {
    if (message.author.bot && message.author.id === this.client.user.id) return;
    if (message.channelId !== this.channelId) return;

    const shouldReply = Math.random() < this.replyChance;

    if (!shouldReply) {
      console.log(`[REACTIVE] Saw message from ${message.author.username}, skipping (${((1-this.replyChance)*100).toFixed(0)}% chance)`);
      return;
    }

    try {
      const typingDelay = randomDelay(2000, 3000);
      console.log(`[REACTIVE] Will reply to ${message.author.username} in ${(typingDelay/1000).toFixed(1)}s`);

      await new Promise(resolve => setTimeout(resolve, typingDelay));

      const reply = getRandomMessage(messagePool.reactive);

      await this.rateLimiter.waitIfNeeded();
      await message.channel.send(reply);

      this.rateLimiter.recordSend();
      this.messageCount++;

      console.log(`[REACTIVE] Sent #${this.messageCount}: "${reply}"`);

    } catch (error) {
      console.error(`[REACTIVE-ERROR]`, error.message);
    }
  }

  async stop() {
    await this.client.destroy();
    console.log(`[REACTIVE] Stopped. Total messages sent: ${this.messageCount}`);
  }
}

const bot = new ReactiveParticipant(
  process.env.BOT3_TOKEN,
  process.env.CHANNEL_ID,
  0.3
);

process.on('SIGINT', () => bot.stop().then(() => process.exit(0)));
process.on('SIGTERM', () => bot.stop().then(() => process.exit(0)));

bot.start().catch(console.error);
