import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { supabase } from "utils/supabase";

interface IParams extends ParsedUrlQuery {
  id: string;
}

interface Props {
  lesson: Lesson;
}

function LessonDetails({ lesson }: Props) {
  console.log(lesson);

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">{lesson.title}</h1>
      <p>{lesson.description}</p>
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
