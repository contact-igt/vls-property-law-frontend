# Scroll-Hijack Fix Implementation Plan

## Problem Statement

**Current Issue:**
- When scrolling continuously from top to bottom (or bottom to top), the scroll-hijacking in the "What You'll Learn" section doesn't activate automatically
- User must stop scrolling, then scroll again within the section for cards to change
- This creates a poor user experience where the scroll-hijack feels "broken"

**Root Cause:**
1. The `wheel` event listener is attached to the **section element** instead of the **window/document**
2. The section detection logic (`isInSection`) only checks boundaries but doesn't account for continuous scroll momentum
3. No mechanism to detect when user **enters** the section while scrolling

---

## Solution Overview

### Strategy
Attach the wheel event listener to the **window** instead of the section, and implement:
1. **Continuous section detection** - Monitor when user scrolls into/within the section
2. **Auto-snap on entry** - Automatically start card transitions when section comes into viewport during scroll
3. **Scroll lock during transitions** - Prevent page scroll while cards are changing
4. **Smooth exit** - Allow normal scrolling to resume after last/first card

---

## Implementation Details

### Phase 1: Window-Level Event Listener
**Change:** Move wheel event from section to window

```jsx
// ❌ CURRENT (Wrong)
section.addEventListener("wheel", handleWheel, { passive: false });

// ✅ NEW (Correct)
window.addEventListener("wheel", handleWheel, { passive: false });
```

**Benefits:**
- Captures scroll events from anywhere on the page
- Detects when user scrolls into section
- No need to be "inside" section for detection

---

### Phase 2: Enhanced Section Detection

**Current Detection:**
```jsx
const isInSection = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
```

**Problem:** Too strict - only triggers when section fully occupies viewport

**New Detection Logic:**
```jsx
const isInSection = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
```

**Explanation:**
- Triggers when section crosses the 50% viewport mark
- More forgiving - activates as soon as section becomes "prominent"
- Works during continuous scroll

---

### Phase 3: Entry Detection & Auto-Navigation

**New State:** Track if user has entered the section
```jsx
const [hasEnteredSection, setHasEnteredSection] = useState(false);
```

**Entry Logic:**
```jsx
// Detect first entry
if (isInSection && !hasEnteredSection) {
  setHasEnteredSection(true);
  // Auto-navigate to first card if scrolling down
  if (e.deltaY > 0 && currentCard === 0) {
    e.preventDefault();
    // User is already on card 0, lock scroll
  }
}
```

---

### Phase 4: Scroll Lock During Card Transitions

**Current Issue:** Page can still scroll while cards are changing

**Solution:** Always prevent default when in section bounds

```jsx
if (isInSection) {
  e.preventDefault(); // Lock page scroll
  
  // Then handle card navigation
  if (e.deltaY > 0 && currentCard < days.length - 1) {
    goToCard(currentCard + 1);
  } else if (e.deltaY < 0 && currentCard > 0) {
    goToCard(currentCard - 1);
  }
  // If at first/last card, still lock scroll briefly to prevent jumpy behavior
}
```

---

### Phase 5: Exit Boundaries

**Allow Exit When:**
- Scrolling up from first card (card 0)
- Scrolling down from last card (card 2)

```jsx
// Allow exit upwards from first card
const canExitUp = currentCard === 0 && e.deltaY < 0 && rect.top >= 0;

// Allow exit downwards from last card  
const canExitDown = currentCard === days.length - 1 && e.deltaY > 0 && rect.bottom <= window.innerHeight;

if (canExitUp || canExitDown) {
  // Don't preventDefault - allow normal page scroll
  setHasEnteredSection(false); // Reset for next entry
  return;
}
```

---

### Phase 6: Intersection Observer (Bonus Enhancement)

**Optional but Recommended:** Use Intersection Observer for cleaner entry/exit detection

```jsx
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setHasEnteredSection(true);
      } else {
        setHasEnteredSection(false);
      }
    },
    {
      threshold: 0.5, // Trigger when 50% visible
      rootMargin: '-10% 0px -10% 0px' // Account for sticky header/footer
    }
  );

  if (sectionRef.current) {
    observer.observe(sectionRef.current);
  }

  return () => observer.disconnect();
}, []);
```

---

## Complete Updated Code

### Updated `handleWheel` Function

```jsx
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
```

---

## Testing Checklist

### Desktop Testing
- [ ] Scroll from banner → cards section (should auto-lock and show card 1)
- [ ] Continue scrolling down (should progress through cards 1→2→3)
- [ ] Scroll down from card 3 (should exit to next section)
- [ ] Scroll up from next section → back to cards (should lock and show card 3)
- [ ] Scroll up through cards (should progress 3→2→1)
- [ ] Scroll up from card 1 (should exit to previous section)
- [ ] Fast scroll through entire page (should catch the section properly)
- [ ] Slow scroll through section (should feel smooth)

### Edge Cases
- [ ] Scroll momentum - section should still catch even with fast trackpad scrolling
- [ ] Browser zoom levels (80%, 100%, 125%, 150%)
- [ ] Different screen heights (1080p, 1440p, 4K)
- [ ] Rapid scroll direction changes
- [ ] Click on navigation dots while scrolling

### Mobile Testing (Already Working)
- [ ] Swipe gestures work correctly
- [ ] No scroll-hijacking on mobile (normal scroll mode)

---

## Performance Considerations

### Current Performance Impact
- ✅ Minimal - wheel events are throttled by browser
- ✅ No layout thrashing - only reads `getBoundingClientRect` once per event
- ✅ Debounced card changes (600ms lock)

### Optimization Tips
1. **Throttle wheel events** if performance issues arise:
```jsx
let lastWheelTime = 0;
const THROTTLE_MS = 16; // ~60fps

if (Date.now() - lastWheelTime < THROTTLE_MS) return;
lastWheelTime = Date.now();
```

2. **RequestAnimationFrame** for smoother updates:
```jsx
requestAnimationFrame(() => {
  goToCard(nextCard);
});
```

---

## Rollback Plan

If issues occur:
1. Keep window-level listener but revert to old detection logic
2. Add console logs to debug section boundaries
3. Increase threshold from 0.5 to 0.3 for earlier detection
4. Add visual debug overlay showing section bounds

---

## Success Metrics

**After Fix:**
- ✅ Zero-friction entry - cards respond immediately when section enters viewport
- ✅ Smooth continuous scroll experience
- ✅ No "dead zones" where scroll doesn't work
- ✅ Natural exit from first/last cards
- ✅ Works with trackpad momentum scrolling

---

## Timeline

- **Phase 1-3:** Core fix - 30 minutes
- **Phase 4-5:** Exit logic - 20 minutes  
- **Testing:** 30 minutes
- **Phase 6 (Optional):** Intersection Observer - 20 minutes

**Total:** ~1-2 hours for complete implementation and testing

---

## Notes

- This pattern is similar to fullPage.js and other scroll-hijacking libraries
- The key insight: **Listen globally, detect locally**
- Mobile users get normal scroll (no hijacking) as designed
- Desktop gets smooth card-based navigation

---

## Alternative Approach (If Above Fails)

Use **scroll-snap** CSS instead of JavaScript hijacking:

```css
.whatlearnsec {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

.card {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

**Pros:** Native browser behavior, zero JS  
**Cons:** Less control over animations and transitions
