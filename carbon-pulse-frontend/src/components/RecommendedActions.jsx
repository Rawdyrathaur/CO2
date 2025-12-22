import { useState } from 'react';
import { FiCheck, FiClock, FiZap, FiX, FiTrendingDown, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';
import { useCarbonStore } from '../store/useCarbonStore';

export default function RecommendedActions() {
  const appliedOptimizations = useCarbonStore(s => s.appliedOptimizations);
  const applyOptimization = useCarbonStore(s => s.applyOptimization);
  const removeOptimization = useCarbonStore(s => s.removeOptimization);
  const getTotalReduction = useCarbonStore(s => s.getTotalReduction);
  const data = useCarbonStore(s => s.data);
  const [showTips, setShowTips] = useState(false);

  const totalCarbon = data?.carbonImpact?.kilograms || 0;
  const totalReduction = getTotalReduction();
  const savedCarbon = (totalCarbon * totalReduction / 100);
  const optimizedCarbon = totalCarbon - savedCarbon;

  const actions = [
    {
      id: 'slow-bots',
      icon: FiClock,
      title: 'Slow down bot activity',
      description: 'Increase delay between messages by 50%',
      reduction: 30
    },
    {
      id: 'batch-messages',
      icon: FiZap,
      title: 'Enable efficient batching',
      description: 'Send messages in larger batches (reduce API calls)',
      reduction: 20
    },
    {
      id: 'quiet-hours',
      icon: FiClock,
      title: 'Activate quiet hours (2AM-6AM)',
      description: 'Pause non-critical bot activity during off-peak',
      reduction: 15
    }
  ];

  const handleToggle = (action) => {
    const isApplied = appliedOptimizations[action.id];

    if (isApplied) {
      removeOptimization(action.id);
      console.log(`REMOVED: ${action.title}`);
    } else {
      applyOptimization(action.id, action.reduction);
      console.log(`APPLIED: ${action.title} (${action.reduction}% reduction)`);
    }
  };

  const hasOptimizations = Object.keys(appliedOptimizations).length > 0;
  const activeCount = Object.keys(appliedOptimizations).length;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800/50">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Carbon Optimizations</h3>
            <p className="text-gray-500 text-sm mt-1">Apply actions to reduce emissions</p>
          </div>
          {hasOptimizations && (
            <div className="px-3 py-1.5 bg-green-900/30 border border-green-600/40 rounded-full">
              <span className="text-xs font-bold text-green-400">{activeCount} Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Live Impact Summary */}
      {hasOptimizations && (
        <div className="mb-6 relative overflow-hidden bg-gradient-to-br from-green-900/30 via-green-800/20 to-emerald-900/30 border border-green-600/40 rounded-2xl p-6">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 to-emerald-400/5 animate-pulse"></div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <FiTrendingDown className="text-green-400" size={20} />
              </div>
              <div>
                <h4 className="text-green-400 font-bold text-base">Live Impact</h4>
                <p className="text-green-400/60 text-xs">Optimizations reducing your footprint</p>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 font-medium">Reduction Level</span>
                <span className="text-lg font-black text-green-400">{totalReduction.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${totalReduction}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/40 rounded-xl p-3 border border-green-600/20">
                <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  Carbon Saved
                </p>
                <p className="text-xl font-black text-green-400">
                  {savedCarbon < 0.001
                    ? `${(savedCarbon * 1000).toFixed(2)}g`
                    : `${savedCarbon.toFixed(3)}kg`
                  }
                </p>
              </div>
              <div className="bg-gray-900/40 rounded-xl p-3 border border-green-600/20">
                <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  New Footprint
                </p>
                <p className="text-xl font-black text-emerald-400">
                  {optimizedCarbon < 0.001
                    ? `${(optimizedCarbon * 1000).toFixed(2)}g`
                    : `${optimizedCarbon.toFixed(3)}kg`
                  }
                </p>
              </div>
            </div>

            {/* Before/After Comparison */}
            <div className="mt-4 pt-4 border-t border-green-600/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 line-through">
                    {totalCarbon < 0.001
                      ? `${(totalCarbon * 1000).toFixed(2)}g CO₂`
                      : `${totalCarbon.toFixed(3)}kg CO₂`
                    }
                  </span>
                  <span className="text-gray-600">→</span>
                  <span className="text-xs text-green-400 font-semibold">
                    {optimizedCarbon < 0.001
                      ? `${(optimizedCarbon * 1000).toFixed(2)}g CO₂`
                      : `${optimizedCarbon.toFixed(3)}kg CO₂`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 rounded">
                  <FiTrendingDown size={12} className="text-green-400" />
                  <span className="text-xs font-bold text-green-400">
                    -{((savedCarbon / totalCarbon) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isApplied = appliedOptimizations[action.id];

          return (
            <div
              key={action.id}
              className={`group relative rounded-xl p-5 border transition-all duration-300 ${
                isApplied
                  ? 'bg-gradient-to-r from-green-900/30 to-green-800/20 border-green-600/40 shadow-lg shadow-green-900/20'
                  : 'bg-gradient-to-r from-gray-800/40 to-gray-800/20 border-gray-700/40 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5'
              }`}
            >
              {/* Applied Indicator */}
              {isApplied && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-600/30 border border-green-500/30 rounded-full">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-green-400">Active</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl transition-all duration-300 ${
                  isApplied
                    ? 'bg-green-600/20 shadow-lg shadow-green-600/20'
                    : 'bg-gray-800/60 group-hover:bg-accent/10'
                }`}>
                  <Icon className={`transition-colors ${isApplied ? 'text-green-400' : 'text-accent'}`} size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-white font-bold text-sm mb-1.5">{action.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{action.description}</p>

                  <div className="flex items-center justify-between gap-3">
                    {/* Impact Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                      isApplied
                        ? 'bg-green-600/20 border border-green-600/30'
                        : 'bg-accent/10 border border-accent/20'
                    }`}>
                      <FiTrendingDown size={12} className={isApplied ? 'text-green-400' : 'text-accent'} />
                      <span className={`text-xs font-bold ${isApplied ? 'text-green-400' : 'text-accent'}`}>
                        {action.reduction}% cut
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleToggle(action)}
                      className={`ml-auto px-4 py-2 font-bold text-xs rounded-lg transition-all duration-300 whitespace-nowrap ${
                        isApplied
                          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/40 hover:border-red-600/60 hover:shadow-lg hover:shadow-red-600/10'
                          : 'bg-accent hover:bg-accent/90 text-black border border-accent hover:shadow-lg hover:shadow-accent/20'
                      }`}
                    >
                      {isApplied ? (
                        <span className="flex items-center gap-1.5">
                          <FiX size={13} /> Remove
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <FiCheck size={13} /> Apply Now
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Best Practices - Collapsible */}
      <div className="mt-4">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between p-3 bg-gray-800/20 hover:bg-gray-800/30 border border-gray-700/30 rounded-lg transition-all"
        >
          <div className="flex items-center gap-2">
            <FiInfo size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-400">Best Practices</span>
          </div>
          {showTips ? (
            <FiChevronUp size={14} className="text-gray-500" />
          ) : (
            <FiChevronDown size={14} className="text-gray-500" />
          )}
        </button>

        {showTips && (
          <div className="mt-3 p-4 bg-gray-800/20 border border-gray-700/30 rounded-lg">
            <div className="space-y-3 text-xs text-gray-400">
              <div>
                <p className="text-white font-semibold mb-1.5">Message Efficiency</p>
                <ul className="space-y-1 ml-4">
                  <li>• Combine updates into single messages</li>
                  <li>• Use embeds instead of multiple texts</li>
                  <li>• Minimize unnecessary reactions</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-1.5">Timing Optimization</p>
                <ul className="space-y-1 ml-4">
                  <li>• Implement smart polling</li>
                  <li>• Use webhooks over polling</li>
                  <li>• Batch during peak hours</li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-1.5">Infrastructure</p>
                <ul className="space-y-1 ml-4">
                  <li>• Choose renewable-powered hosting</li>
                  <li>• Optimize database queries</li>
                  <li>• Enable CDN for static assets</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
