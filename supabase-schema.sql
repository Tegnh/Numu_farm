-- ============================================
-- Numu Platform - Supabase Database Schema
-- انسخ هذا الكود والصقه في Supabase SQL Editor
-- ============================================

-- 1. جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('renter', 'equipment_owner', 'admin')),
    phone TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المعدات
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    daily_price NUMERIC NOT NULL,
    weekly_price NUMERIC,
    monthly_price NUMERIC,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    image_emoji TEXT DEFAULT '🚜',
    rating NUMERIC DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    specifications JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الحجوزات
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
    renter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول التقييمات
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    reviewer_type TEXT NOT NULL CHECK (reviewer_type IN ('renter', 'owner')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    equipment_condition TEXT,
    would_rent_again BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_type)
);

-- ============================================
-- Row Level Security (RLS) - مهم للأمان!
-- ============================================

-- تفعيل RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- سياسات جدول المستخدمين
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- سياسات جدول المعدات
CREATE POLICY "Anyone can view available equipment" ON equipment
    FOR SELECT USING (true);

CREATE POLICY "Owners can insert equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = owner_id);

-- سياسات جدول الحجوزات
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Renters can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Participants can update bookings" ON bookings
    FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- سياسات جدول التقييمات
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Participants can add reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- Indexes للأداء
-- ============================================
CREATE INDEX IF NOT EXISTS idx_equipment_owner ON equipment(owner_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_city ON equipment(city);
CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_equipment ON reviews(equipment_id);

-- ============================================
-- بيانات تجريبية (اختياري)
-- ============================================
-- يمكنك إضافة بيانات تجريبية هنا إذا أردت
