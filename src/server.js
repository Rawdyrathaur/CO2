/**
 * @file CO2 Calculation Microservice API.
 * Lightweight Express server that exposes the calculation engine.
 */

const express = require('express');
const cors = require('cors'); // For frontend access
const { calculateDiscordCarbon, calculateVideoCallCarbon } = require('./calculator');

console.log('DEBUG: loaded src/server.js');

const app = express();
const PORT = process.env.PORT || 3002;

// ======================
// 1. MIDDLEWARE
// ======================
app.use(cors()); // Allow your React frontend/Java backend to call this
app.use(express.json()); // Parse JSON request bodies

// Simple request logger for debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ======================
// 2. API ENDPOINTS
// ======================
/**
 * POST /api/v1/calculate/discord
 * Calculate carbon for Discord messages.
 * Request body: { "count": 1500 }
 */
app.post('/api/v1/calculate/discord', (req, res) => {
  try {
    const { count } = req.body;
    
    // Validate required parameter
    if (count === undefined || count === null) {
      return res.status(400).json({ 
        error: 'Missing required parameter: count' 
      });
    }

    const result = calculateDiscordCarbon(Number(count));
    res.json(result);
    
  } catch (error) {
    // Use our calculator's error handling
    res.status(400).json({ 
      error: error.message,
      type: 'VALIDATION_ERROR'
    });
  }
});

/**
 * POST /api/v1/calculate/video-call
 * Calculate carbon for video calls.
 * Request body: { "durationMinutes": 60, "participantCount": 10 }
 */
app.post('/api/v1/calculate/video-call', (req, res) => {
  try {
    const { durationMinutes, participantCount } = req.body;
    
    // Validate required parameters
    if (durationMinutes === undefined || participantCount === undefined) {
      return res.status(400).json({ 
        error: 'Missing required parameters: durationMinutes, participantCount' 
      });
    }

    const result = calculateVideoCallCarbon(
      Number(durationMinutes), 
      Number(participantCount)
    );
    res.json(result);
    
  } catch (error) {
    res.status(400).json({ 
      error: error.message,
      type: 'VALIDATION_ERROR'
    });
  }
});

/**
 * GET /api/v1/health
 * Simple health check endpoint.
 */
app.get('/api/v1/health', (_req, res) => {
  res.json({ 
    status: 'operational',
    service: 'co2-calculation-microservice',
    timestamp: new Date().toISOString()
  });
});

// ======================
// 3. ERROR HANDLING
// ======================
// Catch-all for 404s — register as middleware without a path string
app.use((req, res) => {
  res.status(404).json({ 
    error: `Route not found: ${req.originalUrl}`,
    availableEndpoints: [
      'POST /api/v1/calculate/discord',
      'POST /api/v1/calculate/video-call',
      'GET /api/v1/health'
    ]
  });
});

// Global error handler
app.use((error, _req, res, _next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    requestId: Date.now() // Simple request ID for debugging
  });
});

// ======================
// 4. SERVER STARTUP
// ======================
app.listen(PORT, () => {
  console.log(`✅ CO2 Microservice running on http://localhost:${PORT}`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/v1/calculate/discord`);
  console.log(`   POST http://localhost:${PORT}/api/v1/calculate/video-call`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/health`);
});

module.exports = app; // For testing