'use client'

import { useState } from 'react'
import { Star, X, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: {
        rating: number
        comment: string
        condition: 'excellent' | 'good' | 'fair' | 'poor'
        wouldRentAgain: boolean
    }) => void
    type: 'farmer' | 'owner' // من يقيم
    targetName: string // اسم الشخص/المعدة المقيَّمة
    equipmentName: string
}

const conditionOptions = [
    { value: 'excellent', label: 'ممتازة', emoji: '✨' },
    { value: 'good', label: 'جيدة', emoji: '👍' },
    { value: 'fair', label: 'مقبولة', emoji: '😐' },
    { value: 'poor', label: 'سيئة', emoji: '👎' },
] as const

export default function ReviewModal({
    isOpen,
    onClose,
    onSubmit,
    type,
    targetName,
    equipmentName,
}: ReviewModalProps) {
    const [rating, setRating] = useState(5)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [condition, setCondition] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good')
    const [wouldRentAgain, setWouldRentAgain] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async () => {
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        onSubmit({ rating, comment, condition, wouldRentAgain })
        setIsSubmitting(false)
        setShowSuccess(true)
        setTimeout(() => {
            setShowSuccess(false)
            onClose()
            // Reset form
            setRating(5)
            setComment('')
            setCondition('good')
            setWouldRentAgain(true)
        }, 2000)
    }

    const title = type === 'farmer'
        ? `تقييم المالك والمعدة`
        : `تقييم المزارع`

    const conditionLabel = type === 'farmer'
        ? 'حالة المعدة عند الاستلام'
        : 'حالة المعدة عند الإرجاع'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full animate-slide-up max-h-[90vh] overflow-y-auto">
                {showSuccess ? (
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">شكراً لتقييمك! 🎉</h3>
                        <p className="text-gray-500">تقييمك يساعد في بناء مجتمع موثوق</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                                <p className="text-gray-500 text-sm">{equipmentName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Target Info */}
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-gray-500 text-sm mb-1">
                                    {type === 'farmer' ? 'المالك' : 'المزارع'}
                                </p>
                                <p className="font-bold text-gray-800 text-lg">{targetName}</p>
                            </div>

                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                    التقييم العام
                                </label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            className="p-1 transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">
                                    {rating === 5 && 'ممتاز! 🌟'}
                                    {rating === 4 && 'جيد جداً 👍'}
                                    {rating === 3 && 'جيد 😊'}
                                    {rating === 2 && 'مقبول 😐'}
                                    {rating === 1 && 'سيء 😕'}
                                </p>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {conditionLabel}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {conditionOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setCondition(option.value)}
                                            className={`p-3 rounded-xl text-center transition-all ${condition === option.value
                                                    ? 'bg-primary-100 border-2 border-primary-500 text-primary-700'
                                                    : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="text-2xl">{option.emoji}</span>
                                            <p className="text-xs mt-1">{option.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Would Rent Again */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {type === 'farmer'
                                        ? 'هل ستستأجر من هذا المالك مرة أخرى؟'
                                        : 'هل ستؤجر لهذا المزارع مرة أخرى؟'
                                    }
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setWouldRentAgain(true)}
                                        className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${wouldRentAgain
                                                ? 'bg-green-100 border-2 border-green-500 text-green-700'
                                                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <ThumbsUp className="w-5 h-5" />
                                        <span className="font-medium">نعم</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setWouldRentAgain(false)}
                                        className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-2 transition-all ${!wouldRentAgain
                                                ? 'bg-red-100 border-2 border-red-500 text-red-700'
                                                : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <ThumbsDown className="w-5 h-5" />
                                        <span className="font-medium">لا</span>
                                    </button>
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    تعليقك (اختياري)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="شاركنا تجربتك..."
                                    rows={3}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="spinner" />
                                        جاري الإرسال...
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-5 h-5" />
                                        إرسال التقييم
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
