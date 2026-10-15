import React, { useEffect, useState } from 'react';
import { PublishedDesign } from '../types/card';
import { CARD_TEMPLATES } from '../data/templates';
import {
  ShieldAlert,
  BarChart3,
  Layers,
  Eye,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AdminPageProps {
  onNavigateHome: () => void;
  onViewCard: (id: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome, onViewCard }) => {
  const [stats, setStats] = useState<any>({
    totalDesigns: 0,
    totalCards: 0,
    totalPosters: 0,
    totalViews: 0,
    categories: {},
  });
  const [designs, setDesigns] = useState<PublishedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resStats, resDesigns] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/designs').then((r) => r.json()),
      ]);

      if (resStats.success) {
        setStats(resStats.data);
      }
      if (resDesigns.success) {
        setDesigns(resDesigns.data);
      }
    } catch (e) {
      console.warn('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdminDelete = async (id: string) => {
    if (window.confirm(`Admin Action: Are you sure you want to remove design ${id}?`)) {
      try {
        await fetch(`/api/designs/${id}`, { method: 'DELETE' });
        setDesigns((prev) => prev.filter((d) => d.id !== id));
        fetchAdminData();
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-6 selection:bg-rose-100 selection:text-rose-900">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 text-white text-[11px] font-semibold mb-2">
              <ShieldAlert size={13} className="text-amber-400" />
              <span>Platform Administration Console</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-stone-900">
              WishCraft Admin Overview
            </h1>
          </div>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-xl transition-colors"
          >
            Back to App
          </button>
        </div>

        {/* Analytics KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold uppercase text-stone-500">Total Published</span>
            <p className="text-2xl font-bold font-mono text-stone-900 mt-1">
              {stats.totalDesigns || designs.length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold uppercase text-stone-500">Public Views</span>
            <p className="text-2xl font-bold font-mono text-rose-600 mt-1">
              {stats.totalViews || 0}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold uppercase text-stone-500">Greeting Cards</span>
            <p className="text-2xl font-bold font-mono text-stone-900 mt-1">
              {stats.totalCards || designs.filter((d) => d.type === 'card').length}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-semibold uppercase text-stone-500">Posters</span>
            <p className="text-2xl font-bold font-mono text-stone-900 mt-1">
              {stats.totalPosters || designs.filter((d) => d.type === 'poster').length}
            </p>
          </div>
        </div>

        {/* Published Content Moderation */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 mb-10">
          <h2 className="text-lg font-bold font-serif text-stone-900 mb-4">
            Published Creations Stream
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold">
                <tr>
                  <th className="p-3">Title / ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Published Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {designs.map((design) => (
                  <tr key={design.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-stone-900">{design.title}</div>
                      <div className="font-mono text-[10px] text-stone-400">{design.id}</div>
                    </td>
                    <td className="p-3 capitalize">{design.type}</td>
                    <td className="p-3 capitalize">{design.category}</td>
                    <td className="p-3 font-mono text-stone-700">{design.views || 0}</td>
                    <td className="p-3 text-stone-500">
                      {new Date(design.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onViewCard(design.id)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        title="View Live Card"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleAdminDelete(design.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                        title="Moderate / Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {designs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-stone-400">
                      No published cards found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Template Catalog Status */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-serif text-stone-900">
              Active Official Templates ({CARD_TEMPLATES.length})
            </h2>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>All Active</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CARD_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-800 truncate max-w-[180px]">
                    {tpl.title}
                  </div>
                  <div className="text-[11px] text-stone-400 capitalize">{tpl.category}</div>
                </div>
                <span className="font-mono text-[10px] text-stone-500">{tpl.defaultFormat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
