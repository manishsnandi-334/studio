
import { BarChart3, TrendingUp, Percent, Download, Package, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TrendForecasterForm from '@/components/analytics/trend-forecaster-form';
import { MOCK_KPIS } from '@/lib/mock-data';
import { DataCard } from '@/components/ui/data-card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Sample data for charts
const kpiChartData = [
  { name: "On-Time Delivery", value: MOCK_KPIS.onTimeDelivery, fill: "var(--color-delivery)" },
  { name: "Wastage Rate", value: MOCK_KPIS.wastageRate, fill: "var(--color-wastage)" },
  { name: "Machine Utilization", value: MOCK_KPIS.machineUtilization, fill: "var(--color-machine)" },
  { name: "Labor Efficiency", value: MOCK_KPIS.laborEfficiency, fill: "var(--color-labor)" },
];

const dailyOutputData = [
  { date: "Mon", output: 9800 },
  { date: "Tue", output: 11500 },
  { date: "Wed", output: 10200 },
  { date: "Thu", output: 12100 },
  { date: "Fri", output: 11800 },
  { date: "Sat", output: 7500 },
];

const chartConfig = {
  output: { label: "Daily Output (Units)", color: "hsl(var(--primary))" },
  delivery: { label: "On-Time Delivery (%)", color: "hsl(var(--chart-1))" },
  wastage: { label: "Wastage Rate (%)", color: "hsl(var(--chart-2))" },
  machine: { label: "Machine Utilization (%)", color: "hsl(var(--chart-3))" },
  labor: { label: "Labor Efficiency (%)", color: "hsl(var(--chart-4))" },
} satisfies Parameters<typeof ChartContainer>[0]["config"];


export default function AnalyticsPage() {
  const averageDailyOutputFromChart = Math.round(
    dailyOutputData.reduce((sum, item) => sum + item.output, 0) / dailyOutputData.length
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Insights & Analytics Panel</h1>
          <p className="text-muted-foreground">Monitor Key Performance Indicators and forecast future trends.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Download Reports (PDF/Excel)
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DataCard
          title="On-Time Delivery"
          value={`${MOCK_KPIS.onTimeDelivery}%`}
          icon={TrendingUp}
          description={MOCK_KPIS.onTimeDelivery > 90 ? "Excellent performance" : "Needs improvement"}
        />
        <DataCard
          title="Wastage Rate"
          value={`${MOCK_KPIS.wastageRate}%`}
          icon={Percent}
          description={MOCK_KPIS.wastageRate < 5 ? "Within acceptable limits" : "High wastage, investigate"}
        />
        <DataCard
          title="Daily Output (Avg)"
          value={`${averageDailyOutputFromChart.toLocaleString()} units`}
          icon={Package}
          description={`Target: ${(Math.round(averageDailyOutputFromChart * 1.1)).toLocaleString()} units`}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Production Output</CardTitle>
          <CardDescription>Output units over the past week.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyOutputData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="output" fill="var(--color-output)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance KPIs</CardTitle>
           <CardDescription>Key metrics for operational efficiency.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie data={kpiChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" labelLine={false} label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                            {kpiChartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>

      <TrendForecasterForm />
    </div>
  );
}
