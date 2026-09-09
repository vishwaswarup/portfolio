import "../styles/Footer.css";

import { FaArrowUp } from "react-icons/fa";

function Footer() {

  const scrollToTop = () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };

  return (

    <footer className="footer">

      {/* Top Divider */}

      <div className="footer-divider"></div>

      <div className="footer-container">

        {/* Name */}

        <h2 className="footer-title">

          Vishwaswarup Rath

        </h2>

        {/* Role */}

        <p className="footer-role">

          Machine Learning Engineer

        </p>

        {/* Description */}

        <p className="footer-description">

          Building practical, intelligent
          software across AI, machine
          learning and full-stack
          development.

        </p>

        {/* Back To Top */}

        <button

          className="back-top"

          onClick={scrollToTop}

          aria-label="Back to top"

        >

          <FaArrowUp />

        </button>

        {/* Copyright */}

        <p className="footer-copy">

          © 2026 Vishwaswarup Rath. All Rights Reserved.

        </p>

        <p className="footer-credit">

          Designed & Developed by Vishwaswarup Rath

        </p>

      </div>

    </footer>

  );

}

export default Footer;