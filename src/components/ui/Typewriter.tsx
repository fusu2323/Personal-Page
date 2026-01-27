import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 0, 
  speed = 50,
  className,
  onComplete
}) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let i = 0;
    const startDelay = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplay(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
          if (onComplete) onComplete();
        }
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(startDelay);
  }, [text, delay, speed, onComplete]);

  return <span className={className}>{display}</span>;
};
