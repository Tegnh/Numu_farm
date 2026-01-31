import Link from 'next/link'
import { Star, MapPin, Calendar } from 'lucide-react'
import { Equipment } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

interface EquipmentCardProps {
    equipment: Equipment
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
    return (
        <div className="equipment-card group">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">🚜</div>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                    {equipment.isAvailable ? (
                        <span className="badge-available">متاح</span>
                    ) : (
                        <span className="badge-rented">مؤجر</span>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-gray-700 text-sm font-medium rounded-full">
                        {equipment.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                    {equipment.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {equipment.description}
                </p>

                {/* Location & Rating */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{equipment.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium text-gray-700">{equipment.rating}</span>
                        <span className="text-gray-400 text-sm">({equipment.reviewsCount})</span>
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-sm text-gray-500">السعر اليومي</p>
                        <p className="text-xl font-bold text-primary-600">
                            {formatPrice(equipment.pricePerDay)}
                        </p>
                    </div>
                    <Link
                        href={`/equipment/${equipment.id}`}
                        className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                        <Calendar className="w-4 h-4" />
                        احجز الآن
                    </Link>
                </div>
            </div>
        </div>
    )
}
