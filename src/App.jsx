import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Below-the-fold sections are code-split so the initial bundle
// only contains what's needed for the first paint (Navbar + Hero).
const About = lazy(() => import("./components/About"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const Resume = lazy(() => import("./components/Resume"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  return (
    <>
      <Navbar />

      <Hero />

      <Suspense fallback={null}>
        <About />

        <Skills />

        <Projects />

        <Resume />

        <Contact />

        <Footer />
      </Suspense>
    </>
  );
}

export default App;
