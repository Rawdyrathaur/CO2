import 'dotenv/config';
import { DiscordBot } from './bot.js';
import { ApiClient } from './api-client.js';
import { BatchManager } from './batch-manager.js';

const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8080',
  batchSize: parseInt(process.env.BATCH_SIZE || '10'),
  intervalMs: parseInt(process.env.BATCH_INTERVAL_MS || '30000')
};

class CarbonListener {
  constructor(config) {
    this.bot = new DiscordBot(config.token);
    this.api = new ApiClient(config.backendUrl);
    this.batcher = new BatchManager(this.api, config.batchSize, config.intervalMs);
    this.#wireEvents();
  }

  async start() {
    console.log('[CARBON-LISTENER] Starting...');
    await this.bot.connect();
    this.batcher.start();
  }

  async shutdown() {
    console.log('[CARBON-LISTENER] Shutting down...');
    await this.batcher.shutdown();
    await this.bot.disconnect();
    console.log('[CARBON-LISTENER] Shutdown complete');
    process.exit(0);
  }

  #wireEvents() {
    this.bot.on('ready', ({ username, guilds }) => {
      console.log(`[BOT] Ready as ${username} (${guilds} servers)`);
    });

    this.bot.on('valid-message', ({ author, channel }) => {
      this.batcher.increment();
      console.log(`[MSG] ${author} in #${channel}`);
    });

    this.batcher.on('batch-flushing', ({ count, trigger }) => {
      console.log(`[BATCH] Sending ${count} messages (trigger: ${trigger})`);
    });

    this.batcher.on('batch-success', ({ count, result }) => {
      const total = result.hackathon.totalMessages;
      const carbon = result.hackathon.totalCarbon.kilograms.toFixed(4);
      console.log(`[SUCCESS] Batch: ${count} | Total: ${total} msgs (${carbon} kg CO₂)`);
    });

    this.api.on('retry', ({ count, attempt, error }) => {
      console.warn(`[RETRY] Attempt ${attempt} failed: ${error}`);
    });

    this.api.on('batch-failed', ({ error, failureCount }) => {
      console.error(`[ERROR] Batch failed: ${error} (failures: ${failureCount})`);
    });

    this.api.on('circuit-opened', ({ failureCount }) => {
      console.error(`[CIRCUIT] OPENED after ${failureCount} failures (1min cooldown)`);
    });

    this.api.on('circuit-closed', () => {
      console.log(`[CIRCUIT] CLOSED - service recovered`);
    });

    this.bot.on('error', (error) => {
      console.error(`[BOT-ERROR]`, error);
    });
  }
}

const listener = new CarbonListener(config);

process.on('SIGINT', () => listener.shutdown());
process.on('SIGTERM', () => listener.shutdown());

listener.start().catch((error) => {
  console.error('[FATAL]', error);
  process.exit(1);
});
