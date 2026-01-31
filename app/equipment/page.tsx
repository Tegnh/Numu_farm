'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EquipmentCard from '@/components/EquipmentCard'
import { useEquipmentStore, Equipment } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
    Search,
    SlidersHorizontal,
    MapPin,
    X,
    ChevronDown,
    RefreshCw
} from 'lucide-react'

const categories = [
    'الكل',
    'جرارات',
    'حصادات',
    'أنظمة ري',
    'رشاشات',
    'محاريث',
    'طائرات درون',
]

const cities = [
    'الكل',
    'الرياض',
    'بريدة',
    'سكاكا',
    'المدينة المنورة',
    'حائل',
    'الهفوف',
    'جدة',
    'الدمام',
]

const categoryMap: Record<string, string> = {
    'tractors': 'جرارات',
    'harvesters': 'حصادات',
    'irrigation': 'أنظمة ري',
    'sprayers': 'رشاشات',
    'plows': 'محاريث',
    'drones': 'طائرات درون',
}

export default function EquipmentPage() {
    const { equipment, filters, setFilters } = useEquipmentStore()
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('الكل')
    const [selectedCity, setSelectedCity] = useState('الكل')
    const [searchQuery, setSearchQuery] = useState('')
    const [availableOnly, setAvailableOnly] = useState(false)
    const [supabaseEquipment, setSupabaseEquipment] = useState<Equipment[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // جلب المعدات من Supabase
    const fetchSupabaseEquipment = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from('equipment')
                .select('*')
                .eq('status', 'available')
                .order('created_at', { ascending: false })

            if (!error && data) {
                const mapped = data.map((eq: any) => ({
                    id: eq.id,
                    name: eq.name,
                    description: eq.description || '',
                    category: categoryMap[eq.category] || eq.category,
                    pricePerDay: eq.daily_price,
                    pricePerWeek: eq.weekly_price || eq.daily_price * 6,
                    location: eq.location,
                    city: eq.city,
                    images: [`/equipment/${eq.category}.jpg`],
                    ownerId: eq.owner_id,
                    ownerName: 'مالك المعدة',
                    rating: eq.rating || 0,
                    reviewsCount: eq.reviews_count || 0,
                    isAvailable: eq.status === 'available',
                    specifications: eq.specifications || {},
                    createdAt: eq.created_at,
                }))
                setSupabaseEquipment(mapped)
            }
        } catch (err) {
            console.log('Could not fetch from Supabase')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchSupabaseEquipment()
    }, [])

    // دمج المعدات من المصدرين
    const allEquipment = [...supabaseEquipment, ...equipment]

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setFilters({ searchQuery })
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setFilters({ category: category === 'الكل' ? '' : category })
    }

    const handleCityChange = (city: string) => {
        setSelectedCity(city)
        setFilters({ city: city === 'الكل' ? '' : city })
    }

    const handleAvailableToggle = () => {
        setAvailableOnly(!availableOnly)
        setFilters({ availableOnly: !availableOnly })
    }

    const clearFilters = () => {
        setSelectedCategory('الكل')
        setSelectedCity('الكل')
        setSearchQuery('')
        setAvailableOnly(false)
        setFilters({
            category: '',
            city: '',
            searchQuery: '',
            availableOnly: false,
        })
    }

    const filteredEquipment = allEquipment.filter((eq) => {
        if (selectedCategory !== 'الكل' && eq.category !== selectedCategory) return false
        if (selectedCity !== 'الكل' && eq.city !== selectedCity) return false
        if (availableOnly && !eq.isAvailable) return false
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            if (!eq.name.toLowerCase().includes(query) &&
                !eq.description.toLowerCase().includes(query)) {
                return false
            }
        }
        return true
    })

    const activeFiltersCount = [
        selectedCategory !== 'الكل',
        selectedCity !== 'الكل',
        availableOnly,
        searchQuery,
    ].filter(Boolean).length

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        استكشف المعدات الزراعية
                    </h1>
                    <p className="text-primary-100 text-lg max-w-2xl">
                        اختر من بين مئات المعدات الزراعية المعتمدة والمتاحة للتأجير في جميع أنحاء المملكة
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mt-8">
                        <div className="flex gap-3 max-w-3xl">
                            <div className="flex-1 relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="ابحث عن معدة..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-white rounded-xl shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-800"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="relative px-5 py-4 bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                <span className="hidden sm:inline text-gray-700 font-medium">الفلاتر</span>
                                {activeFiltersCount > 0 && (
                                    <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-slide-up">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800">خيارات الفلترة</h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                مسح الكل
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    نوع المعدة
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* City Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline w-4 h-4 ml-1" />
                                    المدينة
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    >
                                        {cities.map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Available Only */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    التوفر
                                </label>
                                <button
                                    onClick={handleAvailableToggle}
                                    className={`w-full p-3 rounded-xl border-2 transition-colors ${availableOnly
                                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-600'
                                        }`}
                                >
                                    المتاحة فقط
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filters Tags */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {selectedCategory !== 'الكل' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                {selectedCategory}
                                <button onClick={() => handleCategoryChange('الكل')}>
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        )}
                        {selectedCity !== 'الكل' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                <MapPin className="w-3 h-3" />
                                {selectedCity}
                                <button onClick={() => handleCityChange('الكل')}>
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        )}
                        {availableOnly && (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                متاحة فقط
                                <button onClick={handleAvailableToggle}>
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        عرض <span className="font-bold text-gray-800">{filteredEquipment.length}</span> معدة
                    </p>
                </div>

                {/* Equipment Grid */}
                {filteredEquipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEquipment.map((eq) => (
                            <EquipmentCard key={eq.id} equipment={eq} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
                        <p className="text-gray-500 mb-6">حاول تغيير معايير البحث</p>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
                        >
                            مسح الفلاتر
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}
