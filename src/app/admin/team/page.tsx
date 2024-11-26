import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Contact from "@/components/Contact/Contact";
import Team from "@/components/Team/Team";


export const metadata: Metadata = {
  title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

const TeamPage = () => {
  return (
    <DefaultLayout>
        <Team/>
    </DefaultLayout>
  );
};

export default TeamPage;