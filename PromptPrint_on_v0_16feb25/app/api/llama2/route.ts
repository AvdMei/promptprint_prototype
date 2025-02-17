import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const input = {
    top_p: 1,
    prompt: prompt,
    temperature: 0.75,
    max_new_tokens: 800,
  }

  try {
    const output = await replicate.run("meta/llama-2-7b-chat", { input })
    return NextResponse.json({ output: output.join("") })
  } catch (error) {
    console.error("Error calling Llama-2 model:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

