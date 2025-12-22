/**
 * @file Professional CO₂ Calculation Engine.
 * Core, credible calculation logic for digital carbon footprint.
 * Uses the industry-standard @tgwf/co2 library with the Sustainable Web Design model.
 */

const { co2 } = require('@tgwf/co2');

// ======================
// 1. CONFIGURATION CONSTANTS
// ======================
// Centralize all "magic numbers" for easy maintenance and transparency.
const CONFIG = {
  // Data Transfer Estimates (Conservative)
  BYTES_PER_DISCORD_MESSAGE: 2 * 1024,        // 2 KB
  BYTES_PER_ZOOM_MINUTE_PER_USER: 3 * 1024 * 1024, // 3 MB

  // Physical Equivalents (Sourced from EPA, IEA)
  KG_CO2_PER_CAR_MILE: 0.4, // Avg. gasoline car emits ~0.4 kg CO₂ per mile
  TREE_DAYS_PER_KG_CO2: 0.5, // A mature tree absorbs ~0.5 kg CO₂ per day

  // CO2.js Model Configuration
  CO2_MODEL: 'swd',
  GREEN_HOSTING: true // Applies a renewable energy discount factor
};

// ======================
// 2. CORE CALCULATION ENGINE
// ======================
class CarbonCalculator {
  constructor() {
    // Initialize the official, peer-reviewed model.
    this.emissionsModel = new co2({ model: CONFIG.CO2_MODEL });
  }

  /**
   * Calculates the carbon footprint of Discord activity.
   * @param {number} messageCount - Number of text messages.
   * @returns {CalculationResult} Structured carbon impact data.
   * @throws {TypeError} If input is not a positive number.
   */
  calculateForDiscord(messageCount) {
    this._validatePositiveNumber(messageCount, 'messageCount');

    const dataBytes = this._estimateDiscordDataTransfer(messageCount);
    const impact = this._calculateImpactFromBytes(dataBytes);

    return this._formatResult({
      activityType: 'discord_message',
      primaryMetric: { count: messageCount },
      impact: impact
    });
  }

  /**
   * Calculates the carbon footprint of a Zoom/Video call.
   * @param {number} durationMinutes - Length of the call.
   * @param {number} participantCount - Number of attendees.
   * @returns {CalculationResult} Structured carbon impact data.
   * @throws {TypeError} If inputs are not positive numbers.
   */
  calculateForVideoCall(durationMinutes, participantCount) {
    this._validatePositiveNumber(durationMinutes, 'durationMinutes');
    this._validatePositiveNumber(participantCount, 'participantCount');

    const dataBytes = this._estimateVideoCallDataTransfer(durationMinutes, participantCount);
    const impact = this._calculateImpactFromBytes(dataBytes);

    return this._formatResult({
      activityType: 'video_call',
      primaryMetric: { durationMinutes, participantCount },
      impact: impact
    });
  }

  // ======================
  // 3. PRIVATE HELPER METHODS
  // ======================
  /**
   * @private
   * Estimates total data transferred for Discord messages.
   */
  _estimateDiscordDataTransfer(messageCount) {
    return messageCount * CONFIG.BYTES_PER_DISCORD_MESSAGE;
  }

  /**
   * @private
   * Estimates total data transferred for a video call.
   */
  _estimateVideoCallDataTransfer(durationMinutes, participantCount) {
    return durationMinutes * participantCount * CONFIG.BYTES_PER_ZOOM_MINUTE_PER_USER;
  }

  /**
   * @private
   * Core call to the CO2.js library. The single source of truth for emissions.
   */
  _calculateImpactFromBytes(dataBytes) {
    const gramsCO2 = this.emissionsModel.perByte(dataBytes, CONFIG.GREEN_HOSTING);
    const kgCO2 = gramsCO2 / 1000;

    return {
      gramsCO2,
      kgCO2,
      // Derive tangible equivalents for user understanding
      equivalentCarMiles: kgCO2 / CONFIG.KG_CO2_PER_CAR_MILE,
      equivalentTreeDays: kgCO2 / CONFIG.TREE_DAYS_PER_KG_CO2
    };
  }

  /**
   * @private
   * Creates a consistent, structured API response.
   */
  _formatResult({ activityType, primaryMetric, impact }) {
    return {
      activity: activityType,
      ...primaryMetric,
      carbon: {
        grams: impact.gramsCO2,
        kilograms: impact.kgCO2
      },
      equivalents: {
        carMiles: impact.equivalentCarMiles,
        treeDays: impact.equivalentTreeDays
      },
      timestamp: new Date().toISOString(),
      calculationModel: CONFIG.CO2_MODEL,
      note: 'Estimates are conservative and include a green hosting factor.'
    };
  }

  /**
   * @private
   * Validates that an input is a positive number.
   */
  _validatePositiveNumber(value, paramName) {
    if (typeof value !== 'number' || isNaN(value) || value < 0) {
      throw new TypeError(`"${paramName}" must be a positive number. Received: ${value}`);
    }
  }
}

// ======================
// 4. EXPORTS & INSTANTIATION
// ======================
// Export the class for flexibility and the instance for convenience.
const calculatorInstance = new CarbonCalculator();

module.exports = {
  CarbonCalculator, // For testing or advanced use
  calculateDiscordCarbon: (count) => calculatorInstance.calculateForDiscord(count),
  calculateVideoCallCarbon: (mins, users) => calculatorInstance.calculateForVideoCall(mins, users),

  // Expose config for transparency (e.g., for documentation or UI tooltips)
  CONSTANTS: Object.freeze(CONFIG)
};

// ======================
// 5. IN-MODULE INTEGRATION TEST
// ======================
// Only run if this file is executed directly: `node src/calculator.js`
if (require.main === module) {
  console.log('DEBUG: running /src/calculator.js');
  const { calculateDiscordCarbon, calculateVideoCallCarbon } = require('./calculator.js');

  console.log('🧪 CARBON CALCULATION ENGINE SELF-TEST\n');

  try {
    console.log('1. Discord Test (1500 messages):');
    console.log(calculateDiscordCarbon(1500));

    console.log('\n2. Video Call Test (60 min, 10 users):');
    console.log(calculateVideoCallCarbon(60, 10));

    console.log('\n3. Error Handling Test (invalid input):');
    console.log(calculateDiscordCarbon(-5)); // Should throw
  } catch (error) {
    console.error('✅ Error correctly caught:', error.message);
  }
}