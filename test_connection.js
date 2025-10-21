// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tyaadzrywqjssmosnpwb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YWFkenJ5d3Fqc3Ntb3NucHdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNDI5MTQsImV4cCI6MjA3NjYxODkxNH0.v6_ZneViDLYWx2Hib804NRjl-tPQzvhH_hGxX8tY6Bg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Teste 1: Verificar se consegue acessar a tabela projects
    console.log('📋 Testando acesso à tabela projects...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, name, value')
      .limit(1);
    
    if (projectsError) {
      console.error('❌ Erro ao acessar tabela projects:', projectsError);
      return;
    }
    
    console.log('✅ Tabela projects acessível:', projects);
    
    // Teste 2: Verificar estrutura da tabela
    console.log('🔍 Verificando estrutura da tabela...');
    const { data: structure, error: structureError } = await supabase
      .rpc('get_table_structure', { table_name: 'projects' });
    
    if (structureError) {
      console.log('⚠️ Não foi possível verificar estrutura via RPC, tentando método alternativo...');
    } else {
      console.log('✅ Estrutura da tabela:', structure);
    }
    
    // Teste 3: Tentar inserir um registro de teste
    console.log('🧪 Testando inserção de dados...');
    const testData = {
      name: 'Teste de Conexão',
      value: 100,
      paid_value: 0,
      payment_status: 'pending',
      status: 'todo',
      user_id: 'test-user'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('projects')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir dados de teste:', insertError);
      console.error('Detalhes do erro:', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      console.log('✅ Inserção de teste bem-sucedida:', insertData);
      
      // Limpar dados de teste
      if (insertData && insertData[0]) {
        await supabase
          .from('projects')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Dados de teste removidos');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testConnection();
