-- Adicionar coluna paid_value à tabela projects
-- Execute este SQL no Supabase SQL Editor

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS paid_value DECIMAL(10, 2) DEFAULT 0;

-- Atualizar constraint de payment_status para incluir novos status
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_payment_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_payment_status_check 
CHECK (payment_status IN ('paid', 'pending', 'will_pay', 'not_paid', 'cancelled'));
