import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const MLPredictor = () => {
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: 0,
    loss: 0,
    epochs: 0,
    trainingTime: 0
  });
  const [inputFeatures, setInputFeatures] = useState({
    temperature: 75,
    vibration: 0.2,
    pressure: 120,
    speed: 1800,
    load: 85
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const canvasRef = useRef(null);

  // Generate synthetic training data
  const generateTrainingData = () => {
    const data = [];
    for (let i = 0; i < 1000; i++) {
      const temperature = 60 + Math.random() * 40;
      const vibration = Math.random() * 0.5;
      const pressure = 80 + Math.random() * 60;
      const speed = 1500 + Math.random() * 1000;
      const load = 50 + Math.random() * 50;
      
      // Simple failure logic based on thresholds
      const failure = (
        temperature > 90 || 
        vibration > 0.35 || 
        pressure > 140 || 
        speed > 2200 || 
        load > 90
      ) ? 1 : 0;
      
      data.push({
        features: [temperature, vibration, pressure, speed, load],
        label: failure,
        timestamp: new Date(Date.now() - (1000 - i) * 60000).toISOString()
      });
    }
    return data;
  };

  // Create and compile the neural network model
  const createModel = () => {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [5], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    return model;
  };

  // Train the model
  const trainModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    try {
      const data = generateTrainingData();
      setTrainingData(data);
      
      // Prepare training data
      const features = tf.tensor2d(data.map(d => d.features));
      const labels = tf.tensor2d(data.map(d => [d.label]));
      
      // Create and train model
      const newModel = createModel();
      
      const startTime = Date.now();
      
      await newModel.fit(features, labels, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            setTrainingProgress(((epoch + 1) / 50) * 100);
            setModelMetrics(prev => ({
              ...prev,
              accuracy: logs.val_acc * 100,
              loss: logs.val_loss,
              epochs: epoch + 1,
              trainingTime: (Date.now() - startTime) / 1000
            }));
          }
        }
      });
      
      setModel(newModel);
      
      // Generate some predictions for visualization
      const testData = generateTrainingData().slice(0, 50);
      const testFeatures = tf.tensor2d(testData.map(d => d.features));
      const predictions = await newModel.predict(testFeatures).data();
      
      const predictionResults = testData.map((d, i) => ({
        actual: d.label,
        predicted: predictions[i],
        timestamp: d.timestamp,
        features: d.features
      }));
      
      setPredictions(predictionResults);
      
      // Cleanup tensors
      features.dispose();
      labels.dispose();
      testFeatures.dispose();
      
    } catch (error) {
      console.error('Training error:', error);
    } finally {
      setIsTraining(false);
    }
  };

  // Make a single prediction
  const makePrediction = async () => {
    if (!model) return;
    
    const features = [
      inputFeatures.temperature,
      inputFeatures.vibration,
      inputFeatures.pressure,
      inputFeatures.speed,
      inputFeatures.load
    ];
    
    const input = tf.tensor2d([features]);
    const prediction = await model.predict(input).data();
    
    setPredictionResult({
      probability: prediction[0],
      risk: prediction[0] > 0.5 ? 'High' : prediction[0] > 0.3 ? 'Medium' : 'Low',
      confidence: Math.abs(prediction[0] - 0.5) * 2,
      features: features
    });
    
    input.dispose();
  };

  useEffect(() => {
    // Initialize TensorFlow.js
    tf.ready().then(() => {
      console.log('TensorFlow.js is ready!');
    });
  }, []);

  const FeatureInput = ({ label, value, onChange, min, max, step, unit }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-600 w-20">
          {value}{unit}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">ML Failure Predictor</h2>
        <p className="text-gray-600 mt-2">Train and deploy machine learning models for predictive maintenance</p>
      </div>

      {/* Model Training Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-600" />
            Model Training
          </h3>
          
          <div className="space-y-4">
            <button
              onClick={trainModel}
              disabled={isTraining}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                isTraining
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isTraining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Training...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Training</span>
                </>
              )}
            </button>
            
            {isTraining && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{trainingProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {model && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Accuracy</p>
                  <p className="text-lg font-bold text-green-800">{modelMetrics.accuracy.toFixed(1)}%</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Loss</p>
                  <p className="text-lg font-bold text-blue-800">{modelMetrics.loss.toFixed(4)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Input Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            Input Features
          </h3>
          
          <div className="space-y-4">
            <FeatureInput
              label="Temperature"
              value={inputFeatures.temperature}
              onChange={(value) => setInputFeatures(prev => ({ ...prev, temperature: value }))}
              min={40}
              max={120}
              step={1}
              unit="°C"
            />
            
            <FeatureInput
              label="Vibration"
              value={inputFeatures.vibration}
              onChange={(value) => setInputFeatures(prev => ({ ...prev, vibration: value }))}
              min={0}
              max={1}
              step={0.01}
              unit=" mm/s"
            />
            
            <FeatureInput
              label="Pressure"
              value={inputFeatures.pressure}
              onChange={(value) => setInputFeatures(prev => ({ ...prev, pressure: value }))}
              min={50}
              max={200}
              step={1}
              unit=" PSI"
            />
            
            <FeatureInput
              label="Speed"
              value={inputFeatures.speed}
              onChange={(value) => setInputFeatures(prev => ({ ...prev, speed: value }))}
              min={1000}
              max={3000}
              step={10}
              unit=" RPM"
            />
            
            <FeatureInput
              label="Load"
              value={inputFeatures.load}
              onChange={(value) => setInputFeatures(prev => ({ ...prev, load: value }))}
              min={0}
              max={100}
              step={1}
              unit="%"
            />
            
            <button
              onClick={makePrediction}
              disabled={!model}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                !model
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Predict Failure</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prediction Result */}
      {predictionResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Result</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-4 rounded-lg ${
              predictionResult.risk === 'High' ? 'bg-red-50 border border-red-200' :
              predictionResult.risk === 'Medium' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                predictionResult.risk === 'High' ? 'bg-red-100' :
                predictionResult.risk === 'Medium' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                {predictionResult.risk === 'High' ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : predictionResult.risk === 'Medium' ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">Risk Level</p>
              <p className={`text-lg font-bold ${
                predictionResult.risk === 'High' ? 'text-red-800' :
                predictionResult.risk === 'Medium' ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                {predictionResult.risk}
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">Failure Probability</p>
              <p className="text-2xl font-bold text-blue-800">
                {(predictionResult.probability * 100).toFixed(1)}%
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-600">Confidence</p>
              <p className="text-2xl font-bold text-purple-800">
                {(predictionResult.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Predictions Visualization */}
      {predictions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Predictions vs Actual</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="actual" domain={[0, 1]} />
              <YAxis dataKey="predicted" domain={[0, 1]} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'predicted' ? `${(value * 100).toFixed(1)}%` : value,
                  name === 'predicted' ? 'Predicted' : 'Actual'
                ]}
              />
              <Scatter dataKey="predicted" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MLPredictor;

