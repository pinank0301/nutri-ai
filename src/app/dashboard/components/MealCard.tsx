import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealSchema } from '@/ai/flows/generate-diet-recommendation'; // Ensure this type is exported or defined appropriately

interface MealCardProps {
  meal: Zod.infer<typeof MealSchema>; // Use Zod.infer if MealSchema is a Zod schema instance
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        {meal.photoDataUri ? (
           <div className="relative w-full h-48">
            <Image
              src={meal.photoDataUri}
              alt={meal.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint="food meal" // Generic hint for placeholder generation
            />
           </div>
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1">{meal.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {meal.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
