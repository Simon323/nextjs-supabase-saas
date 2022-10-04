import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { getServiceSupabase } from "utils/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export const config = { api: { bodyParser: false } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers["stripe-signature"];
  const signinSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature!,
      signinSecret!
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case "customer.subscription.created":
      await supabase
        .from<Profile>("profile")
        .update({
          is_subscribed: true,
          //@ts-ignore //TODO: fix this error
          interval: event.data.object.items.data[0].plan.interval,
        })
        //@ts-ignore //TODO: Fix this error
        .eq("stripe_customer", event.data.object.customer);
      break;
    case "customer.subscription.updated":
      break;
    case "customer.subscription.deleted":
      break;
  }

  console.log({ event });

  res.send({ received: true });
};

export default handler;
