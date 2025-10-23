# 🎯 Instruções para Configurar Salvamento de Estratégias no Canvas

## 📋 **Passo 1: Executar Migração no Supabase**

### 1.1 Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `tyaadzrywqjssmosnpwb`

### 1.2 Execute a Migração SQL
- Clique em **"SQL Editor"** no menu lateral
- Clique em **"New query"**
- Copie e cole o conteúdo do arquivo `create_strategies_table.sql`
- Clique em **"Run"** para executar

### 1.3 Verificar se a Tabela foi Criada
- Após executar, você deve ver uma tabela com as colunas da tabela `strategies`
- Se aparecer erro, verifique se você tem permissões de administrador

## 🎨 **Passo 2: Funcionalidades do Canvas**

### 2.1 Salvar Estratégia
- ✅ **Nome obrigatório**: Digite um nome para a estratégia
- ✅ **Pelo menos 1 nó**: Adicione componentes ao canvas
- ✅ **Botão "Salvar"**: Clique para salvar no Supabase
- ✅ **Validação**: Sistema verifica se usuário está autenticado

### 2.2 Carregar Estratégias
- ✅ **Botão "Carregar"**: Mostra lista de estratégias salvas
- ✅ **Lista interativa**: Clique em qualquer estratégia para carregar
- ✅ **Filtro por usuário**: Só mostra suas próprias estratégias
- ✅ **Ordenação**: Mais recentes primeiro

### 2.3 Interface Melhorada
- ✅ **Painel de estratégias**: Lista deslizante no canto superior esquerdo
- ✅ **Informações detalhadas**: Nome e data de modificação
- ✅ **Botão de fechar**: X para fechar o painel
- ✅ **Responsivo**: Funciona em diferentes tamanhos de tela

## 🔧 **Passo 3: Estrutura da Tabela**

```sql
CREATE TABLE public.strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## 🚀 **Passo 4: Testar Funcionalidades**

### 4.1 Teste de Salvamento
1. Acesse `/canvas`
2. Adicione alguns nós ao canvas
3. Digite um nome para a estratégia
4. Clique em "Salvar"
5. Verifique se aparece mensagem de sucesso

### 4.2 Teste de Carregamento
1. Clique em "Carregar"
2. Verifique se aparece a lista de estratégias
3. Clique em uma estratégia para carregar
4. Verifique se os nós aparecem no canvas

### 4.3 Teste de Validação
1. Tente salvar sem nome → Deve mostrar erro
2. Tente salvar sem nós → Deve mostrar erro
3. Teste sem estar logado → Deve mostrar erro

## 🎯 **Funcionalidades Implementadas**

### ✅ **Salvamento Inteligente**
- Validação de usuário autenticado
- Validação de nome obrigatório
- Validação de pelo menos 1 nó
- Tratamento de erros detalhado
- Logs para debug

### ✅ **Carregamento Eficiente**
- Lista apenas estratégias do usuário
- Ordenação por data de modificação
- Interface intuitiva
- Carregamento rápido

### ✅ **Interface Moderna**
- Painel deslizante responsivo
- Botões de ação claros
- Feedback visual
- Acessibilidade

### ✅ **Segurança**
- RLS (Row Level Security) ativado
- Políticas de acesso por usuário
- Validação de dados
- Prevenção de SQL injection

## 🔍 **Troubleshooting**

### Erro: "Tabela strategies não existe"
- Execute a migração SQL no Supabase Dashboard
- Verifique se a tabela foi criada corretamente

### Erro: "Usuário não autenticado"
- Faça login no sistema
- Verifique se a sessão não expirou

### Erro: "Erro ao salvar estratégia"
- Verifique se o nome não está vazio
- Verifique se há pelo menos 1 nó no canvas
- Verifique a conexão com o Supabase

### Lista de estratégias vazia
- Verifique se você salvou alguma estratégia
- Verifique se está logado com o usuário correto
- Verifique se a tabela tem dados

## 📱 **Próximos Passos**

1. **Executar a migração** no Supabase
2. **Testar salvamento** de estratégias
3. **Testar carregamento** de estratégias
4. **Feedback** sobre a funcionalidade
5. **Melhorias** baseadas no uso

---

**🎉 Após executar a migração, o Canvas estará completamente funcional para salvar e carregar estratégias!**
