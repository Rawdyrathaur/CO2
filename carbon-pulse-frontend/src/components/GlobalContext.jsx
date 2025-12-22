import { useState, useEffect } from 'react';
import { FiExternalLink, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import axios from 'axios';

export default function GlobalContext() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/carbon/global-context');
        setArticles(response.data.articles || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch global context:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'critical':
        return { icon: FiAlertCircle, text: 'Critical', color: 'from-red-500 to-pink-500', bgColor: 'bg-red-900/20', borderColor: 'border-red-600/30', textColor: 'text-red-400' };
      case 'high':
        return { icon: FiInfo, text: 'High Impact', color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-900/20', borderColor: 'border-orange-600/30', textColor: 'text-orange-400' };
      case 'moderate':
        return { icon: FiCheckCircle, text: 'Moderate', color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-900/20', borderColor: 'border-yellow-600/30', textColor: 'text-yellow-400' };
      default:
        return { icon: FiInfo, text: 'Info', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-900/20', borderColor: 'border-blue-600/30', textColor: 'text-blue-400' };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'energy': return 'text-yellow-400';
      case 'research': return 'text-blue-400';
      case 'standards': return 'text-purple-400';
      case 'industry': return 'text-green-400';
      case 'sustainability': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-gray-800/50">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <span className="text-base sm:text-lg md:text-xl">🌍</span>
          <h3 className="text-white font-bold text-sm sm:text-base">Global Context & Science</h3>
        </div>
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="animate-pulse text-gray-500 text-xs sm:text-sm">Loading latest research...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-800/50">
      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-sm sm:text-base">🌍</span>
          <h3 className="text-white font-bold text-xs sm:text-sm">Global Context</h3>
        </div>
        <div className="px-1.5 sm:px-2 py-0.5 bg-accent/10 rounded">
          <span className="text-[9px] sm:text-[10px] font-bold text-accent">{articles.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        {articles.map((article) => {
          const impactBadge = getImpactBadge(article.impact);
          const ImpactIcon = impactBadge.icon;

          return (
            <div
              key={article.id}
              className="group relative bg-gradient-to-br from-gray-800/30 to-gray-800/10 border border-gray-700/30 rounded-lg p-2.5 hover:border-accent/30 transition-all duration-200"
            >
              {/* Impact Badge */}
              <div className="absolute top-2 right-2">
                <ImpactIcon size={9} className={impactBadge.textColor} />
              </div>

              {/* Title */}
              <h4 className="text-white text-xs font-bold mb-1 pr-4 leading-tight">
                {article.title}
              </h4>

              {/* Metadata - Inline */}
              <div className="flex items-center gap-2 mb-2 text-[10px]">
                <span className="text-gray-500">{formatDate(article.date)}</span>
                <div className="w-0.5 h-0.5 bg-gray-600 rounded-full"></div>
                <span className={`uppercase tracking-wide ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-[10px] truncate max-w-[60%]">
                  {article.source}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded text-[10px] font-semibold transition-all"
                >
                  Read
                  <FiExternalLink size={9} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Powered by notice */}
      <div className="mt-2.5 pt-2 border-t border-gray-800/50">
        <p className="text-center text-[9px] text-gray-600">
          Latest research • Updated daily
        </p>
      </div>
    </div>
  );
}
