import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { useSound } from '@/hooks/useSound';
import { FaDownload } from 'react-icons/fa6';

export const ResumeDownloader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { playType, playEnter } = useSound();

  const handleDownload = () => {
    setIsOpen(true);
    playEnter();
    
    const steps = [
      "Resolving linhongji.com... 127.0.0.1",
      "Connecting to linhongji.com|127.0.0.1|:443... connected.",
      "HTTP request sent, awaiting response... 200 OK",
      "Length: 2048 (2.0K) [application/pdf]",
      "Saving to: 'resume.pdf'"
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLogs(prev => [...prev, steps[stepIndex]]);
        playType();
        stepIndex++;
      } else {
        clearInterval(interval);
        // Start progress bar
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = '林鸿基-后端开发-27届.pdf';
                link.click();
                setTimeout(() => setIsOpen(false), 2000);
              }, 500);
              return 100;
            }
            return prev + 10;
          });
        }, 100);
      }
    }, 600);
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-40 hidden md:block">
        <button
          onClick={handleDownload}
          className="bg-term-green/10 hover:bg-term-green/20 text-term-green border border-term-green px-4 py-2 rounded font-mono text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(39,201,63,0.3)]"
        >
          <FaDownload />
          <span>wget resume.pdf</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <TerminalWindow title="wget resume.pdf" onClose={() => setIsOpen(false)}>
                <div className="font-mono text-sm space-y-2 h-[300px] flex flex-col justify-end">
                  <div className="text-gray-400">
                    <span className="text-term-green">➜</span> <span className="text-term-blue">~</span> $ wget https://linhongji.com/resume.pdf
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className="text-gray-300">{log}</div>
                  ))}
                  {logs.length >= 5 && (
                    <div className="mt-2">
                       <div className="flex justify-between text-xs text-gray-500 mb-1">
                         <span>{progress}%</span>
                         <span>2.0K --.-KB/s</span>
                       </div>
                       <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                         <div 
                           className="h-full bg-term-green transition-all duration-100 ease-linear"
                           style={{ width: `${progress}%` }}
                         />
                       </div>
                    </div>
                  )}
                  {progress === 100 && (
                    <div className="text-term-green font-bold mt-2">
                      2026-01-29 10:00:00 (5.0 MB/s) - 'resume.pdf' saved [2048/2048]
                    </div>
                  )}
                </div>
              </TerminalWindow>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
