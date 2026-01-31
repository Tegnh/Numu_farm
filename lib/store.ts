import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// أنواع المستخدمين
export type UserRole = 'admin' | 'farm_owner' | 'equipment_owner' | 'renter' | 'worker'

// بيانات المستخدم
export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    phone?: string
    avatar?: string
    farmId?: string
}

// حالة المصادقة (Mock - بسيطة للعرض التجريبي)
interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string, role: UserRole) => Promise<boolean>
    logout: () => void
    setUser: (user: User) => void
}

// مستخدمين تجريبيين
const mockUsers: Record<string, User> = {
    'admin@numu.sa': {
        id: '1',
        name: 'أحمد المدير',
        email: 'admin@numu.sa',
        role: 'admin',
        phone: '+966501234567',
    },
    'farmer@numu.sa': {
        id: '2',
        name: 'محمد المزارع',
        email: 'farmer@numu.sa',
        role: 'farm_owner',
        phone: '+966507654321',
        farmId: 'farm-1',
    },
    'owner@numu.sa': {
        id: '3',
        name: 'خالد المؤجر',
        email: 'owner@numu.sa',
        role: 'equipment_owner',
        phone: '+966509876543',
    },
    'worker@numu.sa': {
        id: '4',
        name: 'سعيد العامل',
        email: 'worker@numu.sa',
        role: 'worker',
        phone: '+966503456789',
        farmId: 'farm-1',
    },
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (email: string, _password: string, role: UserRole) => {
                // Mock login - في الإنتاج سيكون هناك API حقيقي
                const user = mockUsers[email]
                if (user && user.role === role) {
                    set({ user, isAuthenticated: true })
                    return true
                }
                // إنشاء مستخدم جديد للعرض التجريبي
                const newUser: User = {
                    id: Date.now().toString(),
                    name: email.split('@')[0],
                    email,
                    role,
                }
                set({ user: newUser, isAuthenticated: true })
                return true
            },

            logout: () => {
                set({ user: null, isAuthenticated: false })
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true })
            },
        }),
        {
            name: 'numu-auth',
        }
    )
)

// المعدات الزراعية
export interface Equipment {
    id: string
    name: string
    description: string
    category: string
    pricePerDay: number
    pricePerWeek: number
    location: string
    city: string
    images: string[]
    ownerId: string
    ownerName: string
    rating: number
    reviewsCount: number
    isAvailable: boolean
    specifications: Record<string, string>
    createdAt: string
}

