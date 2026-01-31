'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import {
    Sprout,
    ArrowRight,
    DollarSign,
    TrendingUp,
    TrendingDown,
    PieChart,
    Calendar,
    Plus,
    Filter,
    Download,
    Receipt,
    Wallet,
    CreditCard,
    BarChart3,
    ChevronLeft,
    Home,
    LayoutDashboard
} from 'lucide-react'

// بيانات تجريبية للمعاملات المالية
const mockTransactions = [
    { id: 1, type: 'income', category: 'مبيعات تمور', amount: 15000, date: '2024-03-15', description: 'بيع 500 كجم تمور سكري' },
    { id: 2, type: 'expense', category: 'أسمدة', amount: 2500, date: '2024-03-14', description: 'شراء أسمدة NPK' },
    { id: 3, type: 'expense', category: 'رواتب', amount: 8000, date: '2024-03-10', description: 'رواتب العمال - مارس' },
    { id: 4, type: 'income', category: 'مبيعات تمور', amount: 22000, date: '2024-03-08', description: 'بيع 700 كجم تمور خلاص' },
    { id: 5, type: 'expense', category: 'مياه', amount: 1200, date: '2024-03-05', description: 'فاتورة المياه - فبراير' },
    { id: 6, type: 'expense', category: 'صيانة', amount: 3500, date: '2024-03-03', description: 'صيانة نظام الري' },
    { id: 7, type: 'income', category: 'تأجير معدات', amount: 5000, date: '2024-03-01', description: 'تأجير الجرار لمزرعة مجاورة' },
]

const categories = {
    income: ['مبيعات تمور', 'تأجير معدات', 'دعم حكومي', 'أخرى'],
    expense: ['أسمدة', 'مبيدات', 'رواتب', 'مياه', 'كهرباء', 'صيانة', 'وقود', 'أخرى']
}

export default function FinancePage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newTransaction, setNewTransaction] = useState({
        type: 'expense' as 'income' | 'expense',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    })

    // حساب الإحصائيات
    const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    const netProfit = totalIncome - totalExpense

    const filteredTransactions = activeTab === 'all'
        ? mockTransactions
        : mockTransactions.filter(t => t.type === activeTab)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">الإدارة المالية</h1>
                                <p className="text-sm text-gray-500">تتبع المصروفات والإيرادات</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-xl">
                                <Download className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">إضافة معاملة</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* الإيرادات */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-green-100 text-sm">هذا الشهر</span>
                        </div>
                        <p className="text-green-100 mb-1">إجمالي الإيرادات</p>
                        <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
                    </div>

                    {/* المصروفات */}
                    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <TrendingDown className="w-6 h-6" />
                            </div>
                            <span className="text-red-100 text-sm">هذا الشهر</span>
                        </div>
                        <p className="text-red-100 mb-1">إجمالي المصروفات</p>
                        <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
                    </div>

                    {/* صافي الربح */}
                    <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-2xl p-6 text-white`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <span className="text-blue-100 text-sm">هذا الشهر</span>
                        </div>
                        <p className="text-blue-100 mb-1">صافي الربح</p>
                        <p className="text-3xl font-bold">{formatCurrency(netProfit)}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">عدد المبيعات</p>
                                <p className="text-xl font-bold text-gray-800">12</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">عدد المصروفات</p>
                                <p className="text-xl font-bold text-gray-800">8</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">متوسط البيع</p>
                                <p className="text-xl font-bold text-gray-800">{formatCurrency(totalIncome / 3)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <PieChart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">نسبة الربح</p>
                                <p className="text-xl font-bold text-gray-800">{Math.round((netProfit / totalIncome) * 100)}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setActiveTab('income')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'income' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            الإيرادات
                        </button>
                        <button
                            onClick={() => setActiveTab('expense')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'expense' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            المصروفات
                        </button>
                    </div>

                    {/* List */}
                    <div className="divide-y divide-gray-100">
                        {filteredTransactions.map((transaction) => (
                            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {transaction.type === 'income' ? (
                                                <TrendingUp className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <TrendingDown className="w-6 h-6 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">{transaction.category}</h4>
                                            <p className="text-sm text-gray-500">{transaction.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </p>
                                        <p className="text-sm text-gray-400">{transaction.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Add Transaction Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">إضافة معاملة جديدة</h3>

                        {/* Type Toggle */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${newTransaction.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                مصروف
                            </button>
                            <button
                                onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                                className={`flex-1 py-3 rounded-xl font-medium transition-colors ${newTransaction.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                إيراد
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
                                <select
                                    value={newTransaction.category}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                >
                                    <option value="">اختر التصنيف</option>
                                    {categories[newTransaction.type].map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ (ريال)</label>
                                <input
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                                <input
                                    type="text"
                                    value={newTransaction.description}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                    placeholder="وصف المعاملة"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                <input
                                    type="date"
                                    value={newTransaction.date}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => {
                                    // Mock save
                                    setShowAddModal(false)
                                    alert('تم حفظ المعاملة بنجاح!')
                                }}
                                className={`flex-1 py-3 text-white font-medium rounded-xl ${newTransaction.type === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                حفظ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
