
"use client";

import Link from 'next/link';
import { NutriAILogo } from '@/components/icons/NutriAILogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, UserCircle, LogOut, LogIn, Settings, LayoutDashboard } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard', protected: true },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getInitials = (displayName: string | null | undefined) => {
    if (!displayName) return "U";
    const names = displayName.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  const visibleNavLinks = navLinks.filter(link => !link.protected || (link.protected && user));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <NutriAILogo className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-foreground">NutriAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === link.href ? "text-foreground font-medium" : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? (
             <UserCircle className="h-6 w-6 animate-pulse text-muted-foreground" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => router.push('/dashboard?tab=profile')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
          
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
                {visibleNavLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link                   
                      href={link.href}
                      className={cn(
                        "flex w-full items-center py-2 text-lg font-semibold",
                       pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                {user && (
                  <>
                    <DropdownMenuSeparator className="my-2 bg-border" />
                     <SheetClose asChild>
                      <Link href="/dashboard?tab=profile" className="flex w-full items-center py-2 text-lg font-semibold text-muted-foreground hover:text-primary">
                        <Settings className="mr-2 h-5 w-5" /> Profile Settings
                      </Link>
                    </SheetClose>
                    <Button variant="outline" onClick={handleSignOut} className="mt-4 w-full text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
                      <LogOut className="mr-2 h-5 w-5" /> Log Out
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