// بيانات المعدات التجريبية
const mockEquipment: Equipment[] = [
    {
        id: 'eq-1',
        name: 'جرار زراعي جون ديري 6120M',
        description: 'جرار قوي ومتعدد الاستخدامات مناسب لجميع الأعمال الزراعية. قوة المحرك 120 حصان مع نظام هيدروليكي متقدم.',
        category: 'جرارات',
        pricePerDay: 800,
        pricePerWeek: 4500,
        location: 'الرياض',
        city: 'الرياض',
        images: ['/images/tractor1.jpg'],
        ownerId: '3',
        ownerName: 'شركة النخبة للمعدات',
        rating: 4.8,
        reviewsCount: 24,
        isAvailable: true,
        specifications: {
            'قوة المحرك': '120 حصان',
            'نوع الوقود': 'ديزل',
            'سنة الصنع': '2022',
            'حالة المعدة': 'ممتازة',
        },
        createdAt: '2024-01-15',
    },
    {
        id: 'eq-2',
        name: 'حصادة القمح كلاس ليكسيون 770',
        description: 'حصادة عالية الكفاءة لحصاد القمح والشعير والأرز. تقنية GPS مدمجة مع نظام فصل ذكي.',
        category: 'حصادات',
        pricePerDay: 1500,
        pricePerWeek: 8000,
        location: 'القصيم',
        city: 'بريدة',
        images: ['/images/harvester1.jpg'],
        ownerId: '3',
        ownerName: 'مؤسسة الحصاد الذهبي',
        rating: 4.9,
        reviewsCount: 18,
        isAvailable: true,
        specifications: {
            'عرض الحصاد': '9 متر',
            'سعة الخزان': '12,000 لتر',
            'سنة الصنع': '2023',
            'حالة المعدة': 'جديدة',
        },
        createdAt: '2024-02-01',
    },
    {
        id: 'eq-3',
        name: 'نظام ري محوري Valley',
        description: 'نظام ري محوري متكامل للمزارع الكبيرة. تحكم ذكي عن بعد مع مستشعرات رطوبة التربة.',
        category: 'أنظمة ري',
        pricePerDay: 500,
        pricePerWeek: 2800,
        location: 'الجوف',
        city: 'سكاكا',
        images: ['/images/irrigation1.jpg'],
        ownerId: '3',
        ownerName: 'شركة المياه الخضراء',
        rating: 4.7,
        reviewsCount: 31,
        isAvailable: false,
        specifications: {
            'طول الذراع': '400 متر',
            'المساحة المغطاة': '50 هكتار',
            'نوع التحكم': 'ذكي عن بعد',
            'حالة المعدة': 'جيدة جداً',
        },
        createdAt: '2024-01-20',
    },
    {
        id: 'eq-4',
        name: 'رشاش مبيدات John Deere R4045',
        description: 'رشاش مبيدات عالي الدقة مع نظام GPS لتجنب الرش المكرر. خزان بسعة 4500 لتر.',
        category: 'رشاشات',
        pricePerDay: 600,
        pricePerWeek: 3500,
        location: 'المدينة المنورة',
        city: 'المدينة المنورة',
        images: ['/images/sprayer1.jpg'],
        ownerId: '3',
        ownerName: 'مؤسسة الزراعة الحديثة',
        rating: 4.6,
        reviewsCount: 15,
        isAvailable: true,
        specifications: {
            'سعة الخزان': '4,500 لتر',
            'عرض الرش': '36 متر',
            'نوع الفوهات': 'متغيرة',
            'حالة المعدة': 'ممتازة',
        },
        createdAt: '2024-03-01',
    },
    {
        id: 'eq-5',
        name: 'محراث قلاب 5 سكك',
        description: 'محراث قلاب قوي لتجهيز التربة. مناسب للتربة الثقيلة والمتوسطة.',
        category: 'محاريث',
        pricePerDay: 300,
        pricePerWeek: 1600,
        location: 'حائل',
        city: 'حائل',
        images: ['/images/plow1.jpg'],
        ownerId: '3',
        ownerName: 'معدات الشمال',
        rating: 4.5,
        reviewsCount: 22,
        isAvailable: true,
        specifications: {
            'عدد السكك': '5',
            'عمق الحرث': 'حتى 40 سم',
            'الوزن': '1,200 كجم',
            'حالة المعدة': 'جيدة',
        },
        createdAt: '2024-02-15',
    },
    {
        id: 'eq-6',
        name: 'طائرة درون زراعية DJI Agras T40',
        description: 'طائرة رش ذكية للمساحات الكبيرة. رش دقيق مع تقنية تجنب العوائق.',
        category: 'طائرات درون',
        pricePerDay: 400,
        pricePerWeek: 2200,
        location: 'الأحساء',
        city: 'الهفوف',
        images: ['/images/drone1.jpg'],
        ownerId: '3',
        ownerName: 'تقنيات المستقبل الزراعية',
        rating: 4.9,
        reviewsCount: 28,
        isAvailable: true,
        specifications: {
            'سعة الخزان': '40 لتر',
            'معدل الرش': '16 لتر/دقيقة',
            'وقت الطيران': '30 دقيقة',
            'حالة المعدة': 'جديدة',
        },
        createdAt: '2024-03-10',
    },
]

interface EquipmentState {
    equipment: Equipment[]
    filters: {
        category: string
        city: string
        priceRange: [number, number]
        availableOnly: boolean
        searchQuery: string
    }
    setFilters: (filters: Partial<EquipmentState['filters']>) => void
    getFilteredEquipment: () => Equipment[]
    getEquipmentById: (id: string) => Equipment | undefined
    addEquipmentToMain: (equipment: Equipment) => void
    updateEquipmentAvailability: (id: string, isAvailable: boolean) => void
}

