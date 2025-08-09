"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { X, ArrowRight, ArrowLeft } from "lucide-react"
import { type CourseData, SUBJECT_OPTIONS } from "../../types"

interface CourseFormProps {
    course?: CourseData
    onSave: (course: CourseData) => void
    onCancel: () => void
}

export function CourseForm({ course, onSave, onCancel }: CourseFormProps) {
    const [formData, setFormData] = useState<CourseData>({
        id_courses:
            course?.id_courses ||
            `COURSE-${Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}`,
        typer_Courses: course?.typer_Courses || 1,
        duration_Courses: course?.duration_Courses || 0,
        time_create: course?.time_create || new Date().toISOString().split("T")[0],
        subject: course?.subject || [],
        name_over: course?.name_over || "",
        bg: course?.bg || "planned",
        node_width: course?.node_width || 280,
        node_height: course?.node_height || 200,
        course_thumbnail_url: course?.course_thumbnail_url || "",
        input_handles: course?.input_handles || 1,
        output_handles: course?.output_handles || 3,
    })

    const [customSubject, setCustomSubject] = useState("")
    const [showCustomSize, setShowCustomSize] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.subject.length === 0) {
            alert("Please select at least one subject")
            return
        }
        onSave(formData)
    }

    const courseTypes = [
        { value: 1, label: "Beginner Course" },
        { value: 2, label: "Intermediate Course" },
        { value: 3, label: "Advanced Course" },
        { value: 4, label: "Specialization" },
        { value: 5, label: "Workshop" },
    ]

    const backgroundOptions = [
        { value: "completed", label: "Green Background", color: "bg-green-500" },
        { value: "in-progress", label: "Amber Background", color: "bg-amber-500" },
        { value: "planned", label: "Indigo Background", color: "bg-indigo-500" },
        { value: "future", label: "Slate Background", color: "bg-slate-500" },
    ]

    const handleSubjectToggle = (subject: string, checked: boolean) => {
        if (checked) {
            setFormData({
                ...formData,
                subject: [...formData.subject, subject],
            })
        } else {
            setFormData({
                ...formData,
                subject: formData.subject.filter((s) => s !== subject),
            })
        }
    }

    const handleAddCustomSubject = () => {
        if (customSubject.trim() && !formData.subject.includes(customSubject.trim())) {
            setFormData({
                ...formData,
                subject: [...formData.subject, customSubject.trim()],
            })
            setCustomSubject("")
        }
    }

    const handleRemoveSubject = (subjectToRemove: string) => {
        setFormData({
            ...formData,
            subject: formData.subject.filter((s) => s !== subjectToRemove),
        })
    }

    return (
        <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
                <CardTitle>{course ? "Edit Course" : "Add New Course"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="id_courses">Course</Label>
                        <Input
                            id="id_courses"
                            type="text"
                            value={formData.id_courses}
                            onChange={(e) => setFormData({ ...formData, id_courses: e.target.value })}
                            placeholder="e.g., COURSE-0001, WEB-101, etc."
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="typer_Courses">Course Type</Label>
                        <Select
                            value={formData.typer_Courses.toString()}
                            onValueChange={(value) => setFormData({ ...formData, typer_Courses: Number.parseInt(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {courseTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value.toString()}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="duration_Courses">Duration (Hours)</Label>
                        <Input
                            id="duration_Courses"
                            type="number"
                            step="0.5"
                            value={formData.duration_Courses}
                            onChange={(e) => setFormData({ ...formData, duration_Courses: Number.parseFloat(e.target.value) || 0 })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="time_create">Creation Date</Label>
                        <Input
                            id="time_create"
                            type="date"
                            value={formData.time_create}
                            onChange={(e) => setFormData({ ...formData, time_create: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label>Subjects *</Label>

                        {/* Selected Subjects */}
                        {formData.subject.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3 p-2 bg-gray-50 rounded-md">
                                {formData.subject.map((subject) => (
                                    <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                                        {subject}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-red-100"
                                            onClick={() => handleRemoveSubject(subject)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Subject Options */}
                        <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                            {SUBJECT_OPTIONS.map((subject) => (
                                <div key={subject} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={subject}
                                        checked={formData.subject.includes(subject)}
                                        onCheckedChange={(checked) => handleSubjectToggle(subject, checked as boolean)}
                                    />
                                    <Label htmlFor={subject} className="text-sm cursor-pointer">
                                        {subject}
                                    </Label>
                                </div>
                            ))}
                        </div>

                        {/* Custom Subject Input */}
                        <div className="flex gap-2 mt-2">
                            <Input
                                placeholder="Add custom subject..."
                                value={customSubject}
                                onChange={(e) => setCustomSubject(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddCustomSubject()
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddCustomSubject}
                                disabled={!customSubject.trim()}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="name_over">Owner Name</Label>
                        <Input
                            id="name_over"
                            value={formData.name_over}
                            onChange={(e) => setFormData({ ...formData, name_over: e.target.value })}
                            placeholder="Course owner/instructor name"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="bg">Background Color</Label>
                        <Select value={formData.bg} onValueChange={(value: never) => setFormData({ ...formData, bg: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {backgroundOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded ${option.color}`}></div>
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Connection Handles Configuration */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Connection Handles</Label>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="input_handles" className="text-sm flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4" />
                                    Input Handles
                                </Label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Slider
                                        id="input_handles"
                                        min={0}
                                        max={5}
                                        step={1}
                                        value={[formData.input_handles || 1]}
                                        onValueChange={(value) => setFormData({ ...formData, input_handles: value[0] })}
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-mono w-8 text-center">{formData.input_handles}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">How many courses can connect TO this course</p>
                            </div>

                            <div>
                                <Label htmlFor="output_handles" className="text-sm flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Output Handles
                                </Label>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Slider
                                        id="output_handles"
                                        min={0}
                                        max={5}
                                        step={1}
                                        value={[formData.output_handles || 3]}
                                        onValueChange={(value) => setFormData({ ...formData, output_handles: value[0] })}
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-mono w-8 text-center">{formData.output_handles}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">How many courses this can connect TO</p>
                            </div>
                        </div>

                        {/* Handle Presets */}
                        <div className="space-y-2">
                            <Label className="text-sm">Quick Presets:</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 0, output_handles: 1 })}
                                    className="text-xs"
                                >
                                    🚀 Start Course
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 1, output_handles: 1 })}
                                    className="text-xs"
                                >
                                    ➡️ Regular
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 1, output_handles: 0 })}
                                    className="text-xs"
                                >
                                    🎯 End Course
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 1, output_handles: 3 })}
                                    className="text-xs"
                                >
                                    🌟 Hub Course
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 3, output_handles: 1 })}
                                    className="text-xs"
                                >
                                    🔄 Merge Course
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, input_handles: 2, output_handles: 2 })}
                                    className="text-xs"
                                >
                                    ⚡ Junction
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Node Size Controls */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Node Size</Label>

                        {/* Size Presets */}
                        <div className="grid grid-cols-4 gap-2">
                            <Button
                                type="button"
                                variant={formData.node_width === 240 && formData.node_height === 160 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData({ ...formData, node_width: 240, node_height: 160 })}
                                className="text-xs"
                            >
                                Small
                            </Button>
                            <Button
                                type="button"
                                variant={formData.node_width === 280 && formData.node_height === 200 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData({ ...formData, node_width: 280, node_height: 200 })}
                                className="text-xs"
                            >
                                Medium
                            </Button>
                            <Button
                                type="button"
                                variant={formData.node_width === 320 && formData.node_height === 240 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData({ ...formData, node_width: 320, node_height: 240 })}
                                className="text-xs"
                            >
                                Large
                            </Button>
                            <Button
                                type="button"
                                variant={formData.node_width === 380 && formData.node_height === 300 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData({ ...formData, node_width: 380, node_height: 300 })}
                                className="text-xs"
                            >
                                XL
                            </Button>
                        </div>

                        {/* Custom Size Toggle */}
                        <div className="flex items-center space-x-2">
                            <Checkbox id="customSize" checked={showCustomSize}/>
                            <Label htmlFor="customSize" className="text-sm cursor-pointer">
                                Custom size
                            </Label>
                        </div>

                        {/* Custom Size Controls */}
                        {showCustomSize && (
                            <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="node_width" className="text-sm">
                                            Width
                                        </Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Slider
                                                id="node_width"
                                                min={200}
                                                max={500}
                                                step={20}
                                                value={[formData.node_width || 280]}
                                                onValueChange={(value) => setFormData({ ...formData, node_width: value[0] })}
                                                className="flex-1"
                                            />
                                            <span className="text-sm font-mono w-12 text-right">{formData.node_width}px</span>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="node_height" className="text-sm">
                                            Height
                                        </Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Slider
                                                id="node_height"
                                                min={150}
                                                max={400}
                                                step={20}
                                                value={[formData.node_height || 200]}
                                                onValueChange={(value) => setFormData({ ...formData, node_height: value[0] })}
                                                className="flex-1"
                                            />
                                            <span className="text-sm font-mono w-12 text-right">{formData.node_height}px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                            {course ? "Update" : "Add"} Course
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
