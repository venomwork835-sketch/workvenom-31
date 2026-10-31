import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'localStorage' | 'none';
  isValid: boolean;
}

const STORAGE_KEY_URL = 'supabase_url';
const STORAGE_KEY_ANON = 'supabase_anon_key';

// Read configuration from environment variables or localStorage
export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.trim() || '';
  const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.trim() || '';

  if (envUrl && envAnonKey) {
    return {
      url: envUrl,
      anonKey: envAnonKey,
      source: 'env',
      isValid: true,
    };
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    const localUrl = localStorage.getItem(STORAGE_KEY_URL)?.trim() || '';
    const localAnonKey = localStorage.getItem(STORAGE_KEY_ANON)?.trim() || '';

    if (localUrl && localAnonKey) {
      return {
        url: localUrl,
        anonKey: localAnonKey,
        source: 'localStorage',
        isValid: true,
      };
    }
  }

  return {
    url: '',
    anonKey: '',
    source: 'none',
    isValid: false,
  };
}

let activeClient: SupabaseClient | null = null;
let currentConfig: SupabaseConfig = getStoredSupabaseConfig();

function initializeClient(): SupabaseClient | null {
  currentConfig = getStoredSupabaseConfig();
  if (!currentConfig.isValid || !currentConfig.url || !currentConfig.anonKey) {
    activeClient = null;
    return null;
  }

  try {
    activeClient = createClient(currentConfig.url, currentConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return activeClient;
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
    activeClient = null;
    return null;
  }
}

// Initial initialization
initializeClient();

// Get the current Supabase client or re-initialize if needed
export function getSupabaseClient(): SupabaseClient | null {
  if (!activeClient) {
    return initializeClient();
  }
  return activeClient;
}

// Check if Supabase has valid configuration
export function isSupabaseConfigured(): boolean {
  const config = getStoredSupabaseConfig();
  return config.isValid && Boolean(config.url && config.anonKey);
}

// Save credentials into localStorage and re-initialize
export function saveSupabaseConfig(url: string, anonKey: string): { success: boolean; message: string } {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();

  if (!cleanUrl || !cleanKey) {
    return { success: false, message: 'Both Supabase URL and Anon Key are required.' };
  }

  if (!cleanUrl.startsWith('https://') && !cleanUrl.startsWith('http://')) {
    return { success: false, message: 'Supabase URL must start with https:// (e.g. https://your-project.supabase.co)' };
  }

  try {
    localStorage.setItem(STORAGE_KEY_URL, cleanUrl);
    localStorage.setItem(STORAGE_KEY_ANON, cleanKey);
    initializeClient();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supabase-config-changed', {
        detail: { url: cleanUrl, source: 'localStorage' },
      }));
    }

    return { success: true, message: 'Supabase credentials saved successfully!' };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Failed to save to localStorage' };
  }
}

// Clear credentials from localStorage
export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_ANON);
    activeClient = null;
    currentConfig = getStoredSupabaseConfig();

    window.dispatchEvent(new CustomEvent('supabase-config-changed', {
      detail: { url: '', source: 'none' },
    }));
  }
}

// Test live connection to Supabase
export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{
  ok: boolean;
  message: string;
  latencyMs?: number;
}> {
  const targetUrl = (url?.trim() || getStoredSupabaseConfig().url).replace(/\/+$/, '');
  const targetKey = anonKey?.trim() || getStoredSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey) {
    return {
      ok: false,
      message: 'Supabase URL and Anon Key must be provided or configured.',
    };
  }

  const startTime = Date.now();
  try {
    const testClient = createClient(targetUrl, targetKey, {
      auth: { persistSession: false },
    });

    // Test ping by checking auth session or rest health
    const { error } = await testClient.auth.getSession();
    const latency = Date.now() - startTime;

    if (error && error.message.toLowerCase().includes('apikey')) {
      return {
        ok: false,
        message: `Authentication failed: ${error.message}. Please check your Anon Key.`,
      };
    }

    return {
      ok: true,
      message: `Connection successful! Responsive in ${latency}ms.`,
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Network error or invalid Supabase URL. Please verify your Project URL.',
    };
  }
}

// Safe Proxy export for 'supabase' and 'supabaseClient'
// so calling supabase.from(...), supabase.auth, etc. won't throw null errors
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn(`[Supabase] Attempted to access supabase.${String(prop)} but Supabase is not configured yet.`);
      return (..._args: any[]) => {
        console.warn(`[Supabase] Supabase is not configured. Please open Supabase Settings to configure credentials.`);
        return Promise.resolve({
          data: null,
          error: new Error('Supabase client is not configured. Set URL and Anon Key in Supabase Settings.'),
        });
      };
    }
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const supabaseClient = supabase;
