import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

import { SiLeetcode } from "react-icons/si";

// Reads from environment variables so real keys never sit in source
// control. Set these in a local .env file (see README for setup).
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error(
        "EmailJS is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to your .env file."
      );
      setStatus("error");
      return;
    }

    // Simple honeypot: bots tend to fill every field, humans never see this one.
    if (formRef.current.honeypot.value) return;

    setStatus("sending");

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });
      setStatus("success");
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setStatus("error");
    }
  };

  return (

    <section
      id="contact"
      className="contact"
    >

      <div className="contact-container">

        {/* LEFT SIDE */}

        <div className="contact-left">

          <p className="section-tag">
            CONTACT
          </p>

          <h2 className="contact-title">
            Let's Build Something
            <span> Amazing Together.</span>
          </h2>

          <p className="contact-description">
            I'm always open to discussing new projects,
            freelance opportunities or creative ideas.
            If you have something in mind,
            feel free to reach out.
          </p>

          {/* INFO CARDS */}

          <div className="contact-info">

            <div className="contact-card">

              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>
                <h4>Email</h4>

                <p>
                  vishwaswarup.756@gmail.com
                </p>

              </div>

            </div>

            <div className="contact-card">

              <div className="contact-icon">
                <FaPhoneAlt />
              </div>

              <div>

                <h4>Phone</h4>

                <p>
                  +91 9650135762
                </p>

              </div>

            </div>

          </div>

          {/* SOCIAL LINKS */}

          <div className="contact-social">

            <a
              href="https://github.com/vishwaswarup"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/vishwaswarup-rath/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://leetcode.com/u/h2GAJXXhxk/"
              target="_blank"
              rel="noreferrer"
              aria-label="LeetCode"
            >
              <SiLeetcode />
            </a>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="contact-right">

          <form
            className="contact-form"
            ref={formRef}
            onSubmit={handleSubmit}
          >

            {/* Honeypot field - hidden from real visitors and screen readers, catches spam bots */}
            <input
              type="text"
              name="honeypot"
              className="honeypot-field"
              tabIndex="-1"
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="input-group">

              <label htmlFor="contact-name" className="visually-hidden">
                Your Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your Name"
                autoComplete="name"
                required
              />

            </div>

            <div className="input-group">

              <label htmlFor="contact-email" className="visually-hidden">
                Your Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="Your Email"
                autoComplete="email"
                required
              />

            </div>

            <div className="input-group">

              <label htmlFor="contact-subject" className="visually-hidden">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="Subject"
                required
              />

            </div>

            <div className="input-group">

              <label htmlFor="contact-message" className="visually-hidden">
                Your Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="6"
                placeholder="Your Message"
                required
              ></textarea>

            </div>

            <button
              type="submit"
              className="contact-btn"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Send Message →"}
            </button>

            <p className="contact-note">
              I typically reply within 24 hours.
            </p>

            <p className="contact-status" role="status" aria-live="polite">
              {status === "success" &&
                "Thanks! Your message has been sent - I'll get back to you within 24 hours."}
              {status === "error" &&
                "Something went wrong sending your message. Please try again or email me directly."}
            </p>

          </form>

        </div>

      </div>

    </section>

  );

}

export default Contact;
