import Replicate from "replicate"
import { NextResponse } from "next/server"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const input = {
    prompt: prompt,
    max_new_tokens: 150,
    temperature: 0.7,
  }

  try {
    const output = await replicate.run("mistralai/mistral-7b-v0.1", { input })
    return NextResponse.json({ output: output.join("") })
  } catch (error) {
    console.error("Error calling Mistral model:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