export const useEquipmentStore = create<EquipmentState>()(
    persist(
        (set, get) => ({
            equipment: mockEquipment,
            filters: {
                category: '',
                city: '',
                priceRange: [0, 10000],
                availableOnly: false,
                searchQuery: '',
            },

            setFilters: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                }))
            },

            getFilteredEquipment: () => {
                const { equipment, filters } = get()
                return equipment.filter((eq) => {
                    if (filters.category && eq.category !== filters.category) return false
                    if (filters.city && eq.city !== filters.city) return false
                    if (filters.availableOnly && !eq.isAvailable) return false
                    if (filters.searchQuery) {
                        const query = filters.searchQuery.toLowerCase()
                        if (!eq.name.toLowerCase().includes(query) &&
                            !eq.description.toLowerCase().includes(query)) {
                            return false
                        }
                    }
                    if (eq.pricePerDay < filters.priceRange[0] ||
                        eq.pricePerDay > filters.priceRange[1]) {
                        return false
                    }
                    return true
                })
            },

            getEquipmentById: (id: string) => {
                return get().equipment.find((eq) => eq.id === id)
            },

            addEquipmentToMain: (equipment: Equipment) => {
                set((state) => ({
                    equipment: [equipment, ...state.equipment],
                }))
            },

            updateEquipmentAvailability: (id: string, isAvailable: boolean) => {
                set((state) => ({
                    equipment: state.equipment.map((eq) =>
                        eq.id === id ? { ...eq, isAvailable } : eq
                    ),
                }))
            },
        }),
        {
            name: 'numu-equipment',
        }
    )
)

// أنشطة المزرعة
export interface FarmActivity {
    id: string
    type: 'irrigation' | 'fertilization' | 'harvest' | 'pesticide' | 'planting' | 'maintenance'
    title: string
    description: string
    workerId: string
    workerName: string
    farmId: string
    fieldId: string
    fieldName: string
    date: string
    time: string
    status: 'pending' | 'in_progress' | 'completed'
    resources?: {
        name: string
        amount: number
        unit: string
    }[]
    location?: {
        lat: number
        lng: number
    }
    images?: string[]
    notes?: string
}

const mockActivities: FarmActivity[] = [
    {
        id: 'act-1',
        type: 'irrigation',
        title: 'ري الحقل الشرقي',
        description: 'ري منتظم للحقل الشرقي - قمح',
        workerId: '4',
        workerName: 'سعيد العامل',
        farmId: 'farm-1',
        fieldId: 'field-1',
        fieldName: 'الحقل الشرقي',
        date: '2024-03-15',
        time: '06:30',
        status: 'completed',
        resources: [
            { name: 'مياه', amount: 5000, unit: 'لتر' },
        ],
    },
    {
        id: 'act-2',
        type: 'fertilization',
        title: 'تسميد الحقل الغربي',
        description: 'إضافة سماد NPK للحقل الغربي - خضروات',
        workerId: '4',
        workerName: 'سعيد العامل',
        farmId: 'farm-1',
        fieldId: 'field-2',
        fieldName: 'الحقل الغربي',
        date: '2024-03-15',
        time: '08:00',
        status: 'in_progress',
        resources: [
            { name: 'سماد NPK', amount: 50, unit: 'كجم' },
        ],
    },
    {
        id: 'act-3',
        type: 'pesticide',
        title: 'رش مبيدات الحقل الجنوبي',
        description: 'رش مبيدات حشرية للحقل الجنوبي - نخيل',
        workerId: '4',
        workerName: 'أحمد الفني',
        farmId: 'farm-1',
        fieldId: 'field-3',
        fieldName: 'الحقل الجنوبي',
        date: '2024-03-16',
        time: '05:00',
        status: 'pending',
        resources: [
            { name: 'مبيد حشري', amount: 10, unit: 'لتر' },
        ],
    },
]

