import { EventEmitter } from 'events';

export class BatchManager extends EventEmitter {
  constructor(apiClient, batchSize = 10, intervalMs = 30000) {
    super();
    this.apiClient = apiClient;
    this.batchSize = batchSize;
    this.intervalMs = intervalMs;
    this.count = 0;
    this.timer = null;
    this.isShuttingDown = false;
  }

  start() {
    this.timer = setInterval(() => this.#flush('time'), this.intervalMs);
    this.emit('started', { batchSize: this.batchSize, intervalMs: this.intervalMs });
  }

  increment() {
    if (this.isShuttingDown) return;

    this.count++;
    this.emit('message-counted', { currentCount: this.count });

    if (this.count >= this.batchSize) {
      this.#flush('threshold');
    }
  }

  async #flush(trigger) {
    if (this.count === 0) return;

    const batchCount = this.count;
    this.count = 0;

    this.emit('batch-flushing', { count: batchCount, trigger });
    const result = await this.apiClient.sendBatch(batchCount);

    if (result) {
      this.emit('batch-success', { count: batchCount, trigger, result });
    }
  }

  async shutdown() {
    this.isShuttingDown = true;
    clearInterval(this.timer);
    this.emit('shutting-down', { pendingCount: this.count });
    await this.#flush('shutdown');
    this.emit('shutdown-complete');
  }
}
