// Energy calculation constants from benchmark data
// energyPerToken is Wh per 1000 tokens from the benchmark
// baseLatency is computation time in seconds from the benchmark
export const MODEL_PARAMS: Record<string, { energyPerToken: number; baseLatency: number }> = {
  "Llama 3": { energyPerToken: 37.24, baseLatency: 1.96 },
  "DeepSeek": { energyPerToken: 2.72, baseLatency: 5.43 },
  "Llama 2": { energyPerToken: 15.33, baseLatency: 1.49 },
  "Mistral": { energyPerToken: 6.18, baseLatency: 4.55 },
  "Sundai R1": { energyPerToken: 40.22, baseLatency: 17.19 }
} as const

// Model API endpoints
export const MODEL_ENDPOINTS = [
  { name: "Llama 3", api: "/api/llama" },
  { name: "DeepSeek", api: "/api/deepseek" },
  { name: "Llama 2", api: "/api/llama2" },
  { name: "Mistral", api: "/api/mistral" },
  { name: "Sundai R1", api: "/api/deepseek-openai" },
] as const

// CO2 emissions constant (gCO2e per Wh)
export const CARBON_INTENSITY = 0.475 // Average data center carbon intensity

// Environmental impact equivalencies
export const EQUIVALENCIES = {
  carMiles: 404, // gCO2e per mile driven
  lightBulbHours: 11, // gCO2e per hour of LED bulb (10W)
  smartphoneCharge: 2.3, // gCO2e per full charge
  treeSeconds: 0.0138, // gCO2e absorbed per second by a mature tree
} as const

// Color scheme
export const COLORS = {
  energy: "#22c55e", // Vibrant green
  co2: "#f43f5e", // Vibrant rose
  chart: {
    grid: "#94a3b8",
    text: "#1e293b"
  }
} as const

// Add tokenizer mapping
export const MODEL_TOKENIZERS: Record<string, string> = {
  "Llama 3": "Xenova/llama-2-7b", // Using Llama 2 tokenizer as proxy
  "DeepSeek": "deepseek-ai/deepseek-coder-6.7b-base",
  "Llama 2": "Xenova/llama-2-7b",
  "Mistral": "mistralai/Mistral-7B-v0.1",
  "Sundai R1": "deepseek-ai/deepseek-coder-6.7b-base", // Using DeepSeek tokenizer as proxy
} as const

// Types
export interface ModelResult {
  name: string
  tokenCount: number
  energyPerToken: number
  totalEnergy: number
  estimatedTime: number
  co2Emissions: number
}

export interface EnvironmentalEquivalencies {
  carMiles: string
  lightBulbHours: string
  smartphoneCharges: string
  treeSeconds: string
} 