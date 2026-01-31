'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Clock,
    CheckCircle
} from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSubmitting(false)
        setIsSubmitted(true)
    }

    const contactInfo = [
        {
            icon: Phone,
            title: 'اتصل بنا',
            details: ['+966 50 123 4567', '+966 11 234 5678'],
        },
        {
            icon: Mail,
            title: 'راسلنا',
            details: ['info@numu.sa', 'support@numu.sa'],
        },
        {
            icon: MapPin,
            title: 'زورنا',
            details: ['   بريدة , حي البساتين ', '   '],
        },
        {
            icon: Clock,
            title: 'ساعات العمل',
            details: ['الأحد - الخميس: 9ص - 6م', 'الجمعة - السبت: مغلق'],
        },
    ]

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            تواصل معنا
                        </h1>
                        <p className="text-xl text-primary-100">
                            نحن هنا للإجابة على استفساراتك ومساعدتك في كل ما تحتاجه
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 -mt-8 relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info) => (
                            <div key={info.title} className="bg-white p-6 rounded-2xl shadow-xl">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                                    <info.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                                {info.details.map((detail) => (
                                    <p key={detail} className="text-gray-500 text-sm">{detail}</p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">أرسل لنا رسالة</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                هل لديك سؤال أو اقتراح؟ نحب أن نسمع منك! املأ النموذج وسنرد عليك في أقرب وقت ممكن.
                            </p>

                            {isSubmitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-800 mb-2">تم إرسال رسالتك!</h3>
                                    <p className="text-green-600">سنتواصل معك قريباً</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-field"
                                                placeholder="أحمد محمد"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-field"
                                                placeholder="example@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-field"
                                                placeholder="05xxxxxxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="input-field"
                                                placeholder="استفسار عام"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={5}
                                            className="input-field resize-none"
                                            placeholder="اكتب رسالتك هنا..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="spinner" />
                                                جاري الإرسال...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                إرسال الرسالة
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Map Placeholder */}
                        <div className="relative">
                            <div className="sticky top-24">
                                <div className="bg-gray-200 rounded-2xl h-[500px] flex items-center justify-center overflow-hidden">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">📍</div>
                                        <h3 className="text-xl font-bold text-gray-700 mb-2">موقعنا</h3>
                                        <p className="text-gray-500">بريدة ، المملكة العربية السعودية</p>
                                    </div>
                                </div>

                                {/* Quick Contact */}
                                <div className="mt-6 bg-primary-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <MessageCircle className="w-5 h-5 text-primary-600" />
                                        تحتاج مساعدة سريعة؟
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        فريق الدعم متاح على مدار الساعة للإجابة على استفساراتك
                                    </p>
                                    <a
                                        href="https://wa.me/966501234567"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        واتساب
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
