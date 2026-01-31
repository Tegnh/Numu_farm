'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore, useOwnerStore, useReviewStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import {
    ArrowRight,
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Package,
    Users,
    Star,
    CheckCircle,
    XCircle,
    Clock,
    PieChart,
    Activity
} from 'lucide-react'

export default function OwnerReportsPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const { equipment, bookings } = useOwnerStore()
    const { getUserRating } = useReviewStore()

    const [mounted, setMounted] = useState(false)
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')

    useEffect(() => {
        setMounted(true)
        if (!isAuthenticated && mounted) {
            router.push('/login')
        }
    }, [isAuthenticated, router, mounted])

    // بيانات الرسم البياني حسب الفترة
    const chartData = useMemo(() => {
        if (selectedPeriod === 'week') {
            return [
                { label: 'السبت', revenue: 1800, bookings: 2 },
                { label: 'الأحد', revenue: 2200, bookings: 3 },
                { label: 'الإثنين', revenue: 1500, bookings: 1 },
                { label: 'الثلاثاء', revenue: 2800, bookings: 4 },
                { label: 'الأربعاء', revenue: 3200, bookings: 3 },
                { label: 'الخميس', revenue: 2100, bookings: 2 },
                { label: 'الجمعة', revenue: 900, bookings: 1 },
            ]
        } else if (selectedPeriod === 'month') {
            return [
                { label: 'الأسبوع 1', revenue: 8500, bookings: 5 },
                { label: 'الأسبوع 2', revenue: 12000, bookings: 7 },
                { label: 'الأسبوع 3', revenue: 9500, bookings: 6 },
                { label: 'الأسبوع 4', revenue: 15000, bookings: 9 },
            ]
        } else {
            return [
                { label: 'يناير', revenue: 12000, bookings: 5 },
                { label: 'فبراير', revenue: 15000, bookings: 7 },
                { label: 'مارس', revenue: 18000, bookings: 8 },
                { label: 'أبريل', revenue: 22000, bookings: 10 },
                { label: 'مايو', revenue: 19000, bookings: 9 },
                { label: 'يونيو', revenue: 25000, bookings: 12 },
                { label: 'يوليو', revenue: 28000, bookings: 14 },
                { label: 'أغسطس', revenue: 24000, bookings: 11 },
                { label: 'سبتمبر', revenue: 20000, bookings: 8 },
                { label: 'أكتوبر', revenue: 23000, bookings: 10 },
                { label: 'نوفمبر', revenue: 27000, bookings: 13 },
                { label: 'ديسمبر', revenue: 30000, bookings: 15 },
            ]
        }
    }, [selectedPeriod])

    // إحصائيات حسب الفترة
    const periodStats = useMemo(() => {
        const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
        const totalBookings = chartData.reduce((sum, d) => sum + d.bookings, 0)

        // نسب التغيير (وهمية للعرض)
        const changes = {
            week: { revenue: '+8%', bookings: '+2', trend: 'up' },
            month: { revenue: '+15%', bookings: '+5', trend: 'up' },
            year: { revenue: '+45%', bookings: '+25', trend: 'up' },
        }

        return {
            totalRevenue,
            totalBookings,
            ...changes[selectedPeriod]
        }
    }, [chartData, selectedPeriod])

    const maxRevenue = Math.max(...chartData.map(d => d.revenue))

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    // حساب الإحصائيات من البيانات الفعلية
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
    const pendingBookings = bookings.filter(b => b.status === 'pending')
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled')

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const averageBookingValue = confirmedBookings.length > 0
        ? totalRevenue / confirmedBookings.length
        : 0

    // تقييم المالك
    const ownerRating = getUserRating(user?.id || '', 'owner')

    // إحصائيات المعدات
    const availableEquipment = equipment.filter(e => e.status === 'available').length

    // نسبة القبول
    const acceptanceRate = bookings.length > 0
        ? ((confirmedBookings.length / bookings.length) * 100).toFixed(1)
        : 0

    // أفضل المعدات أداءً
    const topEquipment = equipment
        .slice(0, 4)
        .map(eq => ({
            ...eq,
            bookingsCount: bookings.filter(b => b.equipmentId === eq.id).length,
            revenue: bookings
                .filter(b => b.equipmentId === eq.id && (b.status === 'confirmed' || b.status === 'completed'))
                .reduce((sum, b) => sum + b.totalPrice, 0)
        }))
        .sort((a, b) => b.revenue - a.revenue)

    // عنوان الرسم البياني حسب الفترة
    const chartTitle = {
        week: 'أرباح الأسبوع الحالي',
        month: 'أرباح الشهر الحالي',
        year: 'أرباح السنة الحالية',
    }[selectedPeriod]

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/owner"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
                    >
                        <ArrowRight className="w-5 h-5" />
                        العودة للوحة التحكم
                    </Link>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                التقارير والإحصائيات 📊
                            </h1>
                            <p className="text-primary-100">
                                تحليل أداء معداتك والأرباح
                            </p>
                        </div>
                        <div className="flex gap-2 bg-white/10 p-1 rounded-xl">
                            {(['week', 'month', 'year'] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period
                                        ? 'bg-white text-primary-600 shadow-lg'
                                        : 'text-white hover:bg-white/10'
                                        }`}
                                >
                                    {{ week: 'أسبوع', month: 'شهر', year: 'سنة' }[period]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Period Summary Banner */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 rounded-2xl p-4 mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">الفترة المحددة</p>
                                <p className="font-bold text-gray-800">
                                    {{ week: 'آخر 7 أيام', month: 'آخر 30 يوم', year: 'آخر 12 شهر' }[selectedPeriod]}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600">{formatPrice(periodStats.totalRevenue)}</p>
                                <p className="text-gray-500 text-sm">إجمالي الأرباح</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-secondary-600">{periodStats.totalBookings}</p>
                                <p className="text-gray-500 text-sm">عدد الحجوزات</p>
                            </div>
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                <TrendingUp className="w-4 h-4" />
                                {periodStats.revenue}
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <TrendingUp className="w-4 h-4" />
                                {periodStats.revenue}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{formatPrice(periodStats.totalRevenue)}</h3>
                        <p className="text-gray-500 text-sm">أرباح الفترة</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                                <TrendingUp className="w-4 h-4" />
                                {periodStats.bookings}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{periodStats.totalBookings}</h3>
                        <p className="text-gray-500 text-sm">حجوزات الفترة</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {ownerRating.averageRating.toFixed(1)} ⭐
                        </h3>
                        <p className="text-gray-500 text-sm">{ownerRating.totalRatings} تقييم</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{acceptanceRate}%</h3>
                        <p className="text-gray-500 text-sm">نسبة القبول</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-primary-600" />
                                {chartTitle}
                            </h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {chartData.length} فترة
                            </span>
                        </div>

                        {/* Bar Chart */}
                        <div className="space-y-3">
                            {chartData.map((data, index) => (
                                <div key={data.label} className="flex items-center gap-4 group">
                                    <span className="w-20 text-sm text-gray-500 truncate">{data.label}</span>
                                    <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-3 group-hover:from-primary-600 group-hover:to-primary-700"
                                            style={{
                                                width: `${(data.revenue / maxRevenue) * 100}%`,
                                                animationDelay: `${index * 100}ms`
                                            }}
                                        >
                                            {(data.revenue / maxRevenue) > 0.3 && (
                                                <span className="text-xs text-white font-medium">
                                                    {formatPrice(data.revenue)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-16 text-left">
                                        <span className="text-sm font-medium text-gray-700">
                                            {data.bookings} حجز
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">متوسط الأرباح</p>
                                <p className="font-bold text-gray-800">
                                    {formatPrice(periodStats.totalRevenue / chartData.length)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">أعلى أرباح</p>
                                <p className="font-bold text-green-600">{formatPrice(maxRevenue)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">متوسط الحجوزات</p>
                                <p className="font-bold text-gray-800">
                                    {(periodStats.totalBookings / chartData.length).toFixed(1)} / فترة
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                            <PieChart className="w-5 h-5 text-primary-600" />
                            حالة الحجوزات
                        </h3>

                        {/* Donut Chart */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    {/* Background Circle */}
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f3f4f6" strokeWidth="3" />

                                    {/* Confirmed */}
                                    <circle
                                        cx="18" cy="18" r="15.5" fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="3"
                                        strokeDasharray={`${(confirmedBookings.length / Math.max(bookings.length, 1)) * 100} 100`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />

                                    {/* Pending */}
                                    <circle
                                        cx="18" cy="18" r="15.5" fill="none"
                                        stroke="#eab308"
                                        strokeWidth="3"
                                        strokeDasharray={`${(pendingBookings.length / Math.max(bookings.length, 1)) * 100} 100`}
                                        strokeDashoffset={`-${(confirmedBookings.length / Math.max(bookings.length, 1)) * 100}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-800">{bookings.length}</span>
                                    <span className="text-sm text-gray-500">إجمالي</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">مكتملة</span>
                                </div>
                                <span className="font-bold text-green-600">{confirmedBookings.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <span className="text-gray-700">قيد الانتظار</span>
                                </div>
                                <span className="font-bold text-yellow-600">{pendingBookings.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-gray-700">مرفوضة</span>
                                </div>
                                <span className="font-bold text-red-600">{cancelledBookings.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Equipment */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        أفضل المعدات أداءً
                    </h3>

                    {topEquipment.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-4xl mb-3">🚜</div>
                            <p className="text-gray-500">لا توجد معدات بعد</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {topEquipment.map((eq, index) => (
                                <div key={eq.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                                            🚜
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                                    index === 2 ? 'bg-orange-100 text-orange-600' :
                                                        'bg-gray-50 text-gray-500'
                                                }`}>
                                                #{index + 1}
                                            </span>
                                            <h4 className="font-bold text-gray-800 truncate mt-1">{eq.name}</h4>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                                            <p className="text-gray-500">الحجوزات</p>
                                            <p className="font-bold text-gray-800">{eq.bookingsCount}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-2 text-center">
                                            <p className="text-gray-500">الأرباح</p>
                                            <p className="font-bold text-green-600">{formatPrice(eq.revenue)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                        <h4 className="text-primary-100 mb-2">متوسط قيمة الحجز</h4>
                        <p className="text-3xl font-bold">{formatPrice(averageBookingValue)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-2xl p-6 text-white">
                        <h4 className="text-secondary-100 mb-2">المعدات المتاحة</h4>
                        <p className="text-3xl font-bold">{availableEquipment} / {equipment.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <h4 className="text-purple-100 mb-2">نسبة رضا العملاء</h4>
                        <p className="text-3xl font-bold">{ownerRating.positivePercentage.toFixed(0)}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
