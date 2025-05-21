"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileForm } from "./components/UserProfileForm";
import { DietRecommendationForm } from "./components/DietRecommendationForm";
import { MealCard } from "./components/MealCard";
import { MealLogForm } from "./components/MealLogForm";
import type { UserProfile, DietRecommendationData } from "@/types";
import { activityLevels, dietaryGoalsOptions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, User, NotebookText, Lightbulb } from "lucide-react";

const initialProfile: UserProfile = {
  age: undefined,
  weight: undefined,
  activityLevel: activityLevels[0].value,
  dietaryGoals: dietaryGoalsOptions[0].value,
};

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [dietRecommendation, setDietRecommendation] = useState<DietRecommendationData | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Potentially load profile from localStorage here in a real app
  }, []);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    // Potentially save profile to localStorage here
  };

  const handleRecommendationGenerated = (recommendation: DietRecommendationData) => {
    setDietRecommendation(recommendation);
  };

  if (!isClient) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="recommendation" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8">
        <TabsTrigger value="recommendation" className="gap-2">
          <Lightbulb className="h-4 w-4" /> Diet Plan
        </TabsTrigger>
        <TabsTrigger value="log" className="gap-2">
          <NotebookText className="h-4 w-4" /> Log Meals
        </TabsTrigger>
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" /> Profile
        </TabsTrigger>
      </TabsList>

      <TabsContent value="recommendation" className="space-y-8">
        <DietRecommendationForm
          userProfile={userProfile}
          onRecommendationGenerated={handleRecommendationGenerated}
        />
        {dietRecommendation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-primary" />
                Your Personalized Diet
              </CardTitle>
              <CardDescription>{dietRecommendation.recommendation}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4">Recommended Meals:</h3>
              {dietRecommendation.meals && dietRecommendation.meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dietRecommendation.meals.map((meal, index) => (
                    <MealCard key={index} meal={meal} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No meals recommended in this plan. The AI might have provided general advice.</p>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="log">
        <MealLogForm userProfile={userProfile} currentRecommendation={dietRecommendation} />
      </TabsContent>

      <TabsContent value="profile">
        <UserProfileForm profile={userProfile} onProfileUpdate={handleProfileUpdate} />
      </TabsContent>
    </Tabs>
  );
}
