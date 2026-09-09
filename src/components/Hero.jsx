import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  FaJs,
  FaReact,
  FaPython,
  FaGitAlt,
  FaAws,
} from "react-icons/fa";
import { SiTensorflow } from "react-icons/si";
import RobotMascot from "./RobotMascot";
import "../styles/Hero.css";

// Floating tech-stack icons shown in the background of the hero.
// Each has its own brand color that "lights up" when the cursor
// gets close, plus a position class handled in Hero.css.
const TECH_ICONS = [
  { Icon: SiTensorflow, color: "#FF6F00", className: "tech-html" },
  { Icon: FaAws, color: "#FF9900", className: "tech-css" },
  { Icon: FaJs, color: "#F0DB4F", className: "tech-js" },
  { Icon: FaReact, color: "#61DAFB", className: "tech-react" },
  { Icon: FaPython, color: "#3776AB", className: "tech-python" },
  { Icon: FaGitAlt, color: "#F05032", className: "tech-git" },
];

const PROXIMITY_RADIUS = 160;

function Hero() {

  const heroRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);
  const glowOneRef = useRef(null);
  const glowTwoRef = useRef(null);
  const scrollRef = useRef(null);
  const techRefs = useRef([]);
  const techCenters = useRef([]);

  useEffect(() => {

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = [
      tagRef.current,
      titleRef.current,
      descRef.current,
      ...buttonsRef.current.children,
    ];

    if (prefersReducedMotion) {
      gsap.set(elements, { opacity: 1, y: 0 });
      gsap.set([glowOneRef.current, glowTwoRef.current], { opacity: 0.35, scale: 1 });
      gsap.set(scrollRef.current, { opacity: 1 });
      gsap.set(techRefs.current, { opacity: 0.5, scale: 1 });
      return;
    }

    // ---- Entrance sequence ----
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    tl.to([glowOneRef.current, glowTwoRef.current], {
      opacity: 0.35,
      scale: 1,
      duration: 1.6,
      ease: "power2.out",
    })
      .to(
        techRefs.current,
        { opacity: 1, scale: 1, duration: 1, stagger: 0.08, ease: "back.out(1.7)" },
        0.2
      )
      .to(
        tagRef.current,
        { opacity: 1, y: 0, duration: 0.6 },
        0.35
      )
      .to(
        titleRef.current,
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      )
      .to(
        descRef.current,
        { opacity: 1, y: 0, duration: 0.7 },
        0.7
      )
      .to(
        buttonsRef.current.children,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        0.85
      )
      .to(
        scrollRef.current,
        { opacity: 1, duration: 0.6 },
        1.3
      );

    // ---- Ambient drifting glow (subtle, continuous) ----
    const floatOne = gsap.to(glowOneRef.current, {
      x: 30,
      y: 20,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const floatTwo = gsap.to(glowTwoRef.current, {
      x: -25,
      y: -30,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ---- Idle floating motion for tech icons ----
    const techFloats = techRefs.current.map((el, i) =>
      gsap.to(el, {
        y: i % 2 === 0 ? "+=18" : "-=18",
        rotation: i % 2 === 0 ? 8 : -8,
        duration: 3.5 + i * 0.4,
        delay: i * 0.15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    );

    // ---- Cache tech icon centers (viewport coordinates) ----
    const computeCenters = () => {
      techCenters.current = techRefs.current.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      });
    };

    computeCenters();
    window.addEventListener("resize", computeCenters);

    // ---- Cursor parallax on glows + magnetic glow on tech icons ----
    const hero = heroRef.current;

    const handlePointerMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(glowOneRef.current, {
        x: relX * 60,
        y: relY * 60,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(glowTwoRef.current, {
        x: relX * -50,
        y: relY * -50,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });

      techRefs.current.forEach((el, i) => {
        const center = techCenters.current[i];
        if (!el || !center) return;

        const dx = e.clientX - center.x;
        const dy = e.clientY - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const intensity = Math.max(0, 1 - dist / PROXIMITY_RADIUS);

        gsap.to(el, {
          color: intensity > 0 ? TECH_ICONS[i].color : "rgba(255,255,255,0.16)",
          "--glow": intensity * 22,
          scale: 1 + intensity * 0.35,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    hero.addEventListener("pointermove", handlePointerMove);

    return () => {
      tl.kill();
      floatOne.kill();
      floatTwo.kill();
      techFloats.forEach((t) => t.kill());
      window.removeEventListener("resize", computeCenters);
      hero.removeEventListener("pointermove", handlePointerMove);
    };

  }, []);

  return (

    <section id="home" className="hero" ref={heroRef}>


      {/* Background Glow */}

      <div className="hero-glow glow-one" ref={glowOneRef}></div>
      <div className="hero-glow glow-two" ref={glowTwoRef}></div>


      {/* Floating Tech Stack Icons */}

      <div className="hero-tech-layer" aria-hidden="true">

        {TECH_ICONS.map(({ Icon, className }, index) => (
          <span
            key={className}
            ref={(el) => (techRefs.current[index] = el)}
            className={`tech-icon ${className}`}
          >
            <Icon />
          </span>
        ))}

      </div>



      {/* Content */}

      <div className="hero-content">


        <div className="hero-tag" ref={tagRef}>
          <RobotMascot />
        </div>


        <h1 className="hero-title" ref={titleRef}>

          Hey, I'm <span>Vishwaswarup Rath</span>

        </h1>


        <p className="hero-description" ref={descRef}>

          I make full stack AI products when I'm bored,
          and I am always bored.

        </p>



        <div className="hero-buttons" ref={buttonsRef}>


          <span className="btn-reveal">
            <a 
              href="#projects" 
              className="btn btn-primary"
            >

              View My Work

            </a>
          </span>



          <span className="btn-reveal">
            <a 
              href="#contact" 
              className="btn btn-secondary"
            >

              Let's Connect

            </a>
          </span>


        </div>


      </div>



      {/* Scroll Indicator */}

      <div className="scroll-indicator" ref={scrollRef}>

        <span></span>

        Scroll

      </div>


    </section>

  );

}

export default Hero;
