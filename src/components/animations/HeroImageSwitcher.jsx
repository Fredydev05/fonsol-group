import { useEffect, useState } from "react";

const images = [
  "/img/producto1.png",
  "/img/producto2.png",
  "/img/producto3.png"
];

export default function HeroImageSwitcher() {
  const [index, setIndex] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % images.length);
      }, 150);

      // Fade out suavemente
      setTimeout(() => {
        setFlash(false);
      }, 250); // tiempo del destello
    }, 5000); // Cambia la imagen cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative md:w-1/2 h-full 2xl:w-1/2 mask-b-from-70% mask-b-to-95%">
      <img
        src={images[index]}
        alt="Hero Image"
        className={`w-screen md:w-full md:h-screen object-cover transition-opacity duration-500 ${flash ? "opacity-0" : "opacity-100"}`}
      />
      {flash && (
        <div className="absolute inset-0 bg-black opacity-100 pointer-events-none z-10 transition-opacity duration-500"></div>
      )}
    </div>
  );
}
