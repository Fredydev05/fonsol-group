const LightweightBackground = () => {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden -z-10">
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {[...Array(20)].map((_, i) => (
          <path
            key={i}
            d={`
              M0,${30 * i}
              Q400,${30 * i + 20 * Math.sin(i)},800,${30 * i}
            `}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1"
            className="animate-thread"
          />
        ))}
      </svg>
      <style>{`
        @keyframes threadAnim {
          0% { transform: translateY(0); }
          100% { transform: translateY(-30px); }
        }

        .animate-thread {
          animation: threadAnim 6s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default LightweightBackground;
