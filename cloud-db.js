// cloud-db.js - Full auto-inject and cloud sync for INVYXMAX
(function() {
    // 1. Automatically inject the Supabase library into your page so you don't have to touch HTML
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = initCloudDB;
    document.head.appendChild(script);

    const SUPABASE_URL = "https://opwnzmuswljkivzwsigv.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wd256bXVzd2xqa2l2endzaWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzE3NTMsImV4cCI6MjA1NTc0Nzc1M30.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wd256bXVzd2xqa2l2endzaWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzE3NTMsImV4cCI6MjA1NTc0Nzc1M30.eyJh";
    const ROW_ID = 1;

    async function initCloudDB() {
        try {
            const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            // Override global load/save if they exist or set them up
            window.loadDB = async function() {
                const { data, error } = await supabaseClient
                    .from('app_data')
                    .select('payload')
                    .eq('id', ROW_ID)
                    .single();
                if (error || !data) return typeof DEFAULT_DB !== 'undefined' ? structuredClone(DEFAULT_DB) : {};
                return data.payload;
            };

            window.saveDB = async function() {
                if (typeof db === 'undefined') return;
                await supabaseClient
                    .from('app_data')
                    .upsert({ id: ROW_ID, payload: db });
            };

            // Initial load
            const loaded = await window.loadDB();
            if (typeof db !== 'undefined') {
                Object.assign(db, loaded);
            }
        } catch (e) {
            console.error("Cloud DB initialization error:", e);
        }
    }
})();