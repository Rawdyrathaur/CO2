import { useEffect, useState } from 'react';
import axios from 'axios';

const Row = ({ name, isOnline }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-white text-sm font-medium">{name}</span>
    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${isOnline ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
      {isOnline ? 'Connected' : 'Offline'}
    </span>
  </div>
);

export default function DataSources() {
  const [status, setStatus] = useState({ discord: false, api: false, calculator: false });

  useEffect(() => {
    const check = async () => {
      try {
        const [node, java] = await Promise.all([
          axios.get('http://localhost:3002/api/v1/health'),
          axios.get('http://localhost:8080/api/carbon/hackathon/live')
        ]);
        setStatus({ discord: node.status === 200, api: java.status === 200, calculator: node.status === 200 });
      } catch (e) {
        setStatus({ discord: false, api: false, calculator: false });
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800/50">
      <h4 className="text-white font-bold text-base mb-4">Live Data Sources</h4>
      <div className="space-y-1">
        <Row name="Discord" isOnline={status.discord} />
        <Row name="API" isOnline={status.api} />
        <Row name="Calculator" isOnline={status.calculator} />
      </div>
    </div>
  );
}
