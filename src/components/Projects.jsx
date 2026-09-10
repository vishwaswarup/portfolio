import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaYoutube } from "react-icons/fa";

import "../styles/Projects.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    badge: "GITHUB PROJECT",
    video: null,
    poster: null,

    title: "IntelliRAG — Incident-Centric RAG for Terrorism Analysis",

    image: "/images/intellirag-landing.webp",

    description:
      "A multi-modal RAG platform ingesting 5 document/media types (PDFs, news articles, scanned documents, images, reports) into structured, searchable intelligence records via a 6-stage pipeline — OCR, information extraction, entity/relationship mapping, semantic retrieval, layered summarization and analyst-oriented querying — to support threat assessment and intelligence-driven decision making.",

    tech: ["Python", "RAG", "Vector Search", "SQLite", "OCR", "Local LLMs"],

    demo: null,

    github: "https://github.com/vishwaswarup/IntelliRAG",
  },
  {
    id: 2,
    badge: "LIVE PROJECT",
    video: null,
    poster: null,

    title: "BiteRate — Restaurant Review Sentiment Analyzer",

    image: "/images/biterate-landing.webp",

    description:
      "An end-to-end NLP pipeline for restaurant review sentiment analysis with emoji-aware preprocessing, tokenization, lemmatization, negation handling and TF-IDF vectorization. Trained and benchmarked 5 models — Logistic Regression, Naive Bayes, Linear SVC, XGBoost and a Soft Voting Ensemble — reaching up to 88% accuracy, deployed through an interactive Flask dashboard for real-time predictions.",

    tech: ["Python", "NLP", "TF-IDF", "XGBoost", "Flask"],

    demo: "https://biterateai.vercel.app/",

    github: "https://github.com/vishwaswarup/BiteRate",
  },
  {
    id: 3,
    badge: "LIVE PROJECT",
    video: null,
    poster: null,

    title: "Artefax",

    image: "/images/artefax-landing.webp",

    description:
      "An AI platform that analyzes a source document once, then transforms that single understanding into audience-specific outputs (Executive Summary, LinkedIn Post, Advisory, Presentation), each exported as a real PDF/PPTX/TXT file — built with FastAPI, Gemini structured outputs and Next.js, with no re-prompting drift between outputs.",

    tech: ["Next.js", "FastAPI", "Gemini", "Python"],

    demo: "https://artefax.onrender.com/",

    github: "https://github.com/vishwaswarup/Artefax",
  },
  {
    id: 4,
    badge: "GITHUB PROJECT",
    video: null,
    poster: null,

    title: "Personal Stock Recommender System",

    image: "/images/stock-recommender-landing.webp",

    description:
      "A full-stack stock recommendation system that generates personalized stock suggestions based on user risk profiles, with a clean REST API and scalable backend architecture.",

    tech: ["FastAPI", "React", "PostgreSQL", "SQLAlchemy", "JWT", "Alembic"],

    demo: null,

    github: "https://github.com/vishwaswarup/stock-recommendersystem",
  },
  {
    id: 5,
    badge: "GITHUB PROJECT",
    video: "/video/VisionAI_demo.mp4",
    poster: "/video/VisionAI_poster.jpg",
    youtube: "https://youtube.com/shorts/ll4xwz3JRe4?feature=share",

    title: "VisionAI",

    description:
      "A Python-based voice assistant that performs web searches, plays Spotify music, retrieves time/date and answers natural language queries using Google Gemini AI, remembering previous actions for context-aware follow-ups.",

    tech: ["Python", "Gemini AI", "Voice Assistant"],

    demo: null,

    github: "https://github.com/vishwaswarup/VisionAI",
  },
  {
    id: 6,
    badge: "UPCOMING",
    video: null,
    poster: null,

    title: "AI-Logistic-Orchestrator",

    description:
      "Autonomous AI Dispatch Console: building a ReAct (Reason and Act) agent using frameworks like LangGraph that integrates spatial SQL telemetry and live weather data to actively resolve logistics and supply-chain risks. Currently in early development.",

    tech: ["Python", "LangGraph", "ReAct Agents", "SQL", "Weather API"],

    demo: null,

    github: "https://github.com/vishwaswarup/AI-Logistics-Orchestrator",
  },
];

function Projects() {

  const cardsRef = useRef([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  return (

    <section
      id="projects"
      className="projects"
    >

      <div className="projects-heading">

        <p className="section-tag">

          PROJECTS

        </p>

        <h2>

          Featured Projects

        </h2>

        <p className="projects-subtitle">

          A collection of AI, machine learning and
          full-stack projects focused on practical,
          intelligent software.

        </p>

      </div>

      <div className="projects-grid">

        {projects.map((project, index) => (

          <div

            key={project.id}

            ref={(el) => (cardsRef.current[index] = el)}

            className="project-card"

          >

            <div className="project-image">

              <span className="project-badge">

                {project.badge}

              </span>

              {project.youtube && (

                <a

                  href={project.youtube}

                  className="project-youtube-btn"

                  target="_blank"

                  rel="noreferrer"

                  aria-label={`Watch ${project.title} demo on YouTube`}

                >

                  <FaYoutube />

                  View on YouTube

                </a>

              )}

              {project.video ? (

                <video

                  ref={(el) => (videoRefs.current[index] = el)}

                  className="project-video"

                  src={project.video}

                  poster={project.poster}

                  width="960"

                  height="528"

                  muted

                  loop

                  playsInline

                  preload="none"

                  aria-label={`${project.title} demo video`}

                />

              ) : project.image ? (

                <img

                  className="project-video"

                  src={project.image}

                  alt={`${project.title} screenshot`}

                  width="960"

                  height="528"

                  loading="lazy"

                />

              ) : (

                <div className="project-placeholder" aria-hidden="true">

                  {project.title.charAt(0)}

                </div>

              )}

            </div>

            <div className="project-content">

              <h3>

                {project.title}

              </h3>

              <p>

                {project.description}

              </p>

              <div className="project-tech">

                {project.tech.map((item) => (

                  <span key={item}>

                    {item}

                  </span>

                ))}

              </div>

              <div className="project-buttons">

                {project.demo && (
                  <a
                    href={project.demo}
                    className="demo-btn"
                    target="_blank"
                    rel="noreferrer"
                  >

                    Live Demo

                  </a>
                )}

                <a
                  href={project.github}
                  className="github-btn"
                  target="_blank"
                  rel="noreferrer"
                >

                  Source Code

                </a>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );
}

export default Projects;