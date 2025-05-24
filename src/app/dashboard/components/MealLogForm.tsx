
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
import { useState, useEffect } from "react";
import { Loader2, NotebookText, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const mealLogFormSchema = z.object({
  loggedMeals: z.string().min(1, "Please describe your meals.").optional(), // Optional to allow empty initial state
});

type MealLogFormValues = z.infer<typeof mealLogFormSchema>;

interface MealLogFormProps {
  userProfile: UserProfile;
  currentRecommendation: DietRecommendationData | null;
}

const getMealLogStorageKey = (userId: string) => `mealLogs_${userId}`;

export function MealLogForm({ userProfile, currentRecommendation }: MealLogFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeLoggedMealsOutput | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const form = useForm<MealLogFormValues>({
    resolver: zodResolver(mealLogFormSchema),
    defaultValues: {
      loggedMeals: "",
    },
  });

  // Load meals from localStorage when selectedDate or user changes
  useEffect(() => {
    if (user && selectedDate) {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      const storageKey = getMealLogStorageKey(user.uid);
      console.log(`Attempting to load meals for date: ${dateKey}, user: ${user.uid}`);
      try {
        const allLogsRaw = localStorage.getItem(storageKey);
        const allLogs = allLogsRaw ? JSON.parse(allLogsRaw) : {};
        const mealsForDate = allLogs[dateKey] || "";
        console.log(`Loaded meals from localStorage for ${dateKey}: "${mealsForDate}"`);
        form.setValue("loggedMeals", mealsForDate);
        // You can also log form.getValues("loggedMeals") here to see if RHF state updated
        // console.log(`RHF loggedMeals value after setValue: "${form.getValues("loggedMeals")}"`);
      } catch (error) {
        console.error("Error loading meals from localStorage:", error);
        form.setValue("loggedMeals", "");
      }
    } else {
      console.log("User or selectedDate is not available, clearing loggedMeals.");
      form.setValue("loggedMeals", ""); // Clear if no user or date
    }
  }, [selectedDate, user, form]);

  // Clear analysis result when selectedDate changes
  useEffect(() => {
    setAnalysisResult(null);
  }, [selectedDate]);

  async function onSubmit(data: MealLogFormValues) {
    if (!currentRecommendation || !currentRecommendation.recommendation) {
      toast({
        title: "Missing Information",
        description: "Please generate a diet recommendation first to compare against.",
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

    if (!user) {
      toast({
        title: "User not found",
        description: "Please ensure you are logged in.",
        variant: "destructive",
      });
      return;
    }

    const loggedMealsContent = data.loggedMeals || "";
    if (loggedMealsContent.trim().length < 10 && loggedMealsContent.trim().length > 0) {
         toast({
        title: "Meals too short",
        description: "Please describe your meals in at least 10 characters, or leave it empty if you ate nothing.",
        variant: "destructive",
      });
      return;
    }


    setIsLoading(true);
    setAnalysisResult(null);

    // Save meals to localStorage
    try {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      const storageKey = getMealLogStorageKey(user.uid);
      const allLogsRaw = localStorage.getItem(storageKey);
      let allLogs = allLogsRaw ? JSON.parse(allLogsRaw) : {}; // Ensure allLogs is mutable
      if (loggedMealsContent.trim() === "") {
        delete allLogs[dateKey]; 
        console.log(`Cleared meals for date: ${dateKey}`);
      } else {
        allLogs[dateKey] = loggedMealsContent;
        console.log(`Saved meals for date: ${dateKey}: "${loggedMealsContent}"`);
      }
      localStorage.setItem(storageKey, JSON.stringify(allLogs));
    } catch (error) {
      console.error("Error saving meals to localStorage:", error);
      toast({
        title: "Storage Error",
        description: "Could not save meal log locally.",
        variant: "destructive"
      });
    }
    
    // If no meals logged, don't call AI
    if (loggedMealsContent.trim() === "") {
      toast({
        title: "No Meals Logged",
        description: `No meals were entered for ${format(selectedDate, "PPP")}. Entry cleared.`,
      });
      setIsLoading(false);
      return;
    }


    const userProfileString = `Age: ${userProfile.age}, Weight: ${userProfile.weight}kg, Activity Level: ${userProfile.activityLevel}, Dietary Goals: ${userProfile.dietaryGoals}, Dietary Preference: ${userProfile.dietaryPreference}`;

    try {
      const result = await analyzeLoggedMeals({
        recommendedDiet: currentRecommendation.recommendation,
        loggedMeals: loggedMealsContent,
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
        title: "Analysis Error",
        description: "Failed to analyze meals. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const watchedLoggedMeals = form.watch("loggedMeals") || "";

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-card via-muted/10 to-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <NotebookText className="h-6 w-6 text-primary" />
            Log Your Meals
          </CardTitle>
          <CardDescription>
            Select a date, log your meals, and get an AI-powered analysis. Your logs are saved locally per day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                }}
                className="rounded-md border shadow-sm bg-card"
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
                            placeholder={`e.g., Breakfast: Oatmeal with berries...\n(Leave empty if you ate nothing on ${selectedDate ? format(selectedDate, "PPP") : 'selected date'})`}
                            className="min-h-[150px]"
                            {...field}
                            value={field.value || ""} 
                            disabled={!selectedDate || !user}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={
                        isLoading || 
                        !userProfile.age || 
                        !userProfile.weight || 
                        !selectedDate || 
                        !user ||
                        (watchedLoggedMeals.trim().length > 0 && watchedLoggedMeals.trim().length < 10)
                    }
                    className="w-full md:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing & Saving...
                      </>
                    ) : (
                       watchedLoggedMeals.trim() === "" ? "Clear Log for Date" : "Analyze & Save Meals"
                    )}
                  </Button>
                  {(!userProfile.age || !userProfile.weight) && (
                  <p className="text-sm text-destructive">
                    Please complete your age and weight in the Profile tab before analyzing meals.
                  </p>
                  )}
                   {!user && (
                    <p className="text-sm text-destructive">
                      Please log in to save and analyze meals.
                    </p>
                  )}
                  {!selectedDate && (
                    <p className="text-sm text-destructive">
                      Please select a date from the calendar.
                    </p>
                  )}
                   {(watchedLoggedMeals.trim().length > 0 && watchedLoggedMeals.trim().length < 10) && (
                     <p className="text-sm text-destructive">
                       Please describe your meals in at least 10 characters, or leave it empty.
                     </p>
                   )}
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="bg-gradient-to-br from-card via-muted/10 to-card">
          <CardHeader>
            <CardTitle>Meal Analysis Results for {selectedDate ? format(selectedDate, "PPP") : ""}</CardTitle>
            <CardDescription>These results are based on the meals you logged for the selected date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Alignment Assessment:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.alignmentAssessment}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Suggestions:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.suggestions}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


    