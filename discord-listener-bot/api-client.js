import { EventEmitter } from 'events';

export class ApiClient extends EventEmitter {
  constructor(baseUrl, maxRetries = 3) {
    super();
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.circuitOpen = false;
    this.failureCount = 0;
    this.successCount = 0;
  }

  async sendBatch(count) {
    if (this.circuitOpen) {
      this.emit('circuit-open', { count });
      return null;
    }

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/carbon/discord/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count }),
          signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        this.#onSuccess();
        this.emit('batch-sent', { count, attempt, data });
        return data;

      } catch (error) {
        const isLastAttempt = attempt === this.maxRetries;
        this.emit('retry', { count, attempt, error: error.message, isLastAttempt });

        if (isLastAttempt) {
          this.#onFailure(error);
          return null;
        }

        await this.#backoff(attempt);
      }
    }
  }

  #onSuccess() {
    this.successCount++;
    this.failureCount = 0;
    if (this.circuitOpen) {
      this.circuitOpen = false;
      this.emit('circuit-closed');
    }
  }

  #onFailure(error) {
    this.failureCount++;
    this.emit('batch-failed', { error: error.message, failureCount: this.failureCount });

    if (this.failureCount >= 5) {
      this.circuitOpen = true;
      this.emit('circuit-opened', { failureCount: this.failureCount });
      setTimeout(() => {
        this.circuitOpen = false;
        this.failureCount = 0;
        this.emit('circuit-reset');
      }, 60000);
    }
  }

  #backoff(attempt) {
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  getStatus() {
    return {
      circuitOpen: this.circuitOpen,
      failureCount: this.failureCount,
      successCount: this.successCount
    };
  }
}
