import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { COLORS, ModelResult } from "@/lib/constants"

interface ResultsChartProps {
  results: ModelResult[];
}

export function ResultsChart({ results }: ResultsChartProps) {
  return (
    <div className="flex justify-center pt-4 overflow-x-auto">
      <BarChart
        width={600}
        height={400}
        data={results}
        margin={{
          top: 20,
          right: 50,
          left: 40,
          bottom: 20,
        }}
        className="bg-card/30 rounded-lg p-4"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={COLORS.chart.grid} opacity={0.3} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: COLORS.chart.text }} 
          tickLine={{ stroke: COLORS.chart.text }}
        />
        <YAxis
          yAxisId="left"
          label={{
            value: "Energy (Wh/prompt)",
            angle: -90,
            position: "insideLeft",
            fill: COLORS.energy
          }}
          tick={{ fill: COLORS.chart.text }}
          tickLine={{ stroke: COLORS.chart.text }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{
            value: "CO₂ Emissions (gCO₂e)",
            angle: 90,
            position: "insideRight",
            fill: COLORS.co2
          }}
          tick={{ fill: COLORS.chart.text }}
          tickLine={{ stroke: COLORS.chart.text }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Bar
          yAxisId="left"
          dataKey="totalEnergy"
          fill={COLORS.energy}
          name="Energy (Wh)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          yAxisId="right"
          dataKey="co2Emissions"
          fill={COLORS.co2}
          name="CO₂ (gCO₂e)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </div>
  );
} 