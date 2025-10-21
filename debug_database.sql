-- ==========================================
-- DEBUG: Verificar estrutura da tabela projects
-- ==========================================
-- Execute este SQL no Supabase para diagnosticar o problema

-- 1. Verificar se a coluna paid_value existe
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

-- 2. Verificar constraints da tabela
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

-- 3. Verificar dados de um projeto específico
SELECT id, name, client_id, value, paid_value, payment_status, status
FROM projects 
LIMIT 5;

-- 4. Testar inserção de dados (não executar, apenas para referência)
-- INSERT INTO projects (name, user_id, value, paid_value, payment_status, status)
-- VALUES ('Teste', 'user-id', 1000, 0, 'pending', 'todo');
