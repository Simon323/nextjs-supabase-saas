import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "utils/supabase";
import cookie from "cookie";
import Stripe from "stripe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  const token = cookie.parse(req.headers.cookie!)["sb-access-token"];

  supabase.auth.session = () => ({
    access_token: token,
    token_type: "dsds",
    user,
  });

  const { data } = await supabase
    .from<Profile>("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-08-01",
  });

  const session = await stripe.billingPortal.sessions.create({
    customer: data?.stripe_customer!,
    return_url: "http://localhost:3000/dashboard",
  });

  return res.send({
    url: session.url,
  });
};

export default handler;
