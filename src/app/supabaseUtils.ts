import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://seweuyiyvicoqvtgjwss.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld2V1eWl5dmljb3F2dGdqd3NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODkxMDQsImV4cCI6MjA1OTc2NTEwNH0.VmAIM06-p4MZz8fxB3HbTzo1QiA9-JBoabp-Aehu2ko';
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function salvaProgressiUtente({ nome, eta, peso, altezza, obiettivo, email, completed_days }: { nome: string; eta: number; peso: number; altezza: number; obiettivo: string; email: string; completed_days: number[] }) {
  const { data, error } = await supabase
    .from('utenti_progressi')
    .upsert([
      { nome, eta, peso, altezza, obiettivo, email, completed_days }
    ], { onConflict: 'email' });
  return { data, error };
}
