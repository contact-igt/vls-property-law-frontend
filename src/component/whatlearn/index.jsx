import { DynamicIcon } from "lucide-react/dynamic";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import Title from "@/common/Title";
import Image from "next/image";

const WhatLearn = ({ learndata }) => {
  const hasDaysFormat =
    Array.isArray(learndata) && learndata.length && typeof learndata[0] === "object" && "day" in learndata[0];

  const days = hasDaysFormat
    ? learndata
    : [
        {
          day: "Part 1",
          title: "Understanding Property Practice",
          desc: "Get clarity on what property lawyers actually do and why this field is growing rapidly in Tamil Nadu.",
          highlights: [
            {
              title: "What property lawyers actually do",
              desc: "Real-world work scenarios and different types of property-related matters.",
            },
            {
              title: "Civil disputes vs RERA vs revenue proceedings",
              desc: "Understanding the different areas of property law practice.",
            },
            {
              title: "Why property law is growing rapidly in Tamil Nadu",
              desc: "Market trends, opportunities, and demand for property legal services.",
            },
          ],
        },
        {
          day: "Part 2",
          title: "Understanding Property Documents",
          desc: "Learn the fundamentals of property documentation, verification, and common mistakes to avoid.",
          highlights: [
            {
              title: "Basic introduction to sale deeds & EC",
              desc: "What advocates check before advising clients on property transactions.",
            },
            {
              title: "Common property mistakes people make",
              desc: "Critical errors that lead to disputes and how to prevent them.",
            },
            {
              title: "Understanding title verification basics",
              desc: "The foundation of secure property transactions and client protection.",
            },
          ],
        },
        {
          day: "Part 3",
          title: "Building a Career in Property Law",
          desc: "Practical roadmap from general advocate to property-focused practice with real opportunities.",
          highlights: [
            {
              title: "How property advocates start in this field",
              desc: "Entry paths and initial steps for building property law expertise.",
            },
            {
              title: "How lawyers get property clients",
              desc: "Builder, bank & referral opportunities that generate consistent work.",
            },
            {
              title: "Roadmap from general advocate → property-focused practice",
              desc: "Step-by-step guidance on transitioning and specializing in property law.",
            },
          ],
        },
      ];

  const sectionRef = useRef(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Navigate to specific card
  const goToCard = (index) => {
    if (index >= 0 && index < days.length && !isLocked) {
      setCurrentCard(index);
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 600);
    }
  };

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      
      // More sensitive detection - triggers when section crosses viewport center
      const isInSection = 
        rect.top < window.innerHeight * 0.5 && 
        rect.bottom > window.innerHeight * 0.5;

      if (!isInSection) return;

      // Check if we can exit the section
      const canExitUp = currentCard === 0 && e.deltaY < 0;
      const canExitDown = currentCard === days.length - 1 && e.deltaY > 0;

      if (canExitUp || canExitDown) {
        // Allow normal scroll to exit
        return;
      }

      // Lock scroll while in section
      e.preventDefault();

      if (isLocked) return;

      if (e.deltaY > 0 && currentCard < days.length - 1) {
        // Scroll down
        goToCard(currentCard + 1);
      } else if (e.deltaY < 0 && currentCard > 0) {
        // Scroll up
        goToCard(currentCard - 1);
      }
    };

    // Attach to window instead of section
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentCard, isLocked, days.length]);

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      setIsDragging(false);
    };

    const handleTouchMove = (e) => {
      if (!sectionRef.current || isLocked) return;

      const touchCurrentY = e.touches[0].clientY;
      const touchCurrentX = e.touches[0].clientX;
      
      const diffY = Math.abs(touchStartY.current - touchCurrentY);
      const diffX = Math.abs(touchStartX.current - touchCurrentX);

      // Determine if this is a vertical swipe (not horizontal)
      if (diffY > diffX && diffY > 10) {
        setIsDragging(true);
      }
    };

    const handleTouchEnd = (e) => {
      if (!sectionRef.current || isLocked) {
        setIsDragging(false);
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      const rect = sectionRef.current.getBoundingClientRect();
      // Updated detection - same as wheel event
      const isInSection = 
        rect.top < window.innerHeight * 0.5 && 
        rect.bottom > window.innerHeight * 0.5;

      if (!isInSection) {
        setIsDragging(false);
        return;
      }

      // Check exit conditions
      const canExitUp = currentCard === 0 && diff < 0;
      const canExitDown = currentCard === days.length - 1 && diff > 0;

      if (canExitUp || canExitDown) {
        // Allow page scroll, don't interfere
        setIsDragging(false);
        return;
      }

      // Dynamic threshold based on screen size (10% of screen height)
      const swipeThreshold = window.innerHeight * 0.1;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && currentCard < days.length - 1) {
          // Swipe up (next card)
          goToCard(currentCard + 1);
        } else if (diff < 0 && currentCard > 0) {
          // Swipe down (previous card)
          goToCard(currentCard - 1);
        }
      }

      setIsDragging(false);
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("touchstart", handleTouchStart, { passive: true });
      section.addEventListener("touchmove", handleTouchMove, { passive: true });
      section.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (section) {
        section.removeEventListener("touchstart", handleTouchStart);
        section.removeEventListener("touchmove", handleTouchMove);
        section.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [currentCard, isLocked, days.length, isDragging]);

  return (
    <section className={styles.learnsec} ref={sectionRef}>
      <div className="container">
        <div className={styles.titleWrapper}>
          <Title
            title2="You'll Learn ?"
            spantitle="What"
          />
        </div>

        <div className={styles.scrollSection}>
          <div className={styles.leftImage}>
            <Image
              src="/assets/home/whatlearn.jpeg"
              alt="What you will learn"
              width={500}
              height={600}
              className={styles.learnImage}
            />
          </div>

          <div className={styles.rightContent}>
          <div className={styles.cardsContainer}>
            <div 
              className={styles.cardsWrapper}
              style={{
                transform: `translateY(-${currentCard * 100}%)`,
                transition: 'transform 450ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {days.map((d, i) => (
                <div
                  key={i}
                  className={styles.cardSlide}
                >
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.badge}>{d.day}</span>
                      <h3>{d.title}</h3>
                      <p className={styles.cardDesc}>{d.desc}</p>
                    </div>

                    <div className={styles.highlights}>
                      {d.highlights?.map((h, idx) => (
                        <div className={styles.highlight} key={idx}>
                          <div className={styles.iconWrap}>
                            <DynamicIcon name="circle-check" size={20} color="#b20a0a" />
                          </div>
                          <div>
                            <h5 className={styles.hTitle}>{h.title}</h5>
                            <p className={styles.hDesc}>{h.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
{/*                   
                  {i < days.length - 1 && (
                    <div className={styles.scrollHint}>
                      <DynamicIcon name="chevron-down" size={16} color="#b20a0a" />
                      <span>Scroll to continue</span>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navControls}>
            <button
              className={styles.navBtn}
              onClick={() => goToCard(currentCard - 1)}
              disabled={currentCard === 0}
              aria-label="Previous card"
            >
              <DynamicIcon name="chevron-up" size={18} color={currentCard === 0 ? "#ccc" : "#b20a0a"} />
            </button>
            
            <div className={styles.dots}>
              {days.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${currentCard === i ? styles.dotActive : ""}`}
                  onClick={() => goToCard(i)}
                  aria-label={`Go to day ${i + 1}`}
                />
              ))}
            </div>
            
            <button
              className={styles.navBtn}
              onClick={() => goToCard(currentCard + 1)}
              disabled={currentCard === days.length - 1}
              aria-label="Next card"
            >
              <DynamicIcon name="chevron-down" size={18} color={currentCard === days.length - 1 ? "#ccc" : "#b20a0a"} />
            </button>
          </div>
          </div>
        </div>

        <div className={styles.bottomNote}>
          <div className={styles.noteIcon}>
            <DynamicIcon name="lightbulb" size={24} color="#b20a0a" />
          </div>
          <p>
            <strong>Includes:</strong> Practical guidance, roadmap clarity, and live examples
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatLearn;
