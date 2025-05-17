"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2 } from 'lucide-react';
import { trendForecaster, type TrendForecasterInput, type TrendForecasterOutput } from '@/ai/flows/trend-forecaster'; // Ensure path is correct
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  historicalData: z.string().min(50, { message: "Historical data must be at least 50 characters." })
    .describe("CSV or JSON string of historical production data (dates, volumes, material usage)."),
  forecastHorizon: z.string().min(1, { message: "Please select a forecast horizon." })
    .describe("e.g., next week, next month, next quarter"),
});

type TrendForecasterFormValues = z.infer<typeof formSchema>;

export default function TrendForecasterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrendForecasterOutput | null>(null);

  const form = useForm<TrendForecasterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      historicalData: '',
      forecastHorizon: '',
    },
  });

  const onSubmit: SubmitHandler<TrendForecasterFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const forecastInput: TrendForecasterInput = {
        historicalData: data.historicalData,
        forecastHorizon: data.forecastHorizon,
      };
      const output = await trendForecaster(forecastInput);
      setResult(output);
    } catch (e) {
      console.error("Trend forecasting error:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred during trend forecasting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-primary" /> AI Trend Forecaster</CardTitle>
        <CardDescription>
          Evaluate past production data to predict future trends, potential bottlenecks, and material shortages.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Production Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste historical data here (e.g., CSV or JSON format including dates, production volumes, material usage, etc.)"
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide comprehensive data for accurate forecasting. At least 50 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forecastHorizon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forecast Horizon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select forecast period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="next week">Next Week</SelectItem>
                      <SelectItem value="next month">Next Month</SelectItem>
                      <SelectItem value="next quarter">Next Quarter</SelectItem>
                      <SelectItem value="next 6 months">Next 6 Months</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Forecasting...
                </>
              ) : (
                "Forecast Trends"
              )}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>

      {result && !isLoading && (
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-4">Forecast Results</h3>
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{result.summary}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Trend Lines</CardTitle></CardHeader>
              <CardContent><p className="text-sm whitespace-pre-wrap">{result.trendLines}</p></CardContent>
            </Card>
             <Card>
              <CardHeader><CardTitle>Confidence Level</CardTitle></CardHeader>
              <CardContent><p className="text-lg font-bold text-primary">{result.confidenceLevel}</p></CardContent>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}
