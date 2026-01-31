'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EquipmentCard from '@/components/EquipmentCard'
import { useEquipmentStore } from '@/lib/store'
import {
    Tractor,
    BarChart3,
    Users,
    Shield,
    ArrowLeft,
    CheckCircle,
    Star,
    Zap,
    Leaf,
    TrendingUp,
    Clock,
    Award,
    Smartphone,
    CloudSun
} from 'lucide-react'

export default function HomePage() {
    const { equipment } = useEquipmentStore()
    const featuredEquipment = equipment.slice(0, 3)

    const stats = [
        { value: '50+', label: 'معدة متاحة', icon: Tractor },
        { value: '120+', label: ' مستفيد من خدماتنا ', icon: Leaf },
        { value: '90%', label: 'رضا العملاء', icon: Star },
        { value: '24/7', label: 'دعم فني', icon: Clock },
    ]

    const features = [
        {
            icon: Tractor,
            title: 'تأجير المعدات',
            description: 'اختر من بين مئات المعدات الزراعية المعتمدة من أفضل الموردين',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: Shield,
            title: 'دفع آمن ومحمي',
            description: 'نظام دفع موثوق يضمن حقوق المزارع ومالك المعدة - أموالك تحت حماية المنصة',
            color: 'from-primary-500 to-primary-600',
        },
        {
            icon: Star,
            title: 'تقييمات موثوقة',
            description: 'اطّلع على تجارب المزارعين الآخرين وتقييماتهم لكل معدة ومؤجر قبل الحجز',
            color: 'from-purple-500 to-purple-600',
        },
        {
            icon: Clock,
            title: 'دعم على مدار الساعة',
            description: 'فريق دعم متخصص لمساعدتك في أي وقت تحتاجه',
            color: 'from-secondary-500 to-secondary-600',
        },
    ]

    const benefits = [
        {
            icon: Zap,
            title: 'توفير الوقت',
            description: 'احجز المعدة في دقائق بدلاً من أيام البحث والتفاوض',
        },
        {
            icon: Award,
            title: 'جودة مضمونة',
            description: 'جميع المعدات معتمدة ومفحوصة من قبل خبراء',
        },
        {
            icon: TrendingUp,
            title: 'أسعار تنافسية',
            description: 'قارن بين المعدات واختر السعر المناسب لميزانيتك',
        },
        {
            icon: Smartphone,
            title: 'سهولة الاستخدام',
            description: 'تصفح واحجز المعدات من أي مكان وفي أي وقت',
        },
    ]

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pb-32">
                {/* Background */}
                <div className="absolute inset-0 animated-bg opacity-95" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                {/* Floating Elements */}
                <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl floating" />
                <div className="absolute bottom-40 left-20 w-32 h-32 bg-primary-300/20 rounded-full blur-xl floating" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg floating" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-8 animate-fade-in">
                            <CloudSun className="w-4 h-4" />
                            <span>منصة تأجير المعدات الزراعي</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up">
                            <span className="block">منصة</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400">
                                نمو
                            </span>
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-medium mt-4 text-primary-100">

                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            استأجر المعدات التي تحتاجها، بالسعر الذي يناسبك،
                            في الوقت المناسب لك
                            <br />
                            <span className="text-primary-200">نمو معك لمستقبل زراعي أفضل 🌱</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <Link
                                href="/equipment"
                                className="group px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 transition-all flex items-center gap-2"
                            >
                                <Tractor className="w-5 h-5" />
                                استكشف المعدات
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>

                        </div>

                        {/* Trust Badges - تصميم احترافي */}
                        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                                {/* Badge 1 */}
                                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white font-medium text-sm sm:text-base">اسعار مناسبه</span>
                                </div>

                                {/* Badge 2 */}


                                {/* Badge 3 */}
                                <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white font-medium text-sm sm:text-base"> دعم على مدار الساعة </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white relative -mt-32 z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="text-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100 card-hover"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-7 h-7 text-primary-600" />
                                </div>
                                <div className="stat-number">{stat.value}</div>
                                <div className="text-gray-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="section-title">
                            كل ما تحتاجه في{' '}
                            <span className="gradient-text">منصة واحدة</span>
                        </h2>
                        <p className="section-subtitle">
                            نقدم لك حلولاً متكاملة لتطوير مزرعتك وزيادة إنتاجيتك
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="group p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Equipment */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="section-title mb-2">المعدات المميزة</h2>
                            <p className="text-gray-500">أحدث المعدات المتاحة للتأجير</p>
                        </div>
                        <Link
                            href="/equipment"
                            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                        >
                            عرض الكل
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEquipment.map((eq) => (
                            <EquipmentCard key={eq.id} equipment={eq} />
                        ))}
                    </div>

                    <div className="mt-8 text-center sm:hidden">
                        <Link
                            href="/equipment"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                        >
                            عرض الكل
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="section-title mb-6">
                                لماذا تختار{' '}
                                <span className="gradient-text">نمو</span>؟
                            </h2>
                            <p className="text-lg text-gray-500 mb-10">
                                نربط بين المزارعين ومالكي المعدات الزراعية بكل سهولة وأمان - وفّر وقتك ومالك معنا
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {benefits.map((benefit) => (
                                    <div key={benefit.title} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-1">{benefit.title}</h4>
                                            <p className="text-sm text-gray-500">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary-100 via-primary-200 to-secondary-100 rounded-3xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-9xl mb-4">🌾</div>
                                        <p className="text-2xl font-bold text-primary-700">نمو معك</p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary-400 rounded-2xl -z-10" />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-200 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        جاهز لتطوير مزرعتك؟
                    </h2>
                    <p className="text-xl text-primary-100 mb-10">
                        انضم لآلاف المزارعين الذين يثقون بنمو
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="px-10 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 transition-all"
                        >
                            ابدأ مجاناً الآن
                        </Link>
                        <Link
                            href="/contact"
                            className="px-10 py-4 bg-transparent text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all"
                        >
                            تواصل معنا
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
