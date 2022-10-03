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
