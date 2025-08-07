"use client"

import React, { useCallback, useState, useEffect, useRef } from "react"
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
  NodeTypes,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload, RotateCcw } from 'lucide-react'
import { MilestoneData } from "./types"
import { RoadmapProvider } from "./contexts/roadmap-context"
import {useRoadmapStorage} from "@/hooks/use-roadmap-storage";
import {MilestoneNode} from "@/components/milestone-node";
import {MilestoneForm} from "@/components/milestone-form";

const nodeTypes: NodeTypes = {
  milestone: MilestoneNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "milestone",
    data: { 
      label: "Project Kickoff",
      description: "Initial planning and team setup",
      status: "completed",
      quarter: "Q1 2024",
      assignee: "John Doe",
      progress: 100,
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "milestone",
    data: { 
      label: "Market Research",
      description: "Competitive analysis and user surveys",
      status: "completed",
      quarter: "Q1 2024",
      assignee: "Jane Smith",
      progress: 100,
    },
    position: { x: 100, y: 250 },
  },
  {
    id: "3",
    type: "milestone",
    data: { 
      label: "Beta Testing",
      description: "User feedback and bug fixes",
      status: "in-progress",
      quarter: "Q2 2024",
      assignee: "Mike Johnson",
      progress: 65,
    },
    position: { x: 400, y: 175 },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
]

export default function Component() {
  return (
    <div className="w-full h-screen bg-gray-50">
      <ReactFlowProvider>
        <DynamicRoadmapFlow />
      </ReactFlowProvider>
    </div>
  )
}

function DynamicRoadmapFlow() {
  const { data: savedData, saveData, clearData } = useRoadmapStorage()
  const [showForm, setShowForm] = useState(false)
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [nextId, setNextId] = useState(4)
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null)

  // Initialize with saved data or default data
  const [nodes, setNodes, onNodesChange] = useNodesState(
    savedData.nodes.length > 0 ? savedData.nodes : initialNodes
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    savedData.edges.length > 0 ? savedData.edges : initialEdges
  )

  // Debounced save to prevent excessive localStorage writes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveData(nodes, edges)
      }
    }, 500)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [nodes, edges, saveData])

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  const handleEditNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (node) {
      setEditingNode(node)
      setShowForm(true)
    }
  }, [nodes])

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
  }, [setNodes, setEdges])

  const getNodeStyle = (status: string) => {
    switch (status) {
      case 'completed': return { background: '#10b981', border: '2px solid #059669' }
      case 'in-progress': return { background: '#f59e0b', border: '2px solid #d97706' }
      case 'planned': return { background: '#6366f1', border: '2px solid #4f46e5' }
      case 'future': return { background: '#64748b', border: '2px solid #475569' }
      default: return { background: '#64748b', border: '2px solid #475569' }
    }
  }

  const handleSaveMilestone = (milestoneData: MilestoneData) => {
    if (editingNode) {
      // Update existing node
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? {
                ...node,
                data: milestoneData,
                style: getNodeStyle(milestoneData.status),
              }
            : node
        )
      )
    } else {
      // Add new node
      const newNode: Node = {
        id: nextId.toString(),
        type: "milestone",
        data: milestoneData,
        position: { x: Math.random() * 500 + 100, y: Math.random() * 300 + 100 },
        style: getNodeStyle(milestoneData.status),
      }
      setNodes((nds) => [...nds, newNode])
      setNextId(nextId + 1)
    }
    setShowForm(false)
    setEditingNode(null)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'roadmap-data.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.nodes && data.edges) {
            setNodes(data.nodes)
            setEdges(data.edges)
          }
        } catch (error) {
          console.error('Failed to import data:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the roadmap? This will clear all data.')) {
      clearData()
      setNodes(initialNodes)
      setEdges(initialEdges)
      setNextId(4)
    }
  }

  const contextValue = {
    onEditNode: handleEditNode,
    onDeleteNode: handleDeleteNode,
  }

  return (
    <RoadmapProvider value={contextValue}>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dynamic Product Roadmap</h1>
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
          
          <div className="flex gap-2">
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label>
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <MilestoneForm
              milestone={editingNode?.data}
              onSave={handleSaveMilestone}
              onCancel={() => {
                setShowForm(false)
                setEditingNode(null)
              }}
            />
          </div>
        )}

        {/* ReactFlow */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
            defaultEdgeOptions={{
              animated: true,
              style: { strokeWidth: 2 },
            }}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                const status = node.data?.status || 'future'
                switch (status) {
                  case 'completed': return '#10b981'
                  case 'in-progress': return '#f59e0b'
                  case 'planned': return '#6366f1'
                  case 'future': return '#64748b'
                  default: return '#64748b'
                }
              }}
              maskColor="rgba(255, 255, 255, 0.8)"
            />
            <Background gap={20} size={1} color="#e2e8f0" />
          </ReactFlow>
        </div>
      </div>
    </RoadmapProvider>
  )
}
