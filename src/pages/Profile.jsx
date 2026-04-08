import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, MapPin, CreditCard, ShoppingBag, ChevronRight, CheckCircle2, PackageCheck } from 'lucide-react'
import { TopNav, BottomNav } from '../components/Navigation'
import { useAppStore } from '../store/useAppStore'

export default function Profile() {
  const navigate = useNavigate()
  const { phoneNumber, resetApp, orders, logout } = useAppStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sections = [
    {
      title: "Saved Addresses",
      icon: MapPin,
      preview: "Home, Office",
    },
    {
      title: "Payment Method",
      icon: CreditCard,
      preview: "UPI Auto (Active)",
      previewIcon: <CheckCircle2 className="w-3.5 h-3.5 text-sm-primary" />,
    }
  ]

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 relative pb-20">
      <TopNav title="" showBack={true} />
      
      <div className="flex-1 overflow-y-auto px-4 pb-6 mt-2">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-tr from-sm-primary to-green-300 rounded-[2rem] mb-4 shadow-xl shadow-emerald-500/30 flex items-center justify-center p-[3px]">
            <div className="w-full h-full bg-white rounded-[1.8rem] flex items-center justify-center">
              <span className="text-3xl font-black text-slate-800 tracking-tighter">SM</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800">Smart Shopper</h2>
          <p className="text-slate-500 font-bold">+91 {phoneNumber || "9876543210"}</p>
        </div>

        <div className="space-y-4 mb-8">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer group hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-sm-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{section.title}</h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      {section.previewIcon} {section.preview}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </motion.div>
            )
          })}
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Past Orders</h3>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 border-dashed text-center">
                <PackageCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-bold">No orders yet</p>
              </div>
            ) : (
              orders.map((order, i) => {
                // If items is an Array, gracefully extract them. If older string format, use directly.
                const itemsStr = Array.isArray(order.items) 
                  ? order.items.map(item => `${item.quantity}x ${item.name}`).join(', ') 
                  : order.items

                const orderEmoji = order.emoji 
                  ? order.emoji 
                  : (Array.isArray(order.items) ? (order.items[0].name.replace(/[^a-zA-Z]/g, '') === 'Eggs' ? '🥚' : '📦') : '📦');

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={order.id || i}
                    className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                          {orderEmoji.substring(0,2)} 
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black text-slate-800 text-sm truncate pr-2 leading-tight mb-1">{itemsStr}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="font-black text-sm-primary bg-emerald-50 px-3 py-1 rounded-full text-sm">₹{order.totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 border-t border-slate-100 pt-3">
                      <MapPin className="w-3.5 h-3.5" />
                      Delivered to: <span className="text-slate-600 truncate">{order.address}</span>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

      </div>

      <BottomNav />
    </div>
  )
}
