import { useEffect, useRef, useState } from "react";

/**
 * @typedef {{ image: string; title: string; link: string }} Product
 * @param {{ products: Product[] }} props
 */
const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const pauseRef = useRef(false);
  const timeoutRef = useRef(null);
  const trackRef = useRef(null);

  const itemWidth = 300;
  const gap = 16;

  // Autoplay con pausa
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current && !isDragging && !isTouching) {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, isDragging, isTouching]);

  const pauseAutoplay = () => {
    pauseRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pauseRef.current = false;
    }, 5000);
  };

  // Swipe unificado para touch y mouse
  const handleStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
    setIsTouching(!!e.touches);
    pauseAutoplay();
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    setDragDistance(currentX - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    if (dragDistance > 50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (dragDistance < -50 && currentIndex < products.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    setIsDragging(false);
    setIsTouching(false);
    setDragDistance(0);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleEnd);
    el.addEventListener("mousedown", handleStart);
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseup", handleEnd);
    el.addEventListener("mouseleave", handleEnd);

    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
      el.removeEventListener("mousedown", handleStart);
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseup", handleEnd);
      el.removeEventListener("mouseleave", handleEnd);
    };
  }, [currentIndex, dragDistance, isDragging]);

  const translateX =
    -(itemWidth + gap) * currentIndex + (isDragging ? dragDistance : 0);

  return (
    <div className="relative overflow-hidden w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className={`flex gap-4 select-none transition-transform ${
            isDragging ? "" : "duration-500 ease-in-out"
          }`}
          style={{
            transform: `translateX(${translateX}px)`,
            touchAction: "pan-y",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          {products.map((product, i) => (
            <div
              key={i}
              className="w-[300px] flex-shrink-0 bg-white rounded-lg shadow p-4 h-auto pb-6"
            >
              <img
                draggable={false}
                src={product.image}
                alt={product.title}
                className="w-full h-[300px] object-contain"
              />
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#262626]">
                  {product.title}
                </h3>
                <small className="text-[#606060] text-sm">
                  Material inoxidable 304
                </small>
              </div>
              <div className="text-white bg-[#25D366] p-2 px-4 rounded-xl hover:brightness-75 transition w-fit flex items-center gap-2">
                <iconify-icon
                  icon="ic:round-whatsapp"
                  class="text-xl"
                ></iconify-icon>
                <a href={product.link}>Cotizar</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
