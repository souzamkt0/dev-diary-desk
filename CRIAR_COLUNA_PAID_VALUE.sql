-- ==========================================
-- CRIAR COLUNA PAID_VALUE - Dev Diary Desk
-- ==========================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/tyaadzrywqjssmosnpwb/sql
-- ==========================================

-- 1. CRIAR A COLUNA PAID_VALUE
ALTER TABLE public.projects 
ADD COLUMN paid_value DECIMAL(10, 2) DEFAULT 0;

-- 2. ATUALIZAR CONSTRAINT DE PAYMENT_STATUS
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_payment_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_payment_status_check 
CHECK (payment_status IN ('paid', 'pending', 'will_pay', 'not_paid', 'cancelled'));

-- 3. ATUALIZAR PROJETOS EXISTENTES
-- Define paid_value como 0 para projetos que não têm valor definido
UPDATE public.projects 
SET paid_value = 0 
WHERE paid_value IS NULL;

-- 4. PARA PROJETOS JÁ MARCADOS COMO "PAID", DEFINE PAID_VALUE IGUAL AO VALUE
UPDATE public.projects 
SET paid_value = value 
WHERE payment_status = 'paid' 
AND (paid_value IS NULL OR paid_value = 0);

-- 5. VERIFICAR SE FOI CRIADA CORRETAMENTE
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'paid_value';

-- 6. VERIFICAR DADOS ATUALIZADOS
SELECT 
    id, 
    name, 
    value, 
    paid_value, 
    payment_status
FROM projects 
LIMIT 5;

-- ==========================================
-- RESULTADO ESPERADO
-- ==========================================
-- Você deve ver:
-- 1. Coluna 'paid_value' do tipo 'numeric' com default 0
-- 2. Projetos com paid_value = 0 ou igual ao value (se payment_status = 'paid')
-- 3. Constraint atualizado com todos os status de pagamento
-- ==========================================
