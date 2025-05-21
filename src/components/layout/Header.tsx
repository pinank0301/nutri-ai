"use client";

import Link from 'next/link';
import { NutriAILogo } from '@/components/icons/NutriAILogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <NutriAILogo className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">NutriAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" className="hidden md:inline-flex">
             <UserCircle className="h-5 w-5" />
             <span className="sr-only">User Profile</span>
           </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <NutriAILogo className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl text-foreground">NutriAI</span>
              </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex w-full items-center py-2 text-lg font-semibold",
                       pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                 <Button variant="outline" size="icon" className="mt-4">
                    <UserCircle className="h-5 w-5" />
                    <span className="sr-only">User Profile</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
