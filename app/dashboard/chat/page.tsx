'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import {
    ArrowRight,
    Send,
    Paperclip,
    Image,
    Smile,
    MoreVertical,
    Phone,
    Video,
    Search,
    Check,
    CheckCheck,
    Clock,
    User
} from 'lucide-react'

// بيانات تجريبية للمحادثات
const mockContacts = [
    {
        id: '1',
        name: 'سعيد العامل',
        role: 'عامل',
        avatar: '👷',
        lastMessage: 'تم الانتهاء من ري الحقل الشرقي',
        time: '10:30 ص',
        unread: 2,
        online: true
    },
    {
        id: '2',
        name: 'أحمد الفني',
        role: 'فني صيانة',
        avatar: '🔧',
        lastMessage: 'نظام الري يحتاج صيانة',
        time: 'أمس',
        unread: 0,
        online: false
    },
    {
        id: '3',
        name: 'محمد المشرف',
        role: 'مشرف',
        avatar: '👨‍💼',
        lastMessage: 'التقرير الأسبوعي جاهز',
        time: 'الأحد',
        unread: 0,
        online: true
    },
    {
        id: '4',
        name: 'خالد السائق',
        role: 'سائق',
        avatar: '🚜',
        lastMessage: 'وصلت الشحنة',
        time: 'السبت',
        unread: 0,
        online: false
    },
]

const mockMessages = [
    { id: 1, sender: 'worker', text: 'صباح الخير يا أستاذ', time: '09:00 ص', status: 'read' },
    { id: 2, sender: 'owner', text: 'صباح النور سعيد، كيف الأمور في المزرعة؟', time: '09:05 ص', status: 'read' },
    { id: 3, sender: 'worker', text: 'الحمد لله، بدأت ري الحقل الشرقي', time: '09:10 ص', status: 'read' },
    { id: 4, sender: 'owner', text: 'ممتاز! لا تنسى فحص مستوى المياه في الخزان', time: '09:12 ص', status: 'read' },
    { id: 5, sender: 'worker', text: 'تمام، الخزان ممتلئ 80%', time: '09:30 ص', status: 'read' },
    { id: 6, sender: 'worker', text: 'تم الانتهاء من ري الحقل الشرقي', time: '10:30 ص', status: 'delivered' },
]

export default function ChatPage() {
    const { user } = useAuthStore()
    const [selectedContact, setSelectedContact] = useState(mockContacts[0])
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(mockMessages)
    const [showMobileContacts, setShowMobileContacts] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = () => {
        if (!message.trim()) return

        const newMessage = {
            id: messages.length + 1,
            sender: 'owner',
            text: message,
            time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        }

        setMessages([...messages, newMessage])
        setMessage('')
    }

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-30">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">التواصل مع العاملين</h1>
                                <p className="text-sm text-gray-500">محادثات فورية</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Contacts Sidebar */}
                <div className={`${showMobileContacts ? 'flex' : 'hidden'} md:flex w-full md:w-80 bg-white border-l border-gray-200 flex-col`}>
                    {/* Search */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="بحث في المحادثات..."
                                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Contacts List */}
                    <div className="flex-1 overflow-y-auto">
                        {mockContacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => {
                                    setSelectedContact(contact)
                                    setShowMobileContacts(false)
                                }}
                                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${selectedContact.id === contact.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                                        {contact.avatar}
                                    </div>
                                    {contact.online && (
                                        <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-800 truncate">{contact.name}</h4>
                                        <span className="text-xs text-gray-400">{contact.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                                        {contact.unread > 0 && (
                                            <span className="w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {contact.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${!showMobileContacts ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-gray-50`}>
                    {/* Chat Header */}
                    <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowMobileContacts(true)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <div className="relative">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                    {selectedContact.avatar}
                                </div>
                                {selectedContact.online && (
                                    <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">{selectedContact.name}</h4>
                                <p className="text-xs text-gray-500">
                                    {selectedContact.online ? 'متصل الآن' : 'غير متصل'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Video className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Date Separator */}
                        <div className="flex items-center justify-center">
                            <span className="px-4 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                                اليوم
                            </span>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'owner' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[75%] ${msg.sender === 'owner'
                                        ? 'bg-primary-500 text-white rounded-2xl rounded-tr-sm'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-sm'
                                    }`}>
                                    <p className="px-4 py-2">{msg.text}</p>
                                    <div className={`flex items-center gap-1 px-4 pb-2 ${msg.sender === 'owner' ? 'text-primary-100' : 'text-gray-400'
                                        }`}>
                                        <span className="text-xs">{msg.time}</span>
                                        {msg.sender === 'owner' && (
                                            msg.status === 'read' ? (
                                                <CheckCheck className="w-4 h-4" />
                                            ) : msg.status === 'delivered' ? (
                                                <CheckCheck className="w-4 h-4 opacity-70" />
                                            ) : (
                                                <Check className="w-4 h-4 opacity-70" />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Paperclip className="w-5 h-5 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <Image className="w-5 h-5 text-gray-500" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="اكتب رسالة..."
                                    className="w-full px-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-lg">
                                    <Smile className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim()}
                                className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
