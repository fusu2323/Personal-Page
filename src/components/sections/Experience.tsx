import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { experiences } from '@/data/resume';
import { FaSearch } from 'react-icons/fa';
import { useSound } from '@/hooks/useSound';
import { FaCircleXmark, FaSpinner, FaDatabase, FaBolt, FaSitemap, FaListCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

// SQL Visualization Components
const SqlVisualizer: React.FC<{ query: string; onComplete: () => void }> = ({ query, onComplete }) => {
  const [step, setStep] = useState<'lexing' | 'ast' | 'executing'>('lexing');
  
  useEffect(() => {
    // Sequence the animations
    const timer1 = setTimeout(() => setStep('ast'), 2000);
    const timer2 = setTimeout(() => setStep('executing'), 4000);
    const timer3 = setTimeout(onComplete, 6500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="mb-8 bg-[#0d1117] border border-dashed border-term-gray rounded p-6 font-mono text-xs overflow-hidden relative min-h-[200px]">
      <div className="absolute top-2 right-2 text-gray-600 text-[10px]">SQL_ENGINE_V1.0</div>
      
      {/* Lexical Analysis Stage */}
      {step === 'lexing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="text-term-blue mb-4 font-bold">&gt; LEXICAL ANALYSIS (TOKENIZATION)</div>
          <div className="flex flex-wrap gap-2">
            {['SELECT', '*', 'FROM', 'experiences', 'WHERE', 'keyword', 'LIKE', `'%${query}%'`].map((token, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 shadow-sm"
              >
                <span className="text-gray-500 text-[8px] block mb-0.5">TOKEN_{i}</span>
                {token}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AST Generation Stage */}
      {step === 'ast' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full pt-4 relative">
           <div className="text-term-blue absolute top-2 left-4 font-bold text-xs">&gt; AST GENERATION</div>
           
           <div className="relative w-full max-w-[400px] h-[160px] mt-4">
              {/* Connection Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                {/* Root to Children */}
                <motion.path d="M 200 30 L 80 80" stroke="#30363d" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
                <motion.path d="M 200 30 L 200 80" stroke="#30363d" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
                <motion.path d="M 200 30 L 320 80" stroke="#30363d" strokeWidth="2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
                
                {/* Child to Leaf (Example) */}
                <motion.path d="M 320 100 L 320 130" stroke="#30363d" strokeWidth="1" fill="none" strokeDasharray="4 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.8 }} />
              </svg>

              {/* Root Node */}
              <motion.div 
                initial={{ scale: 0, y: -20 }} 
                animate={{ scale: 1, y: 0 }} 
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1f2428] text-term-green border border-term-green px-3 py-1.5 rounded-full z-20 shadow-[0_0_15px_rgba(39,201,63,0.3)] font-bold text-[10px]"
              >
                SELECT_STMT
              </motion.div>

              {/* Level 1 Nodes */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.4 }} 
                className="absolute top-[80px] left-[20%] -translate-x-1/2 bg-[#1f2428] text-blue-400 border border-blue-400/50 px-2 py-1 rounded z-10 text-[9px]"
              >
                TARGET_LIST
              </motion.div>

              <motion.div 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.5 }} 
                className="absolute top-[80px] left-[50%] -translate-x-1/2 bg-[#1f2428] text-yellow-400 border border-yellow-400/50 px-2 py-1 rounded z-10 text-[9px]"
              >
                FROM_CLAUSE
              </motion.div>

              <motion.div 
                initial={{ scale: 0, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.6 }} 
                className="absolute top-[80px] left-[80%] -translate-x-1/2 bg-[#1f2428] text-purple-400 border border-purple-400/50 px-2 py-1 rounded z-10 text-[9px]"
              >
                WHERE_CLAUSE
              </motion.div>

              {/* Leaf Nodes (Details) */}
              <motion.div 
                initial={{ y: -10, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.9 }} 
                className="absolute top-[130px] left-[80%] -translate-x-1/2 text-gray-500 text-[8px] bg-black/30 px-1 rounded"
              >
                expr: LIKE '%{query}%'
              </motion.div>
           </div>
        </motion.div>
      )}

      {/* Execution Stage */}
      {step === 'executing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
           <div className="text-term-blue mb-2 font-bold flex justify-between">
             <span>&gt; EXECUTOR (TABLE SCAN)</span>
             <span className="text-gray-500">PTR: 0x8291A</span>
           </div>
           <div className="space-y-1 relative">
             {/* Scanline */}
             <motion.div 
               className="absolute left-0 right-0 h-6 bg-term-green/10 border-y border-term-green/30 z-10 pointer-events-none"
               initial={{ top: 0 }}
               animate={{ top: "100%" }}
               transition={{ duration: 1.5, ease: "linear", repeat: 1 }}
             />
             
             {/* Mock Rows */}
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-4 text-gray-600 border-b border-gray-800/50 pb-1 font-mono text-[10px]">
                 <span className="w-8 text-gray-700">ID_{i}</span>
                 <span className="flex-1">0x{Math.random().toString(16).slice(2, 10).toUpperCase()}...</span>
                 <span className="w-16">InnoDB</span>
               </div>
             ))}
             
             <div className="mt-2 text-term-green animate-pulse">&gt; Found matching records...</div>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export const Experience: React.FC = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Visual input
  const [activeQuery, setActiveQuery] = useState(''); // Actual filter
  const [sqlState, setSqlState] = useState<'idle' | 'running' | 'completed'>('idle');
  
  const [deployingId, setDeployingId] = useState<number | null>(null);
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [pipelineSteps, setPipelineSteps] = useState<string[]>([]);
  const [deployedCache, setDeployedCache] = useState<Set<number>>(new Set());
  
  const { playType, playEnter } = useSound();

  const filteredExperiences = experiences.filter(exp => {
    if (!activeQuery) return true;
    const query = activeQuery.toLowerCase().replace(/['";]/g, ''); 
    return (
      (exp.company || '').toLowerCase().includes(query) ||
      (exp.role || '').toLowerCase().includes(query) ||
      (exp.details || []).some(d => (d || '').toLowerCase().includes(query)) ||
      (exp.desc || '').toLowerCase().includes(query)
    );
  });

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setSqlState('running');
      setActiveQuery(''); // Clear current filter during animation
      playEnter();
    }
  };

  const handleCardClick = (id: number) => {
    if (deployedCache.has(id)) {
      setSelectedId(id);
      return;
    }

    playEnter();
    setDeployingId(id);
    setPipelineState('running');
    setPipelineSteps([]);
    
    const isFailureScenario = Math.random() > 0.8; 
    
    const steps = [
      "Compiling assets...",
      "Running unit tests (30/30 passed)...",
      "Building Docker image...",
      "Pushing to registry..."
    ];

    const runStep = (currentIndex = 0) => {
      if (currentIndex < steps.length) {
        setPipelineSteps(prev => [...prev, steps[currentIndex]]);
        playType();
        
        if (isFailureScenario && currentIndex === 2) {
           setPipelineState('failed');
           setTimeout(() => {
             setPipelineSteps(prev => [...prev, "⚠ Build failed. Retrying with --no-cache...", "Building Docker image (Attempt 2)..."]);
             setPipelineState('running');
             const nextStepIndex = currentIndex + 1;
             setTimeout(() => runStep(nextStepIndex), 1000);
           }, 1500);
           return;
        }

        const nextStepIndex = currentIndex + 1;
        setTimeout(() => runStep(nextStepIndex), 600);
      } else {
        setPipelineState('success');
        setDeployedCache(prev => new Set(prev).add(id));
        setTimeout(() => {
          setDeployingId(null);
          setSelectedId(id);
          setPipelineState('idle');
        }, 1000);
      }
    };

    runStep();
  };

  const handleArchaeologyClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    // 模拟传送特效
    const el = document.getElementById(`arch-btn-${id}`);
    if (el) {
      el.innerHTML = "INITIALIZING WARP DRIVE...";
      el.classList.add("text-blue-400", "animate-pulse");
    }
    
    setTimeout(() => {
      navigate(`/archaeology/seckill-system`);
    }, 800);
  };

  return (
    <section className="mb-20" id="experience">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center font-mono text-term-blue text-xl">
          <span className="text-term-green mr-2">➜</span> ~/experiences
        </div>
        
        {/* SQL Search Input */}
        <div className="hidden md:flex items-center bg-[#0d1117] border border-term-gray rounded px-3 py-1.5 text-sm font-mono w-96 group focus-within:border-term-blue transition-colors">
          <span className="text-term-blue mr-2">SELECT * FROM experiences WHERE</span>
          <input 
            type="text" 
            placeholder="keyword LIKE '%java%'"
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <FaSearch className="text-gray-500 ml-2 group-focus-within:text-term-blue" />
        </div>
      </div>
      
      {/* SQL Execution Overlay */}
      <AnimatePresence>
        {sqlState === 'running' && (
           <SqlVisualizer 
             query={searchQuery} 
             onComplete={() => {
               setActiveQuery(searchQuery);
               setSqlState('completed');
               setTimeout(() => setSqlState('idle'), 1000); // Fade out after showing results
             }} 
           />
        )}
      </AnimatePresence>

      <div className="space-y-6 relative pl-8 border-l border-term-gray ml-2">
        {filteredExperiences.length === 0 && sqlState !== 'running' ? (
           <div className="text-gray-500 font-mono py-8">0 rows returned. (0.00 sec)</div>
        ) : (
          filteredExperiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            layoutId={`card-${exp.id}`}
            onClick={() => handleCardClick(exp.id)}
            className="cursor-pointer group relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {/* Decoration Lines */}
            <div className="absolute -left-[41px] top-6 w-4 h-[1px] bg-term-gray group-hover:bg-term-blue transition-colors"></div>
            <div className="absolute -left-[45px] top-[21px] w-2 h-2 rounded-full bg-[#161b22] border border-term-gray group-hover:border-term-blue group-hover:bg-term-blue transition-colors"></div>

            <TerminalWindow className="border border-term-gray group-hover:border-term-blue/50 transition-all hover:translate-x-1 hover:shadow-[0_0_15px_rgba(88,166,255,0.1)]">
              <div className="font-mono text-xs text-gray-500 mb-2 border-b border-term-gray/30 pb-2 flex justify-between">
                <span>{exp.cmd}</span>
                <span>{exp.date}</span>
              </div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-lg font-bold text-white group-hover:text-term-blue transition-colors">{exp.company}</h3>
                {deployedCache.has(exp.id) && (
                  <span className="text-[10px] bg-term-green/10 text-term-green px-2 py-0.5 rounded border border-term-green/30">Deployed</span>
                )}
              </div>
              <p className="text-term-blue text-sm mb-2">{exp.role}</p>
              <p className="text-gray-400 text-sm">{exp.desc}</p>
              <div className="mt-3 text-xs font-mono text-term-green opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                <span>{deployedCache.has(exp.id) ? "[Click to view logs]" : "[Click to execute deployment pipeline]"}</span>
              </div>
            </TerminalWindow>
          </motion.div>
        )))}
      </div>

      {/* CI/CD Pipeline Overlay */}
      <AnimatePresence>
        {deployingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <div className="font-mono text-sm w-full max-w-lg p-6 bg-[#0d1117] border border-term-gray rounded-lg shadow-2xl">
              <div className="text-term-blue mb-4 font-bold text-lg flex items-center justify-between">
                <span>Deploying to Production...</span>
                {pipelineState === 'running' && <FaSpinner className="animate-spin" />}
                {pipelineState === 'failed' && <FaCircleXmark className="text-red-500" />}
              </div>
              <div className="space-y-2 h-[200px] overflow-y-auto custom-scrollbar p-2 bg-black/50 rounded">
                 {pipelineSteps.map((step, idx) => (
                   <motion.div
                     key={idx}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`flex items-center ${step.includes('failed') ? 'text-red-500' : 'text-gray-400'}`}
                   >
                     <span className={`mr-2 ${step.includes('failed') ? 'text-red-500' : 'text-term-blue'}`}>➜</span>
                     {step}
                   </motion.div>
                 ))}
                 
                 {pipelineState === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-term-green mt-4 font-bold border-t border-gray-800 pt-2"
                    >
                      ✔ Deployment Successful!
                    </motion.div>
                 )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={`card-${selectedId}`}
              className="w-full max-w-3xl z-10"
            >
              <TerminalWindow 
                title={`user@linhongji: ~/view_experience_${selectedId}`} 
                className="bg-[#0d1117] shadow-2xl border-term-blue/30"
                onClose={() => setSelectedId(null)}
              >
                <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="mb-6 font-mono text-sm">
                    <span className="text-term-green">root@server</span>:<span className="text-term-blue">~</span>$ cat {experiences.find(e => e.id === selectedId)?.company.replace(/ /g, '_')}.log
                  </div>

                  <div className="pl-2 border-l-2 border-term-gray/30 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">{experiences.find(e => e.id === selectedId)?.company}</h2>
                      <p className="text-gray-500 text-sm font-mono">{experiences.find(e => e.id === selectedId)?.role} | {experiences.find(e => e.id === selectedId)?.date}</p>
                    </div>
                    
                    <div className="space-y-3 text-sm md:text-base text-gray-300">
                      {experiences.find(e => e.id === selectedId)?.details.map((detail, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                          <span className="text-term-green mr-2 mt-1">➜</span>
                          <span className="leading-relaxed">{detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Archaeology Link Button */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8 pt-6 border-t border-gray-800"
                    >
                      <button 
                        id={`arch-btn-${selectedId}`}
                        onClick={(e) => handleArchaeologyClick(e, selectedId!)}
                        className="group flex items-center gap-3 px-4 py-2 bg-[#161b22] border border-term-blue/30 hover:border-term-blue text-gray-300 hover:text-white rounded transition-all w-full md:w-auto"
                      >
                        <div className="w-8 h-8 rounded-full bg-term-blue/10 flex items-center justify-center group-hover:bg-term-blue/20">
                           <FaSitemap className="text-term-blue text-sm" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-term-blue font-bold uppercase tracking-wider">Project Archaeology</div>
                          <div className="text-[10px] text-gray-500 font-mono">View Architecture Evolution</div>
                        </div>
                        <FaBolt className="ml-auto text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </motion.div>
                    
                    <div className="pt-4 text-term-blue text-xs animate-pulse font-mono">
                      _ End of file
                    </div>
                  </div>
                </div>
              </TerminalWindow>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
