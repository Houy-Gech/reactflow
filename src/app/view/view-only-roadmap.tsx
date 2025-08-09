"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    type Node,
    type Edge,
    ReactFlowProvider,
    type NodeTypes, BackgroundVariant,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { ViewOnlyCourseNode } from "../../components/view-only-course-node"
import Link from "next/link"

const nodeTypes: NodeTypes = {
    course: ViewOnlyCourseNode,
}

export default function ViewOnlyRoadmap() {
    const searchParams = useSearchParams()
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Memoize the processed nodes and edges to prevent re-processing
    const processedData = useMemo(() => {
        if (nodes.length === 0 && edges.length === 0) return null

        // Convert nodes to view-only format
        const viewOnlyNodes = nodes.map((node: Node) => ({
            ...node,
            type: "course",
            draggable: false,
            selectable: false,
            data: {
                ...node.data,
                viewOnly: true,
            },
        }))

        const viewOnlyEdges = edges.map((edge: Edge) => ({
            ...edge,
            selectable: false,
        }))

        return { nodes: viewOnlyNodes, edges: viewOnlyEdges }
    }, [nodes, edges])

    useEffect(() => {
        let isMounted = true

        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Load from localStorage
                const saved = localStorage.getItem("roadmap-data")
                if (saved && isMounted) {
                    const data = JSON.parse(saved)
                    if (data.nodes && data.edges) {
                        setNodes(data.nodes)
                        setEdges(data.edges)
                    } else {
                        setError("Invalid roadmap data format.")
                    }
                } else if (isMounted) {
                    setError("No roadmap data found. Please create a roadmap first.")
                }
            } catch (err) {
                if (isMounted) {
                    setError("Failed to load roadmap data")
                    console.error("Error loading data:", err)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadData()

        return () => {
            isMounted = false
        }
    }, []) // Remove searchParams dependency to prevent re-runs

    const handleExportData = () => {
        if (!processedData) return

        const dataStr = JSON.stringify(processedData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = "roadmap-view-only.json"
        link.click()
        URL.revokeObjectURL(url)
    }

    if (loading) {
        return (
            <ReactFlowProvider>
                <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading roadmap...</p>
                    </div>
                </div>
            </ReactFlowProvider>
        )
    }

    if (error) {
        return (
            <ReactFlowProvider>
                <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Link href="/">
                            <Button>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Editor
                            </Button>
                        </Link>
                    </div>
                </div>
            </ReactFlowProvider>
        )
    }

    return (
        <ReactFlowProvider>
            <div className="w-full h-full flex flex-col">
                {/* Header */}
                <div className="p-4 bg-white shadow-sm border-b flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Roadmap - View Only</h1>
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
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Editor
                            </Button>
                        </Link>
                        <Button onClick={handleExportData} variant="outline" size="sm" disabled={!processedData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* ReactFlow - View Only */}
                <div className="flex-1">
                    {processedData && processedData.nodes.length > 0 ? (
                        <ReactFlow
                            nodes={processedData.nodes}
                            edges={processedData.edges}
                            nodeTypes={nodeTypes}
                            fitView
                            fitViewOptions={{ padding: 0.2 }}
                            minZoom={0.3}
                            maxZoom={2}
                            nodesDraggable={false}
                            nodesConnectable={false}
                            elementsSelectable={false}
                            panOnDrag={true}
                            zoomOnScroll={true}
                            zoomOnPinch={true}
                            defaultEdgeOptions={{
                                animated: true,
                                style: { strokeWidth: 2 },
                            }}
                        >
                            <Controls showInteractive={false} />
                            <MiniMap
                                nodeColor={(node) => {
                                    const status = node.data?.bg || "future"
                                    switch (status) {
                                        case "completed":
                                            return "#10b981"
                                        case "in-progress":
                                            return "#f59e0b"
                                        case "planned":
                                            return "#6366f1"
                                        case "future":
                                            return "#64748b"
                                        default:
                                            return "#64748b"
                                    }
                                }}
                                maskColor="rgba(255, 255, 255, 0.8)"
                            />
                            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
                        </ReactFlow>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-gray-500 mb-4">No roadmap data to display</p>
                                <Link href="/">
                                    <Button>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Create a Roadmap
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Watermark */}
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-lg shadow-sm text-xs text-gray-500">
                    View Only Mode - No Editing Available
                </div>
            </div>
        </ReactFlowProvider>
    )
}
