import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import {
    Target,
    Heart,
    Award,
    Handshake,
    Shield,
    Clock,
    Users,
    Tractor
} from 'lucide-react'

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: 'رؤيتنا',
            description: 'تسهيل وصول المزارعين للمعدات الزراعية الحديثة بأسعار مناسبة',
        },
        {
            icon: Heart,
            title: 'رسالتنا',
            description: 'ربط المزارعين بمالكي المعدات لتحقيق الفائدة المشتركة',
        },
        {
            icon: Award,
            title: 'قيمنا',
            description: 'الثقة، الشفافية، والتسهيل على المزارعين ومالكي المعدات',
        },
    ]

    const howItWorks = [
        {
            step: 1,
            title: 'تصفح المعدات',
            description: 'ابحث عن المعدة التي تحتاجها من بين عشرات الخيارات',
            emoji: '🔍'
        },
        {
            step: 2,
            title: 'اختر الموعد',
            description: 'حدد تاريخ الاستئجار وعدد الأيام المطلوبة',
            emoji: '📅'
        },
        {
            step: 3,
            title: 'احجز بأمان',
            description: 'أكد الحجز وتواصل مباشرة مع مالك المعدة',
            emoji: '✅'
        },
        {
            step: 4,
            title: 'استلم واستخدم',
            description: 'استلم المعدة واستخدمها في مزرعتك',
            emoji: '🚜'
        },
    ]

    const stats = [
        { value: '50+', label: 'معدة متاحة', icon: Tractor },
        { value: '120+', label: 'مستفيد', icon: Users },
        { value: '24/7', label: 'دعم فني', icon: Clock },
        { value: '100%', label: 'ضمان الثقة', icon: Shield },
    ]

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            عن منصة نمو
                        </h1>
                        <p className="text-xl text-primary-100">
                            منصة تربط بين المزارعين ومالكي المعدات الزراعية لتسهيل عملية التأجير
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 -mt-8 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-xl text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                <p className="text-gray-500 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">قصتنا</h2>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                لاحظنا أن كثيراً من المزارعين يحتاجون معدات زراعية حديثة لفترات محدودة،
                                بينما يملك آخرون معدات غير مستخدمة معظم الوقت.
                            </p>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                من هنا جاءت فكرة نمو - منصة تجمع بين الطرفين لتحقيق الفائدة للجميع.
                                المزارع يحصل على المعدة بسعر مناسب، ومالك المعدة يستفيد من معداته.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                نحن نؤمن بأن التعاون بين أفراد المجتمع الزراعي هو الطريق لتطوير القطاع الزراعي.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-9xl mb-4">🤝</div>
                                    <p className="text-xl font-bold text-primary-700">نربط المزارعين بالمعدات</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-400 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">كيف يعمل نمو؟</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="bg-white p-6 rounded-2xl shadow-lg text-center relative">
                                <div className="absolute -top-4 right-4 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {item.step}
                                </div>
                                <div className="text-5xl mb-4">{item.emoji}</div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">ما يميزنا</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value) => (
                            <div key={value.title} className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
                                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <value.icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Who */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">لمن نمو؟</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="text-5xl mb-4">🌾</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">للمزارعين</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                    استأجر المعدات التي تحتاجها بأسعار مناسبة
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                    اطلع على تقييمات المزارعين الآخرين
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                                    تواصل مباشرة مع مالك المعدة
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <div className="text-5xl mb-4">🚜</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">لمالكي المعدات</h3>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    أضف معداتك واستفد منها في أوقات عدم استخدامها
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    حدد أسعارك وتواريخ التوفر
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    وصل لمزارعين يحتاجون معداتك
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        ابدأ اليوم مع نمو
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        سواء كنت مزارعاً تبحث عن معدات أو مالك معدات تريد تأجيرها
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/equipment"
                            className="px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:-translate-y-1 transition-all"
                        >
                            تصفح المعدات
                        </Link>
                        <Link
                            href="/register"
                            className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all"
                        >
                            سجل الآن
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
