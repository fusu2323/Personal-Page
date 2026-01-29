import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { FaCheck, FaSpinner, FaClock } from 'react-icons/fa6';

const roadmapItems = [
  { id: 'java', name: 'Java', status: 'completed', year: '2023 Q3' },
  { id: 'frontend', name: 'HTML/CSS/JS', status: 'completed', year: '2023 Q4' },
  { id: 'spring', name: 'Spring Framework', status: 'completed', year: '2024 Q1' },
  { id: 'mysql', name: 'MySQL', status: 'completed', year: '2024 Q1' },
  { id: 'redis', name: 'Redis', status: 'completed', year: '2024 Q2' },
  { id: 'juc', name: 'JUC Concurrency', status: 'completed', year: '2024 Q2' },
  { id: 'mongo', name: 'MongoDB', status: 'completed', year: '2024 Q3' },
  { id: 'kafka', name: 'Kafka', status: 'completed', year: '2024 Q3' },
  { id: 'dubbo', name: 'Dubbo', status: 'completed', year: '2024 Q4' },
  { id: 'springcloud', name: 'Spring Cloud', status: 'completed', year: '2024 Q4' },
  { id: 'golang', name: 'Golang', status: 'completed', year: '2025 Q1' },
  { id: 'gin', name: 'Gin Web', status: 'completed', year: '2025 Q1' },
  { id: 'gorm', name: 'Gorm ORM', status: 'completed', year: '2025 Q1' },
  { id: 'agent', name: 'AI Agent', status: 'completed', year: '2025 Q2' },
  { id: 'eino', name: 'Eino Framework', status: 'completed', year: '2025 Q3' },
  { id: 'langchain', name: 'LangChain', status: 'in-progress', year: '2025 Q4' },
  { id: 'future', name: 'To Be Continued...', status: 'pending', year: '∞' },
];

