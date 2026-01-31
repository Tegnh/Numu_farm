'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import {
    ArrowRight,
    Plus,
    Calendar,
    MapPin,
    Camera,
    Filter,
    Grid3X3,
    List,
    ChevronLeft,
    ChevronRight,
    X,
    Leaf,
    Droplets,
    Sun,
    ThermometerSun,
    TreeDeciduous,
    Image as ImageIcon
} from 'lucide-react'

// بيانات تجريبية لسجل النمو
const mockGrowthLogs = [
    {
        id: 1,
        palmId: 'P-001',
        palmName: 'نخلة سكري #1',
        date: '2024-03-15',
        stage: 'إزهار',
        height: '4.5 متر',
        condition: 'ممتازة',
        notes: 'بداية موسم الإزهار، الطلع في حالة جيدة',
        images: ['🌴', '🌸'],
        weather: { temp: '28°C', humidity: '45%' },
        location: 'الحقل الشرقي - صف 1'
    },
    {
        id: 2,
        palmId: 'P-002',
        palmName: 'نخلة خلاص #2',
        date: '2024-03-14',
        stage: 'نمو ثمار',
        height: '5.2 متر',
        condition: 'جيدة',
        notes: 'الثمار في مرحلة الخلال، تحتاج متابعة الري',
        images: ['🌴', '🟢'],
        weather: { temp: '30°C', humidity: '40%' },
        location: 'الحقل الغربي - صف 3'
    },
    {
        id: 3,
        palmId: 'P-003',
        palmName: 'نخلة برحي #3',
        date: '2024-03-12',
        stage: 'نضج',
        height: '4.8 متر',
        condition: 'ممتازة',
        notes: 'الثمار جاهزة للحصاد خلال أسبوع',
        images: ['🌴', '🟡'],
        weather: { temp: '32°C', humidity: '35%' },
        location: 'الحقل الجنوبي - صف 2'
    },
    {
        id: 4,
        palmId: 'P-004',
        palmName: 'نخلة مجدول #4',
        date: '2024-03-10',
        stage: 'إزهار',
        height: '4.2 متر',
        condition: 'متوسطة',
        notes: 'تحتاج تسميد إضافي',
        images: ['🌴'],
        weather: { temp: '27°C', humidity: '50%' },
        location: 'الحقل الشرقي - صف 4'
    },
    {
        id: 5,
        palmId: 'P-005',
        palmName: 'نخلة صقعي #5',
        date: '2024-03-08',
        stage: 'حصاد',
        height: '5.5 متر',
        condition: 'ممتازة',
        notes: 'تم حصاد 80 كجم من التمور',
        images: ['🌴', '📦'],
        weather: { temp: '29°C', humidity: '42%' },
        location: 'الحقل الغربي - صف 1'
    },
]

const stages = ['الكل', 'إزهار', 'نمو ثمار', 'نضج', 'حصاد']
const conditions = ['الكل', 'ممتازة', 'جيدة', 'متوسطة', 'تحتاج عناية']

