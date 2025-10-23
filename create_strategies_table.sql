-- =====================================================
-- MIGRAÇÃO: Criar tabela strategies para Canvas
-- =====================================================
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Criar tabela strategies para salvar estratégias do Canvas
CREATE TABLE IF NOT EXISTS public.strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- Política para usuários gerenciarem suas próprias estratégias
CREATE POLICY "Users can manage their own strategies"
  ON public.strategies FOR ALL
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at_strategies()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER set_updated_at_strategies
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at_strategies();

-- Verificar se a tabela foi criada
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'strategies' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
