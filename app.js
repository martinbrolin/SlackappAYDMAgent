import pkg from '@slack/bolt';
const { App } = pkg;
import OpenAI from "openai";
import 'dotenv/config';
import { BOT_CONFIG } from './bot-config.js';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,            // no public URL needed
  // signingSecret is optional in pure Socket Mode
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple conversation memory (in production, use a database)
const conversationHistory = new Map();

// Helper function to check for keywords
function checkKeywords(text) {
  if (!BOT_CONFIG.keywords) return null;
  
  const lowerText = text.toLowerCase();
  for (const [keyword, response] of Object.entries(BOT_CONFIG.keywords)) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return response;
    }
  }
  return null;
}

// Helper function to get conversation context
function getConversationContext(userId, newMessage) {
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }
  
  const history = conversationHistory.get(userId);
  history.push({ role: "user", content: newMessage });
  
  // Keep only last 10 messages to manage token usage
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }
  
  conversationHistory.set(userId, history);
  return history;
}

// Create system prompt based on configuration
function createSystemPrompt(context = "general") {
  return `You are ${BOT_CONFIG.name}, an AI assistant with a ${BOT_CONFIG.personality} personality.

Your expertise includes: ${BOT_CONFIG.expertise.join(", ")}.

Special knowledge:
${BOT_CONFIG.specialKnowledge}

Response guidelines:
- Tone: ${BOT_CONFIG.tone}
- Style: ${BOT_CONFIG.responseStyle.maxLength}
- ${BOT_CONFIG.responseStyle.includeEmojis ? "Use relevant emojis" : "No emojis"}
- ${BOT_CONFIG.responseStyle.useMarkdown ? "Use Slack markdown formatting when helpful" : "Plain text only"}

Context: ${context === "mention" ? "User mentioned you in a channel - keep response brief" : "Direct message conversation - you can be more detailed"}`;
}

// When someone @mentions the bot anywhere, follow up in a private DM
app.event("app_mention", async ({ event, client }) => {
  try {
    // Open (or find) a 1:1 DM with the user
    const { channel } = await client.conversations.open({ users: event.user }); // needs im:write

    // Generate a customized reply with OpenAI
    const systemPrompt = createSystemPrompt("mention");
    const userMessage = `User mentioned you in a channel with: "${event.text}"
    
Please respond appropriately and let them know you'll follow up in this DM.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    const text = completion.choices[0]?.message?.content?.trim() || 
                 "Hi! I'll follow up here in DM.";

    // Send the DM
    await client.chat.postMessage({ channel: channel.id, text });
  } catch (error) {
    console.error('Error in app_mention handler:', error);
    
    // Handle OpenAI quota errors specifically
    if (error.code === 'insufficient_quota') {
      try {
        const { channel } = await client.conversations.open({ users: event.user });
        await client.chat.postMessage({ 
          channel: channel.id, 
          text: "Hi! I'm here to help, but I'm currently experiencing technical difficulties. Please try again later or contact support." 
        });
      } catch (dmError) {
        console.error('Error sending fallback message:', dmError);
      }
    }
  }
});

// Handle direct messages to the bot
app.message(async ({ message, client, say }) => {
  // Only respond to direct messages (not in channels)
  if (message.channel_type === 'im') {
    try {
      // Check for keyword responses first
      const keywordResponse = checkKeywords(message.text);
      if (keywordResponse) {
        await say(keywordResponse);
        return;
      }
      
      // Get conversation history for context
      const conversationContext = getConversationContext(message.user, message.text);
      const systemPrompt = createSystemPrompt("dm");
      
      // Build messages array with system prompt and conversation history
      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationContext
      ];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      });

      const text = completion.choices[0]?.message?.content?.trim() || 
                   BOT_CONFIG.customResponses?.confused || "I'm here to help! What can I do for you?";
      
      // Store bot response in conversation history
      const history = conversationHistory.get(message.user);
      if (history) {
        history.push({ role: "assistant", content: text });
        conversationHistory.set(message.user, history);
      }
      
      await say(text);
    } catch (error) {
      console.error('Error in message handler:', error);
      
      // Handle OpenAI quota errors specifically
      if (error.code === 'insufficient_quota') {
        await say("I'm currently experiencing technical difficulties due to API limits. Please try again later or contact support.");
      } else {
        await say("Sorry, I encountered an error. Please try again.");
      }
    }
  }
});

// Handle home tab opened event
app.event('app_home_opened', async ({ event, client }) => {
  try {
    // Update the home tab with a welcome message
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `👋 Tervetuloa! Welcome to ${BOT_CONFIG.name}!`
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Hei!* I'm your AI design assistant with expertise in:\n\n` +
                    `• 🎨 *UX Research & Strategy*\n` +
                    `• 🖥️ *UI Design & Prototyping*\n` +
                    `• 🧩 *Design Systems & Components*\n` +
                    `• 🤖 *AI in Design Workflows*\n` +
                    `• 📱 *Digital Product Strategy*\n\n` +
                    `*How can I help you today?* Just send me a message! 💬`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Ask About UX Research 🧐'
                },
                action_id: 'ask_ux_research'
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Design System Help 🧩'
                },
                action_id: 'ask_design_system'
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'AI Design Tips 🤖'
                },
                action_id: 'ask_ai_design'
              }
            ]
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: '💡 *Pro tip:* Try asking me about "prototyping" or "accessibility" for instant help!'
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error updating home tab:', error);
  }
});

// Handle button clicks from home tab
app.action('ask_ux_research', async ({ ack, body, client }) => {
  await ack();
  try {
    await client.chat.postMessage({
      channel: body.user.id,
      text: "🧐 *UX Research Help!*\n\nI can help you with:\n• Planning user studies\n• Research methodologies\n• Turning insights into design decisions\n• User testing strategies\n\nWhat specific UX research question do you have?"
    });
  } catch (error) {
    console.error('Error handling UX research button:', error);
  }
});

app.action('ask_design_system', async ({ ack, body, client }) => {
  await ack();
  try {
    await client.chat.postMessage({
      channel: body.user.id,
      text: "🧩 *Design System Help!*\n\nI can guide you with:\n• Setting up component libraries\n• Design token systems\n• Governance and documentation\n• Scaling design systems\n\nWhat would you like to know about design systems?"
    });
  } catch (error) {
    console.error('Error handling design system button:', error);
  }
});

app.action('ask_ai_design', async ({ ack, body, client }) => {
  await ack();
  try {
    await client.chat.postMessage({
      channel: body.user.id,
      text: "🤖 *AI Design Tips!*\n\nI can help you with:\n• AI-powered design tools\n• Prompt engineering for design\n• Automating design workflows\n• Integrating AI responsibly\n\nWhat AI design topic interests you?"
    });
  } catch (error) {
    console.error('Error handling AI design button:', error);
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("⚡️ DM Agent running on port", process.env.PORT || 3000);
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();
