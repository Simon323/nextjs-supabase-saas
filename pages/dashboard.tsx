import useAuth from "context/user";
import { GetServerSideProps } from "next";
import React from "react";
import { supabase } from "utils/supabase";
import axios from "axios";
import { useRouter } from "next/router";

function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {!isLoading && (
        <>
          <p className="mb-6">
            {user?.is_subscribed
              ? `Subscribed: ${user.interval}`
              : "Not subscribed"}
          </p>
          <button onClick={loadPortal}>Manage subscription</button>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
