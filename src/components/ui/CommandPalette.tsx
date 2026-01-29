import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTerminal, FaCode, FaDownload, FaSun, FaMoon, FaBomb } from 'react-icons/fa6';
import { useSound } from '@/hooks/useSound';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flashbang, setFlashbang] = useState(false);
  const [shake, setShake] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  
  const { playHover, playEnter } = useSound();

  const commands = [
    { id: 'skills', label: 'Go to Skills', icon: <FaCode />, action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'exp', label: 'Go to Experience', icon: <FaTerminal />, action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'roadmap', label: 'Go to Roadmap', icon: <FaCode />, action: () => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' }) },
    { id: 'resume', label: 'Download Resume', icon: <FaDownload />, action: () => document.querySelector<HTMLButtonElement>('button[class*="wget"]')?.click() },
    { 
      id: 'theme', 
      label: 'Toggle Theme (Light Mode)', 
      icon: <FaSun />, 
      action: () => {
        setFlashbang(true);
        setTimeout(() => setFlashbang(false), 2000); // Flashbang effect
      } 
    },
    { 
      id: 'rm -rf', 
      label: 'sudo rm -rf /', 
      icon: <FaBomb className="text-red-500" />, 
      action: () => {
        setShake(true);
        setRedAlert(true);
        setTimeout(() => {
          setShake(false);
          setRedAlert(false);
          alert("PERMISSION DENIED: Nice try, but I need this system to get hired.");
        }, 3000);
      } 
    },
    { id: 'clear', label: 'Clear Terminal', icon: <FaTerminal />, action: () => window.location.reload() },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) || 
    cmd.id.includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const executeCommand = (cmd: typeof commands[0]) => {
    playEnter();
    cmd.action();
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Effects Layer */}
      <AnimatePresence>
        {flashbang && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-white pointer-events-none flex items-center justify-center"
          >
             <div className="text-black font-bold text-4xl font-mono">MY EYES! IT BURNS!</div>
          </motion.div>
        )}
        {redAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998] bg-red-600 pointer-events-none mix-blend-overlay animate-pulse"
          />
        )}
      </AnimatePresence>

      <div className={shake ? "animate-shake" : ""}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm px-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: -20 }}
                className="w-full max-w-lg bg-[#0d1117] border border-term-gray rounded-lg shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center px-4 py-3 border-b border-term-gray">
                  <span className="text-term-green mr-3">➜</span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-600"
                    value={query}
                    onChange={e => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                      }
                      if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setSelectedIndex(prev => Math.max(prev - 1, 0));
                      }
                      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
                        executeCommand(filteredCommands[selectedIndex]);
                      }
                    }}
                  />
                  <span className="text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">ESC</span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto py-2">
                  {filteredCommands.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm font-mono">
                      No matching commands found.
                    </div>
                  ) : (
                    filteredCommands.map((cmd, idx) => (
                      <div
                        key={cmd.id}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                          idx === selectedIndex ? 'bg-term-blue/10 text-term-blue border-l-2 border-term-blue' : 'text-gray-400 border-l-2 border-transparent hover:bg-[#161b22]'
                        }`}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => {
                          setSelectedIndex(idx);
                          playHover();
                        }}
                      >
                        <span className="mr-3 opacity-70">{cmd.icon}</span>
                        <span className="font-mono text-sm flex-1">{cmd.label}</span>
                        {idx === selectedIndex && (
                          <span className="text-xs text-term-green opacity-70">↵</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                <div className="bg-[#161b22] px-4 py-2 border-t border-term-gray flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>Quick Actions</span>
                  <div className="flex gap-3">
                    <span>↑↓ navigate</span>
                    <span>↵ select</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
