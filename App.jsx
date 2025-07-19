import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Cpu, 
  Bot, 
  Zap, 
  Activity, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Menu,
  X
} from 'lucide-react';

// Import components
import Dashboard from './components/Dashboard';
import MLPredictor from './components/MLPredictor';
import QuantumComputing from './components/QuantumComputing';
import RoboticsControl from './components/RoboticsControl';
import AutomationHub from './components/AutomationHub';
import SystemMonitor from './components/SystemMonitor';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    ml: 'operational',
    quantum: 'operational',
    robotics: 'operational',
    automation: 'operational'
  });

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
    { id: 'ml-predictor', name: 'ML Predictor', icon: Brain, color: 'text-purple-600' },
    { id: 'quantum', name: 'Quantum Computing', icon: Cpu, color: 'text-cyan-600' },
    { id: 'robotics', name: 'Robotics Control', icon: Bot, color: 'text-pink-600' },
    { id: 'automation', name: 'Automation Hub', icon: Zap, color: 'text-yellow-600' },
    { id: 'monitor', name: 'System Monitor', icon: Activity, color: 'text-green-600' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard systemStatus={systemStatus} />;
      case 'ml-predictor':
        return <MLPredictor />;
      case 'quantum':
        return <QuantumComputing />;
      case 'robotics':
        return <RoboticsControl />;
      case 'automation':
        return <AutomationHub />;
      case 'monitor':
        return <SystemMonitor systemStatus={systemStatus} setSystemStatus={setSystemStatus} />;
      default:
        return <Dashboard systemStatus={systemStatus} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Machine Failure Predictor</h1>
                <p className="text-sm text-gray-500">AI-Powered Predictive Maintenance System</p>
              </div>
            </div>
          </div>
          
          {/* System Status Indicators */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.ml)}
              <span className="text-sm text-gray-600">ML</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.quantum)}
              <span className="text-sm text-gray-600">Quantum</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.robotics)}
              <span className="text-sm text-gray-600">Robotics</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.automation)}
              <span className="text-sm text-gray-600">Automation</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none border-r border-gray-200"
            >
              <nav className="mt-8 px-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            setActiveTab(tab.id);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                            activeTab === tab.id
                              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                          <span className="font-medium">{tab.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

