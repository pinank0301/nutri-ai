
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth, googleProvider } from "@/config/firebase";
import { signInWithPopup, type FirebaseError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple Google icon component
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 488 512" fill="currentColor" {...props}>
    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      console.error("Error signing in with Google:", firebaseError);
      if (firebaseError.code === "auth/popup-closed-by-user") {
        toast({
          title: "Sign-in Cancelled",
          description: "You closed the sign-in popup. Please try again if you wish to sign in.",
          variant: "default",
        });
      } else {
        toast({
          title: "Sign-in Failed",
          description: firebaseError.message || "An unexpected error occurred during sign-in. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSigningIn(false);
    }
  };
  

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <LogIn className="h-8 w-8 text-primary" />
            Welcome to NutriAI
          </CardTitle>
          <CardDescription className="text-md">
            Sign in to access your personalized dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full text-lg py-6"
            disabled={isSigningIn}
            variant="outline"
          >
            {isSigningIn ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-3 h-5 w-5" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

