import { NextResponse } from "next/server"
import { AutoTokenizer } from '@xenova/transformers'

// Single tokenizer instance
let tokenizer: any = null;

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Initialize tokenizer if not already done
    if (!tokenizer) {
      try {
        tokenizer = await AutoTokenizer.from_pretrained('Xenova/gpt2')
      } catch (error) {
        console.error('Failed to initialize tokenizer:', error)
        return NextResponse.json(
          { error: 'Failed to initialize tokenizer' },
          { status: 500 }
        )
      }
    }

    // Tokenize the text
    const encoding = await tokenizer(text)
    
    return NextResponse.json({
      token_count: encoding.input_ids.length
    })
  } catch (error) {
    console.error('Tokenization error:', error)
    return NextResponse.json(
      { error: 'Failed to tokenize text' },
      { status: 500 }
    )
  }
} 