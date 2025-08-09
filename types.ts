export interface CourseData {
    id_courses: string
    course_thumbnail_url: string
    typer_Courses: number
    duration_Courses: number
    time_create: string
    subject: string[]
    name_over: string
    bg?: "completed" | "in-progress" | "planned" | "future"
    node_width?: number
    node_height?: number
    input_handles?: number
    output_handles?: number
}

export interface MilestoneData {
    label: string
    description: string
    status: "completed" | "in-progress" | "planned" | "future"
    quarter: string
    assignee?: string
    dueDate?: string
    progress?: number
}

export interface QuarterGroup {
    id: string
    label: string
    color: string
    bgColor: string
    borderColor: string
}

export const SUBJECT_OPTIONS = [
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "UI/UX Design",
    "Database Management",
    "Web Development",
    "Software Engineering",
    "Programming Languages",
    "Frameworks & Libraries",
    "Testing & QA",
    "Project Management",
    "Soft Skills",
    "Business Analysis",
] as const
