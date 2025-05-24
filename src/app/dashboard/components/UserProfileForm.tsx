
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
import type { UserProfile, DietaryPreference } from "@/types";
import { activityLevels, dietaryGoalsOptions, dietaryPreferenceOptions } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";

const profileFormSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120),
  weight: z.coerce.number().min(1, "Weight is required").max(500),
  activityLevel: z.string().min(1, "Activity level is required"),
  dietaryGoals: z.string().min(1, "Dietary goal is required"),
  dietaryPreference: z.enum(['any', 'veg', 'non-veg', 'vegan']).default('any'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function UserProfileForm({ profile, onProfileUpdate }: UserProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      age: profile.age ?? undefined,
      weight: profile.weight ?? undefined,
      activityLevel: profile.activityLevel || activityLevels[0].value,
      dietaryGoals: profile.dietaryGoals || dietaryGoalsOptions[0].value,
      dietaryPreference: profile.dietaryPreference || dietaryPreferenceOptions[0].value as DietaryPreference,
    },
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    onProfileUpdate(data as UserProfile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Your Profile
        </CardTitle>
        <CardDescription>
          Update your personal information to get tailored diet recommendations.
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
                      <Input type="number" placeholder="Enter your age" {...field} />
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
                      <Input type="number" placeholder="Enter your weight" {...field} />
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
                        <SelectValue placeholder="Select your activity level" />
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
                        <SelectValue placeholder="Select your dietary goal" />
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
             <FormField
              control={form.control}
              name="dietaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your dietary preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dietaryPreferenceOptions.map((preference) => (
                        <SelectItem key={preference.value} value={preference.value}>
                          {preference.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
