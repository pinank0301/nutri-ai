
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { MealSchema as MealZodSchemaType } from '@/ai/flows/generate-diet-recommendation'; 
import type { z } from 'zod';

// Use z.infer to get the TypeScript type from the Zod schema
type MealSchema = z.infer<typeof MealZodSchemaType>;

interface MealCardProps {
  meal: MealSchema; 
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
              data-ai-hint="food meal" 
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
