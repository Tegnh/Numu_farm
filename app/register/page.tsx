'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore, UserRole } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
    Sprout,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    User,
    Phone,
    Tractor,
    LayoutDashboard,
    Users,
    Wrench,
    CheckCircle
} from 'lucide-react'

const roles: { value: UserRole; label: string; icon: any; description: string }[] = [
    {
        value: 'renter',
        label: 'مزارع (مستأجر)',
        icon: Users,
        description: 'أبحث عن معدات لاستئجارها',
    },
    {
        value: 'equipment_owner',
        label: 'مالك معدات',
        icon: Tractor,
        description: 'أريد تأجير معداتي',
    },
]

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuthStore()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    })
    const [selectedRole, setSelectedRole] = useState<UserRole>('renter')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone) {
                setError('الرجاء ملء جميع الحقول')
                return
            }
            setError('')
            setStep(2)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('كلمتا المرور غير متطابقتين')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            // إنشاء حساب في Supabase
            const { data, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            })

            if (authError) {
                // إذا فشل Supabase، نستخدم Mock
                await login(formData.email, formData.password, selectedRole)
                if (selectedRole === 'renter') {
                    router.push('/dashboard')
                } else if (selectedRole === 'equipment_owner') {
                    router.push('/owner')
                } else {
                    router.push('/')
                }
            } else if (data.user) {
                // إضافة بيانات المستخدم في جدول users
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email: formData.email,
                        name: formData.name,
                        role: selectedRole,
                        phone: formData.phone,
                    })

                if (insertError) {
                    console.error('Insert error:', insertError)
                }

                // حفظ في local store
                await login(formData.email, formData.password, selectedRole)

                // توجيه حسب الدور
                if (selectedRole === 'renter') {
                    router.push('/dashboard')
                } else if (selectedRole === 'equipment_owner') {
                    router.push('/owner')
                } else {
                    router.push('/')
                }
            }
        } catch (err) {
            setError('حدث خطأ في إنشاء الحساب')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Panel - Decorative */}
                <div className="hidden lg:flex bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center text-white">
                        <div className="text-8xl mb-8">🌱</div>
                        <h2 className="text-3xl font-bold mb-4">انضم إلى نمو</h2>
                        <p className="text-primary-100 text-lg max-w-xs mx-auto mb-8">
                            منصة تربط بين المزارعين ومالكي المعدات الزراعية
                        </p>

                        <div className="space-y-3 text-right">
                            {[
                                'استأجر المعدات بسهولة',
                                'أجّر معداتك وحقق دخل إضافي',
                                'تقييمات موثوقة',
                                'دفع آمن ومحمي',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-primary-100">
                                    <CheckCircle className="w-5 h-5 text-primary-300" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="p-8 md:p-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-8">
                        <ArrowRight className="w-5 h-5" />
                        العودة للرئيسية
                    </Link>

                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                            <Sprout className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</h1>
                            <p className="text-gray-500">الخطوة {step} من 2</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-gray-200'}`} />
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {step === 1 ? (
                            <>
                                {/* Role Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        نوع الحساب
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {roles.map((role) => (
                                            <button
                                                key={role.value}
                                                type="button"
                                                onClick={() => setSelectedRole(role.value)}
                                                className={`p-3 rounded-xl border-2 transition-all text-right ${selectedRole === role.value
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <role.icon className={`w-6 h-6 mb-2 ${selectedRole === role.value ? 'text-primary-600' : 'text-gray-400'
                                                    }`} />
                                                <p className={`font-medium ${selectedRole === role.value ? 'text-primary-700' : 'text-gray-700'
                                                    }`}>{role.label}</p>
                                                <p className="text-xs text-gray-500">{role.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        الاسم الكامل
                                    </label>
                                    <div className="relative">
                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="أحمد محمد"
                                            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        البريد الإلكتروني
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@email.com"
                                            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الجوال
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="05xxxxxxxx"
                                            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        كلمة المرور
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="8 أحرف على الأقل"
                                            className="w-full pr-12 pl-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        تأكيد كلمة المرور
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="أعد كتابة كلمة المرور"
                                            className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        أوافق على{' '}
                                        <Link href="/terms" className="text-primary-600 hover:underline">الشروط والأحكام</Link>
                                        {' '}و{' '}
                                        <Link href="/privacy" className="text-primary-600 hover:underline">سياسة الخصوصية</Link>
                                    </label>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    السابق
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <div className="spinner" />
                                        جاري الإنشاء...
                                    </span>
                                ) : step === 1 ? (
                                    'التالي'
                                ) : (
                                    'إنشاء الحساب'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            تسجيل الدخول
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
