import OpenAI from "openai"
import { NextResponse } from "next/server"

const llm_client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "default",
  baseURL: process.env.DEEPSEEK_API_BASE,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  try {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ]

    const generation = await llm_client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1",
      messages: messages,
      stream: false,
      top_p: 0.95,
      temperature: 0.7,
    })

    const output = generation.choices[0].message.content

    return NextResponse.json({ output })
  } catch (error) {
    console.error("Error calling DeepSeek OpenAI model:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

