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
    NodeTypes, BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload, RotateCcw, Eye } from 'lucide-react'
import { CourseData } from "./types"
import { RoadmapProvider } from "./contexts/roadmap-context"
import Link from 'next/link'
import {useRoadmapStorage} from "@/hooks/use-roadmap-storage";
import {CourseForm} from "@/components/course-form";
import {CourseNode} from "@/components/course-node";

const nodeTypes: NodeTypes = {
    course: CourseNode,
}

const initialNodes: Node[] = [
    {
        id: "1",
        type: "course",
        data: {
            id_courses: 1001,
            course_thumbnail_url: "",
            typer_Courses: 1,
            duration_Courses: 40.5,
            time_create: "2024-01-15",
            subject: ["Frontend Development", "Web Development", "Programming Languages"],
            name_over: "John Smith",
            bg: "completed",
            node_width: 280,
            node_height: 200,
        },
        position: { x: 100, y: 100 },
    },
    {
        id: "2",
        type: "course",
        data: {
            id_courses: 1002,
            course_thumbnail_url: "",
            typer_Courses: 3,
            duration_Courses: 60.0,
            time_create: "2024-02-01",
            subject: ["Frontend Development", "Frameworks & Libraries", "Software Engineering"],
            name_over: "Sarah Johnson",
            bg: "in-progress",
            node_width: 320,
            node_height: 240,
        },
        position: { x: 400, y: 100 },
    },
    {
        id: "3",
        type: "course",
        data: {
            id_courses: 1003,
            course_thumbnail_url: "",
            typer_Courses: 4,
            duration_Courses: 120.0,
            time_create: "2024-03-01",
            subject: ["Full Stack Development", "Backend Development", "Database Management", "DevOps"],
            name_over: "Mike Davis",
            bg: "planned",
            node_width: 350,
            node_height: 280,
        },
        position: { x: 750, y: 100 },
    },
]

const initialEdges: Edge[] = [
    { id: "e1-2", source: "1", target: "2", animated: true },
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
    const [selectedNodes, setSelectedNodes] = useState<string[]>([])
    const [nextId, setNextId] = useState(4)
    const saveTimeoutRef = useRef<NodeJS.Timeout>(null)

    // Initialize with saved data or default data
    const [nodes, setNodes, onNodesChange] = useNodesState(
        savedData.nodes.length > 0 ? savedData.nodes : initialNodes
    )
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        savedData.edges.length > 0 ? savedData.edges : initialEdges
    )

    // Handle node selection
    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (event.ctrlKey || event.metaKey) {
            // Multi-select with Ctrl/Cmd
            setSelectedNodes(prev =>
                prev.includes(node.id)
                    ? prev.filter(id => id !== node.id)
                    : [...prev, node.id]
            )
        } else {
            // Single select
            setSelectedNodes([node.id])
        }
    }, [])

    // Clear selection when clicking on pane
    const handlePaneClick = useCallback(() => {
        setSelectedNodes([])
    }, [])

    // Debounced save with longer timeout to prevent ResizeObserver issues
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
            if (nodes.length > 0 || edges.length > 0) {
                // Use requestIdleCallback if available to avoid blocking
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(() => {
                        saveData(nodes, edges)
                    })
                } else {
                    saveData(nodes, edges)
                }
            }
        }, 2000) // Increased timeout to reduce frequency

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
        setSelectedNodes(prev => prev.filter(id => id !== nodeId))
    }, [setNodes, setEdges])

    const getNodeStyle = useCallback((bg: string, width?: number, height?: number) => {
        const backgroundColor = (() => {
            switch (bg) {
                case 'completed': return '#10b981'
                case 'in-progress': return '#f59e0b'
                case 'planned': return '#6366f1'
                case 'future': return '#64748b'
                default: return '#64748b'
            }
        })()

        return {
            background: backgroundColor,
            width: width || 280,
            height: height || 200,
        }
    }, [])

    const handleSaveCourse = useCallback((courseData: CourseData) => {
        if (editingNode) {
            // Update existing node
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === editingNode.id
                        ? {
                            ...node,
                            data: courseData,
                            style: getNodeStyle(courseData.bg || 'planned', courseData.node_width, courseData.node_height),
                        }
                        : node
                )
            )
        } else {
            // Add new node
            const newNode: Node = {
                id: nextId.toString(),
                type: "course",
                data: courseData,
                position: { x: Math.random() * 500 + 100, y: Math.random() * 300 + 100 },
                style: getNodeStyle(courseData.bg || 'planned', courseData.node_width, courseData.node_height),
            }
            setNodes((nds) => [...nds, newNode])
            setNextId(nextId + 1)
        }
        setShowForm(false)
        setEditingNode(null)
    }, [editingNode, nextId, getNodeStyle, setNodes])

    const handleExportData = useCallback(() => {
        const dataStr = JSON.stringify({ nodes, edges }, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'course-roadmap-data.json'
        link.click()
        URL.revokeObjectURL(url)
    }, [nodes, edges])

    const handleImportData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [setNodes, setEdges])

    const handleReset = useCallback(() => {
        if (confirm('Are you sure you want to reset the roadmap? This will clear all data.')) {
            clearData()
            setNodes(initialNodes)
            setEdges(initialEdges)
            setNextId(4)
            setSelectedNodes([])
        }
    }, [clearData, setNodes, setEdges])

    // Memoize nodes with selection to prevent unnecessary re-renders
    const nodesWithSelection = React.useMemo(() =>
        nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                selected: selectedNodes.includes(node.id)
            }
        })), [nodes, selectedNodes]
    )

    const contextValue = React.useMemo(() => ({
        onEditNode: handleEditNode,
        onDeleteNode: handleDeleteNode,
    }), [handleEditNode, handleDeleteNode])

    return (
        <RoadmapProvider value={contextValue}>
            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Course Learning Roadmap</h1>
                        <div className="flex gap-6 mt-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span>Green Background</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                <span>Amber Background</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                <span>Indigo Background</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                                <span>Slate Background</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={() => setShowForm(true)} size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Course
                        </Button>
                        <Button onClick={handleExportData} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                        <Link href="/view">
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Only
                            </Button>
                        </Link>
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
                        <CourseForm
                            course={editingNode?.data}
                            onSave={handleSaveCourse}
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
                        nodes={nodesWithSelection}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={handleNodeClick}
                        onPaneClick={handlePaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.2 }}
                        minZoom={0.3}
                        maxZoom={2}
                        selectNodesOnDrag={false}
                        defaultEdgeOptions={{
                            animated: true,
                            style: { strokeWidth: 2 },
                        }}
                    >
                        <Controls />
                        <MiniMap
                            nodeColor={(node) => {
                                const bg = node.data?.bg || 'future'
                                switch (bg) {
                                    case 'completed': return '#10b981'
                                    case 'in-progress': return '#f59e0b'
                                    case 'planned': return '#6366f1'
                                    case 'future': return '#64748b'
                                    default: return '#64748b'
                                }
                            }}
                            maskColor="rgba(255, 255, 255, 0.8)"
                        />
                        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
                    </ReactFlow>
                </div>
            </div>
        </RoadmapProvider>
    )
}
