
"use client";

import * as React from 'react'; // Added React import
import { useRef } from 'react';
import { TrendingUp, Percent, Download, Package, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TrendForecasterForm from '@/components/analytics/trend-forecaster-form';
import { MOCK_KPIS, MOCK_HOURLY_OUTPUT } from '@/lib/mock-data';
import { DataCard } from '@/components/ui/data-card';
import AnalyticsCharts from '@/components/analytics/analytics-charts';
import type { ChartConfig } from '@/components/ui/chart';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from "@/hooks/use-toast";


const dailyOutputData = MOCK_HOURLY_OUTPUT.map(item => ({
  date: item.time.split('-')[0].slice(0,3), // Using first 3 chars for day name
  output: item.totalOutput
})).slice(0, MOCK_HOURLY_OUTPUT.length > 7 ? 7 : MOCK_HOURLY_OUTPUT.length); // Show up to 7 days

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
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  const averageDailyOutputFromChart = Math.round(
    dailyOutputData.reduce((sum, item) => sum + item.output, 0) / (dailyOutputData.length || 1)
  );

  const handleDownloadPdf = async () => {
    if (!reportContentRef.current) {
      toast({
        title: "Error",
        description: "Could not find content to download.",
        variant: "destructive",
      });
      return;
    }
    setIsDownloading(true);
    toast({
      title: "Processing Report",
      description: "Your PDF report is being generated...",
    });

    try {
      const canvas = await html2canvas(reportContentRef.current, {
        scale: 2, // Improve quality
        useCORS: true, // For external images if any
        logging: false,
        backgroundColor: null, // Use element's background
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height] // Use canvas dimensions for PDF page size
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('analytics-report.pdf');
      
      toast({
        title: "Report Downloaded",
        description: "Analytics report PDF has been saved.",
        variant: "default",
      });

    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate the PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Insights & Analytics Panel</h1>
          <p className="text-muted-foreground">Monitor Key Performance Indicators and forecast future trends.</p>
        </div>
        <Button variant="outline" onClick={handleDownloadPdf} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Download Reports (PDF)
            </>
          )}
        </Button>
      </div>

      <div ref={reportContentRef} className="flex flex-col gap-8 bg-background p-4 rounded-lg"> {/* Content to be captured, added bg and padding */}
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
            description={`Avg from displayed chart. Target: ${(Math.round(averageDailyOutputFromChart * 1.1)).toLocaleString()} units`}
          />
        </div>
        
        <AnalyticsCharts 
          dailyOutputData={dailyOutputData}
          kpiChartData={kpiChartData}
          chartConfig={chartConfig}
        />

        <TrendForecasterForm />
      </div>
    </div>
  );
}
