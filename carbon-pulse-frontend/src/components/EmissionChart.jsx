import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useCarbonStore } from '../store/useCarbonStore';

export default function EmissionChart() {
  const history = useCarbonStore((s) => s.history);
  const data = useCarbonStore((s) => s.data);

  const totalMessages = data?.totalMessages || 0;
  const totalCarbonKg = data?.carbonImpact?.kilograms || 0;

  // Calculate per-minute activity (show fluctuations clearly)
  const chartData = history.map((point, idx) => {
    const prevPoint = idx > 0 ? history[idx - 1] : { messageCount: 0, carbonKg: 0 };

    const messagesThisInterval = point.messageCount - prevPoint.messageCount;
    const carbonThisInterval = (point.carbonKg - prevPoint.carbonKg) * 1000;

    return {
      time: `${(idx + 1) * 10}s`,
      value: carbonThisInterval,
      messages: messagesThisInterval,
      total: point.messageCount
    };
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-800/50">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div>
          <h3 className="text-white font-bold text-base sm:text-lg">Activity Trend</h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Updates every 10s • Total: {totalMessages.toLocaleString()} messages ({(totalCarbonKg * 1000).toFixed(2)}g CO₂)
          </p>
        </div>
      </div>

      <div className="h-48 sm:h-56 md:h-64 lg:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#00d4aa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
            <YAxis stroke="#6B7280" fontSize={10} />
            <Tooltip
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '12px'
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
              formatter={(value, name) => {
                if (name === 'value') {
                  return [`${value.toFixed(6)}g CO₂`, 'Carbon (10s)'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => {
                const dataPoint = chartData.find(d => d.time === label);
                if (!dataPoint) return label;
                return `${label} • ${dataPoint.messages} messages • Total: ${dataPoint.total.toLocaleString()}`;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00d4aa"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
