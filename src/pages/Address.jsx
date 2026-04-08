import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { MapPin, Plus, Home as HomeIcon, Briefcase, ArrowLeft } from 'lucide-react'

export default function Address() {
  const navigate = useNavigate()
  const { selectedAddress, setSelectedAddress } = useAppStore()

  const addresses = [
    { id: 1, type: 'Home', address: 'Delivering to Home', detail: 'A-123, Sector 4, React Layout', icon: HomeIcon },
    { id: 2, type: 'Work', address: 'Delivering to Office', detail: 'Tech Park, Building 9, UI City', icon: Briefcase }
  ]

  const handleSelect = (addr) => {
    setSelectedAddress(addr.address)
    navigate('/')
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="flex items-center p-4 bg-white sticky top-0 z-50 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">Select Address</h1>
      </div>
      
      <div className="p-4 flex-1">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 active:scale-95 transition-transform hover:border-sm-primary/30">
          <div className="flex items-center gap-3 text-sm-primary font-semibold text-sm">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            Add new address
          </div>
        </button>
        
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Saved Addresses</h3>
        <div className="space-y-4">
          {addresses.map((addr) => {
            const Icon = addr.icon
            const isSelected = selectedAddress === addr.address
            return (
              <motion.div
                key={addr.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(addr)}
                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex items-start gap-4 ${
                  isSelected 
                    ? 'border-sm-primary bg-emerald-50/50 shadow-md shadow-emerald-500/10' 
                    : 'border-transparent bg-white shadow-sm hover:border-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-full ${isSelected ? 'bg-sm-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-lg">{addr.type}</span>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-sm-primary shadow-sm shadow-emerald-500/50"></div>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{addr.detail}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
