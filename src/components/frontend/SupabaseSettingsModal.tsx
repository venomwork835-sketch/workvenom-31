import React, { useState, useEffect } from 'react';
import {
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Server,
  Zap,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  SupabaseConfig,
} from '../../lib/supabaseClient';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [config, setConfig] = useState<SupabaseConfig>(getStoredSupabaseConfig());
  const [testState, setTestState] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
    latencyMs?: number;
  }>({ loading: false });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync inputs with stored configuration whenever opened
  useEffect(() => {
    if (isOpen) {
      const current = getStoredSupabaseConfig();
      setConfig(current);
      setUrl(current.url);
      setAnonKey(current.anonKey);
      setTestState({ loading: false });
      setSaveSuccessMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestState({ loading: true, message: undefined });
    setSaveSuccessMsg(null);
    const result = await testSupabaseConnection(url, anonKey);
    setTestState({
      loading: false,
      success: result.ok,
      message: result.message,
      latencyMs: result.latencyMs,
    });
  };

  const handleSave = () => {
    setSaveSuccessMsg(null);
    const res = saveSupabaseConfig(url, anonKey);
    if (res.success) {
      const updated = getStoredSupabaseConfig();
      setConfig(updated);
      setSaveSuccessMsg('Supabase credentials successfully saved to localStorage!');
      setTestState({
        loading: false,
        success: true,
        message: 'Saved & ready! The client will use these credentials across all tabs.',
      });
    } else {
      setTestState({
        loading: false,
        success: false,
        message: res.message,
      });
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to remove your Supabase credentials from localStorage?')) {
      clearSupabaseConfig();
      setUrl('');
      setAnonKey('');
      setConfig(getStoredSupabaseConfig());
      setTestState({
        loading: false,
        message: 'Credentials removed from localStorage.',
      });
      setSaveSuccessMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Supabase Connection</h3>
                {config.isValid ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Not Configured
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Configure your Supabase Cloud Database URL & Anon Key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-200 text-sm">
          {/* Storage Source Notice */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>
                Source:{' '}
                <strong className="text-white">
                  {config.source === 'env'
                    ? 'Environment Variables (.env)'
                    : config.source === 'localStorage'
                    ? 'Browser LocalStorage'
                    : 'Not Configured'}
                </strong>
              </span>
            </div>
            {config.source === 'localStorage' && (
              <span className="text-[11px] text-emerald-400 font-medium">Persisted in this browser</span>
            )}
            {config.source === 'env' && (
              <span className="text-[11px] text-blue-400 font-medium">Read from VITE_SUPABASE_*</span>
            )}
          </div>

          {/* Input Form */}
          <div className="space-y-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Supabase Project URL
                </span>
                <span className="text-[10px] text-slate-400 lowercase">https://[id].supabase.co</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzabcdefg.supabase.co"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition"
              />
            </div>

            {/* Supabase Anon Key */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-400" />
                  Supabase Anon / Public API Key
                </span>
                <span className="text-[10px] text-slate-400">Project API Keys (anon public)</span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-11 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Status or Success Banner */}
          {testState.message && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                testState.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              {testState.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testState.message}</p>
                {testState.latencyMs !== undefined && (
                  <p className="text-[11px] text-emerald-400/80 mt-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Latency: {testState.latencyMs}ms
                  </p>
                )}
              </div>
            </div>
          )}

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* Instructions Guide */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Where to find these keys in Supabase?</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                Open Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Log in to your <strong>Supabase Dashboard</strong> and select your project.</li>
              <li>Go to <strong>Project Settings</strong> (gear icon) &gt; <strong>API</strong>.</li>
              <li>Copy the <strong>Project URL</strong> and paste into the URL field above.</li>
              <li>Under <strong>Project API keys</strong>, copy the <strong>anon public</strong> key.</li>
            </ol>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.source === 'localStorage' && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/30 rounded-xl transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear from LocalStorage
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testState.loading || !url.trim() || !anonKey.trim()}
              className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 rounded-xl transition flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testState.loading ? 'animate-spin' : ''}`} />
              {testState.loading ? 'Testing...' : 'Test Connection'}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!url.trim() || !anonKey.trim()}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
