import React, { useState } from 'react';
import { 
  Radio, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  FileText 
} from 'lucide-react';
import { NewsItem, ExperienceMode, Language } from '../types';

interface NewsRadarProps {
  newsList: NewsItem[];
  onAnalyzeNewsItem: (newsId: string) => Promise<void>;
  onAnalyzeCustomText: (customText: string) => Promise<any>;
  selectedAssetSymbol: string;
  experienceMode: ExperienceMode;
  language: Language;
}

export const NewsRadar: React.FC<NewsRadarProps> = ({
  newsList,
  onAnalyzeNewsItem,
  onAnalyzeCustomText,
  selectedAssetSymbol,
  experienceMode,
  language,
}) => {
  const isArabic = language === 'ar';
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'CPI' | 'FED'>('ALL');
  const [customHeadline, setCustomHeadline] = useState('');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customResult, setCustomResult] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNews = newsList.filter((item) => {
    if (filter === 'HIGH') return item.impact === 'HIGH';
    if (filter === 'CPI') return item.tag.toLowerCase().includes('cpi');
    if (filter === 'FED') return item.tag.toLowerCase().includes('fed');
    return true;
  });

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeadline.trim()) return;

    setIsSubmittingCustom(true);
    setCustomResult(null);

    try {
      const result = await onAnalyzeCustomText(customHeadline);
      setCustomResult(result);
    } catch (err: any) {
      console.warn('Custom analysis issue:', err);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  const handleCopyNewsAnalysis = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-[#11141d] p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300">
              <Radio className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight font-mono">
                  {isArabic ? 'موجز الأخبار وحركة الأسواق' : 'MARKET NEWS & MACRO RADAR'}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {isArabic ? 'تحديث لحظي' : 'LIVE'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-arabic">
                {isArabic ? 'متابعة الأخبار الاقتصادية وتحليل أثرها المباشر على حركة العملات والأسهم' : 'Real-time financial headlines and macroeconomic market impact'}
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
            {(
              [
                { id: 'ALL', labelAr: 'الكل', labelEn: 'All' },
                { id: 'HIGH', labelAr: 'هام', labelEn: 'High' },
                { id: 'CPI', labelAr: 'التضخم', labelEn: 'CPI' },
                { id: 'FED', labelAr: 'الفائدة', labelEn: 'Fed' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  filter === cat.id
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isArabic ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-3 my-3.5 overflow-y-auto max-h-[460px] pr-1 scrollbar-none">
          {filteredNews.map((item) => {
            const isBullish = item.sentiment === 'BULLISH';
            const isBearish = item.sentiment === 'BEARISH';

            return (
              <div
                key={item.id}
                className={`rounded-lg border p-3.5 transition-colors ${
                  item.analyzed
                    ? 'bg-zinc-850/90 border-zinc-750'
                    : 'bg-zinc-850/40 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase ${
                        item.impact === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span className="text-xs text-zinc-400">{item.source}</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" />
                      {item.timeAgo}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {item.relatedAsset}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="text-xs font-semibold text-zinc-100 leading-snug mb-2">
                  {item.headline}
                </h4>

                {/* Analyzed Result or Action Button */}
                {item.analyzed ? (
                  <div className="mt-2.5 pt-2.5 border-t border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-arabic">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            isBullish
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isBearish
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {isBullish ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {isArabic ? (isBullish ? 'أثر إيجابي صاعد' : isBearish ? 'أثر سلبي هابط' : 'أثر محايد') : `${item.sentiment}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.probabilityShift && (
                          <span className="text-xs font-mono font-medium text-emerald-400">
                            {item.probabilityShift > 0 ? `+${item.probabilityShift}%` : `${item.probabilityShift}%`} {isArabic ? 'تأثير' : ''}
                          </span>
                        )}

                        <button
                          onClick={() => handleCopyNewsAnalysis(item.id, item.arabicAnalysis || '')}
                          title={isArabic ? 'نسخ' : 'Copy'}
                          className="p-1 rounded text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
                        >
                          {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div dir={isArabic ? 'rtl' : 'ltr'} className="bg-zinc-900 p-2.5 rounded border border-zinc-800 font-arabic text-xs text-zinc-200 leading-relaxed">
                      {isArabic ? item.arabicAnalysis : (item.englishAnalysis || item.arabicAnalysis)}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-zinc-500 font-arabic">
                      {isArabic ? 'انقر لمعرفة الأثر على السوق' : 'Check market impact'}
                    </span>
                    <button
                      onClick={() => onAnalyzeNewsItem(item.id)}
                      disabled={item.isAnalyzing}
                      className="px-2.5 py-1 rounded text-xs font-medium text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors disabled:opacity-50 font-arabic"
                    >
                      {item.isAnalyzing ? (isArabic ? 'جاري التحليل...' : 'Analyzing...') : (isArabic ? 'تحليل أثر الخبر' : 'Analyze Impact')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Custom News Scanner */}
      <div className="border-t border-zinc-800 pt-3 mt-auto">
        <form onSubmit={handleCustomSubmit} className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 font-arabic flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-zinc-400" />
            <span>{isArabic ? 'فحص أثر أي خبر أو تصريح مالي:' : 'Analyze Financial Statement:'}</span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              placeholder={isArabic ? "اكتب الخبر هنا، مثلاً: 'البنك الفيدرالي يثبت الفائدة عند 5.25%'..." : "e.g. 'Fed keeps interest rates steady'..."}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 font-arabic"
            />
            <button
              type="submit"
              disabled={isSubmittingCustom || !customHeadline.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors flex items-center gap-1 disabled:opacity-50 whitespace-nowrap font-arabic"
            >
              {isSubmittingCustom ? (
                <span>{isArabic ? 'تحليل...' : '...'}</span>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  <span>{isArabic ? 'فحص' : 'Check'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {customResult && (
          <div className="mt-2.5 p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1 text-xs">
            <div className="flex items-center justify-between text-zinc-300 font-arabic">
              <span className="font-bold">{isArabic ? `الأثر: ${customResult.sentiment}` : `Impact: ${customResult.sentiment}`}</span>
              <span className="text-[11px] font-mono text-zinc-400">
                {isArabic ? 'درجة التأثير:' : 'Score:'} {customResult.impactScore}/10
              </span>
            </div>
            <p dir={isArabic ? 'rtl' : 'ltr'} className="font-arabic text-zinc-200">
              {customResult.arabicAnalysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
