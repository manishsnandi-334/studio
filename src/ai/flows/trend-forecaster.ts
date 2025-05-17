'use server';

/**
 * @fileOverview An AI-powered trend forecaster for manufacturing data.
 *
 * - trendForecaster - A function that analyzes historical production data and forecasts future trends.
 * - TrendForecasterInput - The input type for the trendForecaster function.
 * - TrendForecasterOutput - The return type for the trendForecaster function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendForecasterInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'A string containing historical production data, including dates, production volumes, material usage, and any relevant metrics. Should be in CSV or JSON format.'
    ),
  forecastHorizon: z
    .string()
    .describe(
      'The time period for which the forecast is required (e.g., next week, next month, next quarter).'
    ),
});
export type TrendForecasterInput = z.infer<typeof TrendForecasterInputSchema>;

const TrendForecasterOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the forecasted trends, including potential bottlenecks, material shortages, and recommended actions.'
    ),
  trendLines: z.string().describe('Trend lines that show the trend over time'),
  confidenceLevel: z
    .string()
    .describe(
      'A measure of the confidence level in the forecast, expressed as a percentage.'
    ),
});
export type TrendForecasterOutput = z.infer<typeof TrendForecasterOutputSchema>;

export async function trendForecaster(input: TrendForecasterInput): Promise<TrendForecasterOutput> {
  return trendForecasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'trendForecasterPrompt',
  input: {schema: TrendForecasterInputSchema},
  output: {schema: TrendForecasterOutputSchema},
  prompt: `You are an expert manufacturing trend forecaster. Analyze the provided historical production data and forecast future trends, including potential bottlenecks, material shortages, and other relevant insights.

Historical Data: {{{historicalData}}}
Forecast Horizon: {{{forecastHorizon}}}

Provide a summary of the forecasted trends, trend lines that show the trend over time, and a confidence level for the forecast. Focus on bottlenecks and shortages.

Summary:
Trend Lines:
Confidence Level:
`,
});

const trendForecasterFlow = ai.defineFlow(
  {
    name: 'trendForecasterFlow',
    inputSchema: TrendForecasterInputSchema,
    outputSchema: TrendForecasterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
