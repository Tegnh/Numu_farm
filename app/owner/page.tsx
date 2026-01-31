'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore, useOwnerStore, useEquipmentStore, useFarmerStore } from '@/lib/store'
import {
    Sprout,
    ChevronLeft,
    LogOut,
    Bell,
    Menu,
    Home,
    Package,
    Plus,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Tractor,
    MapPin,
    Star,
    BarChart3,
    ArrowUp,
    X
} from 'lucide-react'

const categoryLabels: Record<string, string> = {
    tractors: 'جرارات',
    harvesters: 'حصادات',
    irrigation: 'أنظمة ري',
    sprayers: 'رشاشات',
    seeders: 'بذارات',
    plows: 'محاريث',
    trucks: 'شاحنات',
    other: 'أخرى',
}

export default function OwnerDashboardPage() {
    const router = useRouter()
    const { user, isAuthenticated, logout } = useAuthStore()
    const {
        equipment,
        bookings,
        notifications,
        acceptBooking,
        rejectBooking,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadCount,
        updateEquipment
    } = useOwnerStore()
    const { updateEquipmentAvailability } = useEquipmentStore()
    const { updateBookingStatus: updateFarmerBookingStatus } = useFarmerStore()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'equipment' | 'bookings'>('overview')
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!isAuthenticated && mounted) {
            router.push('/login')
        }
    }, [isAuthenticated, router, mounted])

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="spinner"></div>
            </div>
        )
    }

    // إحصائيات
    const totalEarnings = equipment.reduce((sum, eq) => sum + eq.totalEarnings, 0)
    const totalBookings = equipment.reduce((sum, eq) => sum + eq.totalBookings, 0)
    const pendingRequests = bookings.filter(b => b.status === 'pending').length
    const activeEquipment = equipment.filter(eq => eq.status === 'available').length
    const unreadCount = getUnreadCount()

    const stats = [
        {
            label: 'إجمالي الأرباح',
            value: `${(totalEarnings / 1000).toFixed(0)}K ر.س`,
            change: '+15%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-green-600'
        },
        {
            label: 'إجمالي الحجوزات',
            value: totalBookings,
            change: '+8%',
            trend: 'up',
            icon: Package,
            color: 'from-blue-500 to-blue-600'
        },
        {
            label: 'طلبات جديدة',
            value: pendingRequests,
            change: 'جديد',
            trend: 'neutral',
            icon: Bell,
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            label: 'معدات متاحة',
            value: `${activeEquipment}/${equipment.length}`,
            change: '',
            trend: 'neutral',
            icon: Tractor,
            color: 'from-purple-500 to-purple-600'
        },
    ]

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            available: 'متاحة',
            rented: 'مؤجرة',
            maintenance: 'صيانة',
            pending: 'قيد الانتظار',
            confirmed: 'مؤكد',
            completed: 'مكتمل',
            cancelled: 'ملغي'
        }
        return labels[status] || status
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: 'bg-green-100 text-green-700',
            rented: 'bg-blue-100 text-blue-700',
            maintenance: 'bg-yellow-100 text-yellow-700',
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-green-100 text-green-700',
            completed: 'bg-gray-100 text-gray-700',
            cancelled: 'bg-red-100 text-red-700'
        }
        return colors[status] || 'bg-gray-100 text-gray-700'
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount)
    }

    const handleAcceptBooking = (id: string) => {
        // البحث عن الحجز للحصول على معرف المعدة
        const booking = bookings.find(b => b.id === id)
        if (booking) {
            // تحديث حالة الحجز في store المالك
            acceptBooking(id)
            // تحديث حالة الحجز في store المزارع (لإشعاره)
            updateFarmerBookingStatus(id, 'confirmed')
            // تحديث حالة المعدة لدى المالك إلى "مؤجرة"
            updateEquipment(booking.equipmentId, { status: 'rented' })
            // تحديث حالة المعدة في الصفحة الرئيسية (غير متاحة)
            updateEquipmentAvailability(booking.equipmentId, false)
        }
    }

    const handleRejectBooking = (id: string) => {
        // تحديث حالة الحجز في store المالك
        rejectBooking(id)
        // تحديث حالة الحجز في store المزارع (لإشعاره بالرفض)
        updateFarmerBookingStatus(id, 'cancelled')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                }`}>
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-800">نمو</span>
                            <p className="text-xs text-gray-500">لوحة المالك</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span>نظرة عامة</span>
                        {activeTab === 'overview' && <ChevronLeft className="w-4 h-4 mr-auto" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('equipment')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeTab === 'equipment' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Tractor className="w-5 h-5" />
                        <span>معداتي ({equipment.length})</span>
                        {activeTab === 'equipment' && <ChevronLeft className="w-4 h-4 mr-auto" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeTab === 'bookings' ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Calendar className="w-5 h-5" />
                        <span>الحجوزات</span>
                        {pendingRequests > 0 && (
                            <span className="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingRequests}</span>
                        )}
                    </button>
                    <Link
                        href="/owner/add-equipment"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                        <Plus className="w-5 h-5" />
                        <span>إضافة معدة</span>
                    </Link>
                    <Link
                        href="/owner/reports"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                        <TrendingUp className="w-5 h-5" />
                        <span>التقارير والإحصائيات</span>
                    </Link>
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <span className="text-primary-700 font-bold">
                                {user?.name?.charAt(0) || 'م'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{user?.name}</p>
                            <p className="text-sm text-gray-500">مالك معدات</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout()
                            router.push('/')
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:mr-72">
                {/* Top Bar */}
                <header className="bg-white shadow-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 lg:px-8 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">مرحباً، {user?.name} 👋</h1>
                                <p className="text-sm text-gray-500">إدارة معداتك وحجوزاتك</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-gray-100 rounded-xl"
                                >
                                    <Bell className="w-6 h-6 text-gray-600" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-bold text-gray-800">الإشعارات</h3>
                                            <button
                                                onClick={() => {
                                                    markAllNotificationsAsRead()
                                                }}
                                                className="text-primary-600 text-sm"
                                            >
                                                تحديد الكل كمقروء
                                            </button>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500">
                                                    لا توجد إشعارات
                                                </div>
                                            ) : (
                                                notifications.slice(0, 5).map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => {
                                                            markNotificationAsRead(notif.id)
                                                            if (notif.link) {
                                                                setActiveTab('bookings')
                                                            }
                                                            setShowNotifications(false)
                                                        }}
                                                        className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-primary-50' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${!notif.isRead ? 'bg-primary-500' : 'bg-gray-300'}`} />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                                                                <p className="text-gray-500 text-xs mt-1">{notif.message}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                <Home className="w-5 h-5" />
                                <span>الرئيسية</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-4 lg:p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {stat.change && (
                                        <span className={`text-sm font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                                            {stat.trend === 'up' && <ArrowUp className="w-4 h-4" />}
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Recent Bookings */}
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800">آخر طلبات الحجز</h3>
                                    <button
                                        onClick={() => setActiveTab('bookings')}
                                        className="text-primary-600 text-sm font-medium"
                                    >
                                        عرض الكل
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {bookings.slice(0, 3).map((booking) => (
                                        <div key={booking.id} className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{booking.equipmentImage}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{booking.renterName}</p>
                                                        <p className="text-sm text-gray-500">{booking.equipmentName}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span>{booking.startDate} - {booking.endDate}</span>
                                                <span className="font-bold text-primary-600">{formatCurrency(booking.totalPrice)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* My Equipment Summary */}
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800">معداتي</h3>
                                    <button
                                        onClick={() => setActiveTab('equipment')}
                                        className="text-primary-600 text-sm font-medium"
                                    >
                                        إدارة المعدات
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {equipment.map((eq) => (
                                        <div key={eq.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{eq.image}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{eq.name}</p>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Star className="w-4 h-4 text-yellow-500" />
                                                            <span>{eq.rating}</span>
                                                            <span>•</span>
                                                            <span>{eq.totalBookings} حجز</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                                                    {getStatusLabel(eq.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-100">
                                    <Link
                                        href="/owner/add-equipment"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-primary-50 text-primary-600 font-medium rounded-xl hover:bg-primary-100"
                                    >
                                        <Plus className="w-5 h-5" />
                                        إضافة معدة جديدة
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Equipment Tab */}
                    {activeTab === 'equipment' && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">معداتي ({equipment.length})</h3>
                                <Link
                                    href="/owner/add-equipment"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
                                >
                                    <Plus className="w-5 h-5" />
                                    إضافة معدة
                                </Link>
                            </div>
                            {equipment.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-6xl mb-4">🚜</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">لم تضف أي معدات بعد</h3>
                                    <p className="text-gray-500 mb-6">أضف معداتك وابدأ في كسب المال من تأجيرها</p>
                                    <Link
                                        href="/owner/add-equipment"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
                                    >
                                        <Plus className="w-5 h-5" />
                                        إضافة أول معدة
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {equipment.map((eq) => (
                                        <div key={eq.id} className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-4xl">
                                                    {eq.image}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{eq.name}</h4>
                                                            <p className="text-sm text-gray-500">{categoryLabels[eq.category] || eq.category}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                                                            {getStatusLabel(eq.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {eq.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-500" />
                                                            {eq.rating} ({eq.reviewsCount})
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Package className="w-4 h-4" />
                                                            {eq.totalBookings} حجز
                                                        </span>
                                                        <span className="font-bold text-primary-600">
                                                            {formatCurrency(eq.pricePerDay)}/يوم
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                                                            <Eye className="w-4 h-4" />
                                                            عرض
                                                        </button>
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                                                            <Edit className="w-4 h-4" />
                                                            تعديل
                                                        </button>
                                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            التوفر
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm text-gray-500">الأرباح</p>
                                                    <p className="text-lg font-bold text-green-600">{formatCurrency(eq.totalEarnings)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800">طلبات الحجز ({bookings.length})</h3>
                            </div>
                            {bookings.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد حجوزات</h3>
                                    <p className="text-gray-500">ستظهر طلبات الحجز هنا عندما يحجز أحد معداتك</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-3xl">
                                                    {booking.equipmentImage}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-800">{booking.equipmentName}</h4>
                                                            <p className="text-gray-600">{booking.renterName}</p>
                                                            <p className="text-sm text-gray-500">{booking.renterPhone}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                            {getStatusLabel(booking.status)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {booking.startDate} - {booking.endDate} ({booking.days} أيام)
                                                        </span>
                                                        <span className="font-bold text-primary-600">
                                                            {formatCurrency(booking.totalPrice)}
                                                        </span>
                                                    </div>
                                                    {booking.status === 'pending' && (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleAcceptBooking(booking.id)}
                                                                className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                قبول
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectBooking(booking.id)}
                                                                className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                رفض
                                                            </button>
                                                            <a
                                                                href={`tel:${booking.renterPhone}`}
                                                                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                                                            >
                                                                اتصال
                                                            </a>
                                                            <a
                                                                href={`https://wa.me/966${booking.renterPhone.slice(1)}`}
                                                                target="_blank"
                                                                className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                                                            >
                                                                واتساب
                                                            </a>
                                                        </div>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-green-800 text-sm flex items-center gap-2">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    تم قبول الحجز - يمكنك تقييم المزارع بعد انتهاء فترة الإيجار
                                                                </p>
                                                                <button
                                                                    onClick={() => {
                                                                        // هنا سيتم فتح نافذة التقييم
                                                                        alert('سيتم فتح نافذة تقييم المزارع')
                                                                    }}
                                                                    className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                                                                >
                                                                    <Star className="w-4 h-4" />
                                                                    تقييم المزارع
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Click outside to close notifications */}
            {showNotifications && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                />
            )}
        </div>
    )
}
