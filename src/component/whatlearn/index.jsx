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
  const cardRefs = useRef([]);
  const cardsContainerRef = useRef(null);
  const cardScrollEnabled = useRef(false);
  const activeTouchCardRef = useRef(null);
  const lastTouchY = useRef(0);
  const releasedToPageRef = useRef(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const getMaxScrollTop = (el) => Math.max(0, el.scrollHeight - el.clientHeight);
  const isAtTop = (el) => el.scrollTop <= 0;
  const isAtBottom = (el) => el.scrollTop >= getMaxScrollTop(el) - 1;
  const canScrollCard = (el, deltaY) => {
    if (!el || getMaxScrollTop(el) <= 0) return false;
    if (deltaY < 0) return !isAtTop(el);
    if (deltaY > 0) return !isAtBottom(el);
    return false;
  };

  // Navigate to specific card
  const goToCard = (index) => {
    if (index >= 0 && index < days.length && !isLocked) {
      setCurrentCard(index);
      requestAnimationFrame(() => {
        if (cardRefs.current[index]) cardRefs.current[index].scrollTop = 0;
      });
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 600);
    }
  };

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (!sectionRef.current) return;

      // Card scroll only active when IntersectionObserver confirms container is fully visible
      if (!cardScrollEnabled.current) return;

      const activeCard = cardRefs.current[currentCard];
      const wheelStartedInCard = activeCard?.contains(e.target);

      if (wheelStartedInCard && activeCard) {
        if (canScrollCard(activeCard, e.deltaY)) {
          e.preventDefault();
          e.stopPropagation();
          activeCard.scrollTop += e.deltaY;
          return;
        }

        const cardBoundaryUp = isAtTop(activeCard) && e.deltaY < 0;
        const cardBoundaryDown = isAtBottom(activeCard) && e.deltaY > 0;
        const canPageUp = cardBoundaryUp && currentCard > 0;
        const canPageDown = cardBoundaryDown && currentCard < days.length - 1;

        if (canPageUp || canPageDown) {
          e.preventDefault();
          e.stopPropagation();

          if (isLocked) return;
          goToCard(canPageDown ? currentCard + 1 : currentCard - 1);
          return;
        }
      }

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
      const activeCard = cardRefs.current[currentCard];
      if (!activeCard || !activeCard.contains(e.target)) return;

      e.stopPropagation();
      activeTouchCardRef.current = activeCard;
      lastTouchY.current = e.touches[0].clientY;
      releasedToPageRef.current = false;
    };

    const handleTouchMove = (e) => {
      const activeCard = activeTouchCardRef.current;
      if (!activeCard || releasedToPageRef.current) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY; // positive = swipe up / scroll down

      if (Math.abs(deltaY) < 1) return;

      const atTopBoundary = isAtTop(activeCard) && deltaY < 0;
      const atBottomBoundary = isAtBottom(activeCard) && deltaY > 0;

      if (atTopBoundary || atBottomBoundary) {
        const canPageUp = atTopBoundary && currentCard > 0;
        const canPageDown = atBottomBoundary && currentCard < days.length - 1;

        if (canPageUp || canPageDown) {
          e.preventDefault();
          e.stopPropagation();
          releasedToPageRef.current = true;
          activeTouchCardRef.current = null;

          if (!isLocked) {
            goToCard(canPageDown ? currentCard + 1 : currentCard - 1);
          }
          return;
        }

        releasedToPageRef.current = true;
        activeTouchCardRef.current = null;
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      activeCard.scrollTop += deltaY;
      lastTouchY.current = currentY;
    };

    const resetTouchLock = () => {
      activeTouchCardRef.current = null;
      releasedToPageRef.current = false;
    };

    const container = cardsContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true });
      container.addEventListener("touchmove", handleTouchMove, { passive: false });
      container.addEventListener("touchend", resetTouchLock, { passive: true });
      container.addEventListener("touchcancel", resetTouchLock, { passive: true });
      container.addEventListener("pointerup", resetTouchLock);
      container.addEventListener("pointercancel", resetTouchLock);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", resetTouchLock);
        container.removeEventListener("touchcancel", resetTouchLock);
        container.removeEventListener("pointerup", resetTouchLock);
        container.removeEventListener("pointercancel", resetTouchLock);
      }
    };
  }, [currentCard, days.length, isLocked]);

  // Enable card scroll only when the container is 100% visible in the viewport
  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        cardScrollEnabled.current = entry.isIntersecting;
      },
      { threshold: 1.0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Measure tallest card and sync container height so no card clips
  useEffect(() => {
    const updateHeight = () => {
      const heights = cardRefs.current
        .filter(Boolean)
        .map((el) => el.scrollHeight);
      const maxContentHeight = Math.max(...heights);
      const maxViewportHeight = window.matchMedia("(max-width: 576px)").matches
        ? window.innerHeight * 0.8
        : window.matchMedia("(max-width: 991px)").matches
          ? window.innerHeight * 0.7
          : window.innerHeight * 0.72;
      const nextHeight = Math.min(maxContentHeight, maxViewportHeight);

      if (nextHeight > 0) setContainerHeight(nextHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    cardRefs.current.filter(Boolean).forEach((el) => observer.observe(el));
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [days.length]);

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
          <div
            className={styles.cardsContainer}
            ref={cardsContainerRef}
            style={containerHeight ? { height: containerHeight } : undefined}
          >
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
                  <div
                    className={styles.card}
                    ref={(el) => { cardRefs.current[i] = el; }}
                  >
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
