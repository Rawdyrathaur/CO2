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

    // Messages and carbon added THIS minute
    const messagesThisMinute = point.messageCount - prevPoint.messageCount;
    const carbonThisMinute = (point.carbonKg - prevPoint.carbonKg) * 1000; // Convert to grams

    return {
      time: `${idx + 1}m`,
      value: carbonThisMinute,      // Grams added this minute
      messages: messagesThisMinute,  // Messages added this minute
      total: point.messageCount      // Total so far
    };
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Activity Trend</h3>
          <p className="text-gray-500 text-sm mt-1">
            Messages per minute • Total: {totalMessages.toLocaleString()} messages ({(totalCarbonKg * 1000).toFixed(2)}g CO₂)
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.5}/>
              <stop offset="100%" stopColor="#00d4aa" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} />
          <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
          <YAxis stroke="#6B7280" fontSize={11} />
          <Tooltip
            contentStyle={{
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid #374151',
              borderRadius: '12px',
              padding: '12px'
            }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            formatter={(value, name) => {
              if (name === 'value') {
                return [`${value.toFixed(6)}g CO₂`, 'Carbon this minute'];
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
  );
}
