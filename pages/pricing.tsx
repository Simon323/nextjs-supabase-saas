import useAuth from "context/user";
import { GetStaticProps } from "next";
import Stripe from "stripe";
import axios from "axios";

interface Props {
  plans: Product[];
}

function Pricing({ plans }: Props) {
  const { user, login, isLoading } = useAuth();

  const processSubscription = (planId: string) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    console.log(data);
  };

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = !!user && user.is_subscribed;

  return (
    <div className="w-full max-w-3xl mx-auto flex justify-around flex-wrap gap-y-5 pt-5">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="w-80 h-40 rounded shadow px-6 py-6 hover:bg-slate-400 hover:cursor-pointer"
        >
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            {plan.price && `$ ${plan.price / 100}`}{" "}
            {plan.interval && `/ ${plan.interval}`}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button onClick={processSubscription(plan.id)}>
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <button>Manage Subscription</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2022-08-01",
  });

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price): Promise<Product> => {
      const product = await stripe.products.retrieve(price.product as string);

      return {
        id: product.id,
        name: product.name,
        price: price.unit_amount,
        interval: price?.recurring?.interval ?? null,
        currency: price.currency,
      };
    })
  );

  // const sortedPlans = plans.sort((a, b) => a.price! - b.price!);

  return {
    props: {
      plans,
    },
  };
};

export default Pricing;
