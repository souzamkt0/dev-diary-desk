-- Teste simples para verificar se paid_value existe
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'paid_value';

-- Se não retornar nada, a coluna não existe
-- Se retornar dados, a coluna existe e está configurada
