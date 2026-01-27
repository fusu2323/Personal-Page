import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { socialLinks } from '@/data/resume';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { FaGithub, FaEnvelope, FaFolderOpen, FaTerminal, FaTv } from 'react-icons/fa6';

const iconMap: Record<string, React.ReactNode> = {
  "github": <FaGithub />,
  "bilibili": <FaTv />,
  "mail": <FaEnvelope />
};

export const SocialInteractive: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [warpingLink, setWarpingLink] = useState<string | null>(null);
  const { playEnter, playHover, playExpand } = useSound();

  const handleOpen = () => {
    if (!isOpen) {
      playEnter();
      setIsOpen(true);
    }
  };

  const handleLinkClick = (url: string, name: string) => {
    playExpand();
    setWarpingLink(name);
    setTimeout(() => {
      window.open(url, '_blank');
      setWarpingLink(null);
    }, 1000);
  };

  return (
    <section className="mb-20">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/connect
      </div>

      <TerminalWindow 
        title="user@linhongji: ~/social_links" 
        className={cn(
          "transition-all duration-500 min-h-[250px] relative overflow-hidden",
          !isOpen ? "cursor-pointer hover:border-term-blue" : ""
        )}
      >
        {!isOpen ? (
          <div onClick={handleOpen} className="h-full flex flex-col justify-center items-center text-gray-500 group py-12">
            <span className="text-term-green text-lg mb-2 group-hover:animate-pulse">$ ls -R /social_links/</span>
            <span className="text-xs">[ Click to Explore ]</span>
          </div>
        ) : (
          <div className="font-mono">
            {/* Command History */}
            <div className="text-gray-500 text-sm mb-4">
              <span className="text-term-green">➜</span> <span className="text-term-blue">~</span> $ ls -R /social_links/
            </div>

            {/* Tree View */}
            <div className="pl-2">
              <div className="flex items-center text-blue-400 mb-2">
                <FaFolderOpen className="mr-2" /> .
              </div>
              
              <div className="space-y-1 relative border-l border-gray-700 ml-1.5 pl-4">
                {socialLinks.map((link, idx) => {
                  const isLast = idx === socialLinks.length - 1;
                  const isWarping = warpingLink === link.name;

                  return (
                    <div key={link.name} className="relative">
                      {/* Tree Branch Lines */}
                      <div className="absolute -left-4 top-3 w-3 h-px bg-gray-700"></div>
                      {isLast && <div className="absolute -left-[17px] top-3 bottom-0 w-px bg-[#0d1117] z-10"></div>}

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={isWarping ? { scale: 0, opacity: 0, x: 100 } : { opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={cn(
                          "flex items-center p-2 rounded cursor-pointer transition-colors group",
                          hoveredLink === link.name ? "bg-term-gray" : ""
                        )}
                        onMouseEnter={() => {
                          setHoveredLink(link.name);
                          playHover();
                        }}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={() => handleLinkClick(link.url, link.name)}
                      >
                        <span className={cn("mr-3 text-lg", hoveredLink === link.name ? "text-term-blue" : "text-gray-400")}>
                          {iconMap[link.icon] || <FaTerminal />}
                        </span>
                        <span className={cn("text-sm", hoveredLink === link.name ? "text-white" : "text-gray-300")}>
                          {link.name}
                        </span>
                        
                        {/* Connecting Animation Text (Only when warping) */}
                        {isWarping && (
                          <span className="ml-4 text-xs text-term-green animate-pulse">
                            Connecting...
                          </span>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Bar (ls -l style) */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#161b22] border-t border-term-gray p-2 text-xs text-gray-500 font-mono flex justify-between items-center">
              {hoveredLink ? (
                <>
                  <span>-rwxr-xr-x 1 user staff 2048 {new Date().toLocaleDateString()} {hoveredLink}</span>
                  <span className="text-term-blue">READ_ONLY</span>
                </>
              ) : (
                <span>total {socialLinks.length} files</span>
              )}
            </div>
          </div>
        )}
        
        {/* Warp Overlay */}
        <AnimatePresence>
          {warpingLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20"
            >
              <div className="text-term-green font-mono mb-4 text-lg">
                &gt; Establishing secure connection to {warpingLink}...
              </div>
              <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
                <motion.div 
                  className="h-full bg-term-green"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </TerminalWindow>
    </section>
  );
};
