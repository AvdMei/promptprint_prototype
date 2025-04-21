import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { EnvironmentalEquivalencies } from "@/lib/constants"

interface EnvironmentalImpactProps {
  co2Emissions: number
  equivalencies: EnvironmentalEquivalencies
}

export function EnvironmentalImpact({ co2Emissions, equivalencies }: EnvironmentalImpactProps) {
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Environmental Impact
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1">
                <InfoIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated environmental impact based on average data center energy consumption and carbon intensity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{co2Emissions.toFixed(2)} gCO2e</div>
        <CardDescription>
          This is equivalent to:
          <ul className="mt-2 space-y-1">
            <li>🚗 {equivalencies.carMiles} of driving</li>
            <li>💡 {equivalencies.lightBulbHours} of LED bulb usage</li>
            <li>📱 {equivalencies.smartphoneCharges} smartphone charges</li>
            <li>🌳 {equivalencies.treeSeconds} of tree carbon absorption</li>
          </ul>
        </CardDescription>
      </CardContent>
    </Card>
  )
} 