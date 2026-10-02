import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Testimonials from "./components/Testimonials";
import TestimonialForm from "./components/TestimonialForm";
import Footer from "./components/Footer";

export default function App() {
  // Bumped after each successful submission so Testimonials re-fetches.
  const [version, setVersion] = useState(0);

  return (
    <>
      <Header />
      <Hero />
      <About />
      <Skills />
      <Testimonials version={version} />
      <TestimonialForm onSuccess={() => setVersion((v) => v + 1)} />
      <Footer />
    </>
  );
}
