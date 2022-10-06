import { User } from "@supabase/gotrue-js";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "utils/supabase";
import axios from "axios";

interface IUser {
  is_subscribed: boolean;
  interval?: string;
}

interface IAuth {
  user: (User & IUser) | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuth>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | any>(supabase.auth.user());
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const sessionUser = supabase.auth.user();
      if (sessionUser) {
        const { data: profile } = await supabase
          .from<Profile>("profile")
          .select("*")
          .eq("id", sessionUser.id)
          .single();

        setUser({
          ...sessionUser,
          ...profile,
        });
      }
      setIsLoading(false);
      setInitialLoading(false);
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      // setUser(supabase.auth.user());
      getUserProfile();
    });
  }, []);

  useEffect(() => {
    axios.post("/api/set-supabase-cookie", {
      event: user ? "SIGNED_IN" : "SIGNED_OUT",
      session: supabase.auth.session(),
    });
  }, [user]);

  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const memoedValue = useMemo(
    () => ({ user, login, logout, isLoading }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
