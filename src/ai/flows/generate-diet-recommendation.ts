// use server'
'use server';
/**
 * @fileOverview A diet recommendation AI agent.
 *
 * - generateDietRecommendation - A function that handles the diet recommendation process.
 * - GenerateDietRecommendationInput - The input type for the generateDietRecommendation function.
 * - GenerateDietRecommendationOutput - The return type for the generateDietRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietRecommendationInputSchema = z.object({
  age: z.number().describe('The age of the user in years.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  activityLevel: z
    .string()
    .describe(
      'The activity level of the user (e.g., sedentary, lightly active, moderately active, very active, extra active).'
    ),
  dietaryGoals: z
    .string()
    .describe('The dietary goals of the user (e.g., lose weight, gain muscle, maintain weight).'),
});
export type GenerateDietRecommendationInput = z.infer<
  typeof GenerateDietRecommendationInputSchema
>;

const MealSchema = z.object({
  name: z.string().describe('The name of the meal.'),
  description: z.string().describe('A description of the meal including portion sizes.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const GenerateDietRecommendationOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('The generated diet recommendation based on the user input.'),
  meals: z.array(MealSchema).describe('A list of recommended meals.'),
});
export type GenerateDietRecommendationOutput = z.infer<
  typeof GenerateDietRecommendationOutputSchema
>;

export async function generateDietRecommendation(
  input: GenerateDietRecommendationInput
): Promise<GenerateDietRecommendationOutput> {
  return generateDietRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietRecommendationPrompt',
  input: {schema: GenerateDietRecommendationInputSchema},
  output: {schema: GenerateDietRecommendationOutputSchema},
  prompt: `You are an expert nutritionist specializing in creating personalized diet recommendations.

You will use the age, weight, activity level, and dietary goals to generate a diet recommendation, including suggested foods and portion sizes for each meal.

Age: {{{age}}}
Weight: {{{weight}}}
Activity Level: {{{activityLevel}}}
Dietary Goals: {{{dietaryGoals}}}

Based on this information, provide a personalized diet recommendation.

Output should be a JSON object:
{
  "recommendation": "string",
  "meals": [
    {
      "name": "string",
      "description": "string",
      "photoDataUri": "data:<mimetype>;base64,<encoded_data>"
    }
  ]
}

For each meal in the meals array, generate an image using the name and description.
`,
});

const generateDietRecommendationFlow = ai.defineFlow(
  {
    name: 'generateDietRecommendationFlow',
    inputSchema: GenerateDietRecommendationInputSchema,
    outputSchema: GenerateDietRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    // Generate images for each meal
    if (output && output.meals) {
      for (const meal of output.meals) {
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-exp',
          prompt: [
            {text: `Generate an image of ${meal.name}`},
            {text: meal.description},
          ],
          config: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        });
        meal.photoDataUri = media.url;
      }
    }
    return output!;
  }
);
