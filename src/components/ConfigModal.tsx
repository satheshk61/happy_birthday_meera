import React, { useState } from 'react';
import { X, Sparkles, Settings2, RotateCcw } from 'lucide-react';
import { BirthdayConfig, birthdayConfig as defaultConfig } from '../birthdayConfig';
import { sound } from '../utils/audio';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BirthdayConfig;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<BirthdayConfig>({ ...config });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playNavClick();
    onSaveConfig(formData);
    onClose();
  };

  const handleReset = () => {
    sound.playNavClick();
    setFormData({ ...defaultConfig });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-lg my-8 rounded-3xl p-6 sm:p-8 border border-[#f7e7ce]/30 bg-[#25082d] text-[#fffdf9] shadow-2xl">
        <button
          type="button"
          onClick={() => {
            sound.playNavClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#f7e7ce] transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#ffdab9] text-xs font-serif-display uppercase tracking-widest">
          <Settings2 className="w-4 h-4" />
          <span>Personalization Studio</span>
        </div>

        <h3 className="font-serif-display text-2xl font-bold mb-4 text-[#f7e7ce]">
          Customize Meera's Experience
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans text-xs">
          <div>
            <label className="block text-[#f7e7ce]/80 mb-1 font-medium">Recipient Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[#f7e7ce]/30 text-white focus:outline-none focus:border-[#ffdab9]"
            />
          </div>

          <div>
            <label className="block text-[#f7e7ce]/80 mb-1 font-medium">
              Friendship Start Date (for Live Counter)
            </label>
            <input
              type="date"
              value={formData.friendshipDate}
              onChange={(e) => setFormData({ ...formData, friendshipDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[#f7e7ce]/30 text-white focus:outline-none focus:border-[#ffdab9]"
            />
          </div>

          <div>
            <label className="block text-[#f7e7ce]/80 mb-1 font-medium">Hero Subtitle</label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[#f7e7ce]/30 text-white focus:outline-none focus:border-[#ffdab9]"
            />
          </div>

          <div>
            <label className="block text-[#f7e7ce]/80 mb-1 font-medium">Secret Surprise Message</label>
            <input
              type="text"
              value={formData.surpriseMessage}
              onChange={(e) => setFormData({ ...formData, surpriseMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-[#f7e7ce]/30 text-white focus:outline-none focus:border-[#ffdab9]"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b76e79] to-[#924251] hover:from-[#c57984] hover:to-[#a44b5b] text-white text-xs font-medium shadow-md transition-all cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
