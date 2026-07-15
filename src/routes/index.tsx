import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/parshva/Loader";
import { SmoothScroll } from "@/components/parshva/SmoothScroll";
import { CursorGlow } from "@/components/parshva/CursorGlow";
import { Navbar } from "@/components/parshva/Navbar";
import { Hero } from "@/components/parshva/Hero";
import { VentureStudio } from "@/components/parshva/VentureStudio";
import { Story } from "@/components/parshva/Story";
import { Services } from "@/components/parshva/Services";
import { Industries } from "@/components/parshva/Industries";
import { WhyParshva } from "@/components/parshva/WhyParshva";
import { Process } from "@/components/parshva/Process";
import { VisionMission } from "@/components/parshva/VisionMission";
import { FinalCTA } from "@/components/parshva/FinalCTA";
import { Footer } from "@/components/parshva/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <CursorGlow />
      <Navbar />
      <main className="relative">
        <Hero />
        <div className="section-divider" />
        <VentureStudio />
        <div className="section-divider" />
        <Story />
        <div className="section-divider" />
        <Services />
        <div className="section-divider" />
        <Industries />
        <div className="section-divider" />
        <WhyParshva />
        <div className="section-divider" />
        <Process />
        <div className="section-divider" />
        <VisionMission />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
