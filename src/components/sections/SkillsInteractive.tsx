import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

// Helper to categorize skills for the cloud view
const skillCategories = {
  backend: ["Java", "Spring Cloud", "MyBatis-Plus", "Linux"],
  middleware: ["Redis", "Kafka", "MySQL"],
  tools: ["Docker", "Git"]
};

export const SkillsInteractive: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'loading' | 'streaming' | 'cloud'>('idle');
  const [progress, setProgress] = useState(0);
  const [streamedLines, setStreamedLines] = useState<string[]>([]);
  const { playType, playEnter, playExpand, playHover } = useSound();

  // Loading Effect
  useEffect(() => {
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('streaming');
            return 100;
          }
          playType(); // Sound effect
          return prev + 5;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [stage, playType]);

  // Streaming Effect
  useEffect(() => {
    if (stage === 'streaming') {
      const allLines = [
        "> Reading skills.json...",
        "> Parsing backend stack...",
        "> Loading middleware modules...",
        "> Initializing visualization...",
        "Done."
      ];
      
      let lineIndex = 0;
      const interval = setInterval(() => {
        if (lineIndex >= allLines.length) {
          clearInterval(interval);
          setTimeout(() => {
            playExpand();
            setStage('cloud');
          }, 500);
          return;
        }
        setStreamedLines(prev => [...prev, allLines[lineIndex]]);
        playEnter();
        lineIndex++;
      }, 300);
      return () => clearInterval(interval);
    }
  }, [stage, playEnter, playExpand]);

  const handleStart = () => {
    if (stage === 'idle') {
      playEnter();
      setStage('loading');
    }
  };

  return (
    <section className="mb-20">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/skills
      </div>

      <TerminalWindow 
        title="user@linhongji: ~/skills" 
        className={cn(
          "min-h-[300px] transition-all duration-500", 
          stage === 'idle' ? "cursor-pointer hover:border-term-blue" : ""
        )}
      >
        <div onClick={handleStart} className="h-full">
          {/* Idle State */}
          {stage === 'idle' && (
            <div className="h-full flex flex-col justify-center items-center text-gray-500 group">
              <span className="text-term-green text-lg mb-2 group-hover:animate-pulse">$ cat skills.json</span>
              <span className="text-xs">[ Click to Execute ]</span>
            </div>
          )}

          {/* Loading State */}
          {stage === 'loading' && (
            <div className="font-mono text-sm">
              <div className="mb-2 text-term-blue">Loading skill profile...</div>
              <div className="text-term-green">
                [{Array(Math.floor(progress / 5)).fill('=').join('')}{Array(20 - Math.floor(progress / 5)).fill(' ').join('')}] {progress}%
              </div>
            </div>
          )}

          {/* Streaming State */}
          {stage === 'streaming' && (
            <div className="font-mono text-sm space-y-1">
              {streamedLines.map((line, i) => (
                <div key={i} className="text-gray-300">{line}</div>
              ))}
              <motion.div 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-4 bg-term-green inline-block align-middle"
              />
            </div>
          )}

          {/* Cloud State */}
          {stage === 'cloud' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute top-0 right-0 text-xs text-gray-600 font-mono">mode: visual_cloud</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                {Object.entries(skillCategories).map(([category, items], idx) => (
                  <div key={category} className="space-y-4">
                    <h3 className="text-term-blue font-bold uppercase tracking-wider text-xs border-b border-term-gray pb-2">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, i) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 + i * 0.05 }}
                          whileHover={{ scale: 1.1, textShadow: "0 0 8px rgb(56, 189, 248)" }}
                          onHoverStart={playHover}
                          className="px-3 py-1 bg-term-gray/50 rounded text-sm text-gray-300 hover:text-white hover:bg-term-blue/20 cursor-default border border-transparent hover:border-term-blue/50 transition-all relative group"
                        >
                          {skill}
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-black border border-term-gray p-2 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                            Proficiency: High
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
};
