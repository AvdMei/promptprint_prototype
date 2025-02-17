"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"

export default function Home() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<{ name: string; energyDemand: number }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await compareModels()
  }

  const compareModels = async () => {
    setLoading(true)
    setResults([])

    const estimateEnergyDemand = (latency: number) => {
      return latency * 0.001 * 500
    }

    const modelCalls = [
      { name: "Llama 3", api: "/api/llama" },
      { name: "DeepSeek", api: "/api/deepseek" },
      { name: "Llama 2", api: "/api/llama2" },
      { name: "Mistral", api: "/api/mistral" },
      { name: "Sundai R1", api: "/api/deepseek-openai" },
    ]

    const newResults = await Promise.all(
      modelCalls.map(async (model) => {
        const start = Date.now()
        await fetch(model.api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: input }),
        })
        const latency = Date.now() - start
        return { name: model.name, energyDemand: estimateEnergyDemand(latency) }
      }),
    )

    setResults(newResults)
    setLoading(false)
  }

  return (
    <div className="min-h-screen py-8 px-4 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon.ico-ZC5qDTIZwZtMNwZytVnsNBcViIZ21F.png"
                alt="AI PromptPrint Logo"
                width={80}
                height={80}
                className="opacity-90"
              />
            </div>
            <CardTitle className="text-3xl font-light tracking-tight">
              AI PromptPrint
              <span className="block text-lg text-muted-foreground mt-1">
                How much electricity does your prompt need?
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Compare energy demand between Llama 3, DeepSeek, Llama 2, Mistral, and Sundai R1 models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your prompt"
                required
                className="h-12 text-lg"
              />
              <div className="flex justify-center">
                <Button type="submit" disabled={loading} size="lg" className="w-full max-w-xs text-base">
                  {loading ? "Processing..." : "Compare AI Models"}
                </Button>
              </div>
            </form>
            {results.length > 0 && (
              <div className="flex justify-center pt-4">
                <BarChart
                  width={600}
                  height={400}
                  data={results}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 40,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fill: "#666" }} tickLine={{ stroke: "#666" }} />
                  <YAxis
                    label={{
                      value: "Energy Demand [Wh/prompt]",
                      angle: -90,
                      position: "insideLeft",
                      style: { fill: "#666" },
                    }}
                    tick={{ fill: "#666" }}
                    tickLine={{ stroke: "#666" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="energyDemand" fill="#87CEEB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