interface FarmState {
    activities: FarmActivity[]
    addActivity: (activity: Omit<FarmActivity, 'id'>) => void
    updateActivityStatus: (id: string, status: FarmActivity['status']) => void
    getActivitiesByFarm: (farmId: string) => FarmActivity[]
    getActivitiesByWorker: (workerId: string) => FarmActivity[]
}

export const useFarmStore = create<FarmState>((set, get) => ({
    activities: mockActivities,

    addActivity: (activity) => {
        const newActivity: FarmActivity = {
            ...activity,
            id: `act-${Date.now()}`,
        }
        set((state) => ({
            activities: [...state.activities, newActivity],
        }))
    },

    updateActivityStatus: (id, status) => {
        set((state) => ({
            activities: state.activities.map((act) =>
                act.id === id ? { ...act, status } : act
            ),
        }))
    },

    getActivitiesByFarm: (farmId) => {
        return get().activities.filter((act) => act.farmId === farmId)
    },

    getActivitiesByWorker: (workerId) => {
        return get().activities.filter((act) => act.workerId === workerId)
    },
}))

// معدات المالك
export interface OwnerEquipment {
    id: string
    name: string
    image: string
    category: string
    pricePerDay: number
    status: 'available' | 'rented' | 'maintenance'
    rating: number
    reviewsCount: number
    totalBookings: number
    totalEarnings: number
    location: string
    description: string
    condition: string
    yearOfManufacture: string
    minRentalDays: number
    maxRentalDays: number
    deliveryAvailable: boolean
    deliveryRadius?: string
    deliveryPrice?: string
    availability: {
        monday: boolean
        tuesday: boolean
        wednesday: boolean
        thursday: boolean
        friday: boolean
        saturday: boolean
        sunday: boolean
    }
    createdAt: string
}

// طلبات الحجز
export interface BookingRequest {
    id: string
    equipmentId: string
    equipmentName: string
    equipmentImage: string
    renterName: string
    renterPhone: string
    startDate: string
    endDate: string
    days: number
    totalPrice: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    requestDate: string
    ownerId: string
}

// الإشعارات
export interface Notification {
    id: string
    type: 'booking' | 'review' | 'system'
    title: string
    message: string
    isRead: boolean
    createdAt: string
    link?: string
}

const mockOwnerEquipment: OwnerEquipment[] = [
    {
        id: 'EQ001',
        name: 'جرار زراعي John Deere 5075E',
        image: '🚜',
        category: 'tractors',
        pricePerDay: 800,
        status: 'available',
        rating: 4.8,
        reviewsCount: 12,
        totalBookings: 25,
        totalEarnings: 45000,
        location: 'بريدة',
        description: 'جرار قوي ومتعدد الاستخدامات مناسب لجميع الأعمال الزراعية',
        condition: 'excellent',
        yearOfManufacture: '2022',
        minRentalDays: 1,
        maxRentalDays: 30,
        deliveryAvailable: true,
        deliveryRadius: '50',
        deliveryPrice: '100',
        availability: {
            monday: true, tuesday: true, wednesday: true, thursday: true,
            friday: true, saturday: true, sunday: true
        },
        createdAt: '2024-01-15'
    },
    {
        id: 'EQ002',
        name: 'حصادة قمح CLAAS',
        image: '🌾',
        category: 'harvesters',
        pricePerDay: 1500,
        status: 'rented',
        rating: 4.5,
        reviewsCount: 8,
        totalBookings: 15,
        totalEarnings: 67500,
        location: 'القصيم',
        description: 'حصادة عالية الكفاءة لحصاد القمح والشعير',
        condition: 'good',
        yearOfManufacture: '2021',
        minRentalDays: 2,
        maxRentalDays: 14,
        deliveryAvailable: false,
        availability: {
            monday: true, tuesday: true, wednesday: true, thursday: true,
            friday: false, saturday: true, sunday: true
        },
        createdAt: '2024-02-01'
    },
]

