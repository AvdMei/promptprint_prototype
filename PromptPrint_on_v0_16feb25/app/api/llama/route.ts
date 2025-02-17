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
    temperature: 0.5,
    max_new_tokens: 500,
    min_new_tokens: -1,
  }

  try {
    const output = await replicate.run("meta/llama-2-70b-chat", { input })
    return NextResponse.json({ output: output.join("") })
  } catch (error) {
    console.error("Error calling Llama model:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

