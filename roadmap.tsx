"use client"

import React, { useCallback } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"

const initialNodes: Node[] = [
  // Q1 2024 - Completed
  {
    id: "1",
    type: "input",
    data: { 
      label: "Project Kickoff",
      description: "Initial planning and team setup",
      status: "completed",
      quarter: "Q1 2024"
    },
    position: { x: 100, y: 50 },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "2",
    data: { 
      label: "Market Research",
      description: "Competitive analysis and user surveys",
      status: "completed",
      quarter: "Q1 2024"
    },
    position: { x: 100, y: 150 },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "3",
    data: { 
      label: "MVP Development",
      description: "Core features and basic functionality",
      status: "completed",
      quarter: "Q1 2024"
    },
    position: { x: 100, y: 250 },
    style: {
      background: '#10b981',
      color: 'white',
      border: '2px solid #059669',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },

  // Q2 2024 - In Progress
  {
    id: "4",
    data: { 
      label: "Beta Testing",
      description: "User feedback and bug fixes",
      status: "in-progress",
      quarter: "Q2 2024"
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#f59e0b',
      color: 'white',
      border: '2px solid #d97706',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "5",
    data: { 
      label: "UI/UX Improvements",
      description: "Design system and user experience",
      status: "in-progress",
      quarter: "Q2 2024"
    },
    position: { x: 400, y: 200 },
    style: {
      background: '#f59e0b',
      color: 'white',
      border: '2px solid #d97706',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },

  // Q3 2024 - Planned
  {
    id: "6",
    data: { 
      label: "Public Launch",
      description: "Marketing campaign and go-to-market",
      status: "planned",
      quarter: "Q3 2024"
    },
    position: { x: 700, y: 50 },
    style: {
      background: '#6366f1',
      color: 'white',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "7",
    data: { 
      label: "Mobile App",
      description: "iOS and Android applications",
      status: "planned",
      quarter: "Q3 2024"
    },
    position: { x: 700, y: 150 },
    style: {
      background: '#6366f1',
      color: 'white',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "8",
    data: { 
      label: "Analytics Dashboard",
      description: "Advanced reporting and insights",
      status: "planned",
      quarter: "Q3 2024"
    },
    position: { x: 700, y: 250 },
    style: {
      background: '#6366f1',
      color: 'white',
      border: '2px solid #4f46e5',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },

  // Q4 2024 - Future
  {
    id: "9",
    data: { 
      label: "API Platform",
      description: "Third-party integrations and API",
      status: "future",
      quarter: "Q4 2024"
    },
    position: { x: 1000, y: 100 },
    style: {
      background: '#64748b',
      color: 'white',
      border: '2px solid #475569',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },
  {
    id: "10",
    type: "output",
    data: { 
      label: "Enterprise Features",
      description: "Advanced security and compliance",
      status: "future",
      quarter: "Q4 2024"
    },
    position: { x: 1000, y: 200 },
    style: {
      background: '#64748b',
      color: 'white',
      border: '2px solid #475569',
      borderRadius: '8px',
      width: 200,
      fontSize: '14px',
    },
  },

  // Quarter Labels
  {
    id: "q1-label",
    type: "group",
    data: { label: "Q1 2024 - Foundation" },
    position: { x: 50, y: 0 },
    style: {
      width: 300,
      height: 320,
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderRadius: "12px",
      border: "2px dashed #10b981",
    },
  },
  {
    id: "q2-label",
    type: "group",
    data: { label: "Q2 2024 - Development" },
    position: { x: 350, y: 50 },
    style: {
      width: 300,
      height: 220,
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderRadius: "12px",
      border: "2px dashed #f59e0b",
    },
  },
  {
    id: "q3-label",
    type: "group",
    data: { label: "Q3 2024 - Launch" },
    position: { x: 650, y: 0 },
    style: {
      width: 300,
      height: 320,
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      borderRadius: "12px",
      border: "2px dashed #6366f1",
    },
  },
  {
    id: "q4-label",
    type: "group",
    data: { label: "Q4 2024 - Scale" },
    position: { x: 950, y: 50 },
    style: {
      width: 300,
      height: 220,
      backgroundColor: "rgba(100, 116, 139, 0.1)",
      borderRadius: "12px",
      border: "2px dashed #64748b",
    },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: "e3-5", source: "3", target: "5", animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
  { id: "e4-6", source: "4", target: "6", animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: "e5-7", source: "5", target: "7", animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: "e5-8", source: "5", target: "8", animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: "e6-9", source: "6", target: "9", animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: "e7-10", source: "7", target: "10", animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: "e8-10", source: "8", target: "10", animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
]

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <h1 className="text-2xl font-bold text-gray-900">Product Roadmap 2024</h1>
        <div className="flex gap-6 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span>Planned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            <span>Future</span>
          </div>
        </div>
      </div>
      <ReactFlowProvider>
        <RoadmapFlow />
      </ReactFlowProvider>
    </div>
  )
}

function RoadmapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.5}
      maxZoom={1.5}
    >
      <Controls />
      <MiniMap 
        nodeColor={(node) => {
          if (node.style?.background) return node.style.background as string
          return '#64748b'
        }}
        maskColor="rgba(255, 255, 255, 0.8)"
      />
      <Background variant="dots" gap={20} size={1} color="#e2e8f0" />
    </ReactFlow>
  )
}
