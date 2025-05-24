
"use client";

import { useState, useEffect, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileForm } from "./components/UserProfileForm";
import { DietRecommendationForm } from "./components/DietRecommendationForm";
import { MealCard } from "./components/MealCard";
import { MealLogForm } from "./components/MealLogForm";
import type { UserProfile, DietRecommendationData, DietaryPreference } from "@/types";
import { activityLevels, dietaryGoalsOptions, dietaryPreferenceOptions } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Utensils, User, NotebookText, Lightbulb, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

const initialProfile: UserProfile = {
  age: undefined,
  weight: undefined,
  activityLevel: activityLevels[0].value,
  dietaryGoals: dietaryGoalsOptions[0].value,
  dietaryPreference: dietaryPreferenceOptions[0].value as DietaryPreference,
};

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [isClient, setIsClient] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [dietRecommendation, setDietRecommendation] = useState<DietRecommendationData | null>(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "recommendation");

  useEffect(() => {
    setIsClient(true);
    // In a real app, you'd load profile from Firestore based on user.uid
    // For now, we'll reset profile if user changes or on initial load with a user
    if (user) {
        // Placeholder: load from localStorage or set to initial if new user
        const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        } else {
            setUserProfile(initialProfile);
        }
    } else if (!authLoading) {
      // If not loading and no user, redirect to login
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === "recommendation" || tab === "log" || tab === "profile")) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (user) {
        localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
    }
  };

  const handleRecommendationGenerated = (recommendation: DietRecommendationData) => {
    setDietRecommendation(recommendation);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    router.push(`/dashboard?tab=${value}`, { scroll: false });
  };


  if (authLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    // This case should ideally be handled by the redirect in useEffect,
    // but as a fallback:
     return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p>Redirecting to login...</p>
        <Loader2 className="ml-2 h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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

export default function DashboardPage() {
  return (
    // Suspense boundary for useSearchParams usage
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
