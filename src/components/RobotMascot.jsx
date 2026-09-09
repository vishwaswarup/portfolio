import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import "../styles/RobotMascot.css";

// Playful reactions shown in the speech bubble when the robot is poked.
// Rotated randomly (never the same line twice in a row), Talking-Tom style.
const POKE_LINES = [
  "Hey! Don't do that 😅",
  "Ouch, that tickles!",
  "Okay okay, I'll behave 🙈",
  "Beep boop... that hurt my circuits!",
  "Stop poking me, human!",
  "Try scrolling down instead ⬇️",
];

function getRandomLine(excludeIndex) {
  let index = Math.floor(Math.random() * POKE_LINES.length);
  while (POKE_LINES.length > 1 && index === excludeIndex) {
    index = Math.floor(Math.random() * POKE_LINES.length);
  }
  return index;
}

function RobotMascot() {
  const wrapRef = useRef(null);
  const headRef = useRef(null);
  const bodyRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftLidRef = useRef(null);
  const rightLidRef = useRef(null);
  const mouthNeutralRef = useRef(null);
  const mouthConfusedRef = useRef(null);
  const mouthSmileRef = useRef(null);
  const mouthOhRef = useRef(null);
  const questionRef = useRef(null);
  const bulbRef = useRef(null);
  const bulbGlowRef = useRef(null);
  const antennaBallRef = useRef(null);
  const sparkleRefs = useRef([]);

  const storyTlRef = useRef(null);
  const shakeTlRef = useRef(null);
  const lastLineRef = useRef(-1);
  const hideBubbleTimeout = useRef(null);

  const [speech, setSpeech] = useState("");
  const [bubbleVisible, setBubbleVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Set all "expression" layers to a known start state.
    gsap.set(
      [
        mouthConfusedRef.current,
        mouthSmileRef.current,
        mouthOhRef.current,
        questionRef.current,
        bulbRef.current,
        bulbGlowRef.current,
        ...sparkleRefs.current,
      ],
      { opacity: 0 }
    );
    gsap.set(mouthNeutralRef.current, { opacity: 1 });

    if (prefersReducedMotion) {
      // Respect reduced-motion: show a single friendly static pose.
      gsap.set(mouthSmileRef.current, { opacity: 1 });
      gsap.set(mouthNeutralRef.current, { opacity: 0 });
      return;
    }

    // ---- Gentle continuous idle float (independent of the story loop) ----
    const floatTween = gsap.to(wrapRef.current, {
      y: -8,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // ---- Occasional blink, independent loop ----
    const blinkTween = gsap.to([leftLidRef.current, rightLidRef.current], {
      scaleY: 1,
      duration: 0.09,
      repeat: -1,
      repeatDelay: 2.6,
      yoyo: true,
      ease: "power1.inOut",
    });

    // ---- Main narrative loop: idle -> confused -> idea -> laugh -> idle ----
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.inOut" } });
    storyTlRef.current = tl;

    // Idle hold
    tl.to({}, { duration: 1.4 });

    // Confused: head tilts, eyes glance sideways, a "?" pops up, mouth goes wavy
    tl.to(headRef.current, { rotation: -10, duration: 0.5 }, "confused")
      .to([leftPupilRef.current, rightPupilRef.current], { x: 2, y: -1, duration: 0.5 }, "confused")
      .to(mouthNeutralRef.current, { opacity: 0, duration: 0.3 }, "confused")
      .to(mouthConfusedRef.current, { opacity: 1, duration: 0.3 }, "confused+=0.1")
      .to(
        questionRef.current,
        { opacity: 1, y: -6, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "confused+=0.15"
      )
      .to({}, { duration: 1.1 });

    // Idea: head straightens, bulb pops above, eyes brighten, mouth opens in "oh!"
    tl.to(headRef.current, { rotation: 0, duration: 0.4 }, "idea")
      .to([leftPupilRef.current, rightPupilRef.current], { x: 0, y: 0, duration: 0.4 }, "idea")
      .to(questionRef.current, { opacity: 0, y: -14, duration: 0.3 }, "idea")
      .to(mouthConfusedRef.current, { opacity: 0, duration: 0.25 }, "idea")
      .to(mouthOhRef.current, { opacity: 1, duration: 0.25 }, "idea+=0.05")
      .to(
        bulbRef.current,
        { opacity: 1, y: -6, scale: 1, duration: 0.45, ease: "back.out(2.2)" },
        "idea+=0.1"
      )
      .to(bulbGlowRef.current, { opacity: 0.9, duration: 0.4 }, "idea+=0.15")
      .to(antennaBallRef.current, { scale: 1.4, duration: 0.4 }, "idea+=0.15")
      .to({}, { duration: 1 });

    // Laugh: big happy bounce, eyes squint into curves, sparkles pop, smile
    tl.to(bulbRef.current, { opacity: 0, y: -10, duration: 0.3 }, "laugh")
      .to(bulbGlowRef.current, { opacity: 0, duration: 0.3 }, "laugh")
      .to(antennaBallRef.current, { scale: 1, duration: 0.3 }, "laugh")
      .to(mouthOhRef.current, { opacity: 0, duration: 0.2 }, "laugh")
      .to(mouthSmileRef.current, { opacity: 1, duration: 0.2 }, "laugh+=0.05")
      .to([leftLidRef.current, rightLidRef.current], { scaleY: 0.35, duration: 0.25 }, "laugh")
      .to(
        bodyRef.current,
        { y: -10, duration: 0.22, repeat: 3, yoyo: true, ease: "power1.out" },
        "laugh"
      )
      .to(
        sparkleRefs.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "back.out(3)",
        },
        "laugh+=0.05"
      )
      .to(sparkleRefs.current, { opacity: 0, duration: 0.4 }, "laugh+=0.9")
      .to([leftLidRef.current, rightLidRef.current], { scaleY: 0, duration: 0.25 }, "laugh+=1")
      .to(mouthSmileRef.current, { opacity: 0, duration: 0.3 }, "laugh+=1.3")
      .to(mouthNeutralRef.current, { opacity: 1, duration: 0.3 }, "laugh+=1.3")
      .to({}, { duration: 0.8 });

    return () => {
      tl.kill();
      floatTween.kill();
      blinkTween.kill();
      if (shakeTlRef.current) shakeTlRef.current.kill();
      if (hideBubbleTimeout.current) clearTimeout(hideBubbleTimeout.current);
    };
  }, []);

  const handlePoke = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pick a fresh line and show the speech bubble.
    const nextIndex = getRandomLine(lastLineRef.current);
    lastLineRef.current = nextIndex;
    setSpeech(POKE_LINES[nextIndex]);
    setBubbleVisible(true);

    if (hideBubbleTimeout.current) clearTimeout(hideBubbleTimeout.current);
    hideBubbleTimeout.current = setTimeout(() => setBubbleVisible(false), 2200);

    if (prefersReducedMotion) return;

    // Pause the story loop so the reaction reads clearly, then resume it.
    storyTlRef.current?.pause();

    if (shakeTlRef.current) shakeTlRef.current.kill();
    const shakeTl = gsap.timeline({
      onComplete: () => storyTlRef.current?.resume(),
    });
    shakeTlRef.current = shakeTl;

    shakeTl
      .to(headRef.current, { rotation: -6, duration: 0.08 })
      .to(headRef.current, { rotation: 6, duration: 0.09 })
      .to(headRef.current, { rotation: -4, duration: 0.09 })
      .to(headRef.current, { rotation: 0, duration: 0.12 })
      .to(
        [leftLidRef.current, rightLidRef.current],
        { scaleY: 1, duration: 0.06 },
        0
      )
      .to(
        [leftLidRef.current, rightLidRef.current],
        { scaleY: 0, duration: 0.15 },
        0.25
      );
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePoke();
    }
  };

  return (
    <div className="robot-mascot-wrap" ref={wrapRef}>
      {/* Kept for screen readers & SEO context, visually hidden */}
      <span className="visually-hidden">Machine Learning Engineer</span>

      <button
        type="button"
        className="robot-mascot"
        onClick={handlePoke}
        onKeyDown={handleKeyDown}
        aria-label="Say hi to the little robot"
      >
        <div
          className={`robot-speech ${bubbleVisible ? "is-visible" : ""}`}
          role="status"
          aria-live="polite"
        >
          {speech}
        </div>

        <svg viewBox="0 0 120 120" className="robot-svg" aria-hidden="true">
          {/* Antenna */}
          <line x1="60" y1="14" x2="60" y2="26" stroke="#8f7cff" strokeWidth="3" strokeLinecap="round" />
          <circle
            ref={antennaBallRef}
            cx="60"
            cy="10"
            r="5"
            fill="#8f7cff"
            style={{ transformOrigin: "60px 10px" }}
          />

          {/* Body */}
          <g ref={bodyRef} style={{ transformOrigin: "60px 100px" }}>
            <rect x="34" y="78" width="52" height="30" rx="14" fill="url(#robotBodyGradient)" />
          </g>

          {/* Head group (tilts) */}
          <g ref={headRef} style={{ transformOrigin: "60px 58px" }}>
            <rect x="24" y="26" width="72" height="62" rx="24" fill="url(#robotHeadGradient)" />

            {/* Eyes */}
            <g style={{ transformOrigin: "45px 56px" }}>
              <circle cx="45" cy="56" r="10" fill="#0d0d16" />
              <circle ref={leftPupilRef} cx="45" cy="56" r="4" fill="#8f7cff" />
              <rect
                ref={leftLidRef}
                x="34"
                y="46"
                width="22"
                height="20"
                rx="10"
                fill="#182033"
                style={{ transformOrigin: "45px 46px", transform: "scaleY(0)" }}
              />
            </g>
            <g style={{ transformOrigin: "75px 56px" }}>
              <circle cx="75" cy="56" r="10" fill="#0d0d16" />
              <circle ref={rightPupilRef} cx="75" cy="56" r="4" fill="#8f7cff" />
              <rect
                ref={rightLidRef}
                x="64"
                y="46"
                width="22"
                height="20"
                rx="10"
                fill="#182033"
                style={{ transformOrigin: "75px 46px", transform: "scaleY(0)" }}
              />
            </g>

            {/* Mouths (crossfaded) */}
            <path
              ref={mouthNeutralRef}
              d="M50 74 Q60 78 70 74"
              stroke="#0d0d16"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              ref={mouthConfusedRef}
              d="M48 75 Q54 71 60 75 Q66 79 72 75"
              stroke="#0d0d16"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{ opacity: 0 }}
            />
            <ellipse
              ref={mouthOhRef}
              cx="60"
              cy="75"
              rx="6"
              ry="7"
              fill="#0d0d16"
              style={{ opacity: 0 }}
            />
            <path
              ref={mouthSmileRef}
              d="M47 72 Q60 88 73 72"
              stroke="#0d0d16"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              style={{ opacity: 0 }}
            />
          </g>

          {/* Question mark (confused state) */}
          <text
            ref={questionRef}
            x="88"
            y="34"
            fontSize="20"
            fontWeight="700"
            fill="#8f7cff"
            style={{ opacity: 0, transformOrigin: "88px 34px", transform: "scale(0.5)" }}
          >
            ?
          </text>

          {/* Light bulb (idea state) */}
          <g ref={bulbRef} style={{ opacity: 0, transformOrigin: "88px 26px", transform: "scale(0.5)" }}>
            <circle
              ref={bulbGlowRef}
              cx="88"
              cy="22"
              r="14"
              fill="#ffd76a"
              style={{ opacity: 0, filter: "blur(6px)" }}
            />
            <circle cx="88" cy="20" r="8" fill="#ffe08a" stroke="#ffb020" strokeWidth="1.5" />
            <rect x="84" y="27" width="8" height="5" rx="1.5" fill="#8a8a92" />
          </g>

          {/* Sparkles (laugh state) */}
          {[
            { x: 22, y: 40 },
            { x: 98, y: 66 },
            { x: 30, y: 84 },
          ].map((pos, i) => (
            <path
              key={i}
              ref={(el) => (sparkleRefs.current[i] = el)}
              d={`M${pos.x} ${pos.y - 6} L${pos.x + 2} ${pos.y - 2} L${pos.x + 6} ${pos.y} L${pos.x + 2} ${pos.y + 2} L${pos.x} ${pos.y + 6} L${pos.x - 2} ${pos.y + 2} L${pos.x - 6} ${pos.y} L${pos.x - 2} ${pos.y - 2} Z`}
              fill="#ffd76a"
              style={{ opacity: 0, transformOrigin: `${pos.x}px ${pos.y}px`, transform: "scale(0.4)" }}
            />
          ))}

          <defs>
            <linearGradient id="robotHeadGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4f2ff" />
              <stop offset="100%" stopColor="#c7c0ff" />
            </linearGradient>
            <linearGradient id="robotBodyGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e4e0ff" />
              <stop offset="100%" stopColor="#a89dff" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}

export default RobotMascot;