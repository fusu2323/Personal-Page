import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const SystemMonitor: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: 12,
    mem: 340,
    ping: 24
  });

  useEffect(() => {
    const updateStats = () => {
      // Simulate CPU load based on mouse movement speed (mocked here with random)
      const newCpu = Math.max(5, Math.min(100, stats.cpu + (Math.random() - 0.5) * 20));
      // Simulate Memory based on DOM nodes (mocked)
      const newMem = Math.max(200, Math.min(1024, stats.mem + (Math.random() - 0.5) * 50));
      // Simulate Ping
      const newPing = Math.max(5, Math.min(100, stats.ping + (Math.random() - 0.5) * 10));

      setStats({
        cpu: Math.floor(newCpu),
        mem: Math.floor(newMem),
        ping: Math.floor(newPing)
      });
    };

    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [stats]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
      className="fixed bottom-8 right-8 hidden xl:flex flex-col gap-2 font-mono text-[10px] text-gray-500 z-30 pointer-events-none select-none bg-[#0d1117]/80 p-3 rounded border border-gray-800 backdrop-blur-sm"
    >
      <div className="uppercase text-term-blue font-bold mb-1 border-b border-gray-800 pb-1">System Monitor</div>
      
      <div className="flex justify-between gap-4 items-center">
        <span>CPU_LOAD</span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${stats.cpu > 80 ? 'bg-red-500' : 'bg-term-green'}`}
              animate={{ width: `${stats.cpu}%` }}
            />
          </div>
          <span className={`w-8 text-right ${stats.cpu > 80 ? 'text-red-500' : 'text-term-green'}`}>{stats.cpu}%</span>
        </div>
      </div>

      <div className="flex justify-between gap-4 items-center">
        <span>MEM_ALLOC</span>
        <div className="flex items-center gap-2">
           <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-term-blue"
              animate={{ width: `${(stats.mem / 1024) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-term-blue">{stats.mem}MB</span>
        </div>
      </div>

      <div className="flex justify-between gap-4 items-center">
        <span>NET_LATENCY</span>
        <div className="flex items-center gap-2">
           <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${stats.ping > 100 ? 'bg-red-500' : 'bg-yellow-500'}`}
              animate={{ width: `${Math.min(100, stats.ping)}%` }}
            />
          </div>
          <span className={`w-8 text-right ${stats.ping > 100 ? 'text-red-500' : 'text-yellow-500'}`}>{stats.ping}ms</span>
        </div>
      </div>
      
      <div className="mt-1 pt-1 border-t border-gray-800 text-[8px] text-gray-600 flex justify-between">
        <span>UPTIME: 14d 2h 12m</span>
        <span>PID: 8821</span>
      </div>
    </motion.div>
  );
};
