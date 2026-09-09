import { FaFilePdf, FaDownload } from "react-icons/fa";
import "../styles/Resume.css";

const RESUME_PATH = "/resume/Resume.pdf";
const RESUME_PREVIEW_PATH = `${RESUME_PATH}#toolbar=0&navpanes=0&statusbar=0&view=FitH`;

function Resume() {
  return (
    <section id="resume" className="resume">
      <div className="resume-heading">
        <p className="section-tag">RESUME</p>

        <h2>
          My <span>Resume.</span>
        </h2>

        <p className="resume-subtitle">
          Preview it below, or open the full PDF in a new tab.
        </p>
      </div>

      <div className="resume-preview-wrap">
        <iframe
          src={RESUME_PREVIEW_PATH}
          title="Resume preview"
          className="resume-preview"
        />
      </div>

      <div className="resume-actions">
        <a
          href={RESUME_PATH}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          <FaFilePdf />
          View Full Resume
        </a>

        <a href={RESUME_PATH} download className="btn btn-primary">
          <FaDownload />
          Download Resume
        </a>
      </div>
    </section>
  );
}

export default Resume;
