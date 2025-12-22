import CountUp from 'react-countup';
import { useCarbonStore } from '../store/useCarbonStore';

export default function HeroCarbon({ carbonKg, data }) {
  const getTotalReduction = useCarbonStore(s => s.getTotalReduction);
  const appliedOptimizations = useCarbonStore(s => s.appliedOptimizations);

  const totalReduction = getTotalReduction();
  const hasOptimizations = Object.keys(appliedOptimizations).length > 0;
  const optimizedCarbon = carbonKg * (1 - totalReduction / 100);
  const displayCarbon = hasOptimizations ? optimizedCarbon : carbonKg;

  const getSeverity = (kg) => {
    if (kg < 0.01) return { label: 'Low', color: 'from-green-500 to-emerald-500' };
    if (kg < 0.05) return { label: 'Moderate', color: 'from-yellow-500 to-orange-500' };
    return { label: 'High', color: 'from-red-500 to-pink-500' };
  };

  const severity = getSeverity(displayCarbon);
  const realMessages = data?.realBotMessages || 0;
  const simMessages = data?.simulationMessages || 0;

  return (
    <div className="relative bg-black rounded-2xl p-10 border border-gray-800/50 overflow-hidden">
      {/* Fog Animation Background */}
      <div className="absolute inset-0 opacity-60">
        <div className="fogwrapper">
          <div id="foglayer_01" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
          <div id="foglayer_02" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
          <div id="foglayer_03" className="fog">
            <div className="image01"></div>
            <div className="image02"></div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Current Digital Emissions</p>
            <p className="text-sm text-gray-400">
              Real-time carbon impact • <span className="text-green-400">{realMessages.toLocaleString()}</span> real bot messages
              {simMessages > 0 && <span className="text-yellow-400"> (+{simMessages.toLocaleString()} test)</span>}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${severity.color} bg-opacity-10`}>
            <span className="text-xs font-bold text-white">{severity.label}</span>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="flex items-baseline justify-center gap-4">
            <span className={`text-7xl font-black bg-gradient-to-r ${hasOptimizations ? 'from-green-400 to-emerald-400' : 'from-accent to-green-400'} bg-clip-text text-transparent`}>
              <CountUp end={displayCarbon} decimals={4} duration={1.5} preserveValue />
            </span>
            <span className="text-3xl text-gray-400 font-bold">kg CO₂e</span>
          </div>

          {hasOptimizations && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="px-3 py-1.5 bg-green-900/30 border border-green-600/30 rounded-lg">
                <p className="text-xs text-green-400 font-semibold">
                  -{totalReduction.toFixed(1)}% optimized
                  <span className="text-gray-500 mx-2">•</span>
                  <span className="line-through text-gray-500">{carbonKg.toFixed(4)}kg</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
