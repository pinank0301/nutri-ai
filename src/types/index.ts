
import type { GenerateDietRecommendationOutput, GenerateDietRecommendationInput } from "@/ai/flows/generate-diet-recommendation";

export type DietaryPreference = 'any' | 'veg' | 'non-veg' | 'vegan';

export type UserProfile = {
  age: number | undefined;
  weight: number | undefined;
  activityLevel: string;
  dietaryGoals: string;
  dietaryPreference: DietaryPreference;
};

export type DietRecommendationData = GenerateDietRecommendationOutput;

// Helper to map UserProfile to GenerateDietRecommendationInput
export const mapUserProfileToDietInput = (profile: UserProfile): GenerateDietRecommendationInput => {
  if (profile.age === undefined || profile.weight === undefined) {
    throw new Error("Age and weight are required for diet recommendation.");
  }
  return {
    age: profile.age,
    weight: profile.weight,
    activityLevel: profile.activityLevel,
    dietaryGoals: profile.dietaryGoals,
    dietaryPreference: profile.dietaryPreference,
  };
};

export const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'lightly_active', label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
  { value: 'moderately_active', label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
  { value: 'very_active', label: 'Very Active (hard exercise/sports 6-7 days a week)' },
  { value: 'extra_active', label: 'Extra Active (very hard exercise/sports & physical job)' },
];

export const dietaryGoalsOptions = [
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'gain_muscle', label: 'Gain Muscle' },
  { value: 'maintain_weight', label: 'Maintain Weight' },
  { value: 'healthy_eating', label: 'General Healthy Eating' },
];

export const dietaryPreferenceOptions: Array<{value: DietaryPreference, label: string}> = [
  { value: 'any', label: 'Any' },
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
];
