# 🌍 Carbon Pulse

> Real-time carbon emission tracking for digital communities

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://co-2-9w39s9j9a-itsvicky25s-projects.vercel.app/)
[![Demo Video](https://img.shields.io/badge/demo-video-red?logo=youtube)](https://www.youtube.com/watch?v=c8UEOE1E4zc)

**Carbon Pulse** transforms invisible digital carbon emissions into actionable insights, empowering Discord communities to understand and reduce their environmental impact through real-time monitoring and data-driven recommendations.

## 🎯 Problem Statement

Digital communication generates significant carbon emissions, yet these impacts remain invisible to users. Discord communities process millions of messages daily without understanding their environmental footprint. **Carbon Pulse bridges this awareness gap.**

## ✨ Key Features

### 📊 Real-Time Monitoring
- **Live Dashboard**: Track carbon emissions as they happen with 10-second interval updates
- **Beautiful Visualizations**: Interactive charts showing emission trends and activity patterns
- **Persistent Data**: Historical tracking with localStorage for continuous monitoring

### 🤖 Intelligent Tracking
- **Discord Integration**: Automated message tracking across channels via dedicated bots
- **Accurate Calculations**: Powered by CO2.js library using industry-standard SWD and 1byte models
- **Batch Processing**: Efficient 30-second batch intervals for optimal performance

### 💡 Actionable Insights
- **Carbon Reduction Recommendations**: AI-powered suggestions for reducing digital footprint
- **Impact Tracking**: Monitor the effectiveness of implemented optimizations
- **Global Context**: Access to climate research and actionable sustainability tips

### 📱 Modern UX
- **Fully Responsive**: Seamless experience across all devices (mobile, tablet, desktop)
- **Minimal Design**: Clean, professional interface focused on data clarity
- **Real-Time Updates**: Live data streaming without page refreshes

## 🏗️ Architecture

<img width="2248" height="778" alt="image" src="https://github.com/user-attachments/assets/8906683f-9293-4c1e-8931-0abc7ec79572" />


## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Java Spring Boot 3.5** - REST API
- **Maven** - Build automation
- **H2 Database** - In-memory storage
- **Spring Retry** - Resilience patterns

### Microservices
- **Node.js + Express** - CO2 calculation service
- **@tgwf/co2** - Carbon emission calculations
- **Discord.js** - Bot implementation

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend & microservice hosting
- **GitHub** - Version control & CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Java 17+
- Maven 3.8+
- Discord Bot Token

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Rawdyrathaur/CO2.git
cd carbon-pulse
```

2. **Setup CO2 Microservice**
```bash
npm install
node src/server.js
```

3. **Setup Backend**
```bash
cd octopus-backend/backend/octopus-backend
mvn clean install
mvn spring-boot:run
```

4. **Setup Frontend**
```bash
cd carbon-pulse-frontend
npm install
npm run dev
```

5. **Setup Discord Bot**
```bash
cd discord-listener-bot
cp .env.example .env
# Add your DISCORD_BOT_TOKEN
npm install
npm start
```

### Environment Variables

**Frontend** (`.env`):
```env
VITE_BACKEND_URL=http://localhost:8080
```

**Backend** (`application.properties`):
```properties
CO2_MICROSERVICE_URL=http://localhost:3002/api/v1
PORT=8080
```

**Discord Bot** (`.env`):
```env
DISCORD_BOT_TOKEN=your_token_here
BACKEND_URL=http://localhost:8080
```

## 📊 How It Works

1. **Data Collection**: Discord bots monitor messages across channels
2. **Batching**: Messages batched every 30 seconds for efficiency
3. **Calculation**: CO2 microservice computes emissions using CO2.js
4. **Aggregation**: Backend aggregates data and exposes REST API
5. **Visualization**: React dashboard displays real-time insights
6. **Persistence**: Data stored locally for continuous tracking

## 🌟 Carbon Calculation Methodology

Carbon Pulse uses the **Sustainable Web Design (SWD)** model from the Green Web Foundation:

- **Data Transfer**: Calculates energy per byte transmitted
- **Device Energy**: Accounts for end-user device consumption
- **Network Energy**: Includes network infrastructure impact
- **Data Center Energy**: Server processing overhead

Formula: `CO2 = (data_transferred × energy_per_byte × carbon_intensity)`


## 🏆 Hackathon Criteria Alignment

### Innovation
- First-of-its-kind real-time Discord carbon tracker
- Novel integration of digital activity monitoring with environmental impact

### Technical Complexity
- Microservices architecture with 4 distinct services
- Real-time data pipeline with <10s latency
- Resilient design with retry logic and circuit breakers

### Impact
- Raises awareness about digital carbon footprint
- Provides actionable reduction strategies
- Scalable to any Discord community

### User Experience
- Intuitive, minimal interface
- Mobile-first responsive design
- Zero configuration for end users

## 🔗 Links

- **Live Demo**: https://co-2-9w39s9j9a-itsvicky25s-projects.vercel.app/
- **GitHub**: https://github.com/Rawdyrathaur/CO2
- **Discord Server**: [Join our community](https://discord.com/channels/1416036797200207975/1416036798609756254)

## 📈 Future Roadmap

- [ ] Multi-platform support (Slack, Teams, etc.)
- [ ] ML-based emission predictions
- [ ] Carbon offset marketplace integration
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

## 👥 Team

Built with 💚 for Octopus Hack

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CO2.js](https://www.thegreenwebfoundation.org/co2-js/) by Green Web Foundation
- [Octopus Energy](https://octopusenergy.group/) for hosting the hackathon
- Discord.js community
- Open source contributors

---

<p align="center">
  <strong>Making digital carbon emissions visible, measurable, and actionable.</strong>
</p>

<p align="center">
  Built for <a href="https://octopushack.devpost.com/">Octopus Hack 2024</a>
</p>
