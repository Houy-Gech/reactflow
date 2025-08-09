"use client"

import { Handle, Position } from "reactflow"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Clock, Hash, BookOpen } from "lucide-react"
import type { CourseData } from "../../types"
import { useMemo } from "react"

interface ViewOnlyCourseNodeProps {
    data: CourseData
}

export function ViewOnlyCourseNode({ data }: ViewOnlyCourseNodeProps) {
    // Memoize all calculations to prevent re-renders
    const nodeConfig = useMemo(() => {
        const getBackgroundColor = (bg: string) => {
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
        }

        const getCourseTypeLabel = (type: number) => {
            const types = {
                1: "Beginner",
                2: "Intermediate",
                3: "Advanced",
                4: "Specialization",
                5: "Workshop",
            }
            return types[type as keyof typeof types] || "Unknown"
        }

        const nodeWidth = data.node_width || 280
        const nodeHeight = data.node_height || 200

        // Calculate max subjects based on node height
        // Estimated height for header, labels, and footer badges: ~114px
        // Estimated height per subject list item (text-xs + space-y-0.5): ~18px
        const availableSubjectHeight = nodeHeight - 114
        const maxSubjects = Math.max(0, Math.floor(availableSubjectHeight / 18))

        return {
            backgroundColor: getBackgroundColor(data.bg || "planned"),
            courseTypeLabel: getCourseTypeLabel(data.typer_Courses),
            nodeWidth,
            nodeHeight,
            maxSubjects,
            showOwner: data.name_over && nodeWidth > 250,
            showDate: nodeHeight > 160,
            inputHandles: data.input_handles || 1,
            outputHandles: data.output_handles || 3,
        }
    }, [data])

    const nodeStyle = useMemo(
        () => ({
            width: `${nodeConfig.nodeWidth}px`,
            height: `${nodeConfig.nodeHeight}px`,
            minWidth: `${nodeConfig.nodeWidth}px`,
            minHeight: `${nodeConfig.nodeHeight}px`,
        }),
        [nodeConfig.nodeWidth, nodeConfig.nodeHeight],
    )

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
                        top: `${nodeConfig.nodeHeight / 2}px`,
                        transform: "translateY(-50%)",
                    },
                })
            } else if (i === 1 && totalOutputs >= 2) {
                // Second handle on top
                configs.push({
                    position: Position.Top,
                    style: {
                        left: `${nodeConfig.nodeWidth / 2}px`,
                        transform: "translateX(-50%)",
                    },
                })
            } else if (i === 2 && totalOutputs >= 3) {
                // Third handle on bottom
                configs.push({
                    position: Position.Bottom,
                    style: {
                        left: `${nodeConfig.nodeWidth / 2}px`,
                        transform: "translateX(-50%)",
                    },
                })
            } else {
                // Additional handles distributed on right side
                const rightHandleIndex = i - 2 // Subtract the top and bottom handles
                configs.push({
                    position: Position.Right,
                    style: {
                        top: `${getVerticalHandlePosition(rightHandleIndex, totalOutputs - 2, nodeConfig.nodeHeight)}px`,
                        transform: "translateY(-50%)",
                    },
                })
            }
        }

        return configs
    }

    const outputHandleConfigs = getOutputHandleConfig(nodeConfig.outputHandles)

    return (
        <div
            className={`${nodeConfig.backgroundColor} text-white rounded-lg p-3 shadow-lg border-2 border-gray-300 cursor-default overflow-hidden`}
            style={nodeStyle}
        >
            {/* Input Handles - Always on the left */}
            {Array.from({ length: nodeConfig.inputHandles }).map((_, index) => (
                <Handle
                    key={`input-${index}`}
                    type="target"
                    position={Position.Left}
                    id={`input-${index}`}
                    className="w-3 h-3"
                    style={{
                        pointerEvents: "none",
                        top: `${getVerticalHandlePosition(index, nodeConfig.inputHandles, nodeConfig.nodeHeight)}px`,
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
                    style={{
                        pointerEvents: "none",
                        ...config.style,
                    }}
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
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs px-2 py-1 bg-white/20 text-white">
                            View Only
                        </Badge>
                    </div>
                </div>

                {/* Subjects */}
                <div className="space-y-1 flex-1 min-h-0">
                    <div className="flex items-center gap-1 text-xs">
                        <BookOpen className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium">Subjects:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs pl-2 space-y-0.5">
                        {data.subject.slice(0, nodeConfig.maxSubjects).map((subject) => (
                            <li key={subject} className="truncate">
                                {subject}
                            </li>
                        ))}
                        {data.subject.length > nodeConfig.maxSubjects && (
                            <li className="text-gray-200">+{data.subject.length - nodeConfig.maxSubjects} more</li>
                        )}
                    </ul>
                </div>

                <div className="flex flex-wrap gap-1 text-xs flex-shrink-0">
                    <Badge variant="secondary" className="text-xs px-1 py-0 truncate">
                        {nodeConfig.courseTypeLabel}
                    </Badge>

                    <Badge variant="outline" className="text-xs px-1 py-0 text-white border-white/50">
                        <Clock className="h-2 w-2 mr-1" />
                        {data.duration_Courses}h
                    </Badge>

                    {nodeConfig.showOwner && (
                        <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 text-white border-white/50 truncate max-w-20"
                            title={data.name_over}
                        >
                            <User className="h-2 w-2 mr-1" />
                            {data.name_over}
                        </Badge>
                    )}

                    {nodeConfig.showDate && (
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
