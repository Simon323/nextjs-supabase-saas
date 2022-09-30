import useAuth from "context/user";
import React, { useEffect } from "react";
import { supabase } from "utils/supabase";

function Login() {
  const { login } = useAuth();
  useEffect(() => {
    const exc = async () => {
      await login();
    };
    exc();
  }, []);
  return <div>Login</div>;
}

export default Login;
