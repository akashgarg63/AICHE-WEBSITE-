import { useEffect, useRef } from "react";

// Custom hook — watches a DOM element and triggers a callback when it enters the viewport
// Uses IntersectionObserver: a browser API that fires when an element becomes visible
function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // threshold: 0.15 means fire when 15% of the element is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("card-hidden");
          el.classList.add("card-visible");
          observer.unobserve(el); // stop watching once revealed
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export default useScrollReveal;
