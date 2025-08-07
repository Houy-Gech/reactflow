"use client"

import { useState, useEffect } from "react"
import { Node, Edge } from "reactflow"

const STORAGE_KEY = "roadmap-data"

interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

export function useRoadmapStorage() {
  const [data, setData] = useState<RoadmapData>({ nodes: [], edges: [] })

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData(parsed)
      } catch (error) {
        console.error('Failed to parse saved roadmap data:', error)
      }
    }
  }, [])

  const saveData = (nodes: Node[], edges: Edge[]) => {
    const dataToSave = { nodes, edges }
    setData(dataToSave)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }

  const clearData = () => {
    setData({ nodes: [], edges: [] })
    localStorage.removeItem(STORAGE_KEY)
  }

  return { data, saveData, clearData }
}
