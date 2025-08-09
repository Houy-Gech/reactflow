"use client"

import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Calendar, Clock, Hash, BookOpen } from "lucide-react"
import type { CourseData } from "../../types"
import { useRoadmapContext } from "../../contexts/roadmap-context"
import { useCallback, useMemo } from "react"

interface CourseNodeProps {
    id: string
    data: CourseData
    selected?: boolean
}

export function CourseNode({ id, data, selected }: CourseNodeProps) {
    const { onEditNode, onDeleteNode } = useRoadmapContext()

    const getBackgroundColor = useCallback((bg: string) => {
        switch (bg) {
            case "completed":
                return "bg-green-500"
            case "in-progress":
                return "bg-amber-500"
            case "planned":
                return "bg-indigo-500"
            case "future":
                return "bg-slate-500"
            default:
                return "bg-gray-500"
        }
    }, [])

    const getCourseTypeLabel = useCallback((type: number) => {
        const types = {
            1: "Beginner",
            2: "Intermediate",
            3: "Advanced",
            4: "Specialization",
            5: "Workshop",
        }
        return types[type as keyof typeof types] || "Unknown"
    }, [])

    // Memoize current dimensions to prevent unnecessary recalculations
    const currentDimensions = useMemo(() => {
        return { width: data.node_width || 280, height: data.node_height || 200 }
    }, [data.node_width, data.node_height])

    // Memoize the node style to prevent unnecessary recalculations
    const nodeStyle = useMemo(
        () => ({
            width: `${currentDimensions.width}px`,
            height: `${currentDimensions.height}px`,
            minWidth: `${currentDimensions.width}px`,
            minHeight: `${currentDimensions.height}px`,
        }),
        [currentDimensions.width, currentDimensions.height],
    )

    // Calculate handle positions
    const inputHandles = data.input_handles || 1
    const outputHandles = data.output_handles || 3

    const getVerticalHandlePosition = (index: number, total: number, nodeHeight: number) => {
        if (total === 1) return nodeHeight / 2
        const spacing = nodeHeight / (total + 1)
        return spacing * (index + 1)
    }

    // Distribute output handles across right, top, and bottom
    const getOutputHandleConfig = (totalOutputs: number) => {
        const configs = []

        for (let i = 0; i < totalOutputs; i++) {
            if (i === 0) {
                // First handle always on the right
                configs.push({
                    position: Position.Right,
                    style: {
                        top: `${currentDimensions.height / 2}px`,
                        transform: "translateY(-50%)",
                    },
                })
            } else if (i === 1 && totalOutputs >= 2) {
                // Second handle on top
                configs.push({
                    position: Position.Top,
                    style: {
                        left: `${currentDimensions.width / 2}px`,
                        transform: "translateX(-50%)",
                    },
                })
            } else if (i === 2 && totalOutputs >= 3) {
                // Third handle on bottom
                configs.push({
                    position: Position.Bottom,
                    style: {
                        left: `${currentDimensions.width / 2}px`,
                        transform: "translateX(-50%)",
                    },
                })
            } else {
                // Additional handles distributed on right side
                const rightHandleIndex = i - 2 // Subtract the top and bottom handles
                configs.push({
                    position: Position.Right,
                    style: {
                        top: `${getVerticalHandlePosition(rightHandleIndex, totalOutputs - 2, currentDimensions.height)}px`,
                        transform: "translateY(-50%)",
                    },
                })
            }
        }

        return configs
    }

    const outputHandleConfigs = getOutputHandleConfig(outputHandles)

    return (
        <div
            className={`${getBackgroundColor(data.bg || "planned")} text-white rounded-lg p-3 shadow-lg border-2 overflow-hidden relative group ${
                selected ? "border-blue-500" : "border-gray-300"
            }`}
            style={nodeStyle}
        >
            {/* Input Handles - Always on the left */}
            {Array.from({ length: inputHandles }).map((_, index) => (
                <Handle
                    key={`input-${index}`}
                    type="target"
                    position={Position.Left}
                    id={`input-${index}`}
                    className="w-3 h-3"
                    style={{
                        top: `${getVerticalHandlePosition(index, inputHandles, currentDimensions.height)}px`,
                        transform: "translateY(-50%)",
                    }}
                />
            ))}

            {/* Output Handles - Distributed across right, top, and bottom */}
            {outputHandleConfigs.map((config, index) => (
                <Handle
                    key={`output-${index}`}
                    type="source"
                    position={config.position}
                    id={`output-${index}`}
                    className="w-3 h-3"
                    style={config.style}
                />
            ))}

            <div className="space-y-2 h-full flex flex-col">
                <div className="flex items-start justify-between flex-shrink-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Hash className="h-3 w-3 flex-shrink-0" />
                            <span className="text-xs font-mono truncate">{data.id_courses}</span>
                        </div>
                        <h3 className="font-semibold text-sm leading-tight truncate">Course #{data.id_courses}</h3>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/20" onClick={() => onEditNode(id)}>
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-white/20"
                            onClick={() => onDeleteNode(id)}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                {/* Subjects */}
                <div className="space-y-1 flex-1 min-h-0">
                    <div className="flex items-center gap-1 text-xs">
                        <BookOpen className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium">Subjects:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs pl-2 space-y-0.5">
                        {data.subject.slice(0, currentDimensions.width > 300 ? 4 : 2).map((subject) => (
                            <li key={subject} className="truncate">
                                {subject}
                            </li>
                        ))}
                        {data.subject.length > (currentDimensions.width > 300 ? 4 : 2) && (
                            <li className="text-gray-200">+{data.subject.length - (currentDimensions.width > 300 ? 4 : 2)} more</li>
                        )}
                    </ul>
                </div>

                <div className="flex flex-wrap gap-1 text-xs flex-shrink-0">
                    <Badge variant="secondary" className="text-xs px-1 py-0 truncate">
                        {getCourseTypeLabel(data.typer_Courses)}
                    </Badge>

                    <Badge variant="outline" className="text-xs px-1 py-0 text-white border-white/50">
                        <Clock className="h-2 w-2 mr-1" />
                        {data.duration_Courses}h
                    </Badge>

                    {data.name_over && currentDimensions.width > 250 && (
                        <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 text-white border-white/50 truncate max-w-20"
                            title={data.name_over}
                        >
                            <User className="h-2 w-2 mr-1" />
                            {data.name_over}
                        </Badge>
                    )}

                    {currentDimensions.height > 160 && (
                        <Badge variant="outline" className="text-xs px-1 py-0 text-white border-white/50">
                            <Calendar className="h-2 w-2 mr-1" />
                            {new Date(data.time_create).toLocaleDateString()}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    )
}
