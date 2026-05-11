// All prices USD/user/month unless noted
// Every number cited in PRICING_DATA.md — verified May 2026

export const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: null,
  },
  "github-copilot": {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: null,
    api: null,
  },
  chatgpt: {
    plus: 20,
    team: 30,
    enterprise: null,
    api: null,
  },
  "anthropic-api": { usage: true },
  "openai-api": { usage: true },
  gemini: {
    pro: 19.99,
    ultra: 249.99,
    api: null,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
  },
} as const;