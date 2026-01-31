import { createClient } from '@supabase/supabase-js'

// ⚠️ استبدل هذه القيم بقيم مشروعك من Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// أنواع البيانات
export interface DbUser {
    id: string
    email: string
    name: string
    role: 'renter' | 'equipment_owner' | 'admin'
    phone?: string
    avatar?: string
    created_at: string
}

export interface DbEquipment {
    id: string
    owner_id: string
    name: string
    category: string
    description: string
    daily_price: number
    weekly_price?: number
    monthly_price?: number
    location: string
    city: string
    status: 'available' | 'rented' | 'maintenance'
    image_emoji: string
    rating: number
    reviews_count: number
    specifications?: Record<string, string>
    created_at: string
}

export interface DbBooking {
    id: string
    equipment_id: string
    renter_id: string
    owner_id: string
    start_date: string
    end_date: string
    total_price: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    notes?: string
    created_at: string
}

export interface DbReview {
    id: string
    booking_id: string
    equipment_id: string
    reviewer_id: string
    reviewee_id: string
    reviewer_type: 'renter' | 'owner'
    rating: number
    comment?: string
    equipment_condition?: string
    would_rent_again: boolean
    created_at: string
}
