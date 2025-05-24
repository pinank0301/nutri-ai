
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImageFromFile from '../public/hero.jpg';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-primary/10 via-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                  Discover Your Perfect Diet with NutriAI
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get personalized, AI-powered diet recommendations tailored to your age, weight, activity level, and health goals. Visualize your meals and achieve your wellness targets effortlessly.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="group">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="group">
                  Learn More
                  <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                </Button>
              </div>
            </div>
            <Image
              src={heroImageFromFile}
              alt="Healthy food for a balanced diet"
              data-ai-hint="healthy food"
              width={650}
              height={450}
              className="mx-auto aspect-[16/10] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose NutriAI?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NutriAI combines cutting-edge AI with nutritional science to provide you with actionable insights and delicious meal plans.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <div className="grid gap-1 p-6 rounded-lg border bg-gradient-to-br from-card via-muted/20 to-card shadow-sm">
              <h3 className="text-lg font-bold text-primary">Personalized Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                AI crafts diet plans based on your unique profile and goals.
              </p>
            </div>
            <div className="grid gap-1 p-6 rounded-lg border bg-gradient-to-br from-card via-muted/20 to-card shadow-sm">
              <h3 className="text-lg font-bold text-primary">Meal Visualizer</h3>
              <p className="text-sm text-muted-foreground">
                See appealing images of your recommended meals.
              </p>
            </div>
            <div className="grid gap-1 p-6 rounded-lg border bg-gradient-to-br from-card via-muted/20 to-card shadow-sm">
              <h3 className="text-lg font-bold text-primary">Meal Logging & Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Track your intake and get AI feedback on your progress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
