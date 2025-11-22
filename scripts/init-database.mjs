import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Initialisation de la base de données MBS...\n');

async function executeSQLFromFile() {
  try {
    const sql = readFileSync(join(__dirname, '..', 'database-setup.sql'), 'utf8');

    console.log('📄 Fichier SQL chargé avec succès');
    console.log('⚠️  Note: Pour exécuter ce SQL, vous devez le copier dans l\'éditeur SQL de Supabase');
    console.log('   ou utiliser les outils Supabase CLI.\n');

    console.log('Pour configurer la base de données:');
    console.log('1. Allez sur: ' + supabaseUrl.replace('/rest/v1', '') + '/project/default/sql');
    console.log('2. Copiez le contenu de database-setup.sql');
    console.log('3. Collez-le dans l\'éditeur SQL');
    console.log('4. Cliquez sur "Run"\n');

    console.log('Ou exécutez cette commande si vous avez Supabase CLI:');
    console.log('npx supabase db push\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

executeSQLFromFile();
