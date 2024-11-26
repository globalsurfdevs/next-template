import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Team from "@/components/Team/Team";
import News from "@/components/News/News";


export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const NewsPage = () => {
  return (
    <DefaultLayout>
        <News/>
    </DefaultLayout>
  );
};

export default NewsPage;