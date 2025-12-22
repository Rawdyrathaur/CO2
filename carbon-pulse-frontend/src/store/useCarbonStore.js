import { create } from 'zustand';
import axios from 'axios';

export const useCarbonStore = create((set, get) => ({
  data: null,
  history: [],
  lastMinuteTimestamp: null,
  appliedOptimizations: {}, // Track applied carbon optimizations

  fetchData: async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/carbon/hackathon/live');
      const newData = response.data;

      set({ data: newData });

      // Update history - only add a new point every minute
      const now = Date.now();
      const lastMinute = get().lastMinuteTimestamp;
      const shouldAddPoint = !lastMinute || (now - lastMinute) >= 60000;

      if (shouldAddPoint) {
        const currentHistory = get().history;
        const carbonKg = newData?.carbonImpact?.kilograms || 0;
        const messageCount = newData?.totalMessages || 0;

        const newHistory = [...currentHistory, {
          carbonKg,
          messageCount,
          timestamp: now
        }];

        // Keep last 2 hours (120 minutes) of data - show all accumulated data
        if (newHistory.length > 120) {
          newHistory.shift();
        }

        set({ history: newHistory, lastMinuteTimestamp: now });
      }

      // Poll every 10 seconds
      setTimeout(() => get().fetchData(), 10000);
    } catch (error) {
      console.error('Failed to fetch carbon data:', error);
      // Retry after 10 seconds even on error
      setTimeout(() => get().fetchData(), 10000);
    }
  },

  simulateMessages: async (count) => {
    try {
      await axios.post('http://localhost:8080/api/carbon/discord/batch', {
        count,
        isSimulation: true  // Mark as test data
      });
      // Fetch updated data after simulation
      setTimeout(() => get().fetchData(), 1000);
    } catch (error) {
      console.error('Failed to simulate messages:', error);
      throw error;
    }
  },

  resetSimulations: async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/carbon/simulation/reset');
      console.log('Simulations reset:', response.data);
      // Fetch updated data after reset
      setTimeout(() => get().fetchData(), 500);
      return response.data;
    } catch (error) {
      console.error('Failed to reset simulations:', error);
      throw error;
    }
  },

  applyOptimization: (id, reductionPercent) => {
    set((state) => ({
      appliedOptimizations: {
        ...state.appliedOptimizations,
        [id]: { reductionPercent, appliedAt: Date.now() }
      }
    }));
  },

  removeOptimization: (id) => {
    set((state) => {
      const newOptimizations = { ...state.appliedOptimizations };
      delete newOptimizations[id];
      return { appliedOptimizations: newOptimizations };
    });
  },

  getTotalReduction: () => {
    const optimizations = get().appliedOptimizations;
    // Calculate compound reduction (not additive)
    let remaining = 1.0;
    Object.values(optimizations).forEach(opt => {
      remaining *= (1 - opt.reductionPercent / 100);
    });
    return (1 - remaining) * 100;
  }
}));
