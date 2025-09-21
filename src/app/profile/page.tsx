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
import { User, Edit, Save, Mail, Image as ImageIcon } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  const user = session?.user as any | undefined;

  // Form states
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.image || "");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [editing, setEditing] = useState(false);

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
    // Hydrate from user data
    setDisplayName(user?.name || "");
    setAvatarUrl(user?.image || "");

    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, [user?.name, user?.image]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: displayName.trim(),
          image: avatarUrl.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      await refetch(); // Refresh session data
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      setEditing(false);
    } else {
      setDisplayName(user?.name || "");
      setAvatarUrl(user?.image || "");
      setEditing(true);
    }
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      toast.success("Signed out");
      await refetch();
      router.push("/");
    }
  };

  const toggleTheme = (next: boolean) => {
    setDarkMode(next);
    const root = document.documentElement;
    if (next) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", next ? "dark" : "light");
    toast.success(`Theme set to ${next ? "Dark" : "Light"}`);
  };

  if (isPending || !user) {
    return (
      <main className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <div className="text-lg text-muted-foreground animate-pulse">Loading your profile…</div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your personal information and preferences in a safe space.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Overview
              </CardTitle>
              <CardDescription>View and manage your core details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4 pt-2">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                  <AvatarImage src={avatarUrl} alt={displayName || user.name || "Profile"} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-lg font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <div className="font-semibold text-lg">{displayName || user.name || "Unnamed User"}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <Switch checked={darkMode} onCheckedChange={toggleTheme} className="data-[state=checked]:bg-primary" />
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-destructive hover:bg-destructive/5" 
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Profile
              </CardTitle>
              <CardDescription>Update your display information (email cannot be changed for security)</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="displayName" className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4" />
                      Display Name
                    </Label>
                    <Input 
                      id="displayName" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      placeholder="Enter your preferred name"
                      className="h-12"
                      disabled={!editing}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="avatar" className="flex items-center gap-2 font-medium">
                      <ImageIcon className="h-4 w-4" />
                      Profile Image
                    </Label>
                    <Input 
                      id="avatar" 
                      value={avatarUrl} 
                      onChange={(e) => setAvatarUrl(e.target.value)} 
                      placeholder="Optional: Image URL (e.g., https://...)"
                      className="h-12"
                      disabled={!editing}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input 
                    id="email" 
                    value={user.email} 
                    className="h-12 bg-muted/50"
                    disabled 
                    placeholder="Email cannot be changed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={saving || !editing}
                    className="flex-1 h-12"
                  >
                    {saving ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant={!editing ? "secondary" : "outline"} 
                    onClick={handleEditToggle}
                    className="h-12 flex-1 sm:flex-none"
                    disabled={saving}
                  >
                    {editing ? "Cancel" : "Edit Profile"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => router.push("/home")}
                    className="h-12 sm:w-auto"
                  >
                    Back to Home
                  </Button>
                </div>

                {!editing && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Your profile is up to date. Click "Edit Profile" to make changes.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}