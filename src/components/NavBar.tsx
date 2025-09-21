"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function NavBar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-b border-primary" />
      </div>
    );
  }

  const handleLogout = async () => {
    const { error } = await authClient.signOut();
    if (!error?.code) {
      localStorage.removeItem("bearer_token");
      router.push("/");
    }
  };

  return (
    <nav className="flex items-center gap-3 text-sm">
      <Link href="/resources" className="hover:underline">Resources</Link>
      <Link href="/journal" className="hover:underline">Journal</Link>
      <Link href="/chat" className="hover:underline">Chat</Link>
      <Link href="/crisis" className="hover:underline">Crisis</Link>
      <span className="mx-2 text-muted-foreground">|</span>
      {session?.user ? (
        <div className="flex items-center gap-2">
          <Link href="/profile" className="flex items-center gap-2 hover:underline">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                {session.user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Link href="/login" className="rounded-md border px-3 py-1.5 hover:bg-accent">
            Login
          </Link>
          <Link href="/register" className="rounded-md bg-primary text-primary-foreground px-3 py-1.5">
            Sign up
          </Link>
        </>
      )}
    </nav>
  );
}