export default function GrowthLogPage() {
    const { user } = useAuthStore()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedStage, setSelectedStage] = useState('الكل')
    const [selectedLog, setSelectedLog] = useState<typeof mockGrowthLogs[0] | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)

    const filteredLogs = selectedStage === 'الكل'
        ? mockGrowthLogs
        : mockGrowthLogs.filter(log => log.stage === selectedStage)

    const getStageColor = (stage: string) => {
        const colors: Record<string, string> = {
            'إزهار': 'bg-pink-100 text-pink-700',
            'نمو ثمار': 'bg-green-100 text-green-700',
            'نضج': 'bg-yellow-100 text-yellow-700',
            'حصاد': 'bg-orange-100 text-orange-700',
        }
        return colors[stage] || 'bg-gray-100 text-gray-700'
    }

    const getConditionColor = (condition: string) => {
        const colors: Record<string, string> = {
            'ممتازة': 'text-green-600',
            'جيدة': 'text-blue-600',
            'متوسطة': 'text-yellow-600',
            'تحتاج عناية': 'text-red-600',
        }
        return colors[condition] || 'text-gray-600'
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
                                <h1 className="text-xl font-bold text-gray-800">سجل النمو</h1>
                                <p className="text-sm text-gray-500">ألبوم صور ومتابعة النخيل</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* View Toggle */}
                            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                >
                                    <Grid3X3 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                            >
                                <Camera className="w-5 h-5" />
                                <span className="hidden sm:inline">إضافة صورة</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <TreeDeciduous className="w-8 h-8 text-green-200" />
                            <div>
                                <p className="text-green-100 text-sm">إجمالي النخيل</p>
                                <p className="text-2xl font-bold">156</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <Leaf className="w-8 h-8 text-pink-200" />
                            <div>
                                <p className="text-pink-100 text-sm">في مرحلة الإزهار</p>
                                <p className="text-2xl font-bold">42</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <Sun className="w-8 h-8 text-yellow-200" />
                            <div>
                                <p className="text-yellow-100 text-sm">جاهزة للحصاد</p>
                                <p className="text-2xl font-bold">28</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                        <div className="flex items-center gap-3">
                            <ImageIcon className="w-8 h-8 text-blue-200" />
                            <div>
                                <p className="text-blue-100 text-sm">إجمالي الصور</p>
                                <p className="text-2xl font-bold">1,247</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {stages.map((stage) => (
                        <button
                            key={stage}
                            onClick={() => setSelectedStage(stage)}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${selectedStage === stage
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {stage}
                        </button>
                    ))}
                </div>

                {/* Grid View */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer card-hover"
                            >
                                {/* Image Placeholder */}
                                <div className="h-48 bg-gradient-to-br from-green-100 via-green-200 to-yellow-100 flex items-center justify-center">
                                    <span className="text-7xl">{log.images[0]}</span>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{log.palmName}</h3>
                                            <p className="text-sm text-gray-500">{log.palmId}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStageColor(log.stage)}`}>
                                            {log.stage}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{log.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <MapPin className="w-4 h-4" />
                                            <span>{log.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ThermometerSun className="w-4 h-4 text-orange-500" />
                                            <span className="text-gray-600">{log.weather.temp}</span>
                                            <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                                            <span className="text-gray-600">{log.weather.humidity}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className={`font-medium ${getConditionColor(log.condition)}`}>
                                            {log.condition}
                                        </span>
                                        <div className="flex gap-1">
                                            {log.images.map((img, i) => (
                                                <span key={i} className="text-xl">{img}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {filteredLogs.map((log) => (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                            <span className="text-3xl">{log.images[0]}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-gray-800">{log.palmName}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStageColor(log.stage)}`}>
                                                    {log.stage}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{log.notes}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {log.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {log.location}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-800">{selectedLog.palmName}</h3>
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Image Gallery */}
                            <div className="h-64 bg-gradient-to-br from-green-100 via-green-200 to-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-9xl">{selectedLog.images[0]}</span>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">رقم النخلة</p>
                                    <p className="font-bold text-gray-800">{selectedLog.palmId}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">المرحلة</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(selectedLog.stage)}`}>
                                        {selectedLog.stage}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">الارتفاع</p>
                                    <p className="font-bold text-gray-800">{selectedLog.height}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm text-gray-500 mb-1">الحالة</p>
                                    <p className={`font-bold ${getConditionColor(selectedLog.condition)}`}>{selectedLog.condition}</p>
                                </div>
                            </div>

                            {/* Weather */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-blue-600 mb-2">حالة الطقس وقت التصوير</p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <ThermometerSun className="w-5 h-5 text-orange-500" />
                                        <span className="font-bold text-gray-800">{selectedLog.weather.temp}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-5 h-5 text-blue-500" />
                                        <span className="font-bold text-gray-800">{selectedLog.weather.humidity}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPin className="w-5 h-5 text-primary-500" />
                                <span>{selectedLog.location}</span>
                            </div>

                            {/* Notes */}
                            <div className="bg-yellow-50 rounded-xl p-4">
                                <p className="text-sm text-yellow-700 mb-1">ملاحظات</p>
                                <p className="text-gray-800">{selectedLog.notes}</p>
                            </div>

                            {/* Date */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    تاريخ التسجيل: {selectedLog.date}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Photo Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-slide-up">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">إضافة صورة جديدة</h3>

                        <div className="space-y-4">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">اضغط لالتقاط أو رفع صورة</p>
                                <p className="text-sm text-gray-400 mt-1">PNG, JPG حتى 10MB</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">اختر النخلة</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                    <option>نخلة سكري #1 - P-001</option>
                                    <option>نخلة خلاص #2 - P-002</option>
                                    <option>نخلة برحي #3 - P-003</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                    {stages.filter(s => s !== 'الكل').map(stage => (
                                        <option key={stage}>{stage}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
                                <textarea
                                    rows={3}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl resize-none"
                                    placeholder="أضف ملاحظات عن حالة النخلة..."
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
                                    setShowAddModal(false)
                                    alert('تم حفظ الصورة بنجاح!')
                                }}
                                className="flex-1 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600"
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
