import { useEffect } from 'react';
import { useCarbonStore } from './store/useCarbonStore';
import HeroCarbon from './components/HeroCarbon';
import EmissionChart from './components/EmissionChart';
import LiveMetrics from './components/LiveMetrics';
import RecommendedActions from './components/RecommendedActions';
import DataSources from './components/DataSources';
import GlobalContext from './components/GlobalContext';
import MethodologyAPI from './components/MethodologyAPI';
import SimulationButton from './components/SimulationButton';

function App() {
  const data = useCarbonStore((s) => s.data);
  const fetchData = useCarbonStore((s) => s.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const carbonKg = data?.carbonImpact?.kilograms || 0;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 border-b border-gray-800/50 gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1">Carbon Pulse</h1>
            <p className="text-xs sm:text-sm text-gray-500">Real-time carbon emissions tracker</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-900/50 rounded-lg sm:rounded-xl border border-gray-800">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Live</span>
            <span className="text-gray-700 hidden sm:inline">•</span>
            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">Updated 10s ago</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          <div className="lg:col-span-8 space-y-3 sm:space-y-4 md:space-y-6">
            <HeroCarbon carbonKg={carbonKg} data={data} />
            <EmissionChart />
            <LiveMetrics data={data} />
            <RecommendedActions />
          </div>

          <div className="lg:col-span-4 space-y-3 sm:space-y-4 md:space-y-6">
            <GlobalContext />
            <DataSources />
            <SimulationButton />
            <MethodologyAPI />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
