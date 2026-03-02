import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { ReactNode, useEffect, useState } from "react";

function RouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuth = false;
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoadingUser } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments, isLoadingUser, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
