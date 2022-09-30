import useAuth from "context/user";
import type { NextPage, GetStaticProps } from "next";
import Link from "next/link";
import { supabase } from "utils/supabase";

interface Props {
  lessons: Lesson[];
}

const Home: NextPage<Props> = ({ lessons }: Props) => {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className="w-full max-w-3xl mx-auto my-16 px-2">
      <Link href={"/login"}>
        <a>Login</a>
      </Link>
      <Link href={"/logout"}>
        <a>Logout</a>
      </Link>
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const { data: lessons } = await supabase.from<Lesson>("lesson").select("*");

  return {
    props: {
      lessons,
    },
  };
};
