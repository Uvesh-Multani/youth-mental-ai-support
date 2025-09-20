"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const user = session?.user as any | undefined;

  // Local "profile preference" overrides (non-destructive, client-side only)
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const initials = useMemo(() => {
    const name = displayName || user?.name || user?.email || "U";
    return name
      .split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [displayName, user]);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [user, isPending, router]);

  useEffect(() => {
    // Hydrate local preferences
    const prefsRaw = typeof window !== "undefined" ? localStorage.getItem("profile_prefs") : null;
    const prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
    setDisplayName(prefs.displayName ?? user?.name ?? "");
    setAvatarUrl(prefs.avatarUrl ?? user?.image ?? "");

    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, [user?.name, user?.image]);

  const persistPrefs = (next: { displayName?: string; avatarUrl?: string }) => {
    const currentRaw = localStorage.getItem("profile_prefs");
    const current = currentRaw ? JSON.parse(currentRaw) : {};
    const merged = { ...current, ...next };
    localStorage.setItem("profile_prefs", JSON.stringify(merged));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Persist locally for now; backend user updates can be wired later.
      persistPrefs({ displayName, avatarUrl });
      toast.success("Profile updated (locally)");
      refetch();
    } catch (err) {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      toast.success("Signed out");
      refetch();
      router.push("/");
    }
  };

  const toggleTheme = (next: boolean) => {
    setDarkMode(next);
    const root = document.documentElement;
    if (next) root.classList.add("dark");
    else root.classList.remove("dark");
    toast.success(`Theme set to ${next ? "Dark" : "Light"}`);
  };

  if (isPending || !user) {
    return (
      <main className="min-h-[calc(100vh-56px)] grid place-items-center">
        <div className="text-sm text-muted-foreground">Loading your profile…</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-secondary to-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Profile settings</h1>
          <p className="text-muted-foreground">Manage your account, preferences, and appearance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Basic account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium leading-none">{displayName || user?.name || "Unnamed"}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">Dark mode</span>
                  <Switch checked={darkMode} onCheckedChange={toggleTheme} />
                </div>
              </div>
              <Button variant="secondary" className="w-full" onClick={handleSignOut}>
                Sign out
              </Button>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>These details personalize your experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled />
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/")}>Go home</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Display name and avatar are stored locally for now. Account edits and deletion will be available soon.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}