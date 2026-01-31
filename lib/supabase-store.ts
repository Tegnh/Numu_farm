import { create } from 'zustand'
import { supabase, DbUser, DbEquipment, DbBooking, DbReview } from './supabase'

// ============================================
// Auth Store with Supabase
// ============================================
interface AuthState {
    user: DbUser | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<boolean>
    register: (email: string, password: string, name: string, role: 'renter' | 'equipment_owner', phone?: string) => Promise<boolean>
    logout: () => Promise<void>
    checkSession: () => Promise<void>
}

export const useSupabaseAuth = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                set({ error: error.message, isLoading: false })
                return false
            }

            if (data.user) {
                // جلب بيانات المستخدم من جدول users
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                if (userError || !userData) {
                    set({ error: 'لم يتم العثور على بيانات المستخدم', isLoading: false })
                    return false
                }

                set({
                    user: userData as DbUser,
                    isAuthenticated: true,
                    isLoading: false
                })
                return true
            }
            return false
        } catch (err) {
            set({ error: 'حدث خطأ غير متوقع', isLoading: false })
            return false
        }
    },

    register: async (email, password, name, role, phone) => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                set({ error: error.message, isLoading: false })
                return false
            }

            if (data.user) {
                // إضافة بيانات المستخدم في جدول users
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email,
                        name,
                        role,
                        phone,
                    })

                if (insertError) {
                    set({ error: insertError.message, isLoading: false })
                    return false
                }

                const newUser: DbUser = {
                    id: data.user.id,
                    email,
                    name,
                    role,
                    phone,
                    created_at: new Date().toISOString(),
                }

                set({
                    user: newUser,
                    isAuthenticated: true,
                    isLoading: false
                })
                return true
            }
            return false
        } catch (err) {
            set({ error: 'حدث خطأ غير متوقع', isLoading: false })
            return false
        }
    },

    logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
    },

    checkSession: async () => {
        set({ isLoading: true })
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
            const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (userData) {
                set({
                    user: userData as DbUser,
                    isAuthenticated: true,
                    isLoading: false
                })
                return
            }
        }

        set({ user: null, isAuthenticated: false, isLoading: false })
    },
}))

// ============================================
// Equipment Store with Supabase
// ============================================
interface EquipmentState {
    equipment: DbEquipment[]
    isLoading: boolean
    error: string | null

    fetchAllEquipment: () => Promise<void>
    fetchEquipmentById: (id: string) => Promise<DbEquipment | null>
    fetchOwnerEquipment: (ownerId: string) => Promise<void>
    addEquipment: (equipment: Omit<DbEquipment, 'id' | 'created_at' | 'rating' | 'reviews_count'>) => Promise<string | null>
    updateEquipment: (id: string, updates: Partial<DbEquipment>) => Promise<boolean>
    deleteEquipment: (id: string) => Promise<boolean>
}

export const useSupabaseEquipment = create<EquipmentState>((set, get) => ({
    equipment: [],
    isLoading: false,
    error: null,

    fetchAllEquipment: async () => {
        set({ isLoading: true })
        const { data, error } = await supabase
            .from('equipment')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false })

        if (error) {
            set({ error: error.message, isLoading: false })
        } else {
            set({ equipment: data || [], isLoading: false })
        }
    },

    fetchEquipmentById: async (id: string) => {
        const { data, error } = await supabase
            .from('equipment')
            .select('*')
            .eq('id', id)
            .single()

        if (error) return null
        return data as DbEquipment
    },

    fetchOwnerEquipment: async (ownerId: string) => {
        set({ isLoading: true })
        const { data, error } = await supabase
            .from('equipment')
            .select('*')
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false })

        if (error) {
            set({ error: error.message, isLoading: false })
        } else {
            set({ equipment: data || [], isLoading: false })
        }
    },

    addEquipment: async (equipment) => {
        const { data, error } = await supabase
            .from('equipment')
            .insert({
                ...equipment,
                rating: 0,
                reviews_count: 0,
            })
            .select()
            .single()

        if (error) {
            set({ error: error.message })
            return null
        }

        set((state) => ({
            equipment: [data, ...state.equipment]
        }))
        return data.id
    },

    updateEquipment: async (id, updates) => {
        const { error } = await supabase
            .from('equipment')
            .update(updates)
            .eq('id', id)

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            equipment: state.equipment.map((eq) =>
                eq.id === id ? { ...eq, ...updates } : eq
            )
        }))
        return true
    },

    deleteEquipment: async (id) => {
        const { error } = await supabase
            .from('equipment')
            .delete()
            .eq('id', id)

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            equipment: state.equipment.filter((eq) => eq.id !== id)
        }))
        return true
    },
}))

