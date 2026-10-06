import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Award, 
  Check, 
  Copy, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BROKER_PARTNERS } from '../data/marketData';

interface BrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerModal: React.FC<BrokerModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl border border-zinc-800 bg-[#09090b] p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white font-mono">
                  TIER-1 INSTITUTIONAL BROKER PARTNERS
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  VERIFIED LIQUIDITY
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Official partner links with 0.0 pip raw spreads, zero swap, and instant execution
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Brokers Grid */}
        <div className="space-y-4 my-5 overflow-y-auto pr-1 flex-1 scrollbar-none">
          {BROKER_PARTNERS.map((broker) => (
            <div
              key={broker.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-all relative group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white font-mono">{broker.name}</h4>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {broker.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{broker.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(broker.promoCode)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  >
                    {copiedCode === broker.promoCode ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>Code: <strong className="text-emerald-400">{broker.promoCode}</strong></span>
                  </button>

                  <a
                    href={broker.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                  >
                    <span>Register Account</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-zinc-400 block">Min Deposit</span>
                  <span className="text-zinc-200 font-bold">{broker.minDeposit}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Max Leverage</span>
                  <span className="text-emerald-400 font-bold">{broker.maxLeverage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Spread</span>
                  <span className="text-cyan-400 font-bold">{broker.spread}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Regulation</span>
                  <span className="text-zinc-300 font-bold">{broker.regulation}</span>
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {broker.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-zinc-300 flex items-center gap-1 bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800"
                  >
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span>{feature}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Affiliate Disclosure: MarketProb may receive partner remuneration. All brokers are independently regulated.</span>
          </span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white font-mono text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
