import React from 'react';
import { 
  TrendingUp, 
  ShieldAlert, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  onOpenBrokerModal: () => void;
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBrokerModal, language = 'ar' }) => {
  const isArabic = language === 'ar';

  return (
    <footer className="border-t border-zinc-800 bg-[#0d1117] text-zinc-400 mt-10 pb-10">
      {/* Broker Partnership Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-1.5">
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
              {isArabic ? 'شراكات وسطاء تداول مرخصين' : 'BROKER PARTNERSHIP'}
            </span>
            <h3 className="text-base md:text-lg font-bold text-white font-arabic">
              {isArabic ? 'تداول مع فروق أسعار تبدأ من 0.0 نقطة وسحب فوري للأرباح' : 'Trade with Zero Raw Spread & Regulated Accounts'}
            </h3>
            <p className="text-xs text-zinc-400 font-arabic">
              {isArabic 
                ? 'تنفيذ سريع عبر خوادم Equinix العالمية مع حسابات بنكية مفصولة وسحب فوري للأموال.'
                : 'Fast execution on Equinix servers with segregated accounts and fast withdrawals.'}
            </p>
          </div>

          <button
            onClick={onOpenBrokerModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 font-arabic"
          >
            <span>{isArabic ? 'مقارنة الوسطاء المعتمدين' : 'Compare Brokers'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 text-xs font-arabic">
          {/* Col 1: Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-zinc-800 flex items-center justify-center text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-bold text-white font-mono">
                Market<span className="text-emerald-400">Prob</span>.com
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              {isArabic ? 'منصة المؤشرات الخوارزمية واحتمالات السوق المالي وإدارة مخاطر المحفظة.' : 'Algorithmic market probability and capital risk management platform.'}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
              <Lock className="h-3 w-3 text-zinc-400" />
              <span>TLS 256-bit Encrypted</span>
            </div>
          </div>

          {/* Col 2: Modules */}
          <div className="space-y-1.5">
            <h4 className="text-zinc-200 font-bold uppercase text-[11px]">
              {isArabic ? 'أدوات المنصة' : 'Platform Tools'}
            </h4>
            <ul className="space-y-1 text-zinc-400 text-[11px]">
              <li>{isArabic ? 'مؤشر حركة السوق وتوجيه الدخول' : 'Market Probability Engine'}</li>
              <li>{isArabic ? 'موجز الأخبار وحركة الأسواق' : 'Market News & Macro Radar'}</li>
              <li>{isArabic ? 'رسم بياني مباشر من TradingView' : 'TradingView Live Chart'}</li>
              <li>{isArabic ? 'حاسبة حجم الصفقة وإدارة المخاطر' : 'Position Size Calculator'}</li>
            </ul>
          </div>

          {/* Col 3: Markets */}
          <div className="space-y-1.5">
            <h4 className="text-zinc-200 font-bold uppercase text-[11px]">
              {isArabic ? 'الأسواق المدعومة' : 'Supported Markets'}
            </h4>
            <ul className="space-y-1 text-zinc-400 font-mono text-[11px]">
              <li>BTC/USD • ETH/USD • SOL/USD</li>
              <li>EUR/USD • GBP/USD • USD/JPY</li>
              <li>Gold (XAU/USD) • Crude Oil (WTI)</li>
            </ul>
          </div>

          {/* Col 4: Telemetry */}
          <div className="space-y-1.5">
            <h4 className="text-zinc-200 font-bold uppercase text-[11px] font-mono">
              SYSTEM STATUS
            </h4>
            <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Core:</span>
                <span className="text-zinc-200 font-medium">Quant Analytics v2.6</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Cloud Sync:</span>
                <span className="text-zinc-200 font-medium">Firestore Connected</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Latency:</span>
                <span className="text-emerald-400 font-medium">9 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-1.5 text-[11px] text-zinc-500 font-arabic">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
            <span>{isArabic ? 'إخلاء المسؤولية وإدارة المخاطر:' : 'RISK DISCLAIMER'}</span>
          </div>
          <p>
            {isArabic 
              ? 'يقدم موقع MarketProb بيانات إحصائية وتحليلات خوارزمية لأغراض تعليمية وإرشادية. ينطوي تداول الفوركس والأصول الرقمية والعقود مقابل الفروقات على مخاطر خسارة رأس المال. احرص دائماً على تطبيق إدارة صارمة للمخاطر وتحديد أوامر وقف الخسارة.'
              : 'MarketProb provides statistical market analytics for educational purposes. Trading financial markets carries capital risk. Always practice disciplined risk management.'}
          </p>
          <p className="text-zinc-600 font-mono text-[10px]">
            © {new Date().getFullYear()} MarketProb Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