const mockBookingRequests: BookingRequest[] = [
    {
        id: 'BR001',
        equipmentId: 'EQ001',
        equipmentName: 'جرار زراعي John Deere 5075E',
        equipmentImage: '🚜',
        renterName: 'أحمد الفارسي',
        renterPhone: '0501234567',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        days: 5,
        totalPrice: 4000,
        status: 'pending',
        requestDate: '2024-03-25',
        ownerId: '3'
    },
    {
        id: 'BR002',
        equipmentId: 'EQ002',
        equipmentName: 'حصادة قمح CLAAS',
        equipmentImage: '🌾',
        renterName: 'محمد العتيبي',
        renterPhone: '0559876543',
        startDate: '2024-04-10',
        endDate: '2024-04-12',
        days: 3,
        totalPrice: 4500,
        status: 'pending',
        requestDate: '2024-03-26',
        ownerId: '3'
    },
    {
        id: 'BR003',
        equipmentId: 'EQ001',
        equipmentName: 'جرار زراعي John Deere 5075E',
        equipmentImage: '🚜',
        renterName: 'سعود الدوسري',
        renterPhone: '0567891234',
        startDate: '2024-03-20',
        endDate: '2024-03-25',
        days: 5,
        totalPrice: 4000,
        status: 'confirmed',
        requestDate: '2024-03-15',
        ownerId: '3'
    },
]

const mockNotifications: Notification[] = [
    {
        id: 'N001',
        type: 'booking',
        title: 'طلب حجز جديد',
        message: 'أحمد الفارسي يريد حجز جرار زراعي John Deere',
        isRead: false,
        createdAt: '2024-03-25T10:30:00',
        link: '/owner?tab=bookings'
    },
    {
        id: 'N002',
        type: 'booking',
        title: 'طلب حجز جديد',
        message: 'محمد العتيبي يريد حجز حصادة قمح CLAAS',
        isRead: false,
        createdAt: '2024-03-26T14:15:00',
        link: '/owner?tab=bookings'
    },
    {
        id: 'N003',
        type: 'review',
        title: 'تقييم جديد',
        message: 'سعود الدوسري أعطى تقييم 5 نجوم للجرار',
        isRead: true,
        createdAt: '2024-03-20T09:00:00'
    },
]

interface OwnerState {
    equipment: OwnerEquipment[]
    bookings: BookingRequest[]
    notifications: Notification[]
    addEquipment: (equipment: Omit<OwnerEquipment, 'id' | 'rating' | 'reviewsCount' | 'totalBookings' | 'totalEarnings' | 'createdAt'>) => void
    updateEquipment: (id: string, updates: Partial<OwnerEquipment>) => void
    deleteEquipment: (id: string) => void
    addBooking: (booking: BookingRequest) => void
    acceptBooking: (id: string) => void
    rejectBooking: (id: string) => void
    markNotificationAsRead: (id: string) => void
    markAllNotificationsAsRead: () => void
    getUnreadCount: () => number
    getEquipmentByOwner: (ownerId: string) => OwnerEquipment[]
    getBookingsByOwner: (ownerId: string) => BookingRequest[]
}

