'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { getRoleLabel } from '@/lib/utils'
import {
    Menu,
    X,
    User,
    LogOut,
    Tractor,
    LayoutDashboard,
    Sprout,
    ChevronDown
} from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, isAuthenticated, logout } = useAuthStore()

    const navLinks = [
        { href: '/', label: 'الرئيسية' },
        { href: '/equipment', label: 'المعدات' },
        { href: '/about', label: 'عن نمو' },
        { href: '/contact', label: 'تواصل معنا' },
    ]

    return (
        <nav className="fixed top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold gradient-text">نمو</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                                        <div className="p-3 border-b border-gray-100">
                                            <p className="font-medium text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-500">{getRoleLabel(user.role)}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                href={user.role === 'equipment_owner' ? '/owner' : '/dashboard'}
                                                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                لوحة التحكم
                                            </Link>
                                            {user.role === 'equipment_owner' && (
                                                <Link
                                                    href="/owner/add-equipment"
                                                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Tractor className="w-4 h-4" />
                                                    إضافة معدة
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    setShowUserMenu(false)
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                تسجيل الخروج
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                >
                                    إنشاء حساب
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <hr className="my-3" />
                        {isAuthenticated && user ? (
                            <>
                                <div className="px-4 py-2">
                                    <p className="font-medium text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{getRoleLabel(user.role)}</p>
                                </div>
                                <Link
                                    href="/dashboard"
                                    className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    لوحة التحكم
                                </Link>
                                <button
                                    onClick={() => {
                                        logout()
                                        setIsOpen(false)
                                    }}
                                    className="block w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                >
                                    تسجيل الخروج
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block px-4 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    تسجيل الدخول
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-3 bg-primary-500 text-white text-center rounded-lg font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    إنشاء حساب
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
