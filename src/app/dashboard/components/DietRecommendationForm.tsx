"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile, DietRecommendationData } from "@/types";
import { activityLevels, dietaryGoalsOptions, mapUserProfileToDietInput } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { generateDietRecommendation } from "@/ai/flows/generate-diet-recommendation";
import { useState, useEffect } from "react";
import { Loader2, Lightbulb } from "lucide-react";

const recommendationFormSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120),
  weight: z.coerce.number().min(1, "Weight is required").max(500),
  activityLevel: z.string().min(1, "Activity level is required"),
  dietaryGoals: z.string().min(1, "Dietary goal is required"),
});

type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;

interface DietRecommendationFormProps {
  userProfile: UserProfile;
  onRecommendationGenerated: (recommendation: DietRecommendationData) => void;
}

export function DietRecommendationForm({ userProfile, onRecommendationGenerated }: DietRecommendationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationFormSchema),
    defaultValues: {
      age: userProfile.age ?? undefined,
      weight: userProfile.weight ?? undefined,
      activityLevel: userProfile.activityLevel || activityLevels[0].value,
      dietaryGoals: userProfile.dietaryGoals || dietaryGoalsOptions[0].value,
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      age: userProfile.age ?? undefined,
      weight: userProfile.weight ?? undefined,
      activityLevel: userProfile.activityLevel || activityLevels[0].value,
      dietaryGoals: userProfile.dietaryGoals || dietaryGoalsOptions[0].value,
    });
  }, [userProfile, form]);

 async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    try {
      const input = mapUserProfileToDietInput(data as UserProfile);
      const recommendation = await generateDietRecommendation(input);
      onRecommendationGenerated(recommendation);
      toast({
        title: "Diet Recommendation Generated!",
        description: "Your personalized diet plan is ready.",
      });
    } catch (error) {
      console.error("Failed to generate diet recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to generate diet recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Get Your Personalized Diet Plan
        </CardTitle>
        <CardDescription>
          Fill in your details below, and our AI will generate a diet plan tailored just for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Your weight" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Goals</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dietary goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dietaryGoalsOptions.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Diet Plan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
