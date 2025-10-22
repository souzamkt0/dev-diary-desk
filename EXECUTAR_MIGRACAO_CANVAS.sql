-- ========================================
-- MIGRAÇÃO: Criar Tabela de Estratégias
-- ========================================
-- Execute este script no Supabase SQL Editor
-- para criar a tabela de estratégias do Canvas

-- Criar tabela de estratégias para o Canvas
CREATE TABLE IF NOT EXISTS strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_strategies_user_id ON strategies(user_id);
CREATE INDEX IF NOT EXISTS idx_strategies_created_at ON strategies(created_at);
CREATE INDEX IF NOT EXISTS idx_strategies_is_active ON strategies(is_active);

-- Habilitar RLS
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

-- Política RLS: usuários só podem ver suas próprias estratégias
CREATE POLICY "Users can view their own strategies" ON strategies
  FOR SELECT USING (auth.uid() = user_id);

-- Política RLS: usuários só podem inserir suas próprias estratégias
CREATE POLICY "Users can insert their own strategies" ON strategies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política RLS: usuários só podem atualizar suas próprias estratégias
CREATE POLICY "Users can update their own strategies" ON strategies
  FOR UPDATE USING (auth.uid() = user_id);

-- Política RLS: usuários só podem deletar suas próprias estratégias
CREATE POLICY "Users can delete their own strategies" ON strategies
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFICAÇÃO
-- ========================================
-- Verificar se a tabela foi criada corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'strategies'
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'strategies';
