'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore, useFarmerStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { formatPrice } from '@/lib/utils'
import {
    Bell,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    Phone,
    MessageCircle,
    MapPin,
    Star,
    Package,
    ArrowLeft,
    RefreshCw,
    User,
    AlertTriangle
} from 'lucide-react'

export default function FarmerDashboardPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { bookings, notifications, markNotificationAsRead, getUnreadCount } = useFarmerStore()

    const [mounted, setMounted] = useState(false)
    const [activeTab, setActiveTab] = useState<'bookings' | 'notifications'>('bookings')
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')

    useEffect(() => {
        setMounted(true)
        if (!isAuthenticated && mounted) {
            router.push('/login?redirect=/dashboard')
        }
    }, [isAuthenticated, router, mounted])

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    const unreadCount = getUnreadCount()

    // فلترة الحجوزات
    const filteredBookings = bookings.filter(b => {
        if (filterStatus === 'all') return true
        return b.status === filterStatus
    })

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { label: string; color: string; icon: typeof Clock; bgColor: string }> = {
            pending: {
                label: 'قيد الانتظار',
                color: 'text-yellow-700',
                bgColor: 'bg-yellow-100',
                icon: Clock,
            },
            confirmed: {
                label: 'مقبول ✓',
                color: 'text-green-700',
                bgColor: 'bg-green-100',
                icon: CheckCircle,
            },
            cancelled: {
                label: 'مرفوض',
                color: 'text-red-700',
                bgColor: 'bg-red-100',
                icon: XCircle,
            },
            completed: {
                label: 'مكتمل',
                color: 'text-gray-700',
                bgColor: 'bg-gray-100',
                icon: CheckCircle,
            },
        }
        return statusMap[status] || statusMap.pending
    }

    const stats = [
        {
            label: 'إجمالي الطلبات',
            value: bookings.length,
            icon: Package,
            color: 'from-blue-500 to-blue-600',
        },
        {
            label: 'قيد الانتظار',
            value: bookings.filter(b => b.status === 'pending').length,
            icon: Clock,
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            label: 'مقبولة',
            value: bookings.filter(b => b.status === 'confirmed').length,
            icon: CheckCircle,
            color: 'from-green-500 to-green-600',
        },
        {
            label: 'مرفوضة',
            value: bookings.filter(b => b.status === 'cancelled').length,
            icon: XCircle,
            color: 'from-red-500 to-red-600',
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-20">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    مرحباً، {user?.name} 👋
                                </h1>
                                <p className="text-primary-100">
                                    متابعة طلبات الحجز الخاصة بك
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className="relative p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                                >
                                    <Bell className="w-6 h-6 text-white" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                <Link
                                    href="/equipment"
                                    className="flex items-center gap-2 px-4 py-3 bg-white text-primary-600 font-medium rounded-xl hover:bg-primary-50 transition-colors"
                                >
                                    <Package className="w-5 h-5" />
                                    تصفح المعدات
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'bookings'
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            طلباتي ({bookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${activeTab === 'notifications'
                                ? 'bg-primary-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            الإشعارات
                            {unreadCount > 0 && (
                                <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Bookings Tab */}
                    {activeTab === 'bookings' && (
                        <>
                            {/* Filter */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => {
                                    const labels = {
                                        all: 'الكل',
                                        pending: 'قيد الانتظار',
                                        confirmed: 'مقبولة',
                                        cancelled: 'مرفوضة',
                                    }
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {labels[status]}
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Bookings List */}
                            {filteredBookings.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                    <div className="text-6xl mb-4">📋</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات</h3>
                                    <p className="text-gray-500 mb-6">
                                        {filterStatus === 'all'
                                            ? 'لم تقم بأي حجوزات بعد. تصفح المعدات وابدأ بالحجز!'
                                            : 'لا توجد طلبات بهذه الحالة'
                                        }
                                    </p>
                                    <Link
                                        href="/equipment"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
                                    >
                                        <Package className="w-5 h-5" />
                                        تصفح المعدات
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredBookings.map((booking) => {
                                        const statusInfo = getStatusInfo(booking.status)
                                        return (
                                            <div key={booking.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                                    {/* Equipment Image */}
                                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-4xl shrink-0">
                                                        {booking.equipmentImage}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-800">
                                                                    {booking.equipmentName}
                                                                </h3>
                                                                <p className="text-gray-500 text-sm">
                                                                    طلب بتاريخ {booking.requestDate}
                                                                </p>
                                                            </div>
                                                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.bgColor} ${statusInfo.color}`}>
                                                                <statusInfo.icon className="w-4 h-4" />
                                                                {statusInfo.label}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                                <span>{booking.startDate} - {booking.endDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Clock className="w-4 h-4 text-gray-400" />
                                                                <span>{booking.days} يوم</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm font-bold text-primary-600">
                                                                <span>{formatPrice(booking.totalPrice)}</span>
                                                            </div>
                                                        </div>

                                                        {/* Owner Info - Show only if confirmed */}
                                                        {booking.status === 'confirmed' && (
                                                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                                                <p className="text-green-800 font-medium mb-3 flex items-center gap-2">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                    تم قبول طلبك! يمكنك التواصل مع المالك:
                                                                </p>
                                                                <div className="flex items-center gap-4 flex-wrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                                                            <User className="w-5 h-5 text-gray-600" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-800">{booking.ownerName}</p>
                                                                            <p className="text-sm text-gray-500">{booking.ownerPhone}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2 mr-auto">
                                                                        <a
                                                                            href={`tel:${booking.ownerPhone}`}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            <Phone className="w-4 h-4" />
                                                                            اتصال
                                                                        </a>
                                                                        <a
                                                                            href={`https://wa.me/966${booking.ownerPhone?.slice(1)}`}
                                                                            target="_blank"
                                                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                                        >
                                                                            <MessageCircle className="w-4 h-4" />
                                                                            واتساب
                                                                        </a>
                                                                        <button
                                                                            onClick={() => {
                                                                                alert('سيتم فتح نافذة تقييم المالك والمعدة')
                                                                            }}
                                                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                                                        >
                                                                            <Star className="w-4 h-4" />
                                                                            تقييم
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Rejected Message */}
                                                        {booking.status === 'cancelled' && (
                                                            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                                                                <p className="text-red-800 flex items-center gap-2">
                                                                    <AlertTriangle className="w-5 h-5" />
                                                                    للأسف تم رفض طلبك. يمكنك البحث عن معدات أخرى.
                                                                </p>
                                                                <Link
                                                                    href="/equipment"
                                                                    className="inline-flex items-center gap-2 mt-3 text-sm text-red-700 font-medium hover:underline"
                                                                >
                                                                    <RefreshCw className="w-4 h-4" />
                                                                    البحث عن معدات أخرى
                                                                </Link>
                                                            </div>
                                                        )}

                                                        {/* Pending Message */}
                                                        {booking.status === 'pending' && (
                                                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                                                <p className="text-yellow-800 flex items-center gap-2">
                                                                    <Clock className="w-5 h-5" />
                                                                    طلبك قيد المراجعة من قبل المالك. ستتلقى إشعاراً عند الرد.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="text-6xl mb-4">🔔</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد إشعارات</h3>
                                    <p className="text-gray-500">ستظهر الإشعارات هنا عند وجود تحديثات</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markNotificationAsRead(notif.id)}
                                            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-3 h-3 rounded-full mt-1.5 ${!notif.isRead ? 'bg-primary-500' : 'bg-gray-300'
                                                    }`} />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800">{notif.title}</p>
                                                    <p className="text-gray-500 text-sm mt-1">{notif.message}</p>
                                                    <p className="text-gray-400 text-xs mt-2">
                                                        {new Date(notif.createdAt).toLocaleDateString('ar-SA')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
