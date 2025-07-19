import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder } from '@react-three/drei';
import { 
  Bot, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings,
  Zap,
  Activity,
  Target,
  Wrench,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// 3D Robot Arm Component
const RobotArm = ({ joints, isMoving }) => {
  const armRef = useRef();
  const [time, setTime] = useState(0);

  useFrame((state, delta) => {
    setTime(time + delta);
    if (isMoving && armRef.current) {
      armRef.current.rotation.y = Math.sin(time) * 0.5;
    }
  });

  return (
    <group ref={armRef}>
      {/* Base */}
      <Cylinder args={[1, 1, 0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4f46e5" />
      </Cylinder>
      
      {/* Joint 1 */}
      <group rotation={[0, joints.joint1 * Math.PI / 180, 0]}>
        <Cylinder args={[0.3, 0.3, 2]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#7c3aed" />
        </Cylinder>
        
        {/* Joint 2 */}
        <group position={[0, 2.5, 0]} rotation={[0, 0, joints.joint2 * Math.PI / 180]}>
          <Cylinder args={[0.25, 0.25, 1.5]} position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#ec4899" />
          </Cylinder>
          
          {/* Joint 3 */}
          <group position={[1.5, 0, 0]} rotation={[0, 0, joints.joint3 * Math.PI / 180]}>
            <Cylinder args={[0.2, 0.2, 1]} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#06b6d4" />
            </Cylinder>
            
            {/* End Effector */}
            <group position={[1, 0, 0]}>
              <Box args={[0.3, 0.3, 0.3]}>
                <meshStandardMaterial color="#10b981" />
              </Box>
              
              {/* Gripper */}
              <Box args={[0.1, 0.4, 0.05]} position={[0.2, 0, 0]}>
                <meshStandardMaterial color="#f59e0b" />
              </Box>
              <Box args={[0.1, 0.4, 0.05]} position={[-0.2, 0, 0]}>
                <meshStandardMaterial color="#f59e0b" />
              </Box>
            </group>
          </group>
        </group>
      </group>
      
      {/* Target Position */}
      <Sphere args={[0.1]} position={[joints.targetX, joints.targetY, joints.targetZ]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  );
};

const RoboticsControl = () => {
  const [robotStatus, setRobotStatus] = useState({
    connected: true,
    operational: true,
    batteryLevel: 87,
    temperature: 42,
    lastMaintenance: '2024-01-15'
  });

  const [joints, setJoints] = useState({
    joint1: 0,
    joint2: 45,
    joint3: -30,
    joint4: 0,
    joint5: 0,
    joint6: 0,
    targetX: 2,
    targetY: 1,
    targetZ: 0
  });

  const [isMoving, setIsMoving] = useState(false);
  const [currentTask, setCurrentTask] = useState('idle');
  const [performanceData, setPerformanceData] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);

  const tasks = {
    idle: { name: 'Idle', description: 'Robot is in standby mode' },
    inspection: { name: 'Inspection', description: 'Performing visual inspection of machinery' },
    maintenance: { name: 'Maintenance', description: 'Executing preventive maintenance tasks' },
    repair: { name: 'Repair', description: 'Conducting repair operations' },
    calibration: { name: 'Calibration', description: 'Calibrating sensors and actuators' }
  };

  // Simulate robot movement
  const executeTask = async (taskType) => {
    setCurrentTask(taskType);
    setIsMoving(true);

    const taskSequences = {
      inspection: [
        { joint1: 45, joint2: 30, joint3: -45, targetX: 1.5, targetY: 2, targetZ: 0.5 },
        { joint1: 90, joint2: 60, joint3: -60, targetX: 0.5, targetY: 2.5, targetZ: 1 },
        { joint1: 135, joint2: 45, joint3: -30, targetX: -0.5, targetY: 2, targetZ: 0.5 }
      ],
      maintenance: [
        { joint1: 0, joint2: 90, joint3: -90, targetX: 2, targetY: 0.5, targetZ: 0 },
        { joint1: 30, joint2: 75, joint3: -75, targetX: 1.8, targetY: 1, targetZ: 0.3 },
        { joint1: 60, joint2: 60, joint3: -60, targetX: 1.5, targetY: 1.5, targetZ: 0.5 }
      ],
      repair: [
        { joint1: -30, joint2: 45, joint3: -45, targetX: 2.2, targetY: 1.2, targetZ: -0.3 },
        { joint1: 0, joint2: 30, joint3: -30, targetX: 2.5, targetY: 0.8, targetZ: 0 },
        { joint1: 30, joint2: 45, joint3: -45, targetX: 2, targetY: 1.5, targetZ: 0.3 }
      ]
    };

    const sequence = taskSequences[taskType] || taskSequences.inspection;

    for (const position of sequence) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setJoints(prev => ({ ...prev, ...position }));
    }

    setIsMoving(false);
    setCurrentTask('idle');
  };

  // Generate performance data
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev];
        if (newData.length > 20) newData.shift();

        newData.push({
          time: new Date().toLocaleTimeString(),
          accuracy: 95 + Math.random() * 5,
          speed: 80 + Math.random() * 20,
          efficiency: 85 + Math.random() * 15,
          power: 150 + Math.random() * 50
        });

        return newData;
      });

      // Update diagnostics
      setDiagnostics([
        { component: 'Motors', value: 95 + Math.random() * 5, fullMark: 100 },
        { component: 'Sensors', value: 90 + Math.random() * 10, fullMark: 100 },
        { component: 'Controllers', value: 88 + Math.random() * 12, fullMark: 100 },
        { component: 'Power System', value: 92 + Math.random() * 8, fullMark: 100 },
        { component: 'Communication', value: 96 + Math.random() * 4, fullMark: 100 },
        { component: 'Safety Systems', value: 98 + Math.random() * 2, fullMark: 100 }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const JointControl = ({ label, value, onChange, min = -180, max = 180 }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">{value}°</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        disabled={isMoving}
      />
    </div>
  );

  const StatusIndicator = ({ label, value, unit, status, icon: Icon }) => (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
      <div className={`p-2 rounded-full ${
        status === 'good' ? 'bg-green-100' : 
        status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
      }`}>
        <Icon className={`w-4 h-4 ${
          status === 'good' ? 'text-green-600' : 
          status === 'warning' ? 'text-yellow-600' : 'text-red-600'
        }`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{value}{unit}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Robotics Control</h2>
        <p className="text-gray-600 mt-2">Advanced robotic systems for automated maintenance and inspection</p>
      </div>

      {/* Robot Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusIndicator
          label="Connection"
          value={robotStatus.connected ? 'Connected' : 'Disconnected'}
          unit=""
          status={robotStatus.connected ? 'good' : 'error'}
          icon={Activity}
        />
        <StatusIndicator
          label="Battery Level"
          value={robotStatus.batteryLevel}
          unit="%"
          status={robotStatus.batteryLevel > 50 ? 'good' : robotStatus.batteryLevel > 20 ? 'warning' : 'error'}
          icon={Zap}
        />
        <StatusIndicator
          label="Temperature"
          value={robotStatus.temperature}
          unit="°C"
          status={robotStatus.temperature < 60 ? 'good' : robotStatus.temperature < 80 ? 'warning' : 'error'}
          icon={Activity}
        />
        <StatusIndicator
          label="Status"
          value={robotStatus.operational ? 'Operational' : 'Error'}
          unit=""
          status={robotStatus.operational ? 'good' : 'error'}
          icon={robotStatus.operational ? CheckCircle : AlertTriangle}
        />
      </div>

      {/* Main Control Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Robot Visualization */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bot className="w-5 h-5 mr-2 text-pink-600" />
            Robot Visualization
          </h3>
          
          <div className="h-96 bg-gray-50 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
              <Suspense fallback={null}>
                <RobotArm joints={joints} isMoving={isMoving} />
              </Suspense>
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
          
          <div className="mt-4 flex justify-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentTask === 'idle' ? 'bg-gray-100 text-gray-800' :
              'bg-pink-100 text-pink-800'
            }`}>
              {tasks[currentTask].name}
            </span>
          </div>
        </div>

        {/* Joint Controls */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Joint Controls
          </h3>
          
          <div className="space-y-4">
            <JointControl
              label="Base Rotation (J1)"
              value={joints.joint1}
              onChange={(value) => setJoints(prev => ({ ...prev, joint1: value }))}
            />
            <JointControl
              label="Shoulder (J2)"
              value={joints.joint2}
              onChange={(value) => setJoints(prev => ({ ...prev, joint2: value }))}
              min={-90}
              max={90}
            />
            <JointControl
              label="Elbow (J3)"
              value={joints.joint3}
              onChange={(value) => setJoints(prev => ({ ...prev, joint3: value }))}
              min={-120}
              max={120}
            />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Target Position</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600">X</label>
                  <input
                    type="number"
                    value={joints.targetX}
                    onChange={(e) => setJoints(prev => ({ ...prev, targetX: parseFloat(e.target.value) }))}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    step="0.1"
                    disabled={isMoving}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Y</label>
                  <input
                    type="number"
                    value={joints.targetY}
                    onChange={(e) => setJoints(prev => ({ ...prev, targetY: parseFloat(e.target.value) }))}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    step="0.1"
                    disabled={isMoving}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Z</label>
                  <input
                    type="number"
                    value={joints.targetZ}
                    onChange={(e) => setJoints(prev => ({ ...prev, targetZ: parseFloat(e.target.value) }))}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                    step="0.1"
                    disabled={isMoving}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Control */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-green-600" />
          Automated Tasks
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tasks).filter(([key]) => key !== 'idle').map(([key, task]) => (
            <button
              key={key}
              onClick={() => executeTask(key)}
              disabled={isMoving}
              className={`p-4 text-left border rounded-lg transition-colors ${
                isMoving
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900">{task.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Performance Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
              <Line type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={2} name="Speed %" />
              <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} name="Efficiency %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Diagnostics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={diagnostics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="component" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Health"
                dataKey="value"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RoboticsControl;

