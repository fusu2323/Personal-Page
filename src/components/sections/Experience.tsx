import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { experiences } from '@/data/resume';

export const Experience: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section className="mb-20">
      <div className="flex items-center mb-8 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/experiences
      </div>
      
      <div className="space-y-6 relative pl-8 border-l border-term-gray ml-2">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            layoutId={`card-${exp.id}`}
            onClick={() => setSelectedId(exp.id)}
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
              </div>
              <p className="text-term-blue text-sm mb-2">{exp.role}</p>
              <p className="text-gray-400 text-sm">{exp.desc}</p>
              <div className="mt-3 text-xs font-mono text-term-green opacity-0 group-hover:opacity-100 transition-opacity">
                [Click to expand output]
              </div>
            </TerminalWindow>
          </motion.div>
        ))}
      </div>

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
