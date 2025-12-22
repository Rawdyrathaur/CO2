import QRCode from 'react-qr-code';
import { FiCode, FiBook, FiExternalLink } from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';

export default function MethodologyAPI() {
  // Replace this with your Discord server invite URL
  const discordUrl = 'https://discord.com/channels/1416036797200207975/1416036798609756254';

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 border border-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-sm">Methodology & Community</h3>
        <div className="p-1.5 bg-accent/10 rounded-lg">
          <FiCode className="text-accent" size={14} />
        </div>
      </div>

      {/* Methodology Section */}
      <div className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
        <div className="flex items-start gap-2 mb-2">
          <FiBook className="text-accent mt-0.5" size={12} />
          <div>
            <h4 className="text-white text-xs font-semibold mb-1">Carbon Calculation</h4>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              Powered by <span className="text-accent font-semibold">CO2.js</span> library, utilizing the Sustainable Web Design (SWD) model and 1byte model for accurate digital emissions estimation.
            </p>
          </div>
        </div>
        <a
          href="https://www.thegreenwebfoundation.org/co2-js/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-accent hover:text-accent/80 transition-colors mt-2"
        >
          Learn more about CO2.js
          <FiExternalLink size={9} />
        </a>
      </div>

      {/* Discord Community Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FaDiscord className="text-[#5865F2]" size={14} />
          <h4 className="text-white text-xs font-semibold">Join Discord Community</h4>
        </div>

        {/* Discord Direct Link Button */}
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <button className="w-full flex items-center justify-center gap-2 p-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-all duration-200 shadow-lg shadow-[#5865F2]/20 hover:shadow-[#5865F2]/30">
            <FaDiscord size={16} className="text-white" />
            <span className="text-white text-xs font-bold">Open Discord Channel</span>
            <FiExternalLink size={12} className="text-white/80" />
          </button>
        </a>

        {/* Discord QR Code */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#5865F2]/10 to-[#5865F2]/5 rounded-lg border border-[#5865F2]/20">
          <div className="bg-white p-2 rounded-lg flex-shrink-0">
            <QRCode value={discordUrl} size={48} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[10px] font-semibold mb-0.5">Scan to Join</p>
            <p className="text-gray-400 text-[9px]">
              Watch live bot activity & carbon tracking in real-time
            </p>
          </div>
        </div>

        {/* Discord Info */}
        <div className="p-2.5 bg-gray-800/20 rounded-lg border border-gray-700/20">
          <p className="text-gray-500 text-[9px] mb-1">Live Activity Channel</p>
          <p className="text-white text-[10px] leading-relaxed">
            See the carbon emissions being generated in real-time as bots send messages in our Discord server
          </p>
        </div>
      </div>
    </div>
  );
}
