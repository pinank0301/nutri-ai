'use server';
/**
 * @fileOverview Analyzes logged meals and provides feedback on dietary alignment.
 *
 * - analyzeLoggedMeals - A function that analyzes logged meals against a recommended diet.
 * - AnalyzeLoggedMealsInput - The input type for the analyzeLoggedMeals function.
 * - AnalyzeLoggedMealsOutput - The return type for the analyzeLoggedMeals function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLoggedMealsInputSchema = z.object({
  recommendedDiet: z
    .string()
    .describe('The user\u2019s recommended diet plan, including foods and portion sizes.'),
  loggedMeals: z
    .string()
    .describe(
      'A detailed log of the user\u2019s meals, including descriptions and approximate portion sizes.'
    ),
  userProfile: z.string().describe('The user profile, including age, weight, activity level, and dietary goals.'),
});
export type AnalyzeLoggedMealsInput = z.infer<typeof AnalyzeLoggedMealsInputSchema>;

const AnalyzeLoggedMealsOutputSchema = z.object({
  alignmentAssessment: z
    .string()
    .describe('An assessment of how well the logged meals align with the recommended diet.'),
  suggestions: z
    .string()
    .describe('Specific suggestions for adjustments to the user\u2019s diet based on the analysis.'),
});
export type AnalyzeLoggedMealsOutput = z.infer<typeof AnalyzeLoggedMealsOutputSchema>;

export async function analyzeLoggedMeals(input: AnalyzeLoggedMealsInput): Promise<AnalyzeLoggedMealsOutput> {
  return analyzeLoggedMealsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLoggedMealsPrompt',
  input: {schema: AnalyzeLoggedMealsInputSchema},
  output: {schema: AnalyzeLoggedMealsOutputSchema},
  prompt: `You are a nutrition expert analyzing a user's logged meals against their recommended diet.

  User Profile: {{{userProfile}}}
  Recommended Diet: {{{recommendedDiet}}}
  Logged Meals: {{{loggedMeals}}}

  Provide an assessment of how well the logged meals align with the recommended diet and offer specific suggestions for adjustments.
  Be concise and actionable.

  Output your assessment and suggestions in a clear, structured format.
  `,
});

const analyzeLoggedMealsFlow = ai.defineFlow(
  {
    name: 'analyzeLoggedMealsFlow',
    inputSchema: AnalyzeLoggedMealsInputSchema,
    outputSchema: AnalyzeLoggedMealsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
