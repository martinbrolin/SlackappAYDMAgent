# 🤖 Bot Customization Guide

Your Slack bot is now fully customizable! Here's how to make it uniquely yours.

## 🎯 Quick Customization

### 1. **Edit `bot-config.js`** to change your bot's personality:

```javascript
export const BOT_CONFIG = {
  name: "Your Bot Name",           // What should people call your bot?
  personality: "friendly and helpful", // How should it behave?
  tone: "casual but professional",     // What tone should it use?
  
  expertise: [                         // What is it good at?
    "your domain expertise",
    "specific skills",
    "areas of knowledge"
  ],
  
  specialKnowledge: `                  // Detailed background knowledge
  Custom instructions for your bot about your:
  - Company processes
  - Team workflows  
  - Specific tools you use
  - Industry knowledge
  `,
}
```

## 🎨 Personality Templates

### Option 1: Technical Developer Bot
```javascript
import { CASUAL_DEV_CONFIG } from './bot-config.js';
// Change the import in app.js to use CASUAL_DEV_CONFIG
```

### Option 2: Business Professional Bot  
```javascript
import { BUSINESS_CONFIG } from './bot-config.js';
// Formal, concise, business-focused responses
```

### Option 3: Creative Marketing Bot
```javascript
import { CREATIVE_CONFIG } from './bot-config.js';  
// Enthusiastic, creative, inspiring responses
```

## 🔧 Advanced Customization

### **Keyword Responses**
Add instant responses for common questions:
```javascript
keywords: {
  "how to deploy": "Check our deployment guide at...",
  "code review": "Here's our code review checklist...",
  "meeting schedule": "You can book meetings at..."
}
```

### **Custom Responses**
Set specific responses for different scenarios:
```javascript
customResponses: {
  greeting: "Welcome to the team! 🎉",
  goodbye: "Have a great day!",
  confused: "Could you clarify that?",
  error: "Something went wrong, let me try again."
}
```

### **Response Style**
Control how your bot communicates:
```javascript
responseStyle: {
  includeEmojis: true,        // 😀 Use emojis?
  useMarkdown: true,          // **Bold** and *italic* text?
  maxLength: "brief"          // Short or detailed responses?
}
```

## 🎭 Example Customizations

### **Customer Support Bot**
```javascript
name: "Support Assistant",
personality: "patient, helpful, and solution-focused",
expertise: ["troubleshooting", "product knowledge", "customer service"],
specialKnowledge: `
I help customers with:
- Product setup and configuration
- Common troubleshooting steps  
- Billing and account questions
- Feature explanations
`,
keywords: {
  "refund": "I can help with refund requests. Please provide your order number.",
  "login issue": "Let's troubleshoot your login. First, try resetting your password.",
  "billing": "For billing questions, I can check your account status."
}
```

### **DevOps Bot**
```javascript
name: "DevOps Assistant", 
personality: "technical, efficient, and reliable",
expertise: ["deployments", "monitoring", "infrastructure", "CI/CD"],
specialKnowledge: `
I'm your DevOps companion with expertise in:
- Kubernetes and container orchestration
- AWS/Azure/GCP cloud platforms
- CI/CD pipeline optimization
- Infrastructure as Code (Terraform, CloudFormation)
- Monitoring and alerting (Prometheus, Grafana)
`,
keywords: {
  "deployment": "Ready to deploy? Here's our deployment checklist...",
  "rollback": "To rollback a deployment, use: kubectl rollout undo...",
  "monitoring": "Check these monitoring dashboards first..."
}
```

### **Project Manager Bot**
```javascript
name: "PM Assistant",
personality: "organized, strategic, and collaborative", 
expertise: ["project planning", "agile methodologies", "team coordination"],
specialKnowledge: `
I help teams stay organized with:
- Sprint planning and backlog management
- Risk assessment and mitigation
- Stakeholder communication
- Timeline and resource planning
`,
keywords: {
  "sprint planning": "For sprint planning, start with these steps...",
  "standup": "Daily standup template: What did you do yesterday?...",
  "retrospective": "For retros, try the Start/Stop/Continue format..."
}
```

## 🚀 How to Apply Changes

1. **Edit** `bot-config.js` with your customizations
2. **Restart** your bot: `npm start`  
3. **Test** by sending it a message in Slack
4. **Iterate** until it feels just right!

## 💡 Pro Tips

- **Start simple** - Change the name and personality first
- **Test frequently** - Make small changes and test them
- **Be specific** - The more detailed your specialKnowledge, the better responses
- **Use examples** - Include example responses in your specialKnowledge
- **Monitor usage** - Watch how people interact and adjust accordingly

## 🎯 Ready to Customize?

1. Open `bot-config.js`
2. Change the name, personality, and expertise
3. Add your specific knowledge and keywords
4. Restart with `npm start`
5. Test in Slack!

Your bot will now respond with your custom personality and knowledge! 🚀
