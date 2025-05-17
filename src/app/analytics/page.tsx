
import { TrendingUp, Percent, Download, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"; // Keep for TrendForecasterForm
import TrendForecasterForm from '@/components/analytics/trend-forecaster-form';
import { MOCK_KPIS, MOCK_HOURLY_OUTPUT } from '@/lib/mock-data'; // Use MOCK_HOURLY_OUTPUT for dailyOutputData
import { DataCard } from '@/components/ui/data-card';
import AnalyticsCharts from '@/components/analytics/analytics-charts';
import type { ChartConfig } from '@/components/ui/chart';


// Prepare data for charts and cards here, to be passed to the client component
const dailyOutputData = MOCK_HOURLY_OUTPUT.map(item => ({
  date: item.time.split('-')[0].slice(0,3), // Using time slot for now, could be actual dates
  output: item.totalOutput
})).slice(0, 6); // Take first 6 for a weekly view like Mon-Sat

const kpiChartData = [
  { name: "On-Time Delivery", value: MOCK_KPIS.onTimeDelivery, fill: "hsl(var(--chart-1))" },
  { name: "Wastage Rate", value: MOCK_KPIS.wastageRate, fill: "hsl(var(--chart-2))" },
  { name: "Machine Utilization", value: MOCK_KPIS.machineUtilization, fill: "hsl(var(--chart-3))" },
  { name: "Labor Efficiency", value: MOCK_KPIS.laborEfficiency, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  output: { label: "Daily Output (Units)", color: "hsl(var(--primary))" },
  delivery: { label: "On-Time Delivery (%)", color: "hsl(var(--chart-1))" },
  wastage: { label: "Wastage Rate (%)", color: "hsl(var(--chart-2))" },
  machine: { label: "Machine Utilization (%)", color: "hsl(var(--chart-3))" },
  labor: { label: "Labor Efficiency (%)", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;


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
      
      <AnalyticsCharts 
        dailyOutputData={dailyOutputData}
        kpiChartData={kpiChartData}
        chartConfig={chartConfig}
      />

      <TrendForecasterForm />
    </div>
  );
}
