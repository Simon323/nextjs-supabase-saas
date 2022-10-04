import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "utils/supabase";
import cookie from "cookie";

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

    res.send({
      ...user,
      stripe_customer: data?.stripe_customer,
    });
  } else {
    return res.status(500).send("No headers cookie found");
  }
};

export default handler;
