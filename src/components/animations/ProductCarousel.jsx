import { hr } from "framer-motion/client";
import { useEffect, useRef } from "react";

/**
 * @typedef {{ image: string; title: string;}} Product
 * @param {{ products: Product[] }} props
 */
const ProductCarousel = ({ products }) => {
  const containerRef = useRef(null);
  const pauseRef = useRef(false);
  const pauseTimeoutRef = useRef(null);
  const scrollEndTimeoutRef = useRef(null);

  const itemWidth = 366;

  // Recentrar la card más cercana al centro
  const snapToNearest = () => {
    const el = containerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const index = Math.round(scrollLeft / itemWidth);
    const targetScroll = index * itemWidth;

    el.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  // Scroll automático
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollStep = itemWidth;

    const interval = setInterval(() => {
      if (pauseRef.current) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft + scrollStep >= maxScroll - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manejo de scroll manual
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      pauseRef.current = true;

      clearTimeout(pauseTimeoutRef.current);
      clearTimeout(scrollEndTimeoutRef.current);

      // Reanudar autoplay en 5s
      pauseTimeoutRef.current = setTimeout(() => {
        pauseRef.current = false;
      }, 5000);

      // Snap automático si el usuario dejó de hacer scroll por 150ms
      scrollEndTimeoutRef.current = setTimeout(() => {
        snapToNearest();
      }, 150);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(pauseTimeoutRef.current);
      clearTimeout(scrollEndTimeoutRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            className="w-[350px] flex-shrink-0 bg-[#F8F8F8] shadow p-3 h-auto pb-6 scrollSnapAlign overflow-hidden"
            style={{ scrollSnapAlign: "center" }}
          >
            {!product.inStock && (
              <div className="relative  top-0 -left-10 bg-red-600 text-white text-xs px-8 py-1 rotate-[-45deg] shadow-lg w-fit">
                Sin stock
              </div>
            )}
            <img
              draggable={false}
              src={product.image}
              alt={product.title}
              className="w-full h-[260px] object-cover"
            />
            <div className="mb-6 mt-4">
              <h3 className="text-xl font-semibold text-[#262626]">
                {product.title}
              </h3>
              <hr className="my-2 mx-4 border-[#262626]/20" />
              <div className="flex flex-col gap-1">
                <small className="text-[#606060] text-sm">{product.material}</small>
                <small className="text-[#606060] text-sm">{product.dimension}</small>
                <small className="text-[#606060] text-sm">{product.profundity}</small>
                <small className="text-[#606060] text-sm">{product.capacity}</small>
                <small className="text-[#606060] text-sm">{product.accessories}</small>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <a
              href={`https://wa.me/595984955125?text=Hola!%20me%20interesaria%20cotizar%20el%20${encodeURIComponent(
                product.title
              )}`}
              target="_blank"
              className="text-white bg-[#25D366] shadow-xl shadow-[#262626]/20 p-2 px-4 rounded-xl hover:brightness-75 transition w-fit flex gap-2"
            >
              <iconify-icon
                icon="ic:round-whatsapp"
                class="text-xl"
              ></iconify-icon>
              <span>Cotizar</span>
            </a>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
