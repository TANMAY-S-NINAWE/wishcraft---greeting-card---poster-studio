import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2, Feather } from 'lucide-react';
import { AIMessageSuggestion } from '../../types/card';

interface AIMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (message: string, headline?: string) => void;
  defaultOccasion?: string;
}

export const AIMessageModal: React.FC<AIMessageModalProps> = ({
  isOpen,
  onClose,
  onSelectSuggestion,
  defaultOccasion = 'Birthday',
}) => {
  const [occasion, setOccasion] = useState(defaultOccasion);
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('Heartfelt & Warm');
  const [language, setLanguage] = useState('English');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIMessageSuggestion[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          recipient,
          tone,
          language,
          customNotes,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSuggestions(data.data);
      }
    } catch (err) {
      console.error('Error generating AI wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-stone-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">
            <Feather size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              AI Wishes & Message Writer
            </h2>
            <p className="text-xs text-stone-500">
              Generate heartfelt poetry, romantic proposals, and personalized greetings in seconds.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Occasion / Theme
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g. 30th Birthday, Wedding, Proposal"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-400 focus:bg-white focus:outline-none"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['Birthday', 'Anniversary', 'Proposal', 'Diwali', 'Eid', 'Thank You', 'Get Well', 'Pet Birthday'].map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className="px-2 py-0.5 text-[10px] bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 rounded-md transition-colors"
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Recipient Name or Role
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. My Soulmate, Best Friend, Mom"
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Tone & Emotion
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-400 focus:bg-white focus:outline-none"
            >
              <option value="Heartfelt & Warm">Heartfelt & Warm</option>
              <option value="Romantic & Poetic">Romantic & Poetic</option>
              <option value="Playful & Humorous">Playful & Humorous</option>
              <option value="Elegant & Formal">Elegant & Formal</option>
              <option value="Inspirational & Empowering">Inspirational & Empowering</option>
              <option value="Traditional & Spiritual">Traditional & Spiritual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-400 focus:bg-white focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="Spanish">Spanish (Español)</option>
              <option value="French">French (Français)</option>
              <option value="German">German (Deutsch)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
            Personal Memories or Details (Optional)
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="e.g. Loves stargazing together, traveled to Paris, always makes me laugh"
            className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:border-rose-400 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Generate Button */}
        <div className="mb-4">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting poetic messages...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="text-amber-300" />
                <span>Generate Message Ideas</span>
              </>
            )}
          </button>
        </div>

        {/* Suggestions List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-4 bg-stone-50 hover:bg-rose-50/50 border border-stone-200/80 rounded-2xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-rose-700 tracking-wide uppercase">
                    {sug.title}
                  </span>
                  {sug.shortQuote && (
                    <span className="text-[11px] text-stone-500 font-serif italic">
                      "{sug.shortQuote}"
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-800 leading-relaxed font-sans mb-3">
                  {sug.message}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200/60">
                <button
                  onClick={() => {
                    onSelectSuggestion(sug.message, sug.shortQuote);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors"
                >
                  <Check size={14} />
                  <span>Use This Message</span>
                </button>
              </div>
            </div>
          ))}

          {!loading && suggestions.length === 0 && (
            <div className="py-8 text-center text-stone-400 text-sm">
              Tap "Generate Message Ideas" to create beautiful personalized options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
