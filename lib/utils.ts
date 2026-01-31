import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
    }).format(price)
}

export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const period = hour >= 12 ? 'م' : 'ص'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${period}`
}

export function getActivityTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        irrigation: 'ري',
        fertilization: 'تسميد',
        harvest: 'حصاد',
        pesticide: 'رش مبيدات',
        planting: 'زراعة',
        maintenance: 'صيانة',
    }
    return labels[type] || type
}

export function getActivityTypeColor(type: string): string {
    const colors: Record<string, string> = {
        irrigation: 'bg-blue-100 text-blue-700',
        fertilization: 'bg-green-100 text-green-700',
        harvest: 'bg-yellow-100 text-yellow-700',
        pesticide: 'bg-red-100 text-red-700',
        planting: 'bg-purple-100 text-purple-700',
        maintenance: 'bg-gray-100 text-gray-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
}

export function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending: 'قيد الانتظار',
        in_progress: 'جاري التنفيذ',
        completed: 'مكتمل',
    }
    return labels[status] || status
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        in_progress: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
}

export function getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
        admin: 'مدير النظام',
        farm_owner: 'مالك مزرعة',
        equipment_owner: 'مالك معدات',
        renter: 'مستأجر',
        worker: 'عامل',
    }
    return labels[role] || role
}

export function generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
