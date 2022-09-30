import React, { useEffect } from "react";
import { supabase } from "utils/supabase";

function Login() {
  useEffect(() => {
    supabase.auth.signIn({
      provider: "github",
    });
  });
  return <div>Login</div>;
}

export default Login;
