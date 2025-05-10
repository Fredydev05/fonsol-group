import { useEffect, useRef, useState } from "react";

/**
 * @typedef {{ image: string; title: string; link: string }} Product
 * @param {{ products: Product[] }} props
 */
const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef(null);
  const pauseRef = useRef(false);
  const timeoutRef = useRef(null);

  const itemWidth = 300;
  const gap = 16;

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current && !dragging) {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, dragging]);

  const pauseAutoplay = () => {
    pauseRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pauseRef.current = false;
    }, 5000);
  };

  const handleStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setStartX(x);
    setDragging(true);
    pauseAutoplay();
  };

  const handleMove = (e) => {
    if (!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setOffsetX(x - startX);
  };

  const handleEnd = () => {
    if (!dragging) return;
    const threshold = 50;

    if (offsetX > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (offsetX < -threshold && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    setDragging(false);
    setOffsetX(0);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Mobile
    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: true });
    el.addEventListener("touchend", handleEnd);

    // Mouse
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
  }, [dragging, offsetX, currentIndex]);

  const translateX =
    -(itemWidth + gap) * currentIndex + (dragging ? offsetX : 0);

  return (
    <div className="relative overflow-hidden w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full overflow-hidden">
        <div
          ref={containerRef}
          className={`flex gap-4 select-none transition-transform ${
            dragging ? "" : "duration-500 ease-in-out"
          }`}
          style={{
            transform: `translateX(${translateX}px)`,
            touchAction: "pan-y",
            cursor: dragging ? "grabbing" : "grab",
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
