import { User } from "@supabase/gotrue-js";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "utils/supabase";

interface IAuth {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuth>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null | any>(supabase.auth.user());
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

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
      setInitialLoading(false);
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      // setUser(supabase.auth.user());
      getUserProfile();
    });
  }, []);

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

  const memoedValue = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
