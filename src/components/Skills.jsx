import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../styles/Skills.css";

import {
  FaJs,
  FaReact,
  FaGitAlt,
  FaPython,
  FaAws,
  FaEye,
  FaBrain,
} from "react-icons/fa";

import { SiTensorflow, SiLangchain, SiMongodb } from "react-icons/si";

const skills = [
  {
    icon: <FaJs />,
    title: "JavaScript",
    description: "Interactive and dynamic web experiences.",
  },
  {
    icon: <FaReact />,
    title: "React",
    description: "Component-based frontend development using React.",
  },
  {
    icon: <FaGitAlt />,
    title: "Git",
    description: "Version control and collaborative development.",
  },
  {
    icon: <FaPython />,
    title: "Python",
    description: "Programming, automation and problem solving.",
  },
  {
    icon: <FaEye />,
    title: "YOLOv8",
    description: "Real-time object detection and computer vision.",
  },
  {
    icon: <SiTensorflow />,
    title: "TensorFlow",
    description: "Building and training deep learning models.",
  },
  {
    icon: <FaBrain />,
    title: "RAG",
    description: "Retrieval-augmented generation for grounded AI outputs.",
  },
  {
    icon: <SiLangchain />,
    title: "LangChain",
    description: "Orchestrating LLM pipelines and agentic workflows.",
  },
  {
    icon: <SiMongodb />,
    title: "MongoDB",
    description: "Flexible, document-based data storage.",
  },
  {
    icon: <FaAws />,
    title: "AWS",
    description: "Cloud infrastructure and deployment.",
  },
];

function Skills() {

  const trackRef = useRef(null);

  useEffect(() => {

    const track = trackRef.current;

    const animation = gsap.to(track, {

      xPercent: -50,

      duration: 30,

      ease: "none",

      repeat: -1,

    });

    return () => animation.kill();

  }, []);

  return (
    <section id="skills" className="skills">

      <div className="skills-heading">

        <p className="section-tag">
          SKILLS
        </p>

        <h2>
          Technologies I Use
        </h2>

      </div>

      <div className="skills-slider">

        <div
          ref={trackRef}
          className="skills-track"
        >

          {[...skills, ...skills].map((skill, index) => (

            <div className="skill-card" key={index}>

              <div className="skill-icon">
                {skill.icon}
              </div>

              <h3>{skill.title}</h3>

              <p>{skill.description}</p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Skills;