// ============================================
// Booking Store with Supabase
// ============================================
interface BookingState {
    bookings: DbBooking[]
    isLoading: boolean
    error: string | null

    fetchRenterBookings: (renterId: string) => Promise<void>
    fetchOwnerBookings: (ownerId: string) => Promise<void>
    createBooking: (booking: Omit<DbBooking, 'id' | 'created_at' | 'status'>) => Promise<string | null>
    updateBookingStatus: (id: string, status: DbBooking['status']) => Promise<boolean>
}

export const useSupabaseBooking = create<BookingState>((set) => ({
    bookings: [],
    isLoading: false,
    error: null,

    fetchRenterBookings: async (renterId: string) => {
        set({ isLoading: true })
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                equipment:equipment_id (name, image_emoji, daily_price),
                owner:owner_id (name, phone)
            `)
            .eq('renter_id', renterId)
            .order('created_at', { ascending: false })

        if (error) {
            set({ error: error.message, isLoading: false })
        } else {
            set({ bookings: data || [], isLoading: false })
        }
    },

    fetchOwnerBookings: async (ownerId: string) => {
        set({ isLoading: true })
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                equipment:equipment_id (name, image_emoji),
                renter:renter_id (name, phone)
            `)
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false })

        if (error) {
            set({ error: error.message, isLoading: false })
        } else {
            set({ bookings: data || [], isLoading: false })
        }
    },

    createBooking: async (booking) => {
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                ...booking,
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            set({ error: error.message })
            return null
        }

        set((state) => ({
            bookings: [data, ...state.bookings]
        }))
        return data.id
    },

    updateBookingStatus: async (id, status) => {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)

        if (error) {
            set({ error: error.message })
            return false
        }

        set((state) => ({
            bookings: state.bookings.map((b) =>
                b.id === id ? { ...b, status } : b
            )
        }))
        return true
    },
}))

// ============================================
// Review Store with Supabase
// ============================================
interface ReviewState {
    reviews: DbReview[]
    isLoading: boolean

    fetchEquipmentReviews: (equipmentId: string) => Promise<void>
    fetchUserReviews: (userId: string) => Promise<void>
    addReview: (review: Omit<DbReview, 'id' | 'created_at'>) => Promise<boolean>
    getUserRating: (userId: string) => Promise<{ average: number; count: number }>
}

export const useSupabaseReview = create<ReviewState>((set) => ({
    reviews: [],
    isLoading: false,

    fetchEquipmentReviews: async (equipmentId: string) => {
        set({ isLoading: true })
        const { data } = await supabase
            .from('reviews')
            .select('*, reviewer:reviewer_id (name)')
            .eq('equipment_id', equipmentId)
            .order('created_at', { ascending: false })

        set({ reviews: data || [], isLoading: false })
    },

    fetchUserReviews: async (userId: string) => {
        set({ isLoading: true })
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('reviewee_id', userId)
            .order('created_at', { ascending: false })

        set({ reviews: data || [], isLoading: false })
    },

    addReview: async (review) => {
        const { error } = await supabase
            .from('reviews')
            .insert(review)

        if (error) return false

        // تحديث متوسط التقييم للمعدة
        const { data: avgData } = await supabase
            .from('reviews')
            .select('rating')
            .eq('equipment_id', review.equipment_id)

        if (avgData && avgData.length > 0) {
            const avg = avgData.reduce((sum, r) => sum + r.rating, 0) / avgData.length
            await supabase
                .from('equipment')
                .update({
                    rating: avg,
                    reviews_count: avgData.length
                })
                .eq('id', review.equipment_id)
        }

        return true
    },

    getUserRating: async (userId: string) => {
        const { data } = await supabase
            .from('reviews')
            .select('rating')
            .eq('reviewee_id', userId)

        if (!data || data.length === 0) {
            return { average: 0, count: 0 }
        }

        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
        return { average: avg, count: data.length }
    },
}))
