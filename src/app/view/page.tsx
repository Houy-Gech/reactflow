"use client"

import { Suspense } from "react"
import ViewOnlyRoadmap from "@/app/view/view-only-roadmap";

function ViewOnlyLoading() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading roadmap...</p>
            </div>
        </div>
    )
}

export default function ViewOnlyPage() {
    return (
        <div className="w-full h-screen bg-gray-50">
            <Suspense fallback={<ViewOnlyLoading />}>
                <ViewOnlyRoadmap />
            </Suspense>
        </div>
    )
}
