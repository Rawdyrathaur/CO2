# Discord Carbon Listener Bot

Production-grade Discord bot that tracks messages and sends batched counts to the Carbon Pulse backend.

## Architecture

```
Discord Messages → Message Filter → Batch Manager → API Client (w/ Circuit Breaker) → Java Backend
```

### Key Features

- **Dual Batching**: Time-based (30s) + Count-based (10 msgs)
- **Circuit Breaker**: Auto-disables after 5 failures, recovers after 1min
- **Exponential Backoff**: 1s → 2s → 4s → 8s retry delays
- **Graceful Shutdown**: Flushes pending batch on SIGTERM/SIGINT
- **Event-Driven**: Decoupled components via EventEmitter
- **Zero Dependencies**: Uses native fetch, no axios needed

## Setup

### 1. Install Dependencies

```bash
cd discord-listener-bot
npm install
```

### 2. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Name it "Carbon Listener"
3. Go to "Bot" → Click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - ✅ MESSAGE CONTENT INTENT
   - ✅ SERVER MEMBERS INTENT
5. Copy the bot token

### 3. Invite Bot to Server

Use this URL (replace YOUR_CLIENT_ID with your Application ID from "General Information"):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3072&scope=bot
```

Permissions needed: `Read Messages/View Channels` + `Read Message History`

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
BACKEND_URL=http://localhost:8080
BATCH_SIZE=10
BATCH_INTERVAL_MS=30000
```

### 5. Start the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Validation

### Test 1: Single Message
1. Send 1 message in Discord
2. Wait 30 seconds (time-based flush)
3. Check console: `[SUCCESS] Batch: 1 | Total: 1 msgs`
4. Check dashboard: Total should show 1 message

### Test 2: Batch Threshold
1. Send 10 messages quickly
2. Bot should flush immediately (count-based)
3. Console: `[BATCH] Sending 10 messages (trigger: threshold)`

### Test 3: Natural Conversation
1. Have friends chat naturally
2. Observe batching triggers
3. Verify dashboard updates

### Test 4: Backend Down
1. Stop Java backend
2. Send messages
3. Observe retry logs and circuit breaker activation

## Logs Explained

```
[BOT] Ready as CarbonBot#1234 (3 servers)
[MSG] Friend#5678 in #general
[BATCH] Sending 10 messages (trigger: threshold)
[SUCCESS] Batch: 10 | Total: 147 msgs (0.3381 kg CO₂)
[RETRY] Attempt 2 failed: HTTP 503
[CIRCUIT] OPENED after 5 failures (1min cooldown)
[CIRCUIT] CLOSED - service recovered
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DISCORD_BOT_TOKEN` | - | Bot token from Discord Developer Portal |
| `BACKEND_URL` | `http://localhost:8080` | Java backend URL |
| `BATCH_SIZE` | `10` | Message count before auto-flush |
| `BATCH_INTERVAL_MS` | `30000` | Time (ms) before auto-flush |

## Filtered Messages

Bot ignores:
- Messages from bots (including itself)
- Commands starting with `!` or `/`

## Production Deployment

For production:

1. Use process manager: `pm2 start index.js --name carbon-listener`
2. Set environment variables via system config
3. Enable log rotation
4. Monitor circuit breaker metrics
5. Adjust batch settings based on traffic

## Troubleshooting

**Bot connects but doesn't count messages:**
- Check "Message Content Intent" is enabled in Discord Developer Portal
- Verify bot has "Read Messages" permission in your server

**Circuit breaker keeps opening:**
- Check Java backend is running on port 8080
- Verify network connectivity: `curl http://localhost:8080/api/carbon/hackathon/live`

**No logs appearing:**
- Check `.env` file exists and has valid token
- Ensure Discord token doesn't have extra spaces
