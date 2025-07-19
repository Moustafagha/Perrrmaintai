import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Zap,
  Brain,
  Bot
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = ({ systemStatus }) => {
  const [metrics, setMetrics] = useState({
    totalMachines: 156,
    healthyMachines: 142,
    warningMachines: 11,
    criticalMachines: 3,
    predictedFailures: 7,
    preventedDowntime: 24.5,
    costSavings: 125000,
    accuracy: 94.2
  });

  const [performanceData, setPerformanceData] = useState([]);
  const [failureTypeData, setFailureTypeData] = useState([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev];
        if (newData.length > 20) newData.shift();
        
        const now = new Date();
        newData.push({
          time: now.toLocaleTimeString(),
          efficiency: 85 + Math.random() * 15,
          temperature: 65 + Math.random() * 20,
          vibration: 0.1 + Math.random() * 0.3,
          pressure: 100 + Math.random() * 50
        });
        
        return newData;
      });
    }, 2000);

    // Initialize failure type data
    setFailureTypeData([
      { name: 'Mechanical', value: 35, color: '#ef4444' },
      { name: 'Electrical', value: 25, color: '#f59e0b' },
      { name: 'Thermal', value: 20, color: '#10b981' },
      { name: 'Software', value: 15, color: '#3b82f6' },
      { name: 'Other', value: 5, color: '#8b5cf6' }
    ]);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color, suffix = '' }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change && (
            <div className={`flex items-center mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span className="text-sm font-medium">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">System Dashboard</h2>
        <p className="text-gray-600 mt-2">Real-time monitoring and predictive analytics overview</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Machines"
          value={metrics.totalMachines}
          change={2.1}
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard
          title="Healthy Machines"
          value={metrics.healthyMachines}
          change={1.8}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Predicted Failures"
          value={metrics.predictedFailures}
          change={-12.5}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="ML Accuracy"
          value={metrics.accuracy}
          change={3.2}
          icon={Brain}
          color="bg-purple-500"
          suffix="%"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Failure Types Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Failure Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={failureTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {failureTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">ML Engine</p>
              <p className={`text-sm ${systemStatus.ml === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.ml === 'operational' ? 'Operational' : 'Error'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-cyan-50 rounded-lg">
            <Zap className="w-8 h-8 text-cyan-600" />
            <div>
              <p className="font-medium text-cyan-900">Quantum Core</p>
              <p className={`text-sm ${systemStatus.quantum === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.quantum === 'operational' ? 'Operational' : 'Error'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-lg">
            <Bot className="w-8 h-8 text-pink-600" />
            <div>
              <p className="font-medium text-pink-900">Robotics</p>
              <p className={`text-sm ${systemStatus.robotics === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.robotics === 'operational' ? 'Operational' : 'Error'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
            <Activity className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Automation</p>
              <p className={`text-sm ${systemStatus.automation === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.automation === 'operational' ? 'Operational' : 'Error'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-red-900">High vibration detected on Machine #47</p>
              <p className="text-sm text-red-700">Predicted failure in 2.3 days</p>
            </div>
            <span className="text-xs text-red-600">2 min ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900">Temperature anomaly on Machine #23</p>
              <p className="text-sm text-yellow-700">Requires maintenance check</p>
            </div>
            <span className="text-xs text-yellow-600">15 min ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-green-900">Preventive maintenance completed on Machine #12</p>
              <p className="text-sm text-green-700">System performance restored</p>
            </div>
            <span className="text-xs text-green-600">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

