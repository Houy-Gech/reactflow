"use client"

import { Handle, Position } from "reactflow"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Calendar } from 'lucide-react'
import {MilestoneData} from "../../types";
import {useRoadmapContext} from "../../contexts/roadmap-context";

interface MilestoneNodeProps {
  id: string
  data: MilestoneData
}

export function MilestoneNode({ id, data }: MilestoneNodeProps) {
  const { onEditNode, onDeleteNode } = useRoadmapContext()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-600'
      case 'in-progress': return 'bg-amber-500 border-amber-600'
      case 'planned': return 'bg-indigo-500 border-indigo-600'
      case 'future': return 'bg-slate-500 border-slate-600'
      default: return 'bg-gray-500 border-gray-600'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500 rounded-lg'
    if (progress >= 75) return 'bg-blue-500 rounded-lg'
    if (progress >= 50) return 'bg-yellow-500 rounded-lg'
    if (progress >= 25) return 'bg-orange-500 rounded-lg'
    return 'bg-red-500'
  }

  return (
    <div className={`${getStatusColor(data.status)} text-white p-3 min-w-[200px] shadow-lg border-2`}>
      <Handle type="target" position={Position.Left}  className="w-3 h-3" />
      
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-sm leading-tight">{data.label}</h3>
          <div className="flex gap-1 ml-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={() => onEditNode(id)}
            >
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
        
        <p className="text-xs opacity-90 leading-tight">{data.description}</p>
        
        {data.progress !== undefined && data.progress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{data.progress}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div
                className={`${getProgressColor(data.progress)} h-1.5 rounded-full transition-all duration-300`}
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 text-xs">
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {data.quarter}
          </Badge>
          {data.assignee && (
            <Badge variant="outline" className="text-xs px-1 py-0 text-white border-white/50">
              <User className="h-2 w-2 mr-1" />
              {data.assignee}
            </Badge>
          )}
          {data.dueDate && (
            <Badge variant="outline" className="text-xs px-1 py-0 text-white border-white/50">
              <Calendar className="h-2 w-2 mr-1" />
              {new Date(data.dueDate).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </div>
  )
}