export const useOwnerStore = create<OwnerState>()(
    persist(
        (set, get) => ({
            equipment: mockOwnerEquipment,
            bookings: mockBookingRequests,
            notifications: mockNotifications,

            addEquipment: (equipmentData) => {
                const newEquipment: OwnerEquipment = {
                    ...equipmentData,
                    id: `EQ${Date.now()}`,
                    rating: 0,
                    reviewsCount: 0,
                    totalBookings: 0,
                    totalEarnings: 0,
                    createdAt: new Date().toISOString().split('T')[0],
                }
                set((state) => ({
                    equipment: [...state.equipment, newEquipment],
                    notifications: [
                        {
                            id: `N${Date.now()}`,
                            type: 'system',
                            title: 'تمت إضافة المعدة',
                            message: `تم إضافة "${equipmentData.name}" بنجاح`,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.notifications,
                    ],
                }))
            },

            updateEquipment: (id, updates) => {
                set((state) => ({
                    equipment: state.equipment.map((eq) =>
                        eq.id === id ? { ...eq, ...updates } : eq
                    ),
                }))
            },

            deleteEquipment: (id) => {
                set((state) => ({
                    equipment: state.equipment.filter((eq) => eq.id !== id),
                }))
            },

            addBooking: (booking) => {
                set((state) => ({
                    bookings: [booking, ...state.bookings],
                    notifications: [
                        {
                            id: `N${Date.now()}`,
                            type: 'booking',
                            title: 'طلب حجز جديد',
                            message: `${booking.renterName} يريد حجز ${booking.equipmentName}`,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            link: '/owner?tab=bookings',
                        },
                        ...state.notifications,
                    ],
                }))
            },

            acceptBooking: (id) => {
                set((state) => ({
                    bookings: state.bookings.map((b) =>
                        b.id === id ? { ...b, status: 'confirmed' as const } : b
                    ),
                    notifications: [
                        {
                            id: `N${Date.now()}`,
                            type: 'system',
                            title: 'تم قبول الحجز',
                            message: `تم قبول الحجز ${id} بنجاح`,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.notifications,
                    ],
                }))
            },

            rejectBooking: (id) => {
                set((state) => ({
                    bookings: state.bookings.map((b) =>
                        b.id === id ? { ...b, status: 'cancelled' as const } : b
                    ),
                    notifications: [
                        {
                            id: `N${Date.now()}`,
                            type: 'system',
                            title: 'تم رفض الحجز',
                            message: `تم رفض الحجز ${id}`,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                        },
                        ...state.notifications,
                    ],
                }))
            },

            markNotificationAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    ),
                }))
            },

            markAllNotificationsAsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                }))
            },

            getUnreadCount: () => {
                return get().notifications.filter((n) => !n.isRead).length
            },

            getEquipmentByOwner: (_ownerId) => {
                // في الإنتاج سيتم فلترة حسب المالك
                return get().equipment
            },

            getBookingsByOwner: (_ownerId) => {
                // في الإنتاج سيتم فلترة حسب المالك
                return get().bookings
            },
        }),
        {
            name: 'numu-owner',
        }
    )
)

// طلبات حجز المزارع
export interface FarmerBooking {
    id: string
    equipmentId: string
    equipmentName: string
    equipmentImage: string
    ownerId: string
    ownerName: string
    ownerPhone: string
    farmerId: string
    farmerName: string
    farmerPhone: string
    startDate: string
    endDate: string
    days: number
    totalPrice: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    requestDate: string
    responseDate?: string
    notes?: string
}

interface FarmerState {
    bookings: FarmerBooking[]
    notifications: Notification[]
    createBooking: (booking: Omit<FarmerBooking, 'id' | 'requestDate' | 'status'>) => string
    getBookingsByFarmer: (farmerId: string) => FarmerBooking[]
    updateBookingStatus: (id: string, status: FarmerBooking['status']) => void
    markNotificationAsRead: (id: string) => void
    getUnreadCount: () => number
}

