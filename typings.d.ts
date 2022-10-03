type Interval = "day" | "month" | "week" | "year";

interface Lesson {
  id: number;
  title: string;
  description: string;
}

interface Profile {
  id: number;
  is_subscribed: boolean;
  interval?: string;
  stripe_customer?: string;
}

interface PremiumContent {
  id: number;
  video_url?: string;
}

interface Product {
  id: string;
  name: string;
  price: number | null;
  interval?: Interval | undefined | null;
  currency: string;
}
