import pkg from '@slack/bolt';
const { App } = pkg;
import 'dotenv/config';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Simple response without OpenAI
app.event("app_mention", async ({ event, client }) => {
  try {
    // Open (or find) a 1:1 DM with the user
    const { channel } = await client.conversations.open({ users: event.user });
    
    // Send a simple response
    await client.chat.postMessage({ 
      channel: channel.id, 
      text: `Hi! You mentioned me with: "${event.text}". I'm here to help! 🚀` 
    });
  } catch (error) {
    console.error('Error in app_mention handler:', error);
  }
});

// Handle direct messages
app.message(async ({ message, say }) => {
  if (message.channel_type === 'im') {
    await say(`Thanks for your message: "${message.text}". I'm working on getting AI responses set up! 🤖`);
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Simple DM Agent running on port", process.env.PORT || 3000);
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();


