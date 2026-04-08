import { useNavigate, useLocation } from 'react-router-dom'
import { Home, User, ArrowLeft, MapPin } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export const TopNav = ({ title, showBack = true }) => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title || "StockMind+"}</h1>
      </div>
      <button 
        onClick={() => navigate('/profile')} 
        className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
      >
        <User className="w-6 h-6 text-slate-700" />
      </button>
    </div>
  )
}

export const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-around items-center z-50">
      <button 
        onClick={() => navigate('/')} 
        className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors active:scale-95 ${isActive('/') ? 'text-sm-primary' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-semibold">Home</span>
      </button>
      <button 
        onClick={() => navigate('/profile')} 
        className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors active:scale-95 ${isActive('/profile') ? 'text-sm-primary' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] font-semibold">Profile</span>
      </button>
    </div>
  )
}

export const AddressBar = () => {
  const navigate = useNavigate()
  const selectedAddress = useAppStore(state => state.selectedAddress)
  return (
    <button 
      onClick={() => navigate('/address')}
      className="flex items-center gap-2 p-4 bg-white/60 backdrop-blur-md border-b border-slate-100 w-full cursor-pointer hover:bg-slate-50 transition-colors active:bg-slate-100"
    >
      <MapPin className="w-5 h-5 text-sm-primary" />
      <div className="flex flex-col items-start">
        <span className="text-xs text-slate-500 font-medium">Delivering to</span>
        <span className="text-sm font-bold text-slate-800">{selectedAddress}</span>
      </div>
    </button>
  )
}
