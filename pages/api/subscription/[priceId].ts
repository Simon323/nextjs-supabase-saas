import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "utils/supabase";
import cookie from "cookie";
import Stripe from "stripe";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  if (req.headers.cookie) {
    const token = cookie.parse(req.headers.cookie!)["sb-access-token"];
    supabase.auth.session = () => ({
      access_token: token,
      token_type: "dsds",
      user,
    });

    //TODO: Add more types
    const { data } = await supabase
      .from<Profile>("profile")
      .select("stripe_customer")
      .eq("id", user.id)
      .single();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2022-08-01",
    });

    //TODO: Add more types
    const { priceId } = req.query;
    // const lineItems = [
    //   {
    //     price: priceId,
    //     quantity: 1,
    //   },
    // ];

    const session = await stripe.checkout.sessions.create({
      customer: data?.stripe_customer,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId as string, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancelld`,
    });

    res.send({
      id: session.id,
    });
  } else {
    return res.status(500).send("No headers cookie found");
  }
};

export default handler;
