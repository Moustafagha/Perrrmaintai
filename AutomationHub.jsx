import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Play, 
  Pause, 
  Square, 
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Calendar,
  Bell,
  Activity,
  Workflow,
  Timer
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AutomationHub = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Predictive Maintenance Alert',
      description: 'Automatically trigger maintenance when failure probability exceeds threshold',
      status: 'active',
      trigger: 'ML Prediction > 70%',
      actions: ['Send Alert', 'Create Work Order', 'Schedule Maintenance'],
      lastRun: '2024-01-20 14:30',
      successRate: 94.5,
      executionCount: 127
    },
    {
      id: 2,
      name: 'Temperature Monitoring',
      description: 'Monitor machine temperature and take corrective actions',
      status: 'active',
      trigger: 'Temperature > 85°C',
      actions: ['Reduce Load', 'Increase Cooling', 'Alert Operator'],
      lastRun: '2024-01-20 16:15',
      successRate: 98.2,
      executionCount: 89
    },
    {
      id: 3,
      name: 'Vibration Analysis',
      description: 'Analyze vibration patterns and predict bearing failures',
      status: 'paused',
      trigger: 'Vibration > 0.5 mm/s',
      actions: ['Run Analysis', 'Generate Report', 'Schedule Inspection'],
      lastRun: '2024-01-19 09:45',
      successRate: 87.3,
      executionCount: 45
    },
    {
      id: 4,
      name: 'Energy Optimization',
      description: 'Optimize energy consumption based on production schedule',
      status: 'active',
      trigger: 'Schedule: Daily 2:00 AM',
      actions: ['Analyze Usage', 'Adjust Settings', 'Generate Report'],
      lastRun: '2024-01-20 02:00',
      successRate: 91.7,
      executionCount: 203
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [automationMetrics, setAutomationMetrics] = useState([]);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: '',
    actions: ['']
  });

  // Generate execution history data
  useEffect(() => {
    const history = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      history.unshift({
        time: time.toLocaleTimeString(),
        executions: Math.floor(Math.random() * 20) + 5,
        success: Math.floor(Math.random() * 18) + 4,
        failures: Math.floor(Math.random() * 3)
      });
    }
    
    setExecutionHistory(history);

    // Generate automation metrics
    setAutomationMetrics([
      { name: 'Successful', value: 1247, color: '#10b981' },
      { name: 'Failed', value: 83, color: '#ef4444' },
      { name: 'Pending', value: 34, color: '#f59e0b' },
      { name: 'Cancelled', value: 12, color: '#6b7280' }
    ]);
  }, []);

  const toggleWorkflowStatus = (id) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const deleteWorkflow = (id) => {
    setWorkflows(workflows.filter(workflow => workflow.id !== id));
  };

  const createWorkflow = () => {
    const workflow = {
      id: Date.now(),
      ...newWorkflow,
      status: 'active',
      lastRun: 'Never',
      successRate: 0,
      executionCount: 0
    };
    
    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: '', description: '', trigger: '', actions: [''] });
    setShowCreateModal(false);
  };

  const addAction = () => {
    setNewWorkflow({
      ...newWorkflow,
      actions: [...newWorkflow.actions, '']
    });
  };

  const updateAction = (index, value) => {
    const updatedActions = [...newWorkflow.actions];
    updatedActions[index] = value;
    setNewWorkflow({ ...newWorkflow, actions: updatedActions });
  };

  const removeAction = (index) => {
    setNewWorkflow({
      ...newWorkflow,
      actions: newWorkflow.actions.filter((_, i) => i !== index)
    });
  };

  const WorkflowCard = ({ workflow }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              workflow.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {workflow.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{workflow.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">Trigger: {workflow.trigger}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Last run: {workflow.lastRun}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => toggleWorkflowStatus(workflow.id)}
            className={`p-2 rounded-lg transition-colors ${
              workflow.status === 'active'
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            }`}
          >
            {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setSelectedWorkflow(workflow)}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteWorkflow(workflow.id)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600">Success Rate</p>
          <p className="text-lg font-bold text-green-600">{workflow.successRate}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Executions</p>
          <p className="text-lg font-bold text-blue-600">{workflow.executionCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Actions</p>
          <p className="text-lg font-bold text-purple-600">{workflow.actions.length}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Automation Hub</h2>
          <p className="text-gray-600 mt-2">Intelligent workflow automation for predictive maintenance</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.filter(w => w.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">
                {workflows.reduce((sum, w) => sum + w.executionCount, 0)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500">
              <Workflow className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Time Saved</p>
              <p className="text-2xl font-bold text-gray-900">47.2h</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500">
              <Timer className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Execution Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution History (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={executionHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="executions" stroke="#3b82f6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Success" />
              <Line type="monotone" dataKey="failures" stroke="#ef4444" strokeWidth={2} name="Failures" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={automationMetrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {automationMetrics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workflows List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Automation Workflows</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {workflows.map(workflow => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Create Workflow Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Workflow</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name</label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter workflow name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows="3"
                    placeholder="Describe what this workflow does"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trigger Condition</label>
                  <input
                    type="text"
                    value={newWorkflow.trigger}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Temperature > 80°C"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                  {newWorkflow.actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={action}
                        onChange={(e) => updateAction(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter action"
                      />
                      {newWorkflow.actions.length > 1 && (
                        <button
                          onClick={() => removeAction(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAction}
                    className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Action</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createWorkflow}
                  disabled={!newWorkflow.name || !newWorkflow.trigger}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Workflow
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutomationHub;

