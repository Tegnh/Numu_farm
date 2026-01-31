import Link from 'next/link'
import {
    Sprout,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin
} from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { href: '/equipment', label: 'المعدات' },
        { href: '/about', label: 'عن نمو' },
        { href: '/contact', label: 'تواصل معنا' },
        { href: '/faq', label: 'الأسئلة الشائعة' },
    ]

    const services = [
        { label: 'تأجير المعدات الزراعية' },
        { label: 'تقييمات موثوقة' },
        { label: 'دفع آمن' },
        { label: 'دعم فني' },
    ]

    return (
        <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                                <Sprout className="w-7 h-7 text-primary-300" />
                            </div>
                            <span className="text-3xl font-bold">نمو</span>
                        </Link>
                        <p className="text-primary-200 leading-relaxed">
                            منصة تربط بين المزارعين ومالكي المعدات الزراعية لتسهيل عملية التأجير بثقة وأمان
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">روابط سريعة</h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-primary-200 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">خدماتنا</h3>
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service.label}>
                                    <span className="text-primary-200">{service.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">تواصل معنا</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-primary-200">
                                <MapPin className="w-5 h-5 text-primary-400" />
                                <span>بريدة , المملكة العربية السعودية</span>
                            </li>
                            <li className="flex items-center gap-3 text-primary-200">
                                <Phone className="w-5 h-5 text-primary-400" />
                                <span dir="ltr">+966 50 123 4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-primary-200">
                                <Mail className="w-5 h-5 text-primary-400" />
                                <span>info@numu.sa</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-primary-300 text-sm">
                            © {currentYear} نمو. جميع الحقوق محفوظة
                        </p>
                        <div className="flex gap-6 text-sm text-primary-300">
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                سياسة الخصوصية
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                الشروط والأحكام
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