export const useFarmerStore = create<FarmerState>()(
    persist(
        (set, get) => ({
            bookings: [],
            notifications: [],

            createBooking: (bookingData) => {
                const newBookingId = `FB${Date.now()}`
                const newBooking: FarmerBooking = {
                    ...bookingData,
                    id: newBookingId,
                    status: 'pending',
                    requestDate: new Date().toISOString().split('T')[0],
                }
                set((state) => ({
                    bookings: [newBooking, ...state.bookings],
                    notifications: [
                        {
                            id: `NFB${Date.now()}`,
                            type: 'booking',
                            title: 'تم إرسال طلب الحجز',
                            message: `تم إرسال طلب حجز "${bookingData.equipmentName}" بنجاح`,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            link: '/dashboard',
                        },
                        ...state.notifications,
                    ],
                }))
                return newBookingId
            },

            getBookingsByFarmer: (farmerId) => {
                return get().bookings.filter((b) => b.farmerId === farmerId)
            },

            updateBookingStatus: (id, status) => {
                set((state) => {
                    const booking = state.bookings.find((b) => b.id === id)
                    const statusMessages: Record<string, { title: string; message: string }> = {
                        confirmed: {
                            title: '🎉 تم قبول طلبك!',
                            message: booking ? `تم قبول طلب حجز "${booking.equipmentName}". يمكنك الآن التواصل مع المالك.` : '',
                        },
                        cancelled: {
                            title: 'تم رفض الطلب',
                            message: booking ? `للأسف تم رفض طلب حجز "${booking.equipmentName}".` : '',
                        },
                        completed: {
                            title: 'اكتمل الحجز',
                            message: booking ? `تم إكمال حجز "${booking.equipmentName}" بنجاح.` : '',
                        },
                    }

                    const statusInfo = statusMessages[status]

                    return {
                        bookings: state.bookings.map((b) =>
                            b.id === id ? { ...b, status, responseDate: new Date().toISOString().split('T')[0] } : b
                        ),
                        notifications: statusInfo ? [
                            {
                                id: `NFB${Date.now()}`,
                                type: 'booking' as const,
                                title: statusInfo.title,
                                message: statusInfo.message,
                                isRead: false,
                                createdAt: new Date().toISOString(),
                                link: '/dashboard',
                            },
                            ...state.notifications,
                        ] : state.notifications,
                    }
                })
            },

            markNotificationAsRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    ),
                }))
            },

            getUnreadCount: () => {
                return get().notifications.filter((n) => !n.isRead).length
            },
        }),
        {
            name: 'numu-farmer',
        }
    )
)

// ===== نظام التقييمات =====

export interface Review {
    id: string
    bookingId: string
    equipmentId: string
    equipmentName: string

    // من المزارع للمالك/المعدة
    farmerToOwner?: {
        rating: number // 1-5
        comment: string
        equipmentCondition: 'excellent' | 'good' | 'fair' | 'poor'
        wouldRentAgain: boolean
    }

    // من المالك للمزارع
    ownerToFarmer?: {
        rating: number // 1-5
        comment: string
        equipmentReturnCondition: 'excellent' | 'good' | 'fair' | 'poor'
        wouldRentAgain: boolean
    }

    farmerId: string
    farmerName: string
    ownerId: string
    ownerName: string
    createdAt: string
}

export interface UserRating {
    totalRatings: number
    averageRating: number
    positivePercentage: number // نسبة التقييمات الإيجابية
}

interface ReviewState {
    reviews: Review[]

    // إضافة تقييم من المزارع
    addFarmerReview: (data: {
        bookingId: string
        equipmentId: string
        equipmentName: string
        farmerId: string
        farmerName: string
        ownerId: string
        ownerName: string
        rating: number
        comment: string
        equipmentCondition: 'excellent' | 'good' | 'fair' | 'poor'
        wouldRentAgain: boolean
    }) => void

    // إضافة تقييم من المالك
    addOwnerReview: (data: {
        bookingId: string
        equipmentId: string
        equipmentName: string
        farmerId: string
        farmerName: string
        ownerId: string
        ownerName: string
        rating: number
        comment: string
        equipmentReturnCondition: 'excellent' | 'good' | 'fair' | 'poor'
        wouldRentAgain: boolean
    }) => void

    // جلب تقييمات المستخدم
    getUserRating: (userId: string, userType: 'farmer' | 'owner') => UserRating

    // جلب تقييمات المعدة
    getEquipmentReviews: (equipmentId: string) => Review[]

    // التحقق هل الحجز تم تقييمه
    hasReviewed: (bookingId: string, reviewerType: 'farmer' | 'owner') => boolean
}

