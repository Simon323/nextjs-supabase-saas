import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { supabase } from "utils/supabase";
import Video from "react-player";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface Props {
  lesson: Lesson;
}

function LessonDetails({ lesson }: Props) {
  const [videoUrl, setvideoUrl] = useState<string | null | undefined>(null);

  const getPremiumContent = async () => {
    const { data } = await supabase
      .from<PremiumContent>("premium_content")
      .select("video_url")
      .eq("id", lesson.id)
      .single();

    setvideoUrl(data?.video_url);
  };

  useEffect(() => {
    getPremiumContent();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p>{lesson.description}</p>
      {!!videoUrl && <Video url={videoUrl} width="100%" />}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: lessons } = await supabase.from<Lesson>("lesson").select("id");

  //TODO: Add types and null fallback
  const paths = lessons!.map(({ id }) => ({
    params: {
      id: id.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

//TODO: { params: { id } }
export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;
  const { data: lesson } = await supabase
    .from<Lesson>("lesson")
    .select("*")
    .eq("id", id)
    .single();

  return {
    props: {
      lesson,
    },
  };
};

export default LessonDetails;
