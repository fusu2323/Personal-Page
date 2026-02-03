import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LandingOverlayProps {
  onEnter: () => void;
}

export const LandingOverlay = ({ onEnter }: LandingOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLaptopFixed, setShowLaptopFixed] = useState(false);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // Progress indicators
  const stormOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const fallOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
  const discoveryOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  
  const avatarRotate = useTransform(scrollYProgress, [0, 1], [0, 720]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto overflow-x-hidden scroll-smooth"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Global Background - Matrix Rain */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-term-green z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Fixed Avatar that "falls" through the sections */}
      <motion.div
        className="fixed left-1/2 top-[20%] z-20 pointer-events-none"
        style={{ 
          x: '-50%',
          rotate: avatarRotate,
        }}
      >
         <PixelAvatar className="w-16 h-16 text-term-green drop-shadow-[0_0_10px_rgba(0,255,0,0.5)] animate-bounce" />
      </motion.div>


      {/* --- SECTION 1: THE STORM --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center z-10">
        <motion.div style={{ opacity: stormOpacity }} className="text-center space-y-8">
           <h1 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 tracking-tighter glitch-text">
              SYSTEM<br/>FAILURE
           </h1>
           <p className="text-term-green font-mono text-xl tracking-[0.5em] animate-pulse">
              &gt CRITICAL_ERROR: REALITY_NOT_FOUND
           </p>
           <div className="mt-20 animate-bounce text-gray-500 font-mono text-sm">
              SCROLL TO INITIALIZE RECOVERY
              <div className="text-2xl mt-2">↓</div>
           </div>
        </motion.div>
      </section>


      {/* --- SECTION 2: THE FALL (DATA VOID) --- */}
      <section className="relative min-h-[150vh] flex items-center justify-center z-10 overflow-hidden">
         <motion.div style={{ opacity: fallOpacity }} className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-full">
               {/* Parallax Elements floating UP as we scroll down */}
               <ParallaxObject speed={-2} className="top-[20%] left-[10%] text-gray-700 text-9xl font-black opacity-10">01</ParallaxObject>
               <ParallaxObject speed={-1} className="top-[40%] right-[20%] text-term-green text-sm font-mono border border-term-green/30 p-4 rounded bg-black/50 backdrop-blur">
                  panic("KERNEL_PANIC")
               </ParallaxObject>
               <ParallaxObject speed={-3} className="bottom-[30%] left-[30%] text-white text-6xl font-black opacity-5">JAVA</ParallaxObject>
               <ParallaxObject speed={-1.5} className="top-[60%] left-[10%] text-term-blue text-4xl font-bold opacity-20">GO</ParallaxObject>
               <ParallaxObject speed={-2.5} className="bottom-[10%] right-[10%] w-32 h-32 border-4 border-gray-800 rounded-full opacity-20">
                  <div />
               </ParallaxObject>
            </div>
         </motion.div>
         
         <div className="z-20 text-center bg-black/80 p-8 rounded border border-gray-800 backdrop-blur-sm max-w-md mx-4">
            <p className="text-term-green font-mono leading-relaxed">
               &gt ATTEMPTING TO REASSEMBLE DATA FRAGMENTS...<br/>
               &gt FOUND: BACKEND SKILLS<br/>
               &gt FOUND: ARCHITECTURE PATTERNS<br/>
               &gt FOUND: GEEK SPIRIT
            </p>
         </div>
      </section>


      {/* --- SECTION 3: THE DISCOVERY --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center z-10 pb-20">
        <motion.div style={{ opacity: discoveryOpacity }} className="w-full flex flex-col items-center">
           <div className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-white mb-2">ARTIFACT DETECTED</h2>
              <p className="text-gray-500 font-mono text-sm tracking-widest">ESTABLISH CONNECTION TO PROCEED</p>
           </div>
           
           {/* The Laptop Wrapper */}
           <div className="relative w-[600px] h-[400px]">
              {/* If fixed mode is active, the laptop moves to fixed position overlay, 
                  otherwise it sits here in the flow */}
              {!showLaptopFixed && (
                 <Laptop3D 
                   onClick={() => setShowLaptopFixed(true)} 
                   isOpen={false}
                   isZooming={false}
                 />
              )}
           </div>
        </motion.div>
      </section>

      {/* FIXED OVERLAY FOR TRANSITION */}
      {showLaptopFixed && (
         <LaptopTransitionOverlay onEnter={onEnter} />
      )}
      
    </motion.div>
  );
};

// --- SUBCOMPONENTS ---

interface ParallaxObjectProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

const ParallaxObject = ({ children, className, speed = 1 }: ParallaxObjectProps) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 500]);
  
  return (
    <motion.div className={`absolute ${className}`} style={{ y }}>
      {children}
    </motion.div>
  );
};

interface Laptop3DProps {
  onClick: () => void;
  isOpen: boolean;
  isZooming: boolean;
  className?: string;
}

