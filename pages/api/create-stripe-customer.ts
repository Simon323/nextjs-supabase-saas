import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "utils/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-08-01",
  });

  const customer = await stripe.customers.create({
    email: req.body.record.email, //TODO: Cast to IRecord object
  });

  await supabase
    .from<Profile>("profile")
    .update({ stripe_customer: customer.id })
    .eq("id", req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
