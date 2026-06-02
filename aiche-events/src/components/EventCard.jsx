import { useEffect, useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

function EventCard({ event, index }) {
  // useScrollReveal returns a ref — attach it to the card div
  // index is used to stagger the animation delay (each card = 100ms later)
  const cardRef = useScrollReveal();
  const innerRef = useRef(null);

  // 3D tilt effect — tracks mouse position relative to the card center
  useEffect(() => {
    const card = innerRef.current;
    if (!card) return;

    function handleMouseMove(e) {
      const rect = card.getBoundingClientRect();
      // Get mouse position relative to card center (values from -1 to 1)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      // Multiply by 12 = max 12deg tilt
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
      card.style.boxShadow = `${-x * 12}px ${y * 12}px 32px rgba(99,102,241,0.15)`;
    }

    function handleMouseLeave() {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
      card.style.boxShadow = "none";
    }

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    // Outer wrapper: handles scroll reveal + stagger delay
    <div
      ref={cardRef}
      className="card-hidden"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Inner card: handles 3D tilt */}
      <div
        ref={innerRef}
        className="tilt-card gradient-top bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden cursor-pointer"
      >
        {/* Image with zoom on hover */}
        <div className="img-zoom-wrap h-44">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          {/* Colored tag badge — color comes from event data */}
          <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full mb-3 ${event.tagColor}`}>
            {event.tag}
          </span>

          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2 leading-snug">
            {event.title}
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
            📅 {event.date}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {event.description}
          </p>

          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all duration-150 hover:scale-105 active:scale-95">
            Learn more →
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
