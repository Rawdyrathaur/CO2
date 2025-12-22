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
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800/50">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Carbon Pulse</h1>
            <p className="text-sm text-gray-500">Real-time carbon emissions tracker</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-900/50 rounded-xl border border-gray-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400 font-medium">Live</span>
            <span className="text-gray-700">•</span>
            <span className="text-sm text-gray-500">Updated 10s ago</span>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-8 space-y-6">
            <HeroCarbon carbonKg={carbonKg} data={data} />
            <EmissionChart />
            <LiveMetrics data={data} />
            <RecommendedActions />
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-4 space-y-6">
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
