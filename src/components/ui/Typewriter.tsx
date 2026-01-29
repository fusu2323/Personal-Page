import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
  pauseBeforeRepeat?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 0, 
  speed = 50,
  className,
  onComplete,
  loop = false,
  pauseBeforeRepeat = 3000
}) => {
  const [display, setDisplay] = useState('');
  // Use a ref to track if it's the first run to respect the initial delay
  const isFirstRun = useRef(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startTyping = () => {
      let i = 0;
      
      const typeNextChar = () => {
        if (i <= text.length) {
          setDisplay(text.substring(0, i));
          i++;
          
          if (i <= text.length) {
            timer = setTimeout(typeNextChar, speed);
          } else {
            // Finished typing
            if (onComplete) onComplete();
            
            if (loop) {
              timer = setTimeout(() => {
                i = 0;
                setDisplay(''); // Clear immediately before starting again
                timer = setTimeout(typeNextChar, 100); // Short pause before typing starts
              }, pauseBeforeRepeat);
            }
          }
        }
      };

      typeNextChar();
    };

    const initialDelay = isFirstRun.current ? delay : 0;
    timer = setTimeout(() => {
      isFirstRun.current = false;
      startTyping();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [text, delay, speed, loop, pauseBeforeRepeat, onComplete]);

  return <span className={className}>{display}</span>;
};
