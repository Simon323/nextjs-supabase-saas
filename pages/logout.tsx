import useAuth from "context/user";
import React, { useEffect } from "react";

function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    const exc = async () => {
      await logout();
    };
    exc();
  }, []);

  return <div>Logout</div>;
}

export default Logout;
