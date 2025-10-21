# 🔧 Instruções de Migração do Banco de Dados

## ⚠️ IMPORTANTE: Execute este SQL no Supabase

Para que o sistema funcione corretamente com todas as funcionalidades (edição de projetos, controle de pagamentos, etc.), você precisa executar o SQL abaixo no **Supabase SQL Editor**.

### 📋 Como Executar:

1. Acesse: https://supabase.com/dashboard/project/tyaadzrywqjssmosnpwb/sql
2. Cole o SQL abaixo
3. Clique em **"Run"**

### 🗄️ SQL para Executar:

```sql
-- Adicionar coluna paid_value à tabela projects
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS paid_value DECIMAL(10, 2) DEFAULT 0;

-- Atualizar constraint de payment_status para incluir novos status
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_payment_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_payment_status_check 
CHECK (payment_status IN ('paid', 'pending', 'will_pay', 'not_paid', 'cancelled'));

-- Verificar se a coluna foi criada
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'paid_value';
```

### ✅ Verificação:

Após executar, você deve ver:
- ✓ Coluna `paid_value` criada
- ✓ Constraint de `payment_status` atualizado
- ✓ Sistema funcionando sem erros ao salvar

### 🐛 Se ainda houver erros:

1. Verifique se a migração foi executada com sucesso
2. Atualize a página do sistema (Ctrl/Cmd + R)
3. Limpe o cache do navegador
4. Verifique o console do navegador (F12) para mais detalhes

### 📝 O que esta migração adiciona:

- **`paid_value`**: Campo para controlar quanto já foi pago do projeto
- **Novos status de pagamento**:
  - `pending` - Pendente
  - `will_pay` - Cliente Vai Pagar
  - `paid` - Pago
  - `not_paid` - Não Pago
  - `cancelled` - Cancelado