export const useReviewStore = create<ReviewState>()(
    persist(
        (set, get) => ({
            reviews: [],

            addFarmerReview: (data) => {
                const existingReview = get().reviews.find(r => r.bookingId === data.bookingId)

                if (existingReview) {
                    // تحديث التقييم الموجود
                    set((state) => ({
                        reviews: state.reviews.map((r) =>
                            r.bookingId === data.bookingId
                                ? {
                                    ...r,
                                    farmerToOwner: {
                                        rating: data.rating,
                                        comment: data.comment,
                                        equipmentCondition: data.equipmentCondition,
                                        wouldRentAgain: data.wouldRentAgain,
                                    },
                                }
                                : r
                        ),
                    }))
                } else {
                    // إنشاء تقييم جديد
                    const newReview: Review = {
                        id: `REV${Date.now()}`,
                        bookingId: data.bookingId,
                        equipmentId: data.equipmentId,
                        equipmentName: data.equipmentName,
                        farmerId: data.farmerId,
                        farmerName: data.farmerName,
                        ownerId: data.ownerId,
                        ownerName: data.ownerName,
                        farmerToOwner: {
                            rating: data.rating,
                            comment: data.comment,
                            equipmentCondition: data.equipmentCondition,
                            wouldRentAgain: data.wouldRentAgain,
                        },
                        createdAt: new Date().toISOString(),
                    }
                    set((state) => ({
                        reviews: [newReview, ...state.reviews],
                    }))
                }
            },

            addOwnerReview: (data) => {
                const existingReview = get().reviews.find(r => r.bookingId === data.bookingId)

                if (existingReview) {
                    // تحديث التقييم الموجود
                    set((state) => ({
                        reviews: state.reviews.map((r) =>
                            r.bookingId === data.bookingId
                                ? {
                                    ...r,
                                    ownerToFarmer: {
                                        rating: data.rating,
                                        comment: data.comment,
                                        equipmentReturnCondition: data.equipmentReturnCondition,
                                        wouldRentAgain: data.wouldRentAgain,
                                    },
                                }
                                : r
                        ),
                    }))
                } else {
                    // إنشاء تقييم جديد
                    const newReview: Review = {
                        id: `REV${Date.now()}`,
                        bookingId: data.bookingId,
                        equipmentId: data.equipmentId,
                        equipmentName: data.equipmentName,
                        farmerId: data.farmerId,
                        farmerName: data.farmerName,
                        ownerId: data.ownerId,
                        ownerName: data.ownerName,
                        ownerToFarmer: {
                            rating: data.rating,
                            comment: data.comment,
                            equipmentReturnCondition: data.equipmentReturnCondition,
                            wouldRentAgain: data.wouldRentAgain,
                        },
                        createdAt: new Date().toISOString(),
                    }
                    set((state) => ({
                        reviews: [newReview, ...state.reviews],
                    }))
                }
            },

            getUserRating: (userId, userType) => {
                const reviews = get().reviews
                let ratings: number[] = []
                let wouldRentAgain = 0

                if (userType === 'owner') {
                    // تقييمات المالك (من المزارعين)
                    reviews.forEach(r => {
                        if (r.ownerId === userId && r.farmerToOwner) {
                            ratings.push(r.farmerToOwner.rating)
                            if (r.farmerToOwner.wouldRentAgain) wouldRentAgain++
                        }
                    })
                } else {
                    // تقييمات المزارع (من الملاك)
                    reviews.forEach(r => {
                        if (r.farmerId === userId && r.ownerToFarmer) {
                            ratings.push(r.ownerToFarmer.rating)
                            if (r.ownerToFarmer.wouldRentAgain) wouldRentAgain++
                        }
                    })
                }

                const totalRatings = ratings.length
                const averageRating = totalRatings > 0
                    ? ratings.reduce((a, b) => a + b, 0) / totalRatings
                    : 0
                const positivePercentage = totalRatings > 0
                    ? (wouldRentAgain / totalRatings) * 100
                    : 0

                return { totalRatings, averageRating, positivePercentage }
            },

            getEquipmentReviews: (equipmentId) => {
                return get().reviews.filter(r => r.equipmentId === equipmentId && r.farmerToOwner)
            },

            hasReviewed: (bookingId, reviewerType) => {
                const review = get().reviews.find(r => r.bookingId === bookingId)
                if (!review) return false
                return reviewerType === 'farmer'
                    ? !!review.farmerToOwner
                    : !!review.ownerToFarmer
            },
        }),
        {
            name: 'numu-reviews',
        }
    )
)

