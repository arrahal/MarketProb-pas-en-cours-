import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, ExternalLink, RefreshCw, Layers } from 'lucide-react';
import { Asset, Language } from '../types';

interface TradingViewWidgetProps {
  asset: Asset;
  language?: Language;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ asset, language = 'ar' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeframe, setTimeframe] = useState<'15' | '60' | '240' | 'D'>('60');
  const [widgetKey, setWidgetKey] = useState(0);

  const isArabic = language === 'ar';
  const containerId = `tradingview_chart_${asset.id.replace(/[^a-zA-Z0-9]/g, '_')}`;

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    let isMounted = true;

    const loadTradingViewScript = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div id="${containerId}" style="height: 100%; width: 100%;"></div>`;
      }

      const scriptId = 'tradingview-widget-script';
      let existingScript = document.getElementById(scriptId) as HTMLScriptElement;

      const initWidget = () => {
        if (!isMounted) return;
        if (typeof (window as any).TradingView !== 'undefined') {
          try {
            new (window as any).TradingView.widget({
              autosize: true,
              symbol: asset.tradingViewSymbol,
              interval: timeframe,
              timezone: 'Etc/UTC',
              theme: 'dark',
              style: '1',
              locale: isArabic ? 'ar_AE' : 'en',
              toolbar_bg: '#09090b',
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: containerId,
              hide_side_toolbar: false,
              withdateranges: true,
              details: true,
              hotlist: false,
              calendar: false,
              studies: [
                'RSI@tv-basicstudies',
                'MASimple@tv-basicstudies',
                'MACD@tv-basicstudies',
              ],
              disabled_features: ['header_saveload'],
              enabled_features: ['side_toolbar_in_fullscreen_mode'],
              overrides: {
                'paneProperties.background': '#09090b',
                'paneProperties.vertGridProperties.color': '#18181b',
                'paneProperties.horzGridProperties.color': '#18181b',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.textColor': '#71717a',
                'mainSeriesProperties.candleStyle.upColor': '#10b981',
                'mainSeriesProperties.candleStyle.downColor': '#f43f5e',
                'mainSeriesProperties.candleStyle.borderUpColor': '#10b981',
                'mainSeriesProperties.candleStyle.borderDownColor': '#f43f5e',
                'mainSeriesProperties.candleStyle.wickUpColor': '#10b981',
                'mainSeriesProperties.candleStyle.wickDownColor': '#f43f5e',
              },
            });
          } catch (e) {
            console.error('TradingView widget initialization error:', e);
          }
        }
      };

      if (!existingScript) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.src = 'https://s3.tradingview.com/tv.js';
        scriptElement.type = 'text/javascript';
        scriptElement.async = true;
        scriptElement.onload = initWidget;
        document.head.appendChild(scriptElement);
      } else {
        initWidget();
      }
    };

    const timer = setTimeout(loadTradingViewScript, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [asset.tradingViewSymbol, timeframe, widgetKey, isArabic]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setWidgetKey((prev) => prev + 1);
  };

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-[#11141d] flex flex-col transition-all overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-[#09090b]' : 'h-[540px] xl:h-[580px]'
      }`}
    >
      {/* Widget Header Controls */}
      <div className="border-b border-zinc-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white font-mono tracking-tight">
              {asset.symbol}
            </span>
            <span className="text-xs text-zinc-400 font-arabic font-medium hidden sm:inline">
              {isArabic ? (asset.nameAr || asset.name) : asset.name}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block"></div>

          {/* Timeframe Selectors */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
            {(
              [
                { label: '15m', val: '15' },
                { label: '1H', val: '60' },
                { label: '4H', val: '240' },
                { label: '1D', val: 'D' },
              ] as const
            ).map((tf) => (
              <button
                key={tf.val}
                onClick={() => setTimeframe(tf.val)}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  timeframe === tf.val
                    ? 'bg-zinc-800 text-emerald-400 font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-zinc-400 font-mono bg-zinc-900/90 px-2 py-0.5 rounded-lg border border-zinc-800">
            <Layers className="h-3 w-3 text-emerald-400" />
            <span>RSI • EMA • MACD</span>
          </div>
        </div>

        {/* Right side stats & fullscreen */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-500">{isArabic ? 'أعلى:' : 'High:'} <strong className="text-zinc-200">${asset.high24h.toLocaleString()}</strong></span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-500">{isArabic ? 'أدنى:' : 'Low:'} <strong className="text-zinc-200">${asset.low24h.toLocaleString()}</strong></span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setWidgetKey((p) => p + 1)}
              title="Refresh Chart"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* TradingView Chart Container */}
      <div className="relative flex-1 w-full bg-[#09090b] min-h-[300px]">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Chart Footer Info */}
      <div className="border-t border-zinc-800/80 px-4 py-1.5 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>{asset.tradingViewSymbol}</span>
          <span className="text-zinc-600">|</span>
          <span>Bid: ${asset.bid.toLocaleString()}</span>
          <span>Ask: ${asset.ask.toLocaleString()}</span>
        </div>
        <a
          href={`https://www.tradingview.com/symbols/${asset.tradingViewSymbol.replace(':', '-')}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          <span>TradingView Feed</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};
