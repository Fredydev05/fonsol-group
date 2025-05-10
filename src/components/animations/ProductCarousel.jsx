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

  const pauseRef = useRef(false);
  const timeoutRef = useRef(null);
  const trackRef = useRef(null);

  const itemWidth = 300;
  const gap = 16;

  // Autoplay con pausa
  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseRef.current && !isDragging) {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length, isDragging]);

  const pauseAutoplay = () => {
    pauseRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pauseRef.current = false;
    }, 5000);
  };

  // Swipe (mouse y touch)
  const handleStart = (e) => {
    setIsDragging(true);
    setStartX(e.type === "touchstart" ? e.touches[0].clientX : e.clientX);
    pauseAutoplay();
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    setDragDistance(currentX - startX);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    if (dragDistance > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (dragDistance < -50 && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    setIsDragging(false);
    setDragDistance(0);
  };

  useEffect(() => {
    const el = trackRef.current;
    el.addEventListener("pointerdown", handleStart);
    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerup", handleEnd);
    el.addEventListener("pointerleave", handleEnd);
    el.addEventListener("touchstart", handleStart);
    el.addEventListener("touchmove", handleMove);
    el.addEventListener("touchend", handleEnd);
    return () => {
      el.removeEventListener("pointerdown", handleStart);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerup", handleEnd);
      el.removeEventListener("pointerleave", handleEnd);
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [currentIndex, dragDistance, isDragging]);

  const translateX =
    -(itemWidth + gap) * currentIndex + (isDragging ? dragDistance : 0);

  return (
    <div className="relative overflow-hidden w-full max-w-screen-xl mx-auto px-4">
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-4 transition-transform duration-500 ease-in-out select-none"
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
                <small className="text-[#606060] text-sm">Material inoxidable 304</small>
              </div>
              <div className="text-white bg-[#25D366] p-2 px-4 rounded-xl hover:brightness-75 transition w-fit flex items-center gap-2">
                <iconify-icon icon="ic:round-whatsapp" class="text-xl"></iconify-icon>
                <a
                  href={product.link}
                >
                  Cotizar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;
