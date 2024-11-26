import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import About from "@/components/About/About";

export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const AboutPage = () => {
  return (
    <DefaultLayout>
        <About/>
    </DefaultLayout>
  );
};

export default AboutPage;
