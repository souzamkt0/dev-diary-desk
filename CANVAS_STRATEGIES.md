# 🎨 Canvas de Estratégias CRM

## Visão Geral

O Canvas de Estratégias é uma ferramenta visual estilo n8n que permite criar, gerenciar e executar estratégias de CRM através de uma interface drag-and-drop intuitiva. Você pode "ligar os pontos" criando fluxos visuais que automatizam processos de negócio.

## 🚀 Funcionalidades

### ✨ Componentes Disponíveis

#### **Gatilhos (Triggers)**
- **Gatilho**: Inicia um fluxo baseado em eventos
- **Webhook**: Recebe dados de sistemas externos
- **Formulário**: Captura dados de formulários web
- **API**: Conecta com APIs externas

#### **Ações**
- **Ação**: Executa uma tarefa específica
- **Email**: Envia emails automatizados
- **SMS**: Envia mensagens de texto
- **Tarefa**: Cria tarefas no sistema
- **Notificação**: Envia notificações internas

#### **Lógica de Negócio**
- **Condição**: Avalia condições e toma decisões
- **Decisão**: Roteia o fluxo baseado em critérios
- **Atraso**: Adiciona pausas temporais no fluxo
- **Aprovação**: Requer aprovação manual
- **Rejeição**: Rejeita automaticamente

#### **Dados**
- **Dados**: Armazena e processa informações
- **Banco**: Conecta com banco de dados
- **Integração**: Integra com sistemas externos
- **Relatório**: Gera relatórios automáticos

#### **CRM Específico**
- **Lead**: Gerencia leads
- **Oportunidade**: Acompanha oportunidades de vendas
- **Negócio**: Gerencia negócios fechados
- **Cliente**: Gerencia clientes
- **Campanha**: Executa campanhas de marketing
- **Follow-up**: Agenda follow-ups
- **Reunião**: Agenda reuniões
- **Lembrete**: Cria lembretes

#### **Status e Controle**
- **Sucesso**: Indica sucesso na operação
- **Erro**: Indica erro na operação
- **Aviso**: Indica avisos
- **Info**: Fornece informações
- **Personalizado**: Cria componentes customizados

## 🎯 Como Usar

### 1. **Criar Nova Estratégia**
1. Acesse o menu "Canvas" na sidebar
2. Digite o nome da estratégia no campo superior
3. Clique em "Salvar" para persistir

### 2. **Adicionar Componentes**
1. Na sidebar esquerda, escolha o tipo de componente
2. Clique no componente desejado
3. Ele será adicionado automaticamente ao canvas

### 3. **Conectar Componentes**
1. Passe o mouse sobre um componente
2. Arraste da bolinha de conexão para outro componente
3. A conexão será criada automaticamente

### 4. **Configurar Componentes**
1. Clique em um componente para selecioná-lo
2. Use o painel de propriedades para configurar
3. Adicione descrições e parâmetros específicos

### 5. **Executar Estratégia**
1. Clique no botão "Executar" no header
2. A estratégia será executada em tempo real
3. Monitore o progresso no painel de informações

## 💾 Salvamento e Carregamento

### **Salvar Estratégia**
- Clique em "Salvar" para salvar no banco de dados
- A estratégia será associada ao seu usuário
- Dados são persistidos automaticamente

### **Exportar Estratégia**
- Clique em "Exportar" para baixar arquivo JSON
- Útil para backup e compartilhamento
- Inclui todos os nós e conexões

### **Importar Estratégia**
- Clique em "Importar" e selecione arquivo JSON
- Estratégia será carregada no canvas
- Substitui a estratégia atual

## 🔧 Exemplos de Estratégias

### **1. Captura de Lead**
```
Formulário → Dados → Email de Boas-vindas → Tarefa de Follow-up
```

### **2. Processo de Vendas**
```
Lead → Qualificação → Oportunidade → Proposta → Negócio
```

### **3. Campanha de Marketing**
```
Campanha → Segmentação → Email → Follow-up → Relatório
```

### **4. Suporte ao Cliente**
```
Chat → Classificação → Tarefa → Resolução → Feedback
```

### **5. Onboarding de Cliente**
```
Novo Cliente → Email de Boas-vindas → Reunião → Treinamento → Aprovação
```

## 🎨 Personalização

### **Temas**
- Suporte completo a modo escuro/claro
- Cores personalizáveis por tipo de componente
- Interface responsiva

### **Componentes Customizados**
- Crie seus próprios tipos de componentes
- Defina ícones e cores personalizadas
- Adicione lógica específica do negócio

## 📊 Monitoramento

### **Painel de Informações**
- Número total de nós
- Número de conexões
- Status de execução
- Tempo de execução

### **Logs de Execução**
- Histórico de execuções
- Erros e avisos
- Performance metrics

## 🔒 Segurança

### **Controle de Acesso**
- Estratégias privadas por usuário
- RLS (Row Level Security) habilitado
- Autenticação obrigatória

### **Validação de Dados**
- Validação de entrada em todos os componentes
- Sanitização de dados
- Prevenção de SQL injection

## 🚀 Próximas Funcionalidades

- [ ] Execução em tempo real
- [ ] Templates de estratégias
- [ ] Colaboração em tempo real
- [ ] Versionamento de estratégias
- [ ] Analytics avançados
- [ ] Integração com webhooks
- [ ] API para execução externa
- [ ] Notificações push
- [ ] Relatórios de performance
- [ ] A/B testing de estratégias

## 🛠️ Tecnologias Utilizadas

- **React Flow**: Canvas visual drag-and-drop
- **React**: Framework frontend
- **TypeScript**: Tipagem estática
- **Supabase**: Backend e banco de dados
- **Tailwind CSS**: Estilização
- **shadcn/ui**: Componentes de interface
- **Lucide React**: Ícones

## 📝 Notas de Desenvolvimento

### **Estrutura do Banco**
```sql
strategies (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  nodes JSONB,
  edges JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  user_id UUID
)
```

### **Formato dos Nós**
```json
{
  "id": "unique-id",
  "type": "component-type",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Nome do Componente",
    "description": "Descrição detalhada"
  }
}
```

### **Formato das Conexões**
```json
{
  "id": "connection-id",
  "source": "source-node-id",
  "target": "target-node-id",
  "type": "default"
}
```

---

**🎉 Pronto para criar estratégias incríveis! Use o Canvas para automatizar seus processos de CRM e "ligar os pontos" de forma visual e intuitiva.**
