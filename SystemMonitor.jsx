import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Thermometer,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Monitor,
  Server,
  Database,
  Network
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const SystemMonitor = ({ systemStatus, setSystemStatus }) => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 45, temperature: 62, cores: 8 },
    memory: { used: 12.4, total: 32, percentage: 38.8 },
    disk: { used: 245, total: 500, percentage: 49 },
    network: { upload: 125, download: 890, latency: 12 },
    power: { consumption: 450, efficiency: 92.5 }
  });

  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      component: 'ML Engine',
      message: 'High memory usage detected',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      component: 'Quantum Core',
      message: 'Calibration completed successfully',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      resolved: true
    },
    {
      id: 3,
      type: 'error',
      component: 'Network',
      message: 'Connection timeout to sensor array',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      resolved: false
    }
  ]);

  const [services, setServices] = useState([
    { name: 'ML Engine', status: 'running', uptime: '15d 4h 23m', cpu: 23, memory: 2.1 },
    { name: 'Quantum Simulator', status: 'running', uptime: '12d 18h 45m', cpu: 15, memory: 1.8 },
    { name: 'Robotics Controller', status: 'running', uptime: '8d 12h 12m', cpu: 8, memory: 0.9 },
    { name: 'Automation Engine', status: 'running', uptime: '20d 6h 33m', cpu: 12, memory: 1.2 },
    { name: 'Data Collector', status: 'stopped', uptime: '0d 0h 0m', cpu: 0, memory: 0 },
    { name: 'Alert Manager', status: 'running', uptime: '25d 14h 18m', cpu: 3, memory: 0.4 }
  ]);

  // Simulate real-time system metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.max(10, Math.min(90, prev.cpu.usage + (Math.random() - 0.5) * 10)),
          temperature: Math.max(40, Math.min(80, prev.cpu.temperature + (Math.random() - 0.5) * 5))
        },
        memory: {
          ...prev.memory,
          used: Math.max(8, Math.min(28, prev.memory.used + (Math.random() - 0.5) * 2)),
          percentage: Math.max(25, Math.min(87.5, prev.memory.percentage + (Math.random() - 0.5) * 5))
        },
        disk: {
          ...prev.disk,
          percentage: Math.max(30, Math.min(80, prev.disk.percentage + (Math.random() - 0.5) * 2))
        },
        network: {
          ...prev.network,
          upload: Math.max(50, Math.min(500, prev.network.upload + (Math.random() - 0.5) * 50)),
          download: Math.max(200, Math.min(2000, prev.network.download + (Math.random() - 0.5) * 200)),
          latency: Math.max(5, Math.min(50, prev.network.latency + (Math.random() - 0.5) * 5))
        },
        power: {
          ...prev.power,
          consumption: Math.max(300, Math.min(600, prev.power.consumption + (Math.random() - 0.5) * 30)),
          efficiency: Math.max(85, Math.min(98, prev.power.efficiency + (Math.random() - 0.5) * 2))
        }
      }));

      // Update performance history
      setPerformanceHistory(prev => {
        const newData = [...prev];
        if (newData.length > 30) newData.shift();
        
        newData.push({
          time: new Date().toLocaleTimeString(),
          cpu: systemMetrics.cpu.usage,
          memory: systemMetrics.memory.percentage,
          network: systemMetrics.network.latency,
          temperature: systemMetrics.cpu.temperature
        });
        
        return newData;
      });

      // Update system status based on metrics
      setSystemStatus(prev => ({
        ...prev,
        ml: systemMetrics.cpu.usage > 80 ? 'warning' : 'operational',
        quantum: systemMetrics.memory.percentage > 85 ? 'warning' : 'operational',
        robotics: systemMetrics.cpu.temperature > 75 ? 'warning' : 'operational',
        automation: systemMetrics.network.latency > 30 ? 'warning' : 'operational'
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [systemMetrics, setSystemStatus]);

  const toggleService = (serviceName) => {
    setServices(services.map(service => 
      service.name === serviceName 
        ? { 
            ...service, 
            status: service.status === 'running' ? 'stopped' : 'running',
            uptime: service.status === 'stopped' ? '0d 0h 0m' : service.uptime
          }
        : service
    ));
  };

  const resolveAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'stopped':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
      case 'running':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
      case 'stopped':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const MetricCard = ({ title, value, unit, percentage, icon: Icon, color, trend }) => (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-sm text-gray-600">{unit}</span>
        </div>
        
        {percentage !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage > 80 ? 'bg-red-500' : 
                percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">System Monitor</h2>
          <p className="text-gray-600 mt-2">Real-time system health and performance monitoring</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <MetricCard
          title="CPU Usage"
          value={systemMetrics.cpu.usage.toFixed(1)}
          unit="%"
          percentage={systemMetrics.cpu.usage}
          icon={Cpu}
          color="bg-blue-500"
          trend={2.3}
        />
        
        <MetricCard
          title="Memory"
          value={systemMetrics.memory.used.toFixed(1)}
          unit={`GB / ${systemMetrics.memory.total}GB`}
          percentage={systemMetrics.memory.percentage}
          icon={HardDrive}
          color="bg-purple-500"
          trend={-1.2}
        />
        
        <MetricCard
          title="Disk Usage"
          value={systemMetrics.disk.used}
          unit={`GB / ${systemMetrics.disk.total}GB`}
          percentage={systemMetrics.disk.percentage}
          icon={Database}
          color="bg-green-500"
        />
        
        <MetricCard
          title="Network"
          value={systemMetrics.network.latency.toFixed(0)}
          unit="ms latency"
          icon={Network}
          color="bg-cyan-500"
        />
        
        <MetricCard
          title="Temperature"
          value={systemMetrics.cpu.temperature.toFixed(0)}
          unit="°C"
          percentage={(systemMetrics.cpu.temperature / 100) * 100}
          icon={Thermometer}
          color="bg-red-500"
          trend={1.8}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="network" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Latency (ms)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Services Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-600" />
          System Services
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Uptime</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">CPU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Memory</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{service.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="capitalize">{service.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{service.uptime}</td>
                  <td className="py-3 px-4 text-gray-600">{service.cpu}%</td>
                  <td className="py-3 px-4 text-gray-600">{service.memory} GB</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleService(service.name)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        service.status === 'running'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {service.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
          System Alerts
        </h3>
        
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                alert.resolved 
                  ? 'bg-gray-50 border-gray-200' 
                  : alert.type === 'error' 
                    ? 'bg-red-50 border-red-200' 
                    : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded-full ${
                  alert.resolved 
                    ? 'bg-gray-200' 
                    : alert.type === 'error' 
                      ? 'bg-red-200' 
                      : alert.type === 'warning'
                        ? 'bg-yellow-200'
                        : 'bg-blue-200'
                }`}>
                  {alert.resolved ? (
                    <CheckCircle className="w-4 h-4 text-gray-600" />
                  ) : alert.type === 'error' ? (
                    <XCircle className="w-4 h-4 text-red-600" />
                  ) : alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${alert.resolved ? 'text-gray-600' : 'text-gray-900'}`}>
                    {alert.component}: {alert.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {!alert.resolved && (
                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-sm font-medium transition-colors"
                >
                  Resolve
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;

