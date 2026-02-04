import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TerminalWindow } from '../ui/TerminalWindow';
import { socialLinks } from '@/data/resume';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';
import { FaGithub, FaEnvelope, FaFolderOpen, FaTerminal, FaTv, FaGlobe, FaArrowRight, FaSatellite } from 'react-icons/fa6';

const iconMap: Record<string, React.ReactNode> = {
  "github": <FaGithub />,
  "bilibili": <FaTv />,
  "mail": <FaEnvelope />,
  "website": <FaGlobe />
};

const iconGlowColors: Record<string, string> = {
  "github": "hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
  "bilibili": "hover:shadow-[0_0_20px_rgba(0,170,255,0.3)]",
  "mail": "hover:shadow-[0_0_20px_rgba(255,100,100,0.3)]",
  "website": "hover:shadow-[0_0_20px_rgba(100,255,100,0.3)]"
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
    }, 1500);
  };

  return (
    <section className="mb-20">
      <div className="flex items-center mb-6 font-mono text-term-blue text-xl">
        <span className="text-term-green mr-2">➜</span> ~/connect
      </div>

      <TerminalWindow
        title="user@linhongji: ~/social_links"
        className={cn(
          "transition-all duration-500 min-h-[280px] relative overflow-hidden",
          !isOpen ? "cursor-pointer hover:border-term-blue" : ""
        )}
      >
        {!isOpen ? (
          <div onClick={handleOpen} className="h-full flex flex-col justify-center items-center text-gray-500 group py-12">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-term-green text-lg mb-2 group-hover:animate-pulse"
            >
              $ ls -R /social_links/
            </motion.div>
            <div className="flex items-center gap-2 text-xs">
              <span>[ Click to Establish Connection ]</span>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-term-green rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className="font-mono">
            {/* Command History */}
            <div className="text-gray-500 text-sm mb-4">
              <span className="text-term-green">➜</span> <span className="text-term-blue">~</span> $ ls -R /social_links/ && echo "Scanning available channels..."
            </div>

            {/* Enhanced Tree View with Visual Effects */}
            <div className="pl-2 relative">
              {/* Animated Background Grid */}
              <motion.div
                animate={{ opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-term-blue/5 to-term-green/5 rounded pointer-events-none"
              />

              <div className="flex items-center text-blue-400 mb-3">
                <FaFolderOpen className="mr-2" />
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-sm"
                >
                  .
                </motion.span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 w-1 h-1 bg-term-green/50"
                />
              </div>

              <div className="space-y-2 relative border-l border-gray-700 ml-1.5 pl-4">
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
                          "flex items-center p-3 rounded cursor-pointer transition-all group relative overflow-hidden",
                          hoveredLink === link.name ? "bg-term-gray/50" : "hover:bg-term-gray/30",
                          iconGlowColors[link.icon] || ""
                        )}
                        onMouseEnter={() => {
                          setHoveredLink(link.name);
                          playHover();
                        }}
                        onMouseLeave={() => setHoveredLink(null)}
                        onClick={() => handleLinkClick(link.url, link.name)}
                      >
                        {/* Hover Glow Effect */}
                        <motion.div
                          animate={hoveredLink === link.name ? {
                            opacity: [0, 0.2, 0],
                            scale: [0.8, 1.2, 0.8],
                          } : { opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.8, repeat: hoveredLink === link.name ? Infinity : 0 }}
                          className="absolute inset-0 bg-term-blue/10 pointer-events-none"
                        />

                        {/* Icon with enhanced styling */}
                        <motion.span
                          animate={hoveredLink === link.name ? {
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: 1.2
                          } : { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className={cn(
                            "mr-4 text-xl relative z-10",
                            hoveredLink === link.name ? "text-term-blue drop-shadow-[0_0_8px_rgb(56,189,248)]" : "text-gray-400"
                          )}
                        >
                          {iconMap[link.icon] || <FaTerminal />}
                        </motion.span>

                        {/* Link Name */}
                        <div className="flex-1 relative z-10">
                          <motion.span
                            animate={hoveredLink === link.name ? { x: [0, 5, 0] } : { x: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn("text-base font-medium", hoveredLink === link.name ? "text-white" : "text-gray-300")}
                          >
                            {link.name}
                          </motion.span>

                          {/* URL Preview on Hover */}
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={hoveredLink === link.name ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-term-green/70 mt-0.5 truncate max-w-xs"
                          >
                            → {new URL(link.url).hostname}
                          </motion.div>
                        </div>

                        {/* Arrow Indicator */}
                        <motion.div
                          animate={hoveredLink === link.name ? { x: [0, 10], opacity: 1 } : { x: 0, opacity: 0.5 }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-600 z-10"
                        >
                          <FaArrowRight className="text-sm" />
                        </motion.div>

                        {/* Connecting Animation */}
                        {isWarping && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-term-blue/20 flex items-center justify-center z-20"
                          >
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="text-term-green"
                              >
                                <FaSatellite />
                              </motion.div>
                              <span className="text-xs text-term-green font-bold animate-pulse">
                                INITIALIZING CONNECTION...
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Status Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#0d1117] border-t border-term-gray p-2.5 text-xs text-gray-500 font-mono flex justify-between items-center">
              {hoveredLink ? (
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-term-blue">{hoveredLink}</span>
                    <span className="text-gray-600">|</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-term-green"
                  >
                    READY
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span>total {socialLinks.length} channels available</span>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-term-green rounded-full"
                  />
                </div>
              )}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-600">SECURE</span>
                <span className="text-gray-600">|</span>
                <span className="text-term-blue">v1.0</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Warp Overlay */}
        <AnimatePresence>
          {warpingLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-20"
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-term-green text-5xl mb-6"
                >
                  <FaSatellite />
                </motion.div>
                <div className="text-term-green font-mono text-lg mb-2">
                  &gt; Establishing secure connection
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-term-blue font-mono text-xl mb-8"
                >
                  {warpingLink}
                </motion.div>

                {/* Progress Bar */}
                <div className="w-80 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-term-blue via-term-green to-term-blue relative"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.4 }}
                  >
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>

                {/* Connection Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-xs text-gray-500 font-mono space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span>Protocol:</span>
                    <span className="text-term-blue">HTTPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Encryption:</span>
                    <span className="text-term-green">TLS 1.3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <motion.span
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-yellow-400"
                    >
                      HANDSHAKING...
                    </motion.span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </TerminalWindow>
    </section>
  );
};