export const Roadmap: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'pulling' | 'visual'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const { playType, playEnter } = useSound();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-focus logic for "Enter" key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global Enter listener when stage is idle and user has interacted with the section
      if (stage === 'idle' && e.key === 'Enter') {
        // Check if the roadmap section is in view or focused
        const roadmapSection = document.getElementById('roadmap');
        const terminalElement = document.getElementById('roadmap-terminal');
        
        if (roadmapSection) {
            const rect = roadmapSection.getBoundingClientRect();
            const isInView = (rect.top >= 0 && rect.bottom <= window.innerHeight) || (rect.top < window.innerHeight && rect.bottom > 0);
            
            // Allow triggering if terminal is focused OR if section is clearly visible in viewport
            if (document.activeElement === terminalElement || 
               (isInView && document.activeElement?.tagName === 'BODY')) {
                 e.preventDefault(); // Prevent default scrolling
                 startPull();
            }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  const startPull = () => {
    playEnter();
    setStage('pulling');
    
    const logMessages = [
      "remote: Enumerating objects: 128, done.",
      "remote: Counting objects: 100% (128/128), done.",
      "remote: Compressing objects: 100% (86/86), done.",
      "Receiving objects: 100% (128/128), 24.5 KiB | 5.2 MiB/s, done.",
      "Resolving deltas: 100% (42/42), done.",
      "From github.com:linhongji/career-path",
      " * branch            main       -> FETCH_HEAD",
      "   a1b2c3d..e5f6g7h  main       -> origin/main",
      "Updating a1b2c3d..e5f6g7h",
      "Fast-forward",
      " roadmap.json | 148 ++++++++++++++++++++++",
      " 1 file changed, 148 insertions(+)",
      "Generating visualization graph...",
      "Done."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= logMessages.length) {
        clearInterval(interval);
        setTimeout(() => setStage('visual'), 500);
        return;
      }
      setLogs(prev => [...prev, logMessages[i]]);
      playType(); // Reuse typing sound for log output
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
      i++;
    }, 150);
  };

  // Helper to get SVG path for snake layout
  const getPath = () => {
    // This is a simplified logic. In a real responsive scenario, we might need JS to calculate positions.
    // For now, we'll use CSS Flex/Grid for layout and SVG for decorative curves if possible, 
    // or just rely on the "snake" grid layout.
    return ""; 
  };

  return (
    <section className="mb-20" id="roadmap">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/tech_roadmap
      </div>

      <TerminalWindow 
        id="roadmap-terminal"
        title="user@linhongji: ~/roadmap" 
        className={cn(
          "min-h-[500px] transition-all duration-500 flex flex-col",
          stage === 'idle' ? "cursor-text hover:border-term-blue" : ""
        )}
      >
        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm flex-grow flex flex-col" tabIndex={0} style={{ outline: 'none' }}>
          
          {/* Initial Command Prompt */}
          <div className="text-gray-300 mb-2">
            <span className="text-term-green">➜</span> <span className="text-term-blue">~/roadmap</span> <span className="text-gray-500">(main)</span> $ git pull origin career-path
            {stage === 'idle' && (
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2.5 h-5 bg-gray-500 ml-1 align-bottom"
              />
            )}
          </div>

          {/* Prompt for user interaction */}
          {stage === 'idle' && (
             <div className="mt-4 text-gray-500 text-xs">
               [ Press <span className="text-term-blue font-bold">Enter</span> to execute ]
             </div>
          )}

          {/* Git Logs */}
          <div className="space-y-1 text-gray-400">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Visual Roadmap */}
          <AnimatePresence>
            {stage === 'visual' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-8 relative pt-8 border-t border-gray-800"
              >
                <div className="absolute top-0 right-0 text-xs text-gray-600">view: graph_log --graph</div>
                
                {/* Snake Layout Grid */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 p-4">
                   {/* SVG Connecting Lines Layer (Simplified for snake layout) */}
                   <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden lg:block">
                      <path 
                        d="M 150 50 H 850 Q 900 50 900 100 V 150 Q 900 200 850 200 H 150 Q 100 200 100 250 V 300 Q 100 350 150 350 H 850 Q 900 350 900 400 V 450 Q 900 500 850 500 H 150" 
                        fill="none" 
                        stroke="#00ff00" 
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                   </svg>

                   {roadmapItems.map((item, index) => {
                     const isCompleted = item.status === 'completed';
                     const isInProgress = item.status === 'in-progress';
                     
                     return (
                       <motion.div
                         id={`roadmap-${item.id}`}
                         key={item.id}
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ delay: index * 0.1, type: "spring" }}
                         className={cn(
                           "relative p-4 rounded-lg border transition-all duration-300 z-10 group",
                           isCompleted ? "bg-[#0d1117] border-term-green/50 shadow-[0_0_10px_rgba(39,201,63,0.1)]" :
                           isInProgress ? "bg-[#161b22] border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                           "bg-black border-gray-800 opacity-60"
                         )}
                       >
                         {/* Connection Dot */}
                         <div className={cn(
                           "absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full",
                           isCompleted ? "bg-term-green" : "bg-gray-700"
                         )}></div>

                         <div className="flex justify-between items-start mb-2">
                           <span className={cn(
                             "text-xs font-mono px-1.5 py-0.5 rounded",
                             isCompleted ? "bg-term-green/20 text-term-green" :
                             isInProgress ? "bg-yellow-500/20 text-yellow-500" :
                             "bg-gray-800 text-gray-500"
                           )}>
                             {item.year}
                           </span>
                           {isCompleted && <FaCheck className="text-term-green text-xs" />}
                           {isInProgress && <FaSpinner className="text-yellow-500 animate-spin text-xs" />}
                         </div>
                         
                         <h4 className={cn(
                           "font-bold text-sm mb-1",
                           isCompleted ? "text-white" : 
                           isInProgress ? "text-yellow-400" : 
                           "text-gray-500"
                         )}>
                           {item.name}
                         </h4>
                         
                         {/* Hover details */}
                         <div className="text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                           commit: {Math.random().toString(16).slice(2, 9)}
                         </div>
                       </motion.div>
                     );
                   })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TerminalWindow>
    </section>
  );
};
