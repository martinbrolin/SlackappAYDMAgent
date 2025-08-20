# Slack DM App

A Slack bot that responds to mentions and direct messages using OpenAI's GPT models.

## Features

- Responds to `@mentions` by opening a private DM with the user
- Handles direct messages to the bot
- Uses OpenAI GPT-3.5-turbo for intelligent responses
- Runs in Socket Mode (no public URL required)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Give your app a name and select your workspace
4. Go to "OAuth & Permissions" in the sidebar

### 3. Configure Bot Token Scopes

Add these scopes to your bot:
- `app_mentions:read` - Read mentions
- `channels:history` - Read channel messages
- `chat:write` - Send messages
- `im:history` - Read direct messages
- `im:write` - Send direct messages
- `im:read` - Read direct messages

### 4. Install App to Workspace

1. Go to "Install App" in the sidebar
2. Click "Install to Workspace"
3. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

### 5. Configure Socket Mode

1. Go to "Basic Information" in the sidebar
2. Under "App-Level Tokens", click "Generate Token and Scopes"
3. Give it a name (e.g., "socket-token")
4. Add the `connections:write` scope
5. Copy the generated token (starts with `xapp-`)

### 6. Set Environment Variables

Create a `.env` file in your project root:

```bash
cp env.example .env
```

Then edit `.env` with your actual credentials:

```env
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token
SLACK_APP_TOKEN=xapp-your-actual-app-token
OPENAI_API_KEY=sk-your-actual-openai-key
PORT=3000
```

### 7. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to "API Keys" in the sidebar
4. Create a new API key

## Running the App

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## How It Works

1. **App Mentions**: When someone `@mentions` your bot in a channel, it opens a private DM and responds
2. **Direct Messages**: The bot responds to any direct messages sent to it
3. **OpenAI Integration**: Uses GPT-3.5-turbo to generate contextual responses

## Troubleshooting

### Common Issues

1. **"Invalid token" error**: Check your `.env` file and ensure tokens are correct
2. **"Missing scopes" error**: Verify all required scopes are added in Slack app settings
3. **Bot not responding**: Ensure the app is installed to your workspace and has proper permissions

### Debug Mode

Add this to your `.env` file for more detailed logging:
```env
SLACK_LOG_LEVEL=debug
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your Slack and OpenAI tokens secure
- The app runs in Socket Mode, so no public URL is exposed

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure your Slack app has all required permissions


