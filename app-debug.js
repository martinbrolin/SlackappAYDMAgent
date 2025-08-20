import pkg from '@slack/bolt';
const { App } = pkg;
import 'dotenv/config';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Log all events to see what's happening
app.event('*', async ({ event, logger }) => {
  console.log('🔍 Received event:', event.type, event);
});

// Handle app mentions
app.event("app_mention", async ({ event, client, logger }) => {
  console.log('🎯 App mention received:', event);
  
  try {
    // Open (or find) a 1:1 DM with the user
    const { channel } = await client.conversations.open({ users: event.user });
    console.log('💬 Opening DM channel:', channel);
    
    // Send a simple response
    await client.chat.postMessage({ 
      channel: channel.id, 
      text: `Hi! You mentioned me with: "${event.text}". I'm here to help! 🚀` 
    });
    console.log('✅ DM sent successfully');
  } catch (error) {
    console.error('❌ Error in app_mention handler:', error);
  }
});

// Handle direct messages
app.message(async ({ message, say, logger }) => {
  console.log('💬 Direct message received:', message);
  
  if (message.channel_type === 'im') {
    await say(`Thanks for your message: "${message.text}". I'm working! 🤖`);
    console.log('✅ Direct message response sent');
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ Debug DM Agent running on port", process.env.PORT || 3000);
    console.log("🔍 Listening for all events...");
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();


