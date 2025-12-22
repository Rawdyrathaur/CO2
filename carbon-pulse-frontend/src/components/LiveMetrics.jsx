import CountUp from 'react-countup';
import { FiMail, FiActivity, FiTruck, FiSun } from 'react-icons/fi';
import { getPerMessageImpact } from '../utils/formatters';

const MetricCard = ({ icon: Icon, label, value, unit, decimals }) => (
  <div className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800/50 hover:border-accent/30 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <Icon className="text-accent" size={20} />
      </div>
    </div>
    <div className="text-3xl font-black text-white mb-1">
      <CountUp end={value} decimals={decimals} duration={1.5} separator="," preserveValue />
      {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
    </div>
    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
  </div>
);

export default function LiveMetrics({ data }) {
  const totalMessages = data?.totalMessages || 0;
  const carbonKg = data?.carbonImpact?.kilograms || 0;
  const carMiles = data?.equivalents?.carMiles || 0;
  const treeDays = data?.equivalents?.treeDays || 0;
  const perMessageGrams = getPerMessageImpact(carbonKg, totalMessages);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard icon={FiMail} label="Total Messages" value={totalMessages} decimals={0} />
      <MetricCard icon={FiActivity} label="Avg per Message" value={perMessageGrams} unit="g" decimals={5} />
      <MetricCard icon={FiTruck} label="Car Miles" value={carMiles} unit="mi" decimals={4} />
      <MetricCard icon={FiSun} label="Tree Days" value={treeDays} unit="days" decimals={4} />
    </div>
  );
}
