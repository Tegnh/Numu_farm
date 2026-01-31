'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOwnerStore, useEquipmentStore, useAuthStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
    Sprout,
    ArrowRight,
    Camera,
    Plus,
    X,
    Calendar,
    DollarSign,
    MapPin,
    FileText,
    Tractor,
    Check,
    AlertCircle,
    CheckCircle
} from 'lucide-react'

const categories = [
    { value: 'tractors', label: 'جرارات', icon: '🚜' },
    { value: 'harvesters', label: 'حصادات', icon: '🌾' },
    { value: 'irrigation', label: 'أنظمة ري', icon: '💧' },
    { value: 'sprayers', label: 'رشاشات', icon: '🧴' },
    { value: 'seeders', label: 'بذارات', icon: '🌱' },
    { value: 'plows', label: 'محاريث', icon: '⚙️' },
    { value: 'trucks', label: 'شاحنات', icon: '🚛' },
    { value: 'other', label: 'أخرى', icon: '📦' },
]

const locations = [
    'بريدة',
    'عنيزة',
    'الرس',
    'البكيرية',
    'البدائع',
    'المذنب',
    'الخبراء',
    'رياض الخبراء',
    'الأسياح',
    'الشماسية',
    'الرياض',
    'جدة',
    'الدمام',
]

const equipmentImages: Record<string, string> = {
    tractors: '🚜',
    harvesters: '🌾',
    irrigation: '💧',
    sprayers: '🧴',
    seeders: '🌱',
    plows: '⚙️',
    trucks: '🚛',
    other: '📦',
}

