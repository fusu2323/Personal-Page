import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDatabase, FaServer, FaGlobe, FaLayerGroup, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { cn } from '@/lib/utils';

// --- Custom Nodes ---

const CustomNode = ({ data, type }: { data: any, type: string }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'client': return <FaGlobe className="text-blue-400" />;
      case 'server': return <FaServer className="text-gray-200" />;
      case 'db': return <FaDatabase className="text-green-500" />;
      case 'cache': return <FaBolt className="text-red-500" />;
      case 'mq': return <FaLayerGroup className="text-orange-500" />;
      default: return <FaServer />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case 'client': return 'border-blue-500/50';
      case 'db': return 'border-green-500/50';
      case 'cache': return 'border-red-500/50';
      case 'mq': return 'border-orange-500/50';
      default: return 'border-gray-500/50';
    }
  };

  return (
    <div className={cn(
      "bg-[#0d1117] px-4 py-2 rounded border-2 shadow-lg min-w-[120px] text-center transition-all hover:scale-105 cursor-pointer relative group",
      getBorderColor(),
      data.highlight && "ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0d1117]"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-gray-600 !w-2 !h-2" />
      <div className="flex flex-col items-center gap-1">
        <div className="text-lg mb-1">{getIcon()}</div>
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-600 !w-2 !h-2" />
      
      {/* Tooltip for ADR */}
      {data.adr && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
          Has ADR Decision
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// --- Phases Data ---

const phases = [
  {
    id: 0,
    name: "PHASE 1: THE MONOLITH",
    date: "2023-01-15",
    description: "Initial rapid development for validation.",
    stats: { files: 12, complexity: "Low" },
    nodes: [
      { id: 'client', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'Browser', type: 'client' } },
      { id: 'server', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Monolith API', type: 'server' } },
      { id: 'db', type: 'custom', position: { x: 250, y: 350 }, data: { label: 'MySQL', type: 'db' } },
    ],
    edges: [
      { id: 'e1-2', source: 'client', target: 'server', animated: true, style: { stroke: '#58a6ff' } },
      { id: 'e2-3', source: 'server', target: 'db', style: { stroke: '#30363d' } },
    ],
    commits: [
      { hash: "a1b2c3d", msg: "Initial commit: basic CRUD", tag: "feat" },
      { hash: "e5f6g7h", msg: "Setup MySQL connection", tag: "chore" }
    ]
  },
  {
    id: 1,
    name: "PHASE 2: CACHE LAYER",
    date: "2023-03-20",
    description: "Database bottleneck resolved with Redis.",
    stats: { files: 28, complexity: "Medium" },
    nodes: [
      { id: 'client', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'Browser', type: 'client' } },
      { id: 'server', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Monolith API', type: 'server' } },
      { id: 'redis', type: 'custom', position: { x: 450, y: 200 }, data: { label: 'Redis', type: 'cache', adr: true } },
      { id: 'db', type: 'custom', position: { x: 250, y: 350 }, data: { label: 'MySQL', type: 'db' } },
    ],
    edges: [
      { id: 'e1-2', source: 'client', target: 'server', animated: true, style: { stroke: '#58a6ff' } },
      { id: 'e2-3', source: 'server', target: 'db', style: { stroke: '#30363d' } },
      { id: 'e2-4', source: 'server', target: 'redis', animated: true, style: { stroke: '#da3633', strokeDasharray: 5 } },
    ],
    commits: [
      { hash: "m1n2o3p", msg: "HOTFIX: DB timeout", tag: "fix", highlight: true },
      { hash: "q4r5s6t", msg: "Add Redis caching", tag: "feat" }
    ],
    adr: {
      title: "ADR-002: Redis Caching",
      content: "Introduced Redis read-through cache to solve high latency on product detail pages. Reduced DB load by 80%."
    }
  },
  {
    id: 2,
    name: "PHASE 3: MICROSERVICES",
    date: "2023-08-10",
    description: "Splitting domains for independent scaling.",
    stats: { files: 85, complexity: "High" },
    nodes: [
      { id: 'client', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Gateway', type: 'client' } },
      { id: 'user', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'User Svc', type: 'server' } },
      { id: 'order', type: 'custom', position: { x: 400, y: 150 }, data: { label: 'Order Svc', type: 'server' } },
      { id: 'redis', type: 'custom', position: { x: 550, y: 250 }, data: { label: 'Redis', type: 'cache' } },
      { id: 'db', type: 'custom', position: { x: 250, y: 350 }, data: { label: 'MySQL Cluster', type: 'db' } },
    ],
    edges: [
      { id: 'e1-2', source: 'client', target: 'user', animated: true },
      { id: 'e1-3', source: 'client', target: 'order', animated: true },
      { id: 'e3-4', source: 'order', target: 'redis', style: { stroke: '#da3633' } },
      { id: 'e3-5', source: 'order', target: 'db' },
      { id: 'e2-5', source: 'user', target: 'db' },
    ],
    commits: [
      { hash: "y1z2a3b", msg: "Split User Service", tag: "refactor" },
      { hash: "c4d5e6f", msg: "Init Order Service", tag: "feat" }
    ],
    adr: {
      title: "ADR-005: Service Split",
      content: "Decoupled User and Order domains to allow independent deployment cycles and scaling strategies."
    }
  }
];

export const ProjectArchaeology: React.FC = () => {
  const navigate = useNavigate();
  const [currentPhase, setCurrentPhase] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showAdr, setShowAdr] = useState(false);

  // Initialize nodes/edges based on phase
  useEffect(() => {
    const phase = phases[currentPhase];
    setNodes(phase.nodes);
    setEdges(phase.edges);
    if (phase.adr) setShowAdr(true);
    else setShowAdr(false);
  }, [currentPhase, setNodes, setEdges]);

  // Page Enter Animation
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "circOut" } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-[#0d1117] z-[200] flex flex-col font-mono text-gray-300 overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0d1117]/90 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-blue-500">PROJECT_ARCHAEOLOGY</span> 
              <span className="text-gray-600">/</span> 
              <span>seckill-system</span>
            </h1>
          </div>
        </div>
        <div className="text-xs text-gray-500 flex gap-4">
          <span>STATUS: <span className="text-green-500">ARCHIVED</span></span>
          <span>LAST_UPDATE: 2025-12-31</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-grid-pattern">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-[#0d1117]"
          >
            <Background color="#21262d" gap={20} size={1} />
            <Controls className="bg-[#161b22] border-gray-700 text-gray-400 fill-gray-400" />
          </ReactFlow>

          {/* Phase Controller Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-[#161b22]/90 backdrop-blur border border-gray-700 rounded-xl p-4 shadow-2xl">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">TIMELINE CONTROL</div>
                <div className="text-blue-400 font-bold">{phases[currentPhase].name}</div>
              </div>
              <div className="text-xs text-gray-500 font-mono">{phases[currentPhase].date}</div>
            </div>
            
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="1" 
              value={currentPhase}
              onChange={(e) => setCurrentPhase(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            
            <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono uppercase">
              <span>v1.0 Monolith</span>
              <span>v2.0 Cache</span>
              <span>v3.0 Microservices</span>
            </div>
          </div>

          {/* ADR Alert Card */}
          <AnimatePresence>
            {showAdr && phases[currentPhase].adr && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-4 right-4 w-80 bg-[#161b22]/95 border border-yellow-600/50 rounded p-4 shadow-2xl backdrop-blur"
              >
                <div className="flex items-center gap-2 text-yellow-500 font-bold text-xs mb-2">
                  <FaExclamationTriangle />
                  {phases[currentPhase].adr?.title}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {phases[currentPhase].adr?.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 border-l border-gray-800 bg-[#0d1117] p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Stats */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Project Entropy</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Files</span>
                <span className="text-blue-400">{phases[currentPhase].stats.files}</span>
              </div>
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-blue-500 h-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(phases[currentPhase].stats.files / 100) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Complexity</span>
                <span className="text-red-400">{phases[currentPhase].stats.complexity}</span>
              </div>
            </div>
          </div>

          {/* Commits */}
          <div className="flex-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Git History</h3>
            <div className="space-y-3">
              {phases[currentPhase].commits.map((commit, i) => (
                <motion.div 
                  key={commit.hash}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "p-3 rounded border bg-[#161b22] hover:border-gray-500 transition-colors cursor-pointer",
                    commit.highlight ? "border-l-2 border-l-yellow-500 border-gray-800" : "border-gray-800"
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-blue-400 font-mono">{commit.hash}</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded border uppercase",
                      commit.tag === 'feat' ? "text-green-400 border-green-400/20 bg-green-400/5" :
                      commit.tag === 'fix' ? "text-red-400 border-red-400/20 bg-red-400/5" :
                      "text-yellow-400 border-yellow-400/20 bg-yellow-400/5"
                    )}>{commit.tag}</span>
                  </div>
                  <div className="text-xs text-gray-300">{commit.msg}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};