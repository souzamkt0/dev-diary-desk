-- ==========================================
-- MIGRAÇÃO DO BANCO DE DADOS - Dev Diary Desk
-- ==========================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/tyaadzrywqjssmosnpwb/sql
-- ==========================================

-- 1. Adicionar coluna paid_value à tabela projects
-- Esta coluna armazena o valor já pago do projeto
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS paid_value DECIMAL(10, 2) DEFAULT 0;

-- 2. Remover constraint antiga de payment_status (se existir)
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_payment_status_check;

-- 3. Adicionar nova constraint com todos os status de pagamento
ALTER TABLE public.projects 
ADD CONSTRAINT projects_payment_status_check 
CHECK (payment_status IN ('paid', 'pending', 'will_pay', 'not_paid', 'cancelled'));

-- 4. Atualizar projetos existentes para garantir compatibilidade
-- Define paid_value como 0 para projetos que não têm valor definido
UPDATE public.projects 
SET paid_value = 0 
WHERE paid_value IS NULL;

-- 5. Para projetos já marcados como "paid", define paid_value igual ao value
UPDATE public.projects 
SET paid_value = value 
WHERE payment_status = 'paid' 
AND (paid_value IS NULL OR paid_value = 0);

-- ==========================================
-- VERIFICAÇÃO
-- ==========================================
-- Execute este SELECT para verificar se tudo está OK

SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('paid_value', 'payment_status', 'value')
ORDER BY column_name;

-- Verificar constraint
SELECT 
    constraint_name, 
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'projects'
AND constraint_name LIKE '%payment%';

-- ==========================================
-- RESULTADO ESPERADO
-- ==========================================
-- Você deve ver:
-- 1. Coluna 'paid_value' do tipo 'numeric' com default 0
-- 2. Coluna 'payment_status' do tipo 'text'
-- 3. Coluna 'value' do tipo 'numeric'
-- 4. Constraint 'projects_payment_status_check'
-- ==========================================