// The actual 3D Laptop Component - extracted for reuse
const Laptop3D = ({ onClick, isOpen, isZooming, className }: Laptop3DProps) => {
   return (
    <motion.div
      className={`relative w-full h-full cursor-pointer perspective-[2000px] group ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover Hint */}
      {!isOpen && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-term-green text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           [ CLICK TO OPEN TERMINAL ]
        </div>
      )}

      <motion.div
         className="w-full h-full"
         style={{ transformStyle: 'preserve-3d' }}
         initial={{ rotateX: 60, rotateZ: 0 }}
         animate={
           isZooming
             ? {
                 scale: 40,
                 rotateX: 0,
                 rotateY: 0,
                 z: 100,
                 y: 300, 
               }
             : {
                 rotateX: isOpen ? 0 : 60, // If open, face front. If closed, angled.
                 rotateY: 0,
                 scale: 1,
                 y: 0,
               }
         }
         transition={{ duration: 1.5, ease: "easeInOut" }}
      >
          {/* Laptop Base */}
          <div
            className="absolute inset-0 bg-[#161b22] rounded-xl shadow-2xl"
            style={{
              transform: 'translateZ(0px)',
              transformStyle: 'preserve-3d',
              boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Keyboard */}
            <div className="absolute inset-4 bg-[#0d1117] rounded-lg opacity-50 flex flex-col gap-1 p-4">
              <div className="flex gap-1 justify-center"><div className="w-full h-4 bg-[#30363d] rounded-sm opacity-20"></div></div>
              <div className="flex gap-1 justify-center"><div className="w-full h-24 bg-[#30363d] rounded-sm opacity-20"></div></div>
              <div className="mt-4 w-1/3 h-16 bg-[#30363d] mx-auto rounded-md opacity-30"></div> 
            </div>
            {/* Sides */}
            <div className="absolute top-full left-0 w-full h-4 bg-[#21262d] rounded-b-xl" style={{ transformOrigin: 'top', transform: 'rotateX(-90deg)' }}></div>
            <div className="absolute top-0 left-full w-4 h-full bg-[#30363d] rounded-r-xl" style={{ transformOrigin: 'left', transform: 'rotateY(90deg)' }}></div>
            <div className="absolute top-0 right-full w-4 h-full bg-[#21262d] rounded-l-xl" style={{ transformOrigin: 'right', transform: 'rotateY(-90deg)' }}></div>
          </div>

          {/* Lid */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'top' }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpen ? (isZooming ? 180 : 140) : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Back */}
            <div className="absolute inset-0 bg-[#21262d] rounded-xl flex items-center justify-center border border-[#30363d]" style={{ transform: 'translateZ(2px)', backfaceVisibility: 'hidden' }}>
               <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center"><div className="w-8 h-8 bg-gray-600 rounded-full"></div></div>
            </div>
            {/* Front (Screen) */}
            <div className="absolute inset-0 bg-[#0d1117] rounded-xl p-3 flex flex-col border-4 border-[#161b22]" style={{ transform: 'rotateX(180deg) translateZ(2px)', backfaceVisibility: 'hidden' }}>
               <div className="flex-1 bg-black rounded overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10"></div>
                  <div className="p-4 font-mono text-xs text-term-green opacity-90 relative z-20">
                     <TypewriterText start={isOpen} />
                  </div>
                  <motion.div className="absolute inset-0 flex items-center justify-center z-30" initial={{ opacity: 0 }} animate={{ opacity: isZooming ? 1 : 0 }}>
                     <div className="text-term-green font-bold text-lg tracking-[0.5em] animate-pulse bg-black/90 px-4 py-2 border border-term-green/50">ACCESS GRANTED</div>
                  </motion.div>
               </div>
            </div>
          </motion.div>
      </motion.div>
    </motion.div>
   );
}

interface LaptopTransitionOverlayProps {
  onEnter: () => void;
}

// Fixed overlay that handles the animation sequence once clicked
const LaptopTransitionOverlay = ({ onEnter }: LaptopTransitionOverlayProps) => {
   const [sequence, setSequence] = useState<'opening' | 'zooming'>('opening');

   useEffect(() => {
      // 1. Start opening immediately
      
      // 2. Start zooming after open + type (approx 3.5s)
      const zoomTimer = setTimeout(() => {
         setSequence('zooming');
      }, 3500);

      // 3. Finish
      const endTimer = setTimeout(() => {
         onEnter();
      }, 5500);

      return () => {
         clearTimeout(zoomTimer);
         clearTimeout(endTimer);
      };
   }, [onEnter]);

   return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm">
         <div className="w-[600px] h-[400px]">
            <Laptop3D 
               onClick={() => {}} 
               isOpen={true} 
               isZooming={sequence === 'zooming'} 
            />
         </div>
      </div>
   );
}

const PixelAvatar = ({ className }: { className?: string }) => (
   <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6 2H18V6H22V12H18V22H6V12H2V6H6V2ZM10 8H14V10H10V8ZM8 14H16V20H8V14Z" fill="currentColor"/>
      <rect x="8" y="8" width="2" height="2" fill="black" fillOpacity="0.5"/>
      <rect x="14" y="8" width="2" height="2" fill="black" fillOpacity="0.5"/>
   </svg>
);

const TypewriterText = ({ start }: { start: boolean }) => {
  const [lines, setLines] = useState<string[]>([]);
  const fullText = [
    "> CONNECTING...",
    "> UPLOAD_SPEED: 10TB/s",
    "> DOWNLOADING_CONSCIOUSNESS...",
    "> INSTALLING_SKILLS...",
    "> [SUCCESS] BACKEND_DEV INSTALLED",
    "> [SUCCESS] ARCHITECT INSTALLED",
    "> WELCOME_HOME, USER."
  ];

  useEffect(() => {
    if (!start) return;
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < fullText.length) {
        setLines(prev => [...prev, fullText[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400); 
    return () => clearInterval(interval);
  }, [start]);

  return (
    <div className="flex flex-col space-y-1">
      {lines.map((line, i) => <span key={i}>{line}</span>)}
      <span className="animate-pulse">_</span>
    </div>
  );
};

const MatrixRain = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columns = Math.floor(canvas.width / 20);
      const drops: number[] = new Array(columns).fill(1);
      const chars = "0101010101JAVA GO SQL DOCKER K8S REACT LINUX";

      const draw = () => {
         ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.fillStyle = '#0F0';
         ctx.font = '15px monospace';

         for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
         }
      };
      const interval = setInterval(draw, 50);
      return () => clearInterval(interval);
   }, []);
   return <canvas ref={canvasRef} className="w-full h-full" />;
};
