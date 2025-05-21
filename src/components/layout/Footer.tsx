export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container max-w-screen-2xl text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} NutriAI. All rights reserved.</p>
        <p className="mt-1">Personalized diet suggestions for a healthier you.</p>
      </div>
    </footer>
  );
}
