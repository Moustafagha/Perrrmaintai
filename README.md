# Machine Failure Predictor

A comprehensive AI-powered machine failure prediction system with quantum computing, robotics, and automation features built with React and Vite.

## 🚀 Features

### 🧠 AI/ML Prediction Engine
- **TensorFlow.js Integration**: Real-time machine learning model training and inference
- **Predictive Analytics**: Advanced algorithms for failure prediction
- **Interactive Model Training**: Visual model training with real-time metrics
- **Feature Engineering**: Customizable input parameters for prediction

### ⚛️ Quantum Computing
- **Quantum Algorithm Simulation**: Implementation of Grover's, Shor's, QAOA, and VQE algorithms
- **Quantum State Visualization**: Real-time Bloch sphere representation
- **Quantum Circuit Builder**: Interactive quantum circuit construction
- **Performance Optimization**: Quantum advantage calculations

### 🤖 Robotics Control
- **3D Robot Visualization**: Interactive 3D robot arm simulation using Three.js
- **Joint Control**: Real-time robot joint manipulation
- **Automated Tasks**: Pre-programmed inspection, maintenance, and repair routines
- **Performance Monitoring**: Real-time robotics system diagnostics

### ⚡ Automation Hub
- **Workflow Management**: Create and manage automated maintenance workflows
- **Trigger-based Actions**: Conditional automation based on sensor data
- **Execution Monitoring**: Real-time workflow execution tracking
- **Success Analytics**: Performance metrics and success rate monitoring

### 📊 System Monitoring
- **Real-time Metrics**: CPU, memory, disk, and network monitoring
- **Service Management**: Start/stop system services
- **Alert System**: Automated alert generation and resolution
- **Performance History**: Historical performance data visualization

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS 4, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Machine Learning**: TensorFlow.js
- **Charts**: Recharts, Chart.js
- **Icons**: Lucide React
- **Build Tool**: Vite with ESLint

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd machine-failure-predictor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your hosting provider

## 📱 Usage

### Dashboard
- View system overview and key metrics
- Monitor real-time performance data
- Check system status indicators
- Review recent alerts and notifications

### ML Predictor
- Train machine learning models with custom parameters
- Input sensor data for failure prediction
- Visualize model performance and accuracy
- Export trained models for production use

### Quantum Computing
- Select and execute quantum algorithms
- Visualize quantum states and circuits
- Monitor quantum system performance
- Compare classical vs quantum execution times

### Robotics Control
- Control robot joints in real-time
- Execute automated maintenance tasks
- Monitor robot performance metrics
- View 3D robot visualization

### Automation Hub
- Create custom automation workflows
- Set trigger conditions and actions
- Monitor workflow execution history
- Analyze automation success rates

### System Monitor
- Monitor system resource usage
- Manage system services
- View and resolve system alerts
- Track performance history

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_QUANTUM=true
VITE_ENABLE_ROBOTICS=true
VITE_DEBUG_MODE=false
```

### Customization
- Modify `tailwind.config.js` for custom styling
- Update `src/utils/constants.js` for application constants
- Configure ML models in `src/utils/mlConfig.js`

## 🧪 Testing

```bash
# Run linting
npm run lint

# Run tests (if configured)
npm test

# Build and test production bundle
npm run build && npm run preview
```

## 📊 Performance

- **Bundle Size**: Optimized for production deployment
- **Loading Time**: Fast initial load with code splitting
- **Real-time Updates**: Efficient WebSocket connections
- **Memory Usage**: Optimized for long-running sessions

## 🔒 Security

- Input validation and sanitization
- Secure API communication
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

## 🔄 Version History

- **v1.0.0** - Initial release with full feature set
  - AI/ML prediction engine
  - Quantum computing simulation
  - Robotics control system
  - Automation workflows
  - System monitoring

## 🙏 Acknowledgments

- TensorFlow.js team for ML capabilities
- Three.js community for 3D graphics
- React team for the excellent framework
- Tailwind CSS for styling system
- All contributors and testers

---

Built with ❤️ for predictive maintenance and industrial automation.

