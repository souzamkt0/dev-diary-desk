-- ==========================================
-- DIAGNÓSTICO COMPLETO - Dev Diary Desk
-- ==========================================
-- Execute este SQL no Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/tyaadzrywqjssmosnpwb/sql
-- ==========================================

-- 1. VERIFICAR SE A TABELA PROJECTS EXISTE
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name = 'projects';

-- 2. VERIFICAR TODAS AS COLUNAS DA TABELA PROJECTS
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- 3. VERIFICAR SE A COLUNA PAID_VALUE EXISTE ESPECIFICAMENTE
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'paid_value';

-- 4. VERIFICAR CONSTRAINTS DA TABELA
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'projects';

-- 5. VERIFICAR DADOS EXISTENTES (LIMITADO)
SELECT 
    id, 
    name, 
    value, 
    paid_value, 
    payment_status, 
    status,
    created_at
FROM projects 
LIMIT 3;

-- 6. TENTAR CRIAR A COLUNA PAID_VALUE SE NÃO EXISTIR
-- (Execute apenas se a coluna não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'paid_value'
    ) THEN
        ALTER TABLE public.projects 
        ADD COLUMN paid_value DECIMAL(10, 2) DEFAULT 0;
        
        RAISE NOTICE 'Coluna paid_value criada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna paid_value já existe';
    END IF;
END $$;

-- 7. VERIFICAR NOVAMENTE APÓS TENTATIVA DE CRIAÇÃO
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'paid_value';

-- 8. ATUALIZAR CONSTRAINT DE PAYMENT_STATUS
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_payment_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_payment_status_check 
CHECK (payment_status IN ('paid', 'pending', 'will_pay', 'not_paid', 'cancelled'));

-- 9. VERIFICAÇÃO FINAL
SELECT 
    'VERIFICAÇÃO FINAL' as status,
    COUNT(*) as total_projects,
    COUNT(CASE WHEN paid_value IS NOT NULL THEN 1 END) as projects_with_paid_value
FROM projects;
