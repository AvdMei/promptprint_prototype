import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const input = {
    prompt: prompt,
  }

  try {
    const output = await replicate.run("deepseek-ai/deepseek-r1", { input })
    return NextResponse.json({ output: output.join("") })
  } catch (error) {
    console.error("Error calling DeepSeek model:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

