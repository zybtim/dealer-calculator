
import React, { useState, useEffect, useMemo } from 'react';
import { WIDTHS, HEIGHTS, PRICE_GRID } from './constants';
import { CalculationResult } from './types';

/**
 * Finds the nearest larger or equal value from a sorted array.
 */
const findNearestCeil = (value: number, options: number[]): number | null => {
  const found = options.find((opt) => opt >= value);
  return found !== undefined ? found : null;
};

const App: React.FC = () => {
  const [widthInput, setWidthInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculatePrice = () => {
    const w = parseInt(widthInput, 10);
    const h = parseInt(heightInput, 10);

    if (isNaN(w) || isNaN(h)) {
      setResult(null);
      return;
    }

    const roundedW = findNearestCeil(w, WIDTHS);
    const roundedH = findNearestCeil(h, HEIGHTS);

    if (roundedW === null || roundedH === null) {
      setResult({
        price: null,
        roundedWidth: roundedW || w,
        roundedHeight: roundedH || h,
        isOutOfBounds: true,
      });
      return;
    }

    const price = PRICE_GRID[roundedH]?.[roundedW] || null;

    setResult({
      price,
      roundedWidth: roundedW,
      roundedHeight: roundedH,
      isOutOfBounds: false,
    });
  };

  // Auto-calculate on input change
  useEffect(() => {
    calculatePrice();
  }, [widthInput, heightInput]);

  const handleClear = () => {
    setWidthInput('');
    setHeightInput('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <header className="w-full max-w-md mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-lg mb-4">
          <i className="fa-solid fa-calculator text-2xl"></i>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Калькулятор Дилера</h1>
        <p className="text-slate-500 mt-1">Введите размеры для расчета стоимости</p>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Inputs */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="width" className="block text-sm font-semibold text-slate-700 mb-2">
                Ширина (мм)
              </label>
              <div className="relative">
                <input
                  id="width"
                  type="number"
                  inputMode="numeric"
                  placeholder="напр. 1276"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
                  value={widthInput}
                  onChange={(e) => setWidthInput(e.target.value)}
                />
                <i className="fa-solid fa-arrows-left-right absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-semibold text-slate-700 mb-2">
                Высота (мм)
              </label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  inputMode="numeric"
                  placeholder="напр. 491"
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                />
                <i className="fa-solid fa-arrows-up-down absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="mt-8">
            {result ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {result.isOutOfBounds ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                    <i className="fa-solid fa-triangle-exclamation text-amber-500 text-3xl mb-3"></i>
                    <p className="text-amber-800 font-medium">Размер вне таблицы</p>
                    <p className="text-amber-600 text-sm mt-1">Пожалуйста, уточните цену у менеджера.</p>
                  </div>
                ) : (
                  <div className="bg-blue-600 rounded-2xl p-8 text-white text-center shadow-lg shadow-blue-200">
                    <div className="text-sm font-medium opacity-80 mb-1 uppercase tracking-wider">Итоговая цена</div>
                    <div className="text-4xl font-bold tracking-tight">
                      {result.price?.toLocaleString('ru-RU')} <span className="text-2xl">₽</span>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-blue-400/30 grid grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col items-center">
                        <span className="opacity-70 mb-1">Округлено до:</span>
                        <span className="font-semibold text-sm">Ш: {result.roundedWidth} мм</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="opacity-70 mb-1">Округлено до:</span>
                        <span className="font-semibold text-sm">В: {result.roundedHeight} мм</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-slate-400 text-sm">Введите размеры для расчета</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-6 py-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            <i className="fa-solid fa-rotate-left"></i>
            Очистить
          </button>
        </div>
      </main>

      {/* Info Section */}
      <footer className="w-full max-w-md mt-12 px-4">
        <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white text-xs text-slate-500 leading-relaxed shadow-sm">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-blue-500"></i>
            Правила расчета
          </h3>
          <ul className="space-y-1.5 list-disc pl-4">
            <li>Цены указаны для дилеров.</li>
            <li>При нестандартных размерах выполняется округление в большую сторону до ближайшего табличного значения.</li>
            <li>Например: <span className="font-medium text-slate-700">491 → 500</span>, <span className="font-medium text-slate-700">1276 → 1300</span>.</li>
            <li>Максимально допустимая ширина: <span className="font-medium text-slate-700">2000 мм</span>.</li>
            <li>Максимально допустимая высота: <span className="font-medium text-slate-700">2000 мм</span>.</li>
          </ul>
        </div>
        <p className="text-center mt-6 opacity-30 text-[10px] uppercase tracking-widest">
          &copy; 2024 Dealer Pro Tool
        </p>
      </footer>
    </div>
  );
};

export default App;
