import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServiceSupabase } from "utils/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send("You are not authorized");
  }

  const customer = await stripe.customers.create({
    email: req.body.record.email, //TODO: Cast to IRecord object
  });

  const supabase = getServiceSupabase();

  await supabase
    .from<Profile>("profile")
    .update({ stripe_customer: customer.id })
    .eq("id", req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