export default function AddEquipmentPage() {
    const router = useRouter()
    const { addEquipment } = useOwnerStore()
    const { addEquipmentToMain } = useEquipmentStore()
    const { user } = useAuthStore()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        pricePerDay: '',
        location: '',
        images: [] as string[],
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
        },
        minRentalDays: '1',
        maxRentalDays: '30',
        deliveryAvailable: false,
        deliveryRadius: '',
        deliveryPrice: '',
        condition: 'excellent',
        yearOfManufacture: '',
        specifications: '',
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleAvailabilityChange = (day: string) => {
        setFormData({
            ...formData,
            availability: {
                ...formData.availability,
                [day]: !formData.availability[day as keyof typeof formData.availability],
            },
        })
    }

    const handleImageUpload = () => {
        // في الإنتاج سيتم رفع الصور فعلياً
        const mockImages = ['📸', '🖼️', '📷']
        if (formData.images.length < 5) {
            setFormData({
                ...formData,
                images: [...formData.images, mockImages[formData.images.length % 3]],
            })
        }
    }

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)

        const equipmentId = `EQ${Date.now()}`

        // إنشاء المعدة الجديدة للمالك
        const newOwnerEquipment = {
            name: formData.name,
            image: equipmentImages[formData.category] || '📦',
            category: formData.category,
            pricePerDay: parseInt(formData.pricePerDay) || 0,
            status: 'available' as const,
            location: formData.location,
            description: formData.description,
            condition: formData.condition,
            yearOfManufacture: formData.yearOfManufacture,
            minRentalDays: parseInt(formData.minRentalDays) || 1,
            maxRentalDays: parseInt(formData.maxRentalDays) || 30,
            deliveryAvailable: formData.deliveryAvailable,
            deliveryRadius: formData.deliveryRadius,
            deliveryPrice: formData.deliveryPrice,
            availability: formData.availability,
        }

        // إنشاء المعدة للصفحة الرئيسية
        const newMainEquipment = {
            id: equipmentId,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            pricePerDay: parseInt(formData.pricePerDay) || 0,
            pricePerWeek: (parseInt(formData.pricePerDay) || 0) * 6, // خصم يوم للأسبوع
            location: formData.location,
            city: formData.location,
            images: [`/equipment/${formData.category}.jpg`],
            ownerId: user?.id || 'owner-new',
            ownerName: user?.name || 'مالك المعدة',
            rating: 0,
            reviewsCount: 0,
            isAvailable: true,
            specifications: {
                brand: formData.name.split(' ')[0] || 'غير محدد',
                model: formData.name,
                year: formData.yearOfManufacture || new Date().getFullYear().toString(),
                condition: formData.condition === 'excellent' ? 'ممتازة' : formData.condition === 'good' ? 'جيدة' : 'مقبولة',
            },
            createdAt: new Date().toISOString(),
        }

        // إضافة المعدة إلى Supabase
        try {
            const { data: supabaseData, error: supabaseError } = await supabase
                .from('equipment')
                .insert({
                    owner_id: user?.id,
                    name: formData.name,
                    category: formData.category,
                    description: formData.description,
                    daily_price: parseInt(formData.pricePerDay) || 0,
                    weekly_price: (parseInt(formData.pricePerDay) || 0) * 6,
                    location: formData.location,
                    city: formData.location,
                    status: 'available',
                    image_emoji: equipmentImages[formData.category] || '📦',
                    specifications: {
                        condition: formData.condition,
                        year: formData.yearOfManufacture,
                    },
                })
                .select()
                .single()

            if (!supabaseError && supabaseData) {
                console.log('Equipment added to Supabase:', supabaseData.id)
            }
        } catch (err) {
            console.log('Supabase not configured, using local storage')
        }

        // إضافة المعدة للـ owner store
        addEquipment(newOwnerEquipment)

        // إضافة المعدة للـ equipment store (الصفحة الرئيسية)
        addEquipmentToMain(newMainEquipment)

        setIsSubmitting(false)
        setShowSuccess(true)

        // الانتقال للوحة التحكم بعد 2 ثواني
        setTimeout(() => {
            router.push('/owner')
        }, 2000)
    }

    const isStep1Valid = formData.name && formData.category && formData.description
    const isStep2Valid = formData.pricePerDay && formData.location
    const isStep3Valid = true // التوفر افتراضياً صحيح

    const days = [
        { key: 'saturday', label: 'السبت' },
        { key: 'sunday', label: 'الأحد' },
        { key: 'monday', label: 'الاثنين' },
        { key: 'tuesday', label: 'الثلاثاء' },
        { key: 'wednesday', label: 'الأربعاء' },
        { key: 'thursday', label: 'الخميس' },
        { key: 'friday', label: 'الجمعة' },
    ]

    // نافذة النجاح
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">تمت الإضافة بنجاح! 🎉</h2>
                    <p className="text-gray-500 mb-6">
                        تم إضافة "{formData.name}" إلى معداتك. يمكن للمستأجرين الآن رؤية معدتك وحجزها.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            href="/owner"
                            className="flex-1 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                        >
                            العودة للوحة التحكم
                        </Link>
                        <button
                            onClick={() => {
                                setShowSuccess(false)
                                setStep(1)
                                setFormData({
                                    name: '',
                                    category: '',
                                    description: '',
                                    pricePerDay: '',
                                    location: '',
                                    images: [],
                                    availability: {
                                        monday: true, tuesday: true, wednesday: true, thursday: true,
                                        friday: true, saturday: true, sunday: true,
                                    },
                                    minRentalDays: '1',
                                    maxRentalDays: '30',
                                    deliveryAvailable: false,
                                    deliveryRadius: '',
                                    deliveryPrice: '',
                                    condition: 'excellent',
                                    yearOfManufacture: '',
                                    specifications: '',
                                })
                            }}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            إضافة معدة أخرى
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/owner" className="flex items-center gap-2 text-gray-600 hover:text-primary-600">
                        <ArrowRight className="w-5 h-5" />
                        <span>العودة للوحة التحكم</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-800">نمو</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">إضافة معدة جديدة</h1>
                    <p className="text-gray-500">أضف معدتك وابدأ في كسب المال من تأجيرها</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}
                            >
                                {step > s ? <Check className="w-5 h-5" /> : s}
                            </div>
                            <span className={`hidden sm:block font-medium ${step >= s ? 'text-primary-600' : 'text-gray-400'}`}>
                                {s === 1 ? 'المعلومات الأساسية' : s === 2 ? 'السعر والموقع' : 'التوفر'}
                            </span>
                            {s < 3 && <div className={`w-16 h-1 rounded ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-primary-500" />
                                المعلومات الأساسية
                            </h2>

                            {/* Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    صور المعدة (اختياري)
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {formData.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl"
                                        >
                                            {img}
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.images.length < 5 && (
                                        <button
                                            onClick={handleImageUpload}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                                        >
                                            <Camera className="w-8 h-8" />
                                            <span className="text-xs">إضافة صورة</span>
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">أضف حتى 5 صور للمعدة (الصورة الأولى ستكون الرئيسية)</p>
                            </div>

                            {/* Equipment Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    اسم المعدة <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="مثال: جرار زراعي John Deere 5075E"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    نوع المعدة <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.value })}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.category === cat.value
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-2xl block mb-1">{cat.icon}</span>
                                            <span className={`text-sm font-medium ${formData.category === cat.value ? 'text-primary-700' : 'text-gray-700'}`}>
                                                {cat.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    وصف المعدة <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="اكتب وصفاً تفصيلياً للمعدة، حالتها، مميزاتها..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                                />
                            </div>

                            {/* Year & Condition */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        سنة الصنع
                                    </label>
                                    <input
                                        type="number"
                                        name="yearOfManufacture"
                                        value={formData.yearOfManufacture}
                                        onChange={handleInputChange}
                                        placeholder="2020"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        حالة المعدة
                                    </label>
                                    <select
                                        name="condition"
                                        value={formData.condition}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    >
                                        <option value="excellent">ممتازة</option>
                                        <option value="good">جيدة</option>
                                        <option value="fair">مقبولة</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Price & Location */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-primary-500" />
                                السعر والموقع
                            </h2>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    سعر الإيجار اليومي <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="pricePerDay"
                                        value={formData.pricePerDay}
                                        onChange={handleInputChange}
                                        placeholder="500"
                                        className="w-full px-4 py-3 pr-20 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">ر.س/يوم</span>
                                </div>
                            </div>

                            {/* Min/Max Rental Days */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الحد الأدنى للإيجار (أيام)
                                    </label>
                                    <input
                                        type="number"
                                        name="minRentalDays"
                                        value={formData.minRentalDays}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الحد الأقصى للإيجار (أيام)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxRentalDays"
                                        value={formData.maxRentalDays}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    موقع المعدة <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none appearance-none"
                                    >
                                        <option value="">اختر المدينة</option>
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Delivery Option */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="deliveryAvailable"
                                        checked={formData.deliveryAvailable}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="font-medium text-gray-700">أوفر خدمة التوصيل</span>
                                </label>
                                {formData.deliveryAvailable && (
                                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">نطاق التوصيل (كم)</label>
                                            <input
                                                type="number"
                                                name="deliveryRadius"
                                                value={formData.deliveryRadius}
                                                onChange={handleInputChange}
                                                placeholder="50"
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">سعر التوصيل (ر.س)</label>
                                            <input
                                                type="number"
                                                name="deliveryPrice"
                                                value={formData.deliveryPrice}
                                                onChange={handleInputChange}
                                                placeholder="100"
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Availability */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-primary-500" />
                                تقويم التوفر
                            </h2>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                                <p className="text-blue-700 text-sm">
                                    حدد الأيام التي تكون فيها المعدة متاحة للإيجار. يمكنك تعديل هذا لاحقاً من لوحة التحكم.
                                </p>
                            </div>

                            {/* Weekly Availability */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    أيام التوفر الأسبوعية
                                </label>
                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((day) => (
                                        <button
                                            key={day.key}
                                            type="button"
                                            onClick={() => handleAvailabilityChange(day.key)}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.availability[day.key as keyof typeof formData.availability]
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 bg-gray-50 text-gray-400'
                                                }`}
                                        >
                                            <span className="text-xs font-medium block">{day.label}</span>
                                            {formData.availability[day.key as keyof typeof formData.availability] ? (
                                                <Check className="w-5 h-5 mx-auto mt-1" />
                                            ) : (
                                                <X className="w-5 h-5 mx-auto mt-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="font-bold text-gray-800 mb-4">ملخص المعدة</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">اسم المعدة</span>
                                        <span className="font-medium">{formData.name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">النوع</span>
                                        <span className="font-medium">
                                            {categories.find(c => c.value === formData.category)?.label || '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">السعر اليومي</span>
                                        <span className="font-medium text-primary-600">
                                            {formData.pricePerDay ? `${formData.pricePerDay} ر.س` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">الموقع</span>
                                        <span className="font-medium">{formData.location || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">حالة المعدة</span>
                                        <span className="font-medium">
                                            {formData.condition === 'excellent' ? 'ممتازة' :
                                                formData.condition === 'good' ? 'جيدة' : 'مقبولة'}
                                        </span>
                                    </div>
                                    {formData.deliveryAvailable && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">التوصيل</span>
                                            <span className="font-medium text-green-600">متاح</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                السابق
                            </button>
                        )}
                        {step < 3 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                                className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                التالي
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        جاري الإضافة...
                                    </span>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5 inline ml-2" />
                                        نشر المعدة
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
