import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-secondary to-background">
      <div className="mx-auto max-w-md px-6 py-12">
        <Suspense fallback={<div className="text-center py-8">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}