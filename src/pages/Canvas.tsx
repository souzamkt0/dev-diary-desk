import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  NodeTypes,
  EdgeTypes,
  MarkerType,
  ConnectionLineType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './Canvas.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Play, 
  Pause,
  Settings,
  Zap,
  Users,
  Target,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  Globe,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Shield,
  Star,
  Heart,
  Brain,
  Lightbulb,
  Rocket,
  Wrench,
  Filter,
  Search,
  Eye,
  Edit,
  Copy,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Componente genérico para todos os nós
function GenericNode({ data, selected, type, onLabelChange, onDescriptionChange, onDelete, showHandles }: {
  data: any;
  selected: boolean;
  type: string;
  onLabelChange?: (newLabel: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  onDelete?: () => void;
  showHandles?: boolean;
}) {
  const getIcon = () => {
    const icons = {
      trigger: Zap,
      action: Play,
      condition: Filter,
      data: Database,
      integration: Globe,
      notification: MessageSquare,
      decision: Target,
      delay: Clock,
      webhook: ArrowRight,
      email: Mail,
      sms: Phone,
      task: CheckCircle,
      lead: Users,
      opportunity: TrendingUp,
      deal: DollarSign,
      customer: Heart,
      campaign: Rocket,
      report: BarChart3,
      automation: Wrench,
      workflow: Settings,
      api: Globe,
      database: Database,
      form: FileText,
      chat: MessageSquare,
      meeting: Calendar,
      followup: ArrowRight,
      reminder: Clock,
      approval: CheckCircle,
      rejection: AlertCircle,
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertCircle,
      info: Eye,
      custom: Settings,
    };
    const IconComponent = icons[type as keyof typeof icons] || Settings;
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  return (
    <BaseNode 
      data={data} 
      selected={selected} 
      type={type}
      onLabelChange={onLabelChange}
      onDescriptionChange={onDescriptionChange}
      onDelete={onDelete}
      showHandles={showHandles}
    >
      {getIcon()}
    </BaseNode>
  );
}

// Criar tipos de nós com callbacks
const createNodeTypes = (updateNodeLabel: (nodeId: string, newLabel: string) => void, updateNodeDescription: (nodeId: string, newDescription: string) => void, deleteNode: (nodeId: string) => void, showHandles: boolean): NodeTypes => ({
  trigger: (props) => <GenericNode {...props} type="trigger" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  action: (props) => <GenericNode {...props} type="action" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  condition: (props) => <GenericNode {...props} type="condition" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  data: (props) => <GenericNode {...props} type="data" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  integration: (props) => <GenericNode {...props} type="integration" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  notification: (props) => <GenericNode {...props} type="notification" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  decision: (props) => <GenericNode {...props} type="decision" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  delay: (props) => <GenericNode {...props} type="delay" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  webhook: (props) => <GenericNode {...props} type="webhook" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  email: (props) => <GenericNode {...props} type="email" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  sms: (props) => <GenericNode {...props} type="sms" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  task: (props) => <GenericNode {...props} type="task" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  lead: (props) => <GenericNode {...props} type="lead" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  opportunity: (props) => <GenericNode {...props} type="opportunity" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  deal: (props) => <GenericNode {...props} type="deal" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  customer: (props) => <GenericNode {...props} type="customer" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  campaign: (props) => <GenericNode {...props} type="campaign" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  report: (props) => <GenericNode {...props} type="report" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  automation: (props) => <GenericNode {...props} type="automation" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  workflow: (props) => <GenericNode {...props} type="workflow" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  api: (props) => <GenericNode {...props} type="api" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  database: (props) => <GenericNode {...props} type="database" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  form: (props) => <GenericNode {...props} type="form" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  chat: (props) => <GenericNode {...props} type="chat" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  meeting: (props) => <GenericNode {...props} type="meeting" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  followup: (props) => <GenericNode {...props} type="followup" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  reminder: (props) => <GenericNode {...props} type="reminder" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  approval: (props) => <GenericNode {...props} type="approval" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  rejection: (props) => <GenericNode {...props} type="rejection" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  success: (props) => <GenericNode {...props} type="success" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  error: (props) => <GenericNode {...props} type="error" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  warning: (props) => <GenericNode {...props} type="warning" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  info: (props) => <GenericNode {...props} type="info" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
  custom: (props) => <GenericNode {...props} type="custom" onLabelChange={(newLabel) => updateNodeLabel(props.id, newLabel)} onDescriptionChange={(newDescription) => updateNodeDescription(props.id, newDescription)} onDelete={() => deleteNode(props.id)} showHandles={showHandles} />,
});

// Tipos de conexões customizados
const edgeTypes: EdgeTypes = {};

// Componente base para nós
function BaseNode({ data, selected, type, children, onLabelChange, onDescriptionChange, onDelete, showHandles = true }: { 
  data: any; 
  selected: boolean; 
  type: string; 
  children: React.ReactNode;
  onLabelChange?: (newLabel: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  onDelete?: () => void;
  showHandles?: boolean;
}) {
  const labelRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  // Sincronizar estados temporários quando os dados mudam
  useEffect(() => {
    if (labelRef.current) {
      const next = data.label || '';
      if (labelRef.current.textContent !== next) {
        labelRef.current.textContent = next;
      }
    }
  }, [data.label]);

  useEffect(() => {
    if (descriptionRef.current) {
      const next = data.description || '';
      if (descriptionRef.current.textContent !== next) {
        descriptionRef.current.textContent = next;
      }
    }
  }, [data.description]);

  const focusEditable = (ref: React.RefObject<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    if (typeof window !== 'undefined') {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const getNodeColor = () => {
    const colors = {
      trigger: 'bg-blue-500',
      action: 'bg-green-500',
      condition: 'bg-yellow-500',
      data: 'bg-purple-500',
      integration: 'bg-indigo-500',
      notification: 'bg-pink-500',
      decision: 'bg-orange-500',
      delay: 'bg-gray-500',
      webhook: 'bg-cyan-500',
      email: 'bg-red-500',
      sms: 'bg-teal-500',
      task: 'bg-amber-500',
      lead: 'bg-emerald-500',
      opportunity: 'bg-violet-500',
      deal: 'bg-rose-500',
      customer: 'bg-sky-500',
      campaign: 'bg-lime-500',
      report: 'bg-fuchsia-500',
      automation: 'bg-stone-500',
      workflow: 'bg-slate-500',
      api: 'bg-zinc-500',
      database: 'bg-neutral-500',
      form: 'bg-orange-400',
      chat: 'bg-blue-400',
      meeting: 'bg-green-400',
      followup: 'bg-yellow-400',
      reminder: 'bg-purple-400',
      approval: 'bg-green-600',
      rejection: 'bg-red-600',
      success: 'bg-green-700',
      error: 'bg-red-700',
      warning: 'bg-yellow-600',
      info: 'bg-blue-600',
      custom: 'bg-gray-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const handleLabelBlur = () => {
    const rawValue = (labelRef.current?.textContent ?? '').trim();
    const nextValue = rawValue || 'Novo Nó';
    if (labelRef.current) {
      labelRef.current.textContent = nextValue;
    }
    if (nextValue !== (data.label || '')) {
      onLabelChange?.(nextValue);
    }
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const original = data.label || '';
      if (labelRef.current) {
        labelRef.current.textContent = original;
        labelRef.current.blur();
      }
    }
  };

  const handleDescriptionBlur = () => {
    const nextValue = (descriptionRef.current?.textContent ?? '').trim();
    if (nextValue !== (data.description || '')) {
      onDescriptionChange?.(nextValue);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLDivElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const original = data.description || '';
      if (descriptionRef.current) {
        descriptionRef.current.textContent = original;
        descriptionRef.current.blur();
      }
    }
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 min-w-[200px] relative group ${getNodeColor()} ${
      selected ? 'border-orange-400' : 'border-gray-300'
    }`}>
      {/* Handles de conexão */}
      {showHandles && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="w-3 h-3 bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-125 transition-all duration-200"
            style={{ left: -6 }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            className="w-3 h-3 bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-125 transition-all duration-200"
            style={{ right: -6 }}
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="w-3 h-3 bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-125 transition-all duration-200"
            style={{ top: -6 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="w-3 h-3 bg-orange-500 border-2 border-white hover:bg-orange-600 hover:scale-125 transition-all duration-200"
            style={{ bottom: -6 }}
          />
        </>
      )}
      
      {/* Botão de exclusão */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          title="Excluir nó"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      
      <div className="flex items-center space-x-2">
        {children}
      </div>
      
      {/* Label editável */}
      <div className="text-white text-sm font-medium mt-1 flex items-center">
        <div
          ref={labelRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Clique para editar"
          onFocus={(e) => {
            e.stopPropagation();
            focusEditable(labelRef);
          }}
          onBlur={handleLabelBlur}
          onKeyDown={handleLabelKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          tabIndex={0}
          role="textbox"
          className="editable-text cursor-text hover:bg-white hover:bg-opacity-20 px-1 py-0.5 rounded nodrag flex-1 truncate focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            focusEditable(labelRef);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="ml-1 text-white/80 hover:text-white transition nodrag"
          title="Editar título"
          aria-label="Editar título"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      {/* Description editável */}
      <div className="text-white text-xs opacity-80 mt-1 flex items-center">
        <div
          ref={descriptionRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Clique para adicionar descrição"
          onFocus={(e) => {
            e.stopPropagation();
            focusEditable(descriptionRef);
          }}
          onBlur={handleDescriptionBlur}
          onKeyDown={handleDescriptionKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          tabIndex={0}
          role="textbox"
          className="editable-text cursor-text hover:bg-white hover:bg-opacity-20 px-1 py-0.5 rounded nodrag flex-1 truncate focus:ring-2 focus:ring-white/40 focus:ring-offset-0"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            focusEditable(descriptionRef);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="ml-1 text-white/80 hover:text-white transition nodrag"
          title="Editar descrição"
          aria-label="Editar descrição"
        >
          <Edit className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}


// Componente principal do Canvas
export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeType, setSelectedNodeType] = useState<string>('trigger');
  const [isRunning, setIsRunning] = useState(false);
  const [strategyName, setStrategyName] = useState('Nova Estratégia');
  const [showHandles, setShowHandles] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showComponents, setShowComponents] = useState(true);

  // Conectar nós
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#f97316', 
          strokeWidth: 3,
          strokeDasharray: '5,5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#f97316',
          width: 20,
          height: 20,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Adicionar novo nó
  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `Novo ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `Descrição do ${type}`,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Adicionar nós de exemplo para demonstração
  const addExampleNodes = useCallback(() => {
    const exampleNodes: Node[] = [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Lead Entra', description: 'Novo lead no sistema' },
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { label: 'Enviar Email', description: 'Email de boas-vindas' },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 700, y: 100 },
        data: { label: 'Follow-up', description: 'Agendar reunião' },
      },
    ];

    const exampleEdges: Edge[] = [
      {
        id: 'e1-2',
        source: 'trigger-1',
        target: 'action-1',
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#f97316', 
          strokeWidth: 3,
          strokeDasharray: '5,5'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed, 
          color: '#f97316',
          width: 20,
          height: 20,
        },
      },
      {
        id: 'e2-3',
        source: 'action-1',
        target: 'task-1',
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#f97316', 
          strokeWidth: 3,
          strokeDasharray: '5,5'
        },
        markerEnd: { 
          type: MarkerType.ArrowClosed, 
          color: '#f97316',
          width: 20,
          height: 20,
        },
      },
    ];

    setNodes(exampleNodes);
    setEdges(exampleEdges);
  }, [setNodes, setEdges]);

  // Atualizar label do nó
  const updateNodeLabel = useCallback((nodeId: string, newLabel: string) => {
    console.log('Atualizando label:', nodeId, newLabel);
    setNodes((nds) => {
      const updatedNodes = nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      );
      console.log('Nós atualizados:', updatedNodes);
      return updatedNodes;
    });
  }, [setNodes]);

  // Atualizar descrição do nó
  const updateNodeDescription = useCallback((nodeId: string, newDescription: string) => {
    console.log('Atualizando descrição:', nodeId, newDescription);
    setNodes((nds) => {
      const updatedNodes = nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, description: newDescription } } : node
      );
      console.log('Nós atualizados:', updatedNodes);
      return updatedNodes;
    });
  }, [setNodes]);

  // Excluir nó
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    toast.success('Nó excluído com sucesso!');
  }, [setNodes, setEdges]);

  // Salvar estratégia
  const saveStrategy = async () => {
    try {
      const strategy = {
        name: strategyName,
        nodes,
        edges,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('strategies')
        .insert([strategy]);

      if (error) throw error;

      toast.success('Estratégia salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar estratégia:', error);
      toast.error('Erro ao salvar estratégia');
    }
  };

  // Carregar estratégia
  const loadStrategy = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      setStrategyName(data.name);
      toast.success('Estratégia carregada!');
    } catch (error) {
      console.error('Erro ao carregar estratégia:', error);
      toast.error('Erro ao carregar estratégia');
    }
  };

  // Executar estratégia
  const runStrategy = () => {
    setIsRunning(true);
    toast.success('Estratégia executada!');
    setTimeout(() => setIsRunning(false), 3000);
  };

  // Limpar canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    toast.success('Canvas limpo!');
  };

  // Exportar estratégia
  const exportStrategy = () => {
    const data = {
      name: strategyName,
      nodes,
      edges,
      exported_at: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategyName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Exportar canvas em PDF
  const exportToPDF = async () => {
    try {
      toast.loading('Gerando PDF...', { id: 'pdf-export' });
      
      // Encontrar o elemento do canvas
      const canvasElement = document.querySelector('.react-flow');
      if (!canvasElement) {
        throw new Error('Canvas não encontrado');
      }

      // Adicionar classe para estilos de exportação
      canvasElement.classList.add('exporting');
      
      // Ocultar elementos desnecessários para o PDF
      const handles = document.querySelectorAll('.react-flow__handle');
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panel = document.querySelector('.react-flow__panel');
      
      // Ocultar elementos
      handles.forEach(handle => (handle as HTMLElement).style.display = 'none');
      if (controls) (controls as HTMLElement).style.display = 'none';
      if (minimap) (minimap as HTMLElement).style.display = 'none';
      if (panel) (panel as HTMLElement).style.display = 'none';

      // Configurar html2canvas
      const canvas = await html2canvas(canvasElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Maior resolução
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: canvasElement.scrollWidth,
        height: canvasElement.scrollHeight,
        ignoreElements: (element) => {
          return element.classList.contains('react-flow__handle') ||
                 element.classList.contains('react-flow__controls') ||
                 element.classList.contains('react-flow__minimap') ||
                 element.classList.contains('react-flow__panel');
        }
      });

      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Calcular dimensões para ajustar ao PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calcular escala para ajustar a imagem ao PDF
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Centralizar a imagem no PDF
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;

      // Adicionar título
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(strategyName, pdfWidth / 2, 20, { align: 'center' });
      
      // Adicionar data
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pdfWidth / 2, 30, { align: 'center' });

      // Adicionar imagem do canvas
      pdf.addImage(imgData, 'PNG', x, y + 10, scaledWidth, scaledHeight);

      // Adicionar informações da estratégia
      pdf.setFontSize(10);
      pdf.text(`Nós: ${nodes.length}`, 20, pdfHeight - 20);
      pdf.text(`Conexões: ${edges.length}`, 20, pdfHeight - 15);
      pdf.text(`Status: ${isRunning ? 'Executando' : 'Parado'}`, 20, pdfHeight - 10);

      // Salvar PDF
      pdf.save(`${strategyName.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      
      // Restaurar elementos ocultos
      canvasElement.classList.remove('exporting');
      handles.forEach(handle => (handle as HTMLElement).style.display = '');
      if (controls) (controls as HTMLElement).style.display = '';
      if (minimap) (minimap as HTMLElement).style.display = '';
      if (panel) (panel as HTMLElement).style.display = '';
      
      toast.success('PDF exportado com sucesso!', { id: 'pdf-export' });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao exportar PDF', { id: 'pdf-export' });
      
      // Restaurar elementos em caso de erro
      const canvasElement = document.querySelector('.react-flow');
      const handles = document.querySelectorAll('.react-flow__handle');
      const controls = document.querySelector('.react-flow__controls');
      const minimap = document.querySelector('.react-flow__minimap');
      const panel = document.querySelector('.react-flow__panel');
      
      if (canvasElement) canvasElement.classList.remove('exporting');
      handles.forEach(handle => (handle as HTMLElement).style.display = '');
      if (controls) (controls as HTMLElement).style.display = '';
      if (minimap) (minimap as HTMLElement).style.display = '';
      if (panel) (panel as HTMLElement).style.display = '';
    }
  };

  // Importar estratégia
  const importStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setStrategyName(data.name || 'Estratégia Importada');
        toast.success('Estratégia importada!');
      } catch (error) {
        toast.error('Erro ao importar estratégia');
      }
    };
    reader.readAsText(file);
  };

  // Tipos de nós organizados por categoria
  const nodeTypesList = [
    // Gatilhos
    { type: 'trigger', label: 'Gatilho', icon: Zap, color: 'bg-blue-500', category: 'triggers' },
    { type: 'webhook', label: 'Webhook', icon: ArrowRight, color: 'bg-cyan-500', category: 'triggers' },
    { type: 'form', label: 'Formulário', icon: FileText, color: 'bg-orange-400', category: 'triggers' },
    { type: 'api', label: 'API', icon: Globe, color: 'bg-zinc-500', category: 'triggers' },
    
    // Ações
    { type: 'action', label: 'Ação', icon: Play, color: 'bg-green-500', category: 'actions' },
    { type: 'email', label: 'Email', icon: Mail, color: 'bg-red-500', category: 'actions' },
    { type: 'sms', label: 'SMS', icon: Phone, color: 'bg-teal-500', category: 'actions' },
    { type: 'notification', label: 'Notificação', icon: MessageSquare, color: 'bg-pink-500', category: 'actions' },
    { type: 'task', label: 'Tarefa', icon: CheckCircle, color: 'bg-amber-500', category: 'actions' },
    { type: 'integration', label: 'Integração', icon: Globe, color: 'bg-indigo-500', category: 'actions' },
    { type: 'automation', label: 'Automação', icon: Wrench, color: 'bg-stone-500', category: 'actions' },
    { type: 'workflow', label: 'Workflow', icon: Settings, color: 'bg-slate-500', category: 'actions' },
    
    // CRM
    { type: 'lead', label: 'Lead', icon: Users, color: 'bg-emerald-500', category: 'crm' },
    { type: 'opportunity', label: 'Oportunidade', icon: TrendingUp, color: 'bg-violet-500', category: 'crm' },
    { type: 'deal', label: 'Negócio', icon: DollarSign, color: 'bg-rose-500', category: 'crm' },
    { type: 'customer', label: 'Cliente', icon: Heart, color: 'bg-sky-500', category: 'crm' },
    { type: 'campaign', label: 'Campanha', icon: Rocket, color: 'bg-lime-500', category: 'crm' },
    { type: 'chat', label: 'Chat', icon: MessageSquare, color: 'bg-blue-400', category: 'crm' },
    { type: 'meeting', label: 'Reunião', icon: Calendar, color: 'bg-green-400', category: 'crm' },
    { type: 'followup', label: 'Follow-up', icon: ArrowRight, color: 'bg-yellow-400', category: 'crm' },
    { type: 'reminder', label: 'Lembrete', icon: Clock, color: 'bg-purple-400', category: 'crm' },
    { type: 'report', label: 'Relatório', icon: BarChart3, color: 'bg-fuchsia-500', category: 'crm' },
    
    // Lógica
    { type: 'condition', label: 'Condição', icon: Filter, color: 'bg-yellow-500', category: 'logic' },
    { type: 'decision', label: 'Decisão', icon: Target, color: 'bg-orange-500', category: 'logic' },
    { type: 'delay', label: 'Atraso', icon: Clock, color: 'bg-gray-500', category: 'logic' },
    { type: 'data', label: 'Dados', icon: Database, color: 'bg-purple-500', category: 'logic' },
    { type: 'database', label: 'Banco', icon: Database, color: 'bg-neutral-500', category: 'logic' },
    
    // Status
    { type: 'success', label: 'Sucesso', icon: CheckCircle, color: 'bg-green-700', category: 'status' },
    { type: 'error', label: 'Erro', icon: AlertCircle, color: 'bg-red-700', category: 'status' },
    { type: 'warning', label: 'Aviso', icon: AlertCircle, color: 'bg-yellow-600', category: 'status' },
    { type: 'info', label: 'Info', icon: Eye, color: 'bg-blue-600', category: 'status' },
    { type: 'approval', label: 'Aprovação', icon: CheckCircle, color: 'bg-green-600', category: 'status' },
    { type: 'rejection', label: 'Rejeição', icon: AlertCircle, color: 'bg-red-600', category: 'status' },
    { type: 'custom', label: 'Personalizado', icon: Settings, color: 'bg-gray-600', category: 'status' },
  ];

  // Função para filtrar nós por categoria
  const getFilteredNodeTypes = () => {
    if (activeCategory === 'all') {
      return nodeTypesList;
    }
    return nodeTypesList.filter(node => node.category === activeCategory);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Canvas de Estratégias
            </h1>
            <input
              type="text"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nome da estratégia"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={runStrategy}
              disabled={isRunning}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Executando...' : 'Executar'}
            </Button>
            <Button onClick={saveStrategy} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
            <Button onClick={exportStrategy} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar JSON
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200">
              <FileText className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importStrategy}
                className="hidden"
              />
            </label>
            <Button onClick={addExampleNodes} variant="outline" className="text-blue-600 hover:text-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Exemplo
            </Button>
            <Button 
              onClick={() => setShowHandles(!showHandles)} 
              variant="outline" 
              className={showHandles ? "text-green-600 hover:text-green-700" : "text-gray-600 hover:text-gray-700"}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showHandles ? 'Ocultar Handles' : 'Mostrar Handles'}
            </Button>
            <Button onClick={clearCanvas} variant="outline" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
        
        {/* Menu de Componentes Organizado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowComponents(!showComponents)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 transition-colors"
              >
                <span>Componentes</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({getFilteredNodeTypes().length} de {nodeTypesList.length})
                </span>
                {showComponents ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {showComponents && (
            <>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'all' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setActiveCategory('triggers')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'triggers' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  Gatilhos
                </button>
                <button
                  onClick={() => setActiveCategory('actions')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'actions' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  Ações
                </button>
                <button
                  onClick={() => setActiveCategory('crm')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'crm' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  CRM
                </button>
                <button
                  onClick={() => setActiveCategory('logic')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'logic' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  Lógica
                </button>
                <button
                  onClick={() => setActiveCategory('status')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeCategory === 'status' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900'
                  }`}
                >
                  Status
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {getFilteredNodeTypes().map((nodeType) => {
                  const IconComponent = nodeType.icon;
                  return (
                    <button
                      key={nodeType.type}
                      onClick={() => addNode(nodeType.type)}
                      className={`p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-orange-400 transition-colors ${nodeType.color} text-white text-xs flex flex-col items-center space-y-1`}
                      title={nodeType.label}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-xs">{nodeType.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* Canvas principal */}
        <div className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={createNodeTypes(updateNodeLabel, updateNodeDescription, deleteNode, showHandles)}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#f97316', strokeWidth: 3 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#f97316',
                width: 20,
                height: 20,
              },
            }}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            <Panel position="top-right">
              <Card className="w-80">
                <CardHeader>
                  <CardTitle className="text-sm">Informações da Estratégia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Nós:</span>
                    <Badge variant="secondary">{nodes.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Conexões:</span>
                    <Badge variant="secondary">{edges.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <Badge variant={isRunning ? "destructive" : "default"}>
                      {isRunning ? 'Executando' : 'Parado'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
