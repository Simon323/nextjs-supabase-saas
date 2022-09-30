import React, { useEffect } from "react";
import { supabase } from "utils/supabase";
import { useRouter } from "next/router";

function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logoutSupabase = async () => {
      await supabase.auth.signOut();
      router.push("/");
    };
    logoutSupabase();
  }, []);

  return <div>Logout</div>;
}

export default Logout;
