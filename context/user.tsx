import { User } from "@supabase/gotrue-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "utils/supabase";

interface IAuth {
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuth>({
  user: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(supabase.auth.user());

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      setUser(supabase.auth.user());
    });
  }, []);

  const memoedValue = useMemo(() => ({ user }), [user]);

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
