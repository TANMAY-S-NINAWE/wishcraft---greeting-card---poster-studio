import React, { useEffect, useState } from 'react';
import { PublishedDesign } from '../types/card';
import { getLocalDesigns, deleteDesign } from '../utils/storage';
import {
  Plus,
  Share2,
  Trash2,
  ExternalLink,
  Eye,
  Copy,
  Check,
  Heart,
  Calendar,
  Layers,
} from 'lucide-react';
import { SharePublishModal } from '../components/card/SharePublishModal';

interface DashboardPageProps {
  onCreateNewCard: () => void;
  onCreateNewPoster: () => void;
  onEditDesign: (design: PublishedDesign) => void;
  onViewCard: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onCreateNewCard,
  onCreateNewPoster,
  onEditDesign,
  onViewCard,
}) => {
  const [designs, setDesigns] = useState<PublishedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'card' | 'poster'>('all');
  const [activeShareDesign, setActiveShareDesign] = useState<PublishedDesign | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/designs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDesigns(data.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback local
    setDesigns(getLocalDesigns());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this design? The shared link will no longer work.')) {
      await deleteDesign(id);
      setDesigns((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleCopy = (design: PublishedDesign) => {
    const sharePath = design.type === 'poster' ? `/poster/${design.id}` : `/card/${design.id}`;
    const url = `${window.location.origin}${sharePath}`;
    navigator.clipboard.writeText(url);
    setCopiedId(design.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = designs.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-6 selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif text-stone-900 mb-1">
              My Creations & Published Links
            </h1>
            <p className="text-sm text-stone-500 font-sans">
              Manage your personalized greeting cards, proposals, and posters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onCreateNewCard}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Create Card</span>
            </button>
            <button
              onClick={onCreateNewPoster}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Create Poster</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl max-w-xs mb-8">
          {[
            { id: 'all', label: 'All Designs' },
            { id: 'card', label: 'Greeting Cards' },
            { id: 'poster', label: 'Posters' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filterType === tab.id
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Creations List */}
        {loading ? (
          <div className="text-center py-16 text-stone-400 text-sm">Loading your designs...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Heart size={24} />
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-900 mb-1">
              No designs saved yet
            </h3>
            <p className="text-xs text-stone-500 mb-5 max-w-sm mx-auto">
              Start by choosing a template or designing a custom greeting card or poster.
            </p>
            <button
              onClick={onCreateNewCard}
              className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl"
            >
              Start Creating Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((design) => {
              const sharePath = design.type === 'poster' ? `/poster/${design.id}` : `/card/${design.id}`;

              return (
                <div
                  key={design.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header with views and type */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                      <span className="capitalize font-medium px-2 py-0.5 bg-stone-100 rounded-md text-[11px]">
                        {design.type}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-stone-500">
                        <Eye size={13} />
                        <span>{design.views || 0} views</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-serif text-stone-900 mb-1 truncate">
                      {design.title}
                    </h3>

                    {design.recipientName && (
                      <p className="text-xs text-stone-500 mb-3 truncate">
                        For: <strong className="text-stone-700">{design.recipientName}</strong>
                      </p>
                    )}

                    <p className="text-[11px] text-stone-400 font-mono mb-4">
                      ID: {design.id}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopy(design)}
                      className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
                      title="Copy Public Link"
                    >
                      {copiedId === design.id ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    </button>

                    <button
                      onClick={() => setActiveShareDesign(design)}
                      className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Share Options & QR"
                    >
                      <Share2 size={16} />
                    </button>

                    <button
                      onClick={() => onViewCard(design.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleDelete(design.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Design"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {activeShareDesign && (
        <SharePublishModal
          isOpen={!!activeShareDesign}
          onClose={() => setActiveShareDesign(null)}
          design={activeShareDesign}
        />
      )}
    </div>
  );
};
