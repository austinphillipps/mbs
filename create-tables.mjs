import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();

const apiUrl = supabaseUrl.replace('/rest/v1', '');

console.log('🚀 Configuration de la base de données MBS\n');
console.log('📍 URL:', apiUrl);
console.log('\n' + '='.repeat(60));
console.log('\n⚠️  INSTRUCTIONS IMPORTANTES\n');
console.log('Pour créer les tables de la base de données:');
console.log('\n1. Ouvrez votre navigateur et allez sur:');
console.log(`   ${apiUrl}/project/default/sql/new\n`);
console.log('2. Copiez TOUT le contenu du fichier "database-setup.sql"');
console.log('   (qui se trouve à la racine du projet)\n');
console.log('3. Collez-le dans l\'éditeur SQL de Supabase\n');
console.log('4. Cliquez sur le bouton "RUN" pour exécuter\n');
console.log('5. Attendez que toutes les tables soient créées\n');
console.log('6. Vous verrez un message de succès\n');
console.log('='.repeat(60));
console.log('\n✅ Une fois terminé, vous pourrez:');
console.log('   • Créer un compte utilisateur');
console.log('   • Vous connecter à l\'application');
console.log('   • Commencer à gérer vos stocks et clients\n');
console.log('📧 Pour créer un utilisateur admin, utilisez:');
console.log('   Email: admin@mbs.com');
console.log('   Mot de passe: votre_mot_de_passe_sécurisé\n');
console.log('Puis dans le SQL Editor, exécutez:');
console.log(`   INSERT INTO profiles (id, email, full_name, role)`);
console.log(`   SELECT id, email, 'Administrateur MBS', 'admin'`);
console.log(`   FROM auth.users WHERE email = 'admin@mbs.com';`);
console.log('\n' + '='.repeat(60) + '\n');
