'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, UserRole } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
    Sprout,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Tractor,
    Users,
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

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuthStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [selectedRole, setSelectedRole] = useState<UserRole>('renter')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const redirect = searchParams.get('redirect') || '/'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // تسجيل الدخول عبر Supabase
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                // إذا فشل Supabase، نستخدم Mock للعرض التجريبي
                const success = await login(email, password, selectedRole)
                if (success) {
                    if (selectedRole === 'renter') {
                        router.push('/dashboard')
                    } else if (selectedRole === 'equipment_owner') {
                        router.push('/owner')
                    } else {
                        router.push(redirect)
                    }
                } else {
                    setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
                }
            } else if (data.user) {
                // جلب بيانات المستخدم من جدول users
                const { data: userData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', data.user.id)
                    .single()

                if (userData) {
                    // حفظ في الـ local store أيضاً
                    await login(email, password, userData.role as UserRole)

                    // توجيه حسب الدور
                    if (userData.role === 'renter') {
                        router.push('/dashboard')
                    } else if (userData.role === 'equipment_owner') {
                        router.push('/owner')
                    } else {
                        router.push(redirect)
                    }
                }
            }
        } catch (err) {
            setError('حدث خطأ في تسجيل الدخول')
        } finally {
            setIsLoading(false)
        }
    }

    const quickLogin = async (role: UserRole) => {
        const emails: Record<UserRole, string> = {
            admin: 'admin@numu.sa',
            farm_owner: 'farmer@numu.sa',
            equipment_owner: 'owner@numu.sa',
            renter: 'renter@numu.sa',
            worker: 'worker@numu.sa',
        }
        setEmail(emails[role])
        setPassword('demo123')
        setSelectedRole(role)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Panel - Form */}
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
                            <h1 className="text-2xl font-bold text-gray-800">مرحباً بك في نمو</h1>
                            <p className="text-gray-500">سجل دخولك للمتابعة</p>
                        </div>
                    </div>

                    {/* Quick Login for Demo */}
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                        <p className="text-primary-800 text-sm font-medium mb-3">🔐 تسجيل دخول سريع للتجربة:</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => quickLogin('renter')}
                                className="px-4 py-2 bg-primary-200 hover:bg-primary-300 rounded-lg text-primary-800 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                مزارع
                            </button>
                            <button
                                onClick={() => quickLogin('equipment_owner')}
                                className="px-4 py-2 bg-primary-200 hover:bg-primary-300 rounded-lg text-primary-800 text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <Tractor className="w-4 h-4" />
                                مالك معدات
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                        className={`p-4 rounded-xl border-2 transition-all text-right ${selectedRole === role.value
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <role.icon className={`w-8 h-8 mb-2 ${selectedRole === role.value ? 'text-primary-600' : 'text-gray-400'
                                            }`} />
                                        <p className={`font-bold ${selectedRole === role.value ? 'text-primary-700' : 'text-gray-700'
                                            }`}>{role.label}</p>
                                        <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                    </button>
                                ))}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full pr-12 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pr-12 pl-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    required
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

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                                <span className="text-sm text-gray-600">تذكرني</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <div className="spinner" />
                                    جاري تسجيل الدخول...
                                </span>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        ليس لديك حساب؟{' '}
                        <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>

                {/* Right Panel - Decorative */}
                <div className="hidden lg:flex bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center text-white">
                        <div className="text-8xl mb-8">🤝</div>
                        <h2 className="text-3xl font-bold mb-4">نمو يربطك بالمعدات</h2>
                        <p className="text-primary-100 text-lg max-w-xs mx-auto mb-8">
                            منصة تربط بين المزارعين ومالكي المعدات الزراعية بكل سهولة وأمان
                        </p>

                        <div className="space-y-3 text-right">
                            {[
                                'تصفح واحجز المعدات بسهولة',
                                'تقييمات من مزارعين حقيقيين',
                                'دفع آمن ومحمي',
                                'دعم على مدار الساعة',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 text-primary-100">
                                    <CheckCircle className="w-5 h-5 text-primary-300" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
