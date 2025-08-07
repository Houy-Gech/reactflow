"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {MilestoneData} from "../../types";

interface MilestoneFormProps {
  milestone?: MilestoneData;
  onSave: (milestone: MilestoneData) => void;
  onCancel: () => void;
}

export function MilestoneForm({ milestone, onSave, onCancel }: MilestoneFormProps) {
  const [formData, setFormData] = useState<MilestoneData>({
    label: milestone?.label || "",
    description: milestone?.description || "",
    status: milestone?.status || "planned",
    quarter: milestone?.quarter || "Q1 2024",
    assignee: milestone?.assignee || "",
    dueDate: milestone?.dueDate || "",
    progress: milestone?.progress || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{milestone ? 'Edit Milestone' : 'Add New Milestone'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="label">Title</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: never) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="future">Future</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quarter">Quarter</Label>
            <Select value={formData.quarter} onValueChange={(value) => setFormData({ ...formData, quarter: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                <SelectItem value="Q1 2025">Q1 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="Team member name"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="progress">Progress (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {milestone ? 'Update' : 'Add'} Milestone
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
