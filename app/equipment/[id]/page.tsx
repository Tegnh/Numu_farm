'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useEquipmentStore, useAuthStore, useFarmerStore, useOwnerStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import {
    ArrowRight,
    Star,
    MapPin,
    Calendar,
    Phone,
    MessageCircle,
    Shield,
    CheckCircle,
    User,
    Clock,
    Truck,
    CalendarDays,
    Send,
    Loader2
} from 'lucide-react'

export default function EquipmentDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getEquipmentById } = useEquipmentStore()
    const { isAuthenticated, user } = useAuthStore()
    const { createBooking } = useFarmerStore()
    const { addBooking } = useOwnerStore()

    const [selectedDays, setSelectedDays] = useState(1)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [bookingStep, setBookingStep] = useState<'form' | 'loading' | 'success'>('form')
    const [startDate, setStartDate] = useState('')
    const [notes, setNotes] = useState('')

    const equipment = getEquipmentById(params.id as string)

    if (!equipment) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="pt-24 text-center py-32">
                    <div className="text-6xl mb-4">🚜</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">المعدة غير موجودة</h1>
                    <Link
                        href="/equipment"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
                    >
                        <ArrowRight className="w-5 h-5" />
                        العودة للمعدات
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const totalPrice = selectedDays >= 7
        ? Math.floor(selectedDays / 7) * equipment.pricePerWeek + (selectedDays % 7) * equipment.pricePerDay
        : selectedDays * equipment.pricePerDay

    // حساب تاريخ الانتهاء
    const calculateEndDate = (start: string, days: number) => {
        if (!start) return ''
        const date = new Date(start)
        date.setDate(date.getDate() + days - 1)
        return date.toISOString().split('T')[0]
    }

    const handleBooking = () => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/equipment/' + equipment.id)
            return
        }
        // تعيين تاريخ افتراضي (غداً)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        setStartDate(tomorrow.toISOString().split('T')[0])
        setShowBookingModal(true)
        setBookingStep('form')
    }

    const handleSubmitBooking = async () => {
        if (!user || !startDate) return

        setBookingStep('loading')

        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1500))

        const endDate = calculateEndDate(startDate, selectedDays)

        // إنشاء الحجز في store المزارع
        const bookingId = createBooking({
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            equipmentImage: '🚜',
            ownerId: equipment.ownerId,
            ownerName: equipment.ownerName,
            ownerPhone: '0501234567', // في الإنتاج سيكون من بيانات المالك
            farmerId: user.id,
            farmerName: user.name,
            farmerPhone: user.phone || '0500000000',
            startDate,
            endDate,
            days: selectedDays,
            totalPrice,
            notes,
        })

        // إضافة الحجز في store المالك أيضاً
        addBooking({
            id: bookingId,
            farmerId: user.id,
            equipmentId: equipment.id,
            equipmentName: equipment.name,
            equipmentImage: '🚜',
            renterName: user.name,
            renterPhone: user.phone || '0500000000',
            startDate,
            endDate,
            days: selectedDays,
            totalPrice,
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
            ownerId: equipment.ownerId,
        })

        setBookingStep('success')
    }

    const closeModal = () => {
        setShowBookingModal(false)
        setBookingStep('form')
        setNotes('')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-20">
                {/* Breadcrumb */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-gray-500 hover:text-primary-600">الرئيسية</Link>
                            <span className="text-gray-300">/</span>
                            <Link href="/equipment" className="text-gray-500 hover:text-primary-600">المعدات</Link>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-800 font-medium">{equipment.name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Image Gallery */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                    <span className="text-9xl">🚜</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-2">
                                            {equipment.category}
                                        </span>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                            {equipment.name}
                                        </h1>
                                    </div>
                                    {equipment.isAvailable ? (
                                        <span className="badge-available">متاح للتأجير</span>
                                    ) : (
                                        <span className="badge-rented">غير متاح حالياً</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 text-gray-500 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        <span className="font-medium text-gray-700">{equipment.rating}</span>
                                        <span>({equipment.reviewsCount} تقييم)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>{equipment.city}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {equipment.description}
                                </p>

                                {/* Specifications */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">المواصفات</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(equipment.specifications).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <CheckCircle className="w-5 h-5 text-primary-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">{key}</p>
                                                    <p className="font-medium text-gray-800">{value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Owner Info */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">المؤجر</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                                        <User className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{equipment.ownerName}</h4>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>4.9 (156 تقييم)</span>
                                        </div>
                                    </div>
                                    <div className="mr-auto flex gap-2">
                                        <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button className="p-3 bg-primary-100 rounded-xl hover:bg-primary-200 transition-colors">
                                            <MessageCircle className="w-5 h-5 text-primary-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-baseline gap-2 mb-6">
                                        <span className="text-3xl font-bold text-primary-600">
                                            {formatPrice(equipment.pricePerDay)}
                                        </span>
                                        <span className="text-gray-500">/ يوم</span>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                مدة التأجير
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                                                    className="w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-xl font-bold"
                                                >
                                                    -
                                                </button>
                                                <div className="flex-1 text-center">
                                                    <span className="text-2xl font-bold text-gray-800">{selectedDays}</span>
                                                    <span className="text-gray-500 mr-2">يوم</span>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedDays(selectedDays + 1)}
                                                    className="w-12 h-12 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors text-xl font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {selectedDays >= 7 && (
                                            <div className="p-3 bg-green-50 rounded-xl text-green-700 text-sm">
                                                🎉 وفرت {formatPrice(selectedDays * equipment.pricePerDay - totalPrice)} بتأجير أسبوعي!
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-500">{formatPrice(equipment.pricePerDay)} × {selectedDays} يوم</span>
                                            <span className="text-gray-800">{formatPrice(selectedDays * equipment.pricePerDay)}</span>
                                        </div>
                                        {selectedDays >= 7 && (
                                            <div className="flex justify-between mb-2 text-green-600">
                                                <span>خصم الأسبوع</span>
                                                <span>-{formatPrice(selectedDays * equipment.pricePerDay - totalPrice)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-gray-100">
                                            <span className="font-bold text-gray-800">الإجمالي</span>
                                            <span className="font-bold text-primary-600 text-xl">{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        disabled={!equipment.isAvailable}
                                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${equipment.isAvailable
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:-translate-y-0.5'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {equipment.isAvailable ? 'احجز الآن' : 'غير متاح'}
                                    </button>

                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        لن يتم خصم أي مبلغ حتى تأكيد الحجز من المالك
                                    </p>
                                </div>

                                {/* Trust Badges */}
                                <div className="bg-white rounded-2xl p-4 shadow-lg">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Shield className="w-5 h-5 text-primary-500" />
                                            <span className="text-gray-600">ضمان جودة المعدة</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Clock className="w-5 h-5 text-primary-500" />
                                            <span className="text-gray-600">إلغاء مجاني قبل 24 ساعة</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Truck className="w-5 h-5 text-primary-500" />
                                            <span className="text-gray-600">توصيل متاح (رسوم إضافية)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up max-h-[90vh] overflow-y-auto">
                        {/* Form Step */}
                        {bookingStep === 'form' && (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <CalendarDays className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">تأكيد الحجز</h3>
                                        <p className="text-gray-500 text-sm">أكمل بيانات الحجز</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🚜</span>
                                        <div>
                                            <p className="font-bold text-gray-800">{equipment.name}</p>
                                            <p className="text-sm text-gray-500">{equipment.city}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تاريخ البداية
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                المدة
                                            </label>
                                            <div className="p-3 bg-gray-100 rounded-xl text-center font-bold text-gray-800">
                                                {selectedDays} يوم
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                تاريخ الانتهاء
                                            </label>
                                            <div className="p-3 bg-gray-100 rounded-xl text-center font-medium text-gray-600">
                                                {startDate ? calculateEndDate(startDate, selectedDays) : '-'}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ملاحظات (اختياري)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="أي ملاحظات أو طلبات خاصة..."
                                            rows={3}
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-primary-50 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">الإجمالي</span>
                                        <span className="font-bold text-primary-600 text-xl">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        * سيتم التواصل معك بعد موافقة المالك على الحجز
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={handleSubmitBooking}
                                        disabled={!startDate}
                                        className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Send className="w-5 h-5" />
                                        إرسال الطلب
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Loading Step */}
                        {bookingStep === 'loading' && (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">جاري إرسال الطلب...</h3>
                                <p className="text-gray-500">يرجى الانتظار</p>
                            </div>
                        )}

                        {/* Success Step */}
                        {bookingStep === 'success' && (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">تم إرسال طلب الحجز! 🎉</h3>
                                    <p className="text-gray-500">
                                        سيتم إشعارك عندما يقبل المالك طلبك
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500">المعدة:</span>
                                        <span className="font-medium text-gray-800">{equipment.name}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500">المدة:</span>
                                        <span className="font-medium text-gray-800">{selectedDays} يوم</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500">من:</span>
                                        <span className="font-medium text-gray-800">{startDate}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-500">إلى:</span>
                                        <span className="font-medium text-gray-800">{calculateEndDate(startDate, selectedDays)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                        <span className="text-gray-500">الإجمالي:</span>
                                        <span className="font-bold text-primary-600">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 rounded-xl p-4 mb-6 text-sm">
                                    <p className="text-yellow-800">
                                        <strong>ماذا بعد؟</strong><br />
                                        سيقوم المالك بمراجعة طلبك. عند القبول، ستتلقى إشعاراً مع معلومات التواصل.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        حسناً
                                    </button>
                                    <Link
                                        href="/dashboard"
                                        className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors text-center"
                                    >
                                        متابعة طلباتي
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
