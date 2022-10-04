import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";

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

  console.log({ event });

  res.send({ received: true });
};

export default handler;
