import React from "react";
import Link from "next/link";
import useAuth from "context/user";

function Nav() {
  const { user } = useAuth();

  return (
    <nav className="flex py-4 px-6 border-b border-gray-200">
      <Link href="/">
        <a className="ml-2">Home</a>
      </Link>
      {!!user && (
        <Link href="/dashboard">
          <a className="ml-2">Dashboard</a>
        </Link>
      )}
      <Link href="/pricing">
        <a className="ml-2">Pricing</a>
      </Link>
      <div className="ml-auto">
        <Link href={user ? "/logout" : "/login"}>
          <a>{user ? "Logout" : "Login"}</a>
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
