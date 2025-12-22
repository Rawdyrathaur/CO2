export class RateLimiter {
  constructor(maxMessages = 5, windowMs = 5000) {
    this.maxMessages = maxMessages;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  canSend() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);
    return this.timestamps.length < this.maxMessages;
  }

  recordSend() {
    this.timestamps.push(Date.now());
  }

  async waitIfNeeded() {
    if (this.canSend()) return;

    const oldestTimestamp = this.timestamps[0];
    const waitTime = this.windowMs - (Date.now() - oldestTimestamp) + 100;

    console.log(`[RATE-LIMIT] Waiting ${waitTime}ms to respect Discord limits`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  getStatus() {
    const now = Date.now();
    const recentMessages = this.timestamps.filter(t => now - t < this.windowMs);
    return {
      messagesInWindow: recentMessages.length,
      available: this.maxMessages - recentMessages.length
    };
  }
}
