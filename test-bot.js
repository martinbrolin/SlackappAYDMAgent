import pkg from '@slack/bolt';
const { App } = pkg;
import 'dotenv/config';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Test basic functionality
app.event('app_mention', async ({ event, client }) => {
  console.log('🎯 Mention received:', event.text);
  
  try {
    // Try to send a message back to the channel first
    await client.chat.postMessage({
      channel: event.channel,
      text: `I heard you mention me: "${event.text}" 👋`
    });
    console.log('✅ Channel message sent');
    
    // Then try to open DM
    const { channel } = await client.conversations.open({ users: event.user });
    await client.chat.postMessage({
      channel: channel.id,
      text: `Hi! I opened this DM because you mentioned me. How can I help? 🚀`
    });
    console.log('✅ DM sent');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
});

// Test direct messages
app.message(async ({ message, say }) => {
  if (message.channel_type === 'im') {
    console.log('💬 DM received:', message.text);
    await say('Thanks for the DM! I can hear you. 🤖');
  }
});

(async () => {
  try {
    await app.start(3000);
    console.log("🧪 Test bot running on port 3000");
    console.log("📝 Mention me in any channel to test!");
  } catch (error) {
    console.error('Error:', error);
  }
})();

