import React, { useCallback, useState } from 'react';
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
  MarkerType,
  ConnectionLineType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './Canvas.css';
import { Button } from '@/components/ui/button';

// Componente base para nós
function BaseNode({ data, selected, type, children }: { 
  data: any; 
  selected: boolean; 
  type: string; 
  children: React.ReactNode;
}) {
  const getNodeColor = () => {
    const colors = {
      trigger: 'bg-blue-500',
      action: 'bg-green-500',
      condition: 'bg-yellow-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 min-w-[200px] relative group ${getNodeColor()} ${
      selected ? 'border-orange-400' : 'border-gray-300'
    }`}>
      {/* Handles de conexão */}
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
      
      <div className="flex items-center space-x-2">
        {children}
      </div>
      
      <div className="text-white text-sm font-medium mt-1">
        {data.label}
      </div>
    </div>
  );
}

// Componente genérico para todos os nós
function GenericNode({ data, selected, type }: {
  data: any;
  selected: boolean;
  type: string;
}) {
  const getIcon = () => {
    const icons = {
      trigger: '⚡',
      action: '▶️',
      condition: '❓',
    };
    return icons[type as keyof typeof icons] || '⚙️';
  };

  return (
    <BaseNode 
      data={data} 
      selected={selected} 
      type={type}
    >
      <span className="text-2xl">{getIcon()}</span>
    </BaseNode>
  );
}

// Tipos de nós customizados
const nodeTypes: NodeTypes = {
  trigger: (props) => <GenericNode {...props} type="trigger" />,
  action: (props) => <GenericNode {...props} type="action" />,
  condition: (props) => <GenericNode {...props} type="condition" />,
};

// Componente principal do Canvas
export default function CanvasSimple() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
      data: { label: `Novo ${type}` },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Adicionar nós de exemplo
  const addExampleNodes = useCallback(() => {
    const exampleNodes: Node[] = [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { label: 'Gatilho Inicial' },
      },
      {
        id: 'action-1',
        type: 'action',
        position: { x: 400, y: 100 },
        data: { label: 'Ação Principal' },
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 700, y: 100 },
        data: { label: 'Condição' },
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
        target: 'condition-1',
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Canvas de Estratégias</h1>
          <div className="flex space-x-2">
            <Button onClick={() => addNode('trigger')} variant="outline">
              + Gatilho
            </Button>
            <Button onClick={() => addNode('action')} variant="outline">
              + Ação
            </Button>
            <Button onClick={() => addNode('condition')} variant="outline">
              + Condição
            </Button>
            <Button onClick={addExampleNodes} variant="outline">
              Exemplo
            </Button>
          </div>
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
            nodeTypes={nodeTypes}
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
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
