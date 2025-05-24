
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { analyzeLoggedMeals } from "@/ai/flows/analyze-logged-meals";
import type { AnalyzeLoggedMealsOutput } from "@/ai/flows/analyze-logged-meals";
import type { UserProfile, DietRecommendationData } from "@/types";
import { useState } from "react";
import { Loader2, NotebookText, CalendarDays } from "lucide-react";
import { format } from "date-fns";

const mealLogFormSchema = z.object({
  loggedMeals: z.string().min(10, "Please describe your meals in at least 10 characters."),
});

type MealLogFormValues = z.infer<typeof mealLogFormSchema>;

interface MealLogFormProps {
  userProfile: UserProfile;
  currentRecommendation: DietRecommendationData | null;
}

export function MealLogForm({ userProfile, currentRecommendation }: MealLogFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeLoggedMealsOutput | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<MealLogFormValues>({
    resolver: zodResolver(mealLogFormSchema),
    defaultValues: {
      loggedMeals: "",
    },
  });

  async function onSubmit(data: MealLogFormValues) {
    if (!currentRecommendation || !currentRecommendation.recommendation) {
      toast({
        title: "Missing Information",
        description: "Please generate a diet recommendation first.",
        variant: "destructive",
      });
      return;
    }

    if (!userProfile.age || !userProfile.weight) {
         toast({
        title: "Missing Profile Information",
        description: "Please complete your profile information in the Profile tab.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: "Date Not Selected",
        description: "Please select a date to log meals for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    const userProfileString = `Age: ${userProfile.age}, Weight: ${userProfile.weight}kg, Activity Level: ${userProfile.activityLevel}, Dietary Goals: ${userProfile.dietaryGoals}, Dietary Preference: ${userProfile.dietaryPreference}`;

    try {
      const result = await analyzeLoggedMeals({
        recommendedDiet: currentRecommendation.recommendation,
        loggedMeals: data.loggedMeals, // These are meals for the selectedDate
        userProfile: userProfileString,
      });
      setAnalysisResult(result);
      toast({
        title: `Meal Analysis Complete for ${format(selectedDate, "PPP")}!`,
        description: "Check the results below.",
      });
    } catch (error) {
      console.error("Failed to analyze logged meals:", error);
      toast({
        title: "Error",
        description: "Failed to analyze meals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotebookText className="h-6 w-6 text-primary" />
            Log Your Meals
          </CardTitle>
          <CardDescription>
            Select a date and enter the meals you've consumed for an AI-powered analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow-sm"
                disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
              />
               <p className="text-sm text-center mt-2 text-muted-foreground">
                Selected: {selectedDate ? format(selectedDate, "PPP") : "No date selected"}
              </p>
            </div>

            <div className="flex-grow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="loggedMeals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          Meals for {selectedDate ? format(selectedDate, "MMMM do, yyyy") : "the selected date"}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={`e.g., Breakfast: Oatmeal with berries and nuts. Lunch: Grilled chicken salad...\n(Meals for ${selectedDate ? format(selectedDate, "PPP") : 'selected date'})`}
                            className="min-h-[150px]"
                            {...field}
                            disabled={!selectedDate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isLoading || !userProfile.age || !userProfile.weight || !selectedDate || form.watch('loggedMeals').length < 10} 
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Meals for Selected Date"
                    )}
                  </Button>
                  {(!userProfile.age || !userProfile.weight) && (
                  <p className="text-sm text-destructive">
                    Please complete your age and weight in the Profile tab before analyzing meals.
                  </p>
                  )}
                  {!selectedDate && (
                    <p className="text-sm text-destructive">
                      Please select a date from the calendar.
                    </p>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Meal Analysis Results for {selectedDate ? format(selectedDate, "PPP") : ""}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Alignment Assessment:</h3>
              <p className="text-muted-foreground">{analysisResult.alignmentAssessment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Suggestions:</h3>
              <p className="text-muted-foreground">{analysisResult.suggestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
