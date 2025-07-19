import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  TrendingUp,
  Activity,
  Atom,
  Binary
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const QuantumComputing = () => {
  const [quantumState, setQuantumState] = useState({
    qubits: 8,
    entanglement: 0.75,
    coherenceTime: 100,
    gateOperations: 0,
    quantumVolume: 64
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState('grover');
  const [optimizationResults, setOptimizationResults] = useState([]);
  const [quantumCircuit, setQuantumCircuit] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [quantumAdvantage, setQuantumAdvantage] = useState(0);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Quantum algorithms simulation
  const algorithms = {
    grover: {
      name: "Grover's Search",
      description: "Quantum search algorithm for unstructured databases",
      complexity: "O(√N)",
      applications: ["Database search", "Optimization problems"]
    },
    shor: {
      name: "Shor's Algorithm",
      description: "Quantum algorithm for integer factorization",
      complexity: "O((log N)³)",
      applications: ["Cryptography", "Security analysis"]
    },
    qaoa: {
      name: "QAOA",
      description: "Quantum Approximate Optimization Algorithm",
      complexity: "O(p·m)",
      applications: ["Combinatorial optimization", "Machine scheduling"]
    },
    vqe: {
      name: "VQE",
      description: "Variational Quantum Eigensolver",
      complexity: "O(N⁴)",
      applications: ["Molecular simulation", "Material science"]
    }
  };

  // Simulate quantum circuit execution
  const executeQuantumAlgorithm = async () => {
    setIsRunning(true);
    setOptimizationResults([]);
    setQuantumCircuit([]);
    
    // Simulate quantum circuit construction
    const circuit = [];
    const steps = 20;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const gate = {
        step: i,
        gate: ['H', 'CNOT', 'RZ', 'RY', 'RX'][Math.floor(Math.random() * 5)],
        qubits: Math.floor(Math.random() * quantumState.qubits),
        angle: Math.random() * Math.PI * 2,
        fidelity: 0.95 + Math.random() * 0.05
      };
      
      circuit.push(gate);
      setQuantumCircuit([...circuit]);
      
      // Simulate optimization progress
      const result = {
        iteration: i,
        energy: -10 + Math.random() * 2 - i * 0.1,
        probability: Math.random(),
        classicalTime: Math.pow(2, quantumState.qubits) * 0.001,
        quantumTime: Math.sqrt(Math.pow(2, quantumState.qubits)) * 0.001
      };
      
      setOptimizationResults(prev => [...prev, result]);
    }
    
    // Calculate quantum advantage
    const finalResult = optimizationResults[optimizationResults.length - 1];
    if (finalResult) {
      const advantage = finalResult.classicalTime / finalResult.quantumTime;
      setQuantumAdvantage(advantage);
    }
    
    setIsRunning(false);
  };

  // Quantum state visualization
  const drawQuantumState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw Bloch sphere representation
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    
    // Draw sphere
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();
    
    // Z axis (ellipse for 3D effect)
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw quantum state vectors for each qubit
    for (let i = 0; i < quantumState.qubits; i++) {
      const angle = (i / quantumState.qubits) * 2 * Math.PI + Date.now() * 0.001;
      const x = centerX + Math.cos(angle) * radius * 0.8;
      const y = centerY + Math.sin(angle) * radius * 0.8;
      
      ctx.fillStyle = `hsl(${(i * 360) / quantumState.qubits}, 70%, 60%)`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw vector line
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    // Draw entanglement connections
    if (quantumState.entanglement > 0.5) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      for (let i = 0; i < quantumState.qubits - 1; i++) {
        const angle1 = (i / quantumState.qubits) * 2 * Math.PI + Date.now() * 0.001;
        const angle2 = ((i + 1) / quantumState.qubits) * 2 * Math.PI + Date.now() * 0.001;
        
        const x1 = centerX + Math.cos(angle1) * radius * 0.8;
        const y1 = centerY + Math.sin(angle1) * radius * 0.8;
        const x2 = centerX + Math.cos(angle2) * radius * 0.8;
        const y2 = centerY + Math.sin(angle2) * radius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    const animate = () => {
      drawQuantumState();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [quantumState]);

  // Generate performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => {
        const newData = [...prev];
        if (newData.length > 20) newData.shift();
        
        newData.push({
          time: new Date().toLocaleTimeString(),
          coherence: quantumState.coherenceTime * (0.9 + Math.random() * 0.2),
          fidelity: 0.95 + Math.random() * 0.05,
          entanglement: quantumState.entanglement * (0.8 + Math.random() * 0.4),
          gateError: Math.random() * 0.01
        });
        
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quantumState]);

  const QuantumMetric = ({ title, value, unit, color, icon: Icon }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toFixed(2) : value}{unit}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Quantum Computing</h2>
        <p className="text-gray-600 mt-2">Quantum algorithms for optimization and machine learning acceleration</p>
      </div>

      {/* Quantum Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <QuantumMetric
          title="Qubits"
          value={quantumState.qubits}
          unit=""
          color="bg-cyan-500"
          icon={Atom}
        />
        <QuantumMetric
          title="Entanglement"
          value={quantumState.entanglement * 100}
          unit="%"
          color="bg-purple-500"
          icon={Zap}
        />
        <QuantumMetric
          title="Coherence Time"
          value={quantumState.coherenceTime}
          unit="μs"
          color="bg-blue-500"
          icon={Activity}
        />
        <QuantumMetric
          title="Quantum Volume"
          value={quantumState.quantumVolume}
          unit=""
          color="bg-indigo-500"
          icon={Binary}
        />
      </div>

      {/* Algorithm Selection and Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-cyan-600" />
            Quantum Algorithm
          </h3>
          
          <div className="space-y-4">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {Object.entries(algorithms).map(([key, alg]) => (
                <option key={key} value={key}>{alg.name}</option>
              ))}
            </select>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{algorithms[algorithm].name}</h4>
              <p className="text-sm text-gray-600 mt-1">{algorithms[algorithm].description}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Complexity:</strong> {algorithms[algorithm].complexity}
              </p>
              <div className="mt-2">
                <p className="text-sm text-gray-500"><strong>Applications:</strong></p>
                <ul className="text-sm text-gray-600 ml-4">
                  {algorithms[algorithm].applications.map((app, i) => (
                    <li key={i}>• {app}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <button
              onClick={executeQuantumAlgorithm}
              disabled={isRunning}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Algorithm</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quantum State Visualization */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantum State Visualization</h3>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full h-64 border border-gray-200 rounded-lg"
          />
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Gate Operations</p>
              <p className="font-bold text-gray-900">{quantumCircuit.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Quantum Advantage</p>
              <p className="font-bold text-gray-900">{quantumAdvantage.toFixed(1)}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantum System Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="coherence" stroke="#06b6d4" strokeWidth={2} name="Coherence (μs)" />
            <Line type="monotone" dataKey="fidelity" stroke="#8b5cf6" strokeWidth={2} name="Fidelity" />
            <Line type="monotone" dataKey="entanglement" stroke="#3b82f6" strokeWidth={2} name="Entanglement" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Optimization Results */}
      {optimizationResults.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={optimizationResults}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="energy" stroke="#ef4444" strokeWidth={2} name="Energy" />
              <Line type="monotone" dataKey="probability" stroke="#10b981" strokeWidth={2} name="Success Probability" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quantum Circuit Display */}
      {quantumCircuit.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantum Circuit</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-4">
              {quantumCircuit.slice(-10).map((gate, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-shrink-0 p-3 bg-gradient-to-br from-cyan-50 to-purple-50 border border-cyan-200 rounded-lg"
                >
                  <div className="text-center">
                    <p className="font-bold text-cyan-800">{gate.gate}</p>
                    <p className="text-xs text-gray-600">Q{gate.qubits}</p>
                    <p className="text-xs text-purple-600">{(gate.fidelity * 100).toFixed(1)}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantumComputing;

