"use client"

import { createContext, useContext } from 'react'

interface RoadmapContextType {
  onEditNode: (nodeId: string) => void
  onDeleteNode: (nodeId: string) => void
}

const RoadmapContext = createContext<RoadmapContextType | null>(null)

export const useRoadmapContext = () => {
  const context = useContext(RoadmapContext)
  if (!context) {
    throw new Error('useRoadmapContext must be used within RoadmapProvider')
  }
  return context
}

export const RoadmapProvider = RoadmapContext.Provider
