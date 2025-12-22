import { Client, GatewayIntentBits } from 'discord.js';
import { EventEmitter } from 'events';

export class DiscordBot extends EventEmitter {
  constructor(token) {
    super();
    this.token = token;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    this.client.on('ready', () => this.#onReady());
    this.client.on('messageCreate', (msg) => this.#onMessage(msg));
    this.client.on('error', (error) => this.emit('error', error));
  }

  async connect() {
    await this.client.login(this.token);
  }

  async disconnect() {
    this.emit('disconnecting');
    await this.client.destroy();
    this.emit('disconnected');
  }

  #onReady() {
    this.emit('ready', {
      username: this.client.user.tag,
      guilds: this.client.guilds.cache.size
    });
  }

  #onMessage(message) {
    if (this.#shouldIgnore(message)) return;

    this.emit('valid-message', {
      author: message.author.tag,
      channel: message.channel.name,
      guild: message.guild?.name
    });
  }

  #shouldIgnore(message) {
    return message.author.id === this.client.user.id ||
           message.content.startsWith('!') ||
           message.content.startsWith('/');
  }
}
