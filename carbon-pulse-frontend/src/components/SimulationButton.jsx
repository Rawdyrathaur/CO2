import { useState } from 'react';
import { FiSend, FiRotateCcw } from 'react-icons/fi';
import { useCarbonStore } from '../store/useCarbonStore';

export default function SimulationButton() {
  const [count, setCount] = useState(1500);
  const [isBusy, setIsBusy] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const simulate = useCarbonStore(state => state.simulateMessages);
  const resetSimulations = useCarbonStore(state => state.resetSimulations);
  const data = useCarbonStore(state => state.data);

  const realMessages = data?.realBotMessages || 0;
  const simMessages = data?.simulationMessages || 0;

  const handleSimulate = async () => {
    if (isBusy) return;
    setIsBusy(true);
    await simulate(Number(count));
    setIsBusy(false);
  };

  const handleReset = async () => {
    if (isResetting || simMessages === 0) return;
    setIsResetting(true);
    try {
      await resetSimulations();
    } catch (error) {
      console.error('Reset failed:', error);
    }
    setIsResetting(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-800/50">
      <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">Test Simulation</h4>

      <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
        <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1">
          <span className="text-gray-400">Real bot messages:</span>
          <span className="text-green-400 font-semibold">{realMessages.toLocaleString()}</span>
        </div>
        {simMessages > 0 && (
          <div className="flex justify-between items-center text-[10px] sm:text-xs">
            <span className="text-gray-400">Test messages:</span>
            <span className="text-yellow-400 font-semibold">{simMessages.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3">
        <input
          type="number"
          value={count}
          onChange={e => setCount(e.target.value)}
          className="w-full p-2.5 sm:p-3 rounded-lg bg-gray-800/50 text-white text-sm border border-gray-700/50 focus:border-accent outline-none transition-all"
          placeholder="Number of messages"
        />
        <button
          onClick={handleSimulate}
          className="w-full bg-accent hover:bg-accent/90 text-black font-bold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          disabled={isBusy}
        >
          {isBusy ? 'Running...' : (
            <>
              <FiSend size={14} />
              Simulate
            </>
          )}
        </button>

        {simMessages > 0 && (
          <button
            onClick={handleReset}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-xs sm:text-sm"
            disabled={isResetting}
          >
            {isResetting ? 'Resetting...' : (
              <>
                <FiRotateCcw size={12} />
                Undo Simulations
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
