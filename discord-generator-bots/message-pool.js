export const messagePool = {
  steady: [
    "Just pushed the latest changes ✅",
    "Code review done on PR #42 👍",
    "Fixed the bug in production 🐛",
    "Running tests now... 🧪",
    "Deployment went smooth 🚀",
    "API endpoint is live! 🎯",
    "Documentation updated 📝",
    "Refactored the auth module 🔐",
    "Database migration complete ✨",
    "Feature branch merged 🎉",
    "CI pipeline passed 💚",
    "Performance looks good 📊",
    "Cache invalidation working perfectly 🔄",
    "Logs show no errors 😌",
    "Ready for staging deploy! 🚢",
    "All tests passing 💯",
    "Backend integration working 🔗",
    "Frontend updates deployed ⚡"
  ],

  burst: [
    "Hey team, quick update 👋",
    "Found an issue in the calculation 🤔",
    "Should we use the SWD model? 💭",
    "Yeah, that makes sense! 💡",
    "Let me check the carbon values...",
    "Okay, pushing the fix now 🔧",
    "Anyone free for a quick sync? 📞",
    "Dashboard metrics look off 📉",
    "Refreshing the data source 🔄",
    "All good now! ✨",
    "Nice work everyone! 🙌",
    "Breaking for lunch 🍕",
    "Back online ☕",
    "Tackling the next ticket 💪",
    "This is looking great! 🔥",
    "Almost done with this feature 🎯",
    "Need a quick break, brb 😅"
  ],

  reactive: [
    "Agreed! 👍",
    "Good point 💯",
    "Makes sense 🤔",
    "Let me look into that 🔍",
    "On it! ⚡",
    "Will do 👌",
    "Sounds good 👍",
    "Thanks for catching that! 🙏",
    "Yep, I see it 👀",
    "Perfect timing ⏰",
    "Nice! 🎉",
    "Exactly 💡",
    "True 👆",
    "Same here 🤝",
    "Got it ✅",
    "Awesome work! 🌟",
    "Love it! ❤️",
    "Great idea 💭",
    "I'm on board 🚀",
    "Totally agree 💪",
    "Smart thinking 🧠",
    "Makes total sense 🎯"
  ]
};

export function getRandomMessage(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
