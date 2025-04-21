"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MoonIcon, SunIcon, InfoIcon } from "lucide-react"
import { useTheme } from "next-themes"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import { EnvironmentalImpact } from "@/components/environmental-impact"
import { ResultsChart } from "@/components/results-chart"
import { 
  MODEL_PARAMS, 
  MODEL_ENDPOINTS, 
  EQUIVALENCIES, 
  ModelResult, 
  EnvironmentalEquivalencies,
  CARBON_INTENSITY 
} from "@/lib/constants"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [input, setInput] = useState("")
  const [tokenCount, setTokenCount] = useState(0)
  const [results, setResults] = useState<ModelResult[]>([])
  const [loading, setLoading] = useState(false)
  const [tokenizing, setTokenizing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Debounced token counting
  useEffect(() => {
    const getTokenCount = async () => {
      if (!input.trim()) {
        setTokenCount(0)
        return
      }
      
      setTokenizing(true)
      try {
        const response = await fetch('/api/tokenize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input })
        })
        
        if (response.ok) {
          const data = await response.json()
          setTokenCount(data.token_count)
        } else {
          console.error('Failed to get token count')
          // Fallback to simple estimation
          setTokenCount(input.split(/\s+/).length + Math.floor(input.length / 4))
        }
      } catch (error) {
        console.error('Failed to count tokens:', error)
        // Fallback to simple estimation if tokenizer fails
        setTokenCount(input.split(/\s+/).length + Math.floor(input.length / 4))
      }
      setTokenizing(false)
    }

    const timeoutId = setTimeout(getTokenCount, 500) // Debounce for 500ms
    return () => clearTimeout(timeoutId)
  }, [input])

  const calculateEquivalencies = (co2Emissions: number): EnvironmentalEquivalencies => ({
    carMiles: (co2Emissions / EQUIVALENCIES.carMiles).toFixed(4),
    lightBulbHours: (co2Emissions / EQUIVALENCIES.lightBulbHours).toFixed(2),
    smartphoneCharges: (co2Emissions / EQUIVALENCIES.smartphoneCharge).toFixed(2),
    treeSeconds: (co2Emissions / EQUIVALENCIES.treeSeconds).toFixed(0)
  })

  const getTotalEnvironmentalImpact = (): EnvironmentalEquivalencies => {
    if (results.length === 0) return {
      carMiles: "0.0000",
      lightBulbHours: "0.00",
      smartphoneCharges: "0.00",
      treeSeconds: "0"
    };
    const totalCO2 = results.reduce((sum, result) => sum + result.co2Emissions, 0);
    return calculateEquivalencies(totalCO2);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResults([])
    
    const newResults = await Promise.all(
      MODEL_ENDPOINTS.map(async (model) => {
        const params = MODEL_PARAMS[model.name]
        
        const energyPerToken = params.energyPerToken / 1000 // Convert to Wh/token
        const totalEnergy = tokenCount * energyPerToken
        const co2Emissions = totalEnergy * CARBON_INTENSITY
        const estimatedTime = (params.baseLatency / 100) * tokenCount

        try {
          await fetch(model.api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: input }),
          })
        } catch (error) {
          console.error(`Error calling ${model.name}:`, error)
        }

        return {
          name: model.name,
          tokenCount,
          energyPerToken: params.energyPerToken,
          totalEnergy,
          estimatedTime,
          co2Emissions
        }
      })
    )

    setResults(newResults)
    setLoading(false)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen py-8 px-4 md:py-12 bg-gradient-to-b from-emerald-50/20 to-rose-50/20 dark:from-background dark:to-muted/20">
        <div className="max-w-5xl mx-auto">
          {/* Theme Toggle */}
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              ))}
            </Button>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm shadow-lg border-muted">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon.ico-ZC5qDTIZwZtMNwZytVnsNBcViIZ21F.png"
                  alt="AI PromptPrint Logo"
                  width={80}
                  height={80}
                  className="opacity-90 dark:opacity-80"
                />
              </div>
              <CardTitle className="text-4xl font-light tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                AI PromptPrint
                <span className="block text-lg text-muted-foreground mt-2 font-normal">
                  Measure Your AI's Environmental Impact
                </span>
              </CardTitle>
              <CardDescription className="text-base max-w-2xl mx-auto">
                Compare energy consumption and CO₂ emissions across different AI models.
                <UITooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="inline-block ml-2 h-4 w-4 cursor-help opacity-70" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Energy values are based on real benchmark data. CO₂ emissions are calculated using average data center carbon intensity ({CARBON_INTENSITY} gCO₂e/Wh).</p>
                  </TooltipContent>
                </UITooltip>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your prompt to analyze its environmental impact..."
                    required
                    className="h-12 text-lg bg-background/50"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {tokenizing ? (
                        "Counting tokens..."
                      ) : (
                        tokenCount > 0 ? 
                        `Tokens: ${tokenCount}` :
                        "Tokens: 0"
                      )}
                    </span>
                    {tokenCount > 0 && (
                      <span className="text-muted-foreground">
                        Estimated processing tokens
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    size="lg" 
                    className="w-full max-w-xs text-base relative overflow-hidden group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⚡</span> 
                        Processing...
                      </span>
                    ) : (
                      "Analyze Environmental Impact"
                    )}
                  </Button>
                </div>
              </form>

              {results.length > 0 && (
                <div className="space-y-8 animate-in fade-in-50">
                  <EnvironmentalImpact 
                    co2Emissions={results.reduce((sum, result) => sum + result.co2Emissions, 0)}
                    equivalencies={getTotalEnvironmentalImpact()} 
                  />
                  <ResultsChart results={results} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result) => {
                      const equivalencies = calculateEquivalencies(result.co2Emissions);
                      return (
                        <Card 
                          key={result.name} 
                          className="bg-card/50 hover:bg-card/70 transition-colors border-green-100 dark:border-green-900/50"
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {result.name}
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <InfoIcon className="h-4 w-4 cursor-help opacity-70" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>Based on benchmark data for {result.name}</p>
                                  <div className="mt-2 text-xs">
                                    <p>Equivalent to:</p>
                                    <ul className="list-disc list-inside">
                                      <li>{equivalencies.carMiles} miles driven</li>
                                      <li>{equivalencies.lightBulbHours} hours of LED bulb use</li>
                                      <li>{equivalencies.smartphoneCharges} smartphone charges</li>
                                    </ul>
                                  </div>
                                </TooltipContent>
                              </UITooltip>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">Energy per Token:</span>
                                <span className="font-mono text-green-600 dark:text-green-400">
                                  {(result.energyPerToken / 1000).toFixed(6)} Wh
                                </span>
                              </div>
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">Total Energy:</span>
                                <span className="font-mono text-green-600 dark:text-green-400">
                                  {result.totalEnergy.toFixed(4)} Wh
                                </span>
                              </div>
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">CO₂ Emissions:</span>
                                <span className="font-mono text-rose-600 dark:text-rose-400">
                                  {result.co2Emissions.toFixed(4)} gCO₂e
                                </span>
                              </div>
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">Estimated Time:</span>
                                <span className="font-mono">{result.estimatedTime.toFixed(2)}s</span>
                              </div>
                              <div className="flex justify-between text-sm items-center">
                                <span className="text-muted-foreground">Token Count:</span>
                                <span className="font-mono">{result.tokenCount}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}

