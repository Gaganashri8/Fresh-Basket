import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function Success() {
  const navigate = useNavigate()
  const selectedAddress = useAppStore(state => state.selectedAddress)

  return (
    <div className="flex flex-col h-screen bg-emerald-50 relative overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-sm-primary/20 to-transparent pointer-events-none"
      />
      
      <div className="flex-1 overflow-y-auto px-5 pt-16 pb-24 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-24 h-24 bg-sm-primary rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/40 mb-6"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-slate-800 mb-3 tracking-tight leading-tight px-4"
          >
            Order placed successfully 🎉
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-emerald-100/80 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-emerald-200"
          >
            <CheckCircle2 className="w-5 h-5 text-sm-primary" /> 
            <span className="text-emerald-800 font-bold text-sm tracking-wide">Paid via UPI (Auto) ✅</span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-dashed border-slate-200">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Arriving By</p>
              <p className="text-3xl font-black text-slate-800 flex items-center gap-2">
                <Clock className="w-7 h-7 text-sm-primary" />
                15 Mins
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>

          <div className="relative pl-7 space-y-7 before:absolute before:inset-y-3 before:left-3 before:w-0.5 before:bg-slate-100">
            
            <div className="relative">
              <div className="absolute -left-[30px] w-5 h-5 bg-sm-primary rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="font-bold text-slate-800 text-lg leading-none mb-1">Preparing your order</p>
              <p className="text-sm text-slate-500 font-medium">Your items are being packed safely.</p>
            </div>
            
            <div className="relative opacity-50">
              <div className="absolute -left-[30px] w-5 h-5 bg-slate-200 rounded-full border-[3px] border-white"></div>
              <p className="font-bold text-slate-600 text-lg leading-none mb-1">Out for delivery</p>
            </div>
            
            <div className="relative opacity-50">
              <div className="absolute -left-[30px] w-5 h-5 bg-slate-200 rounded-full border-[3px] border-white flex items-center justify-center">
                <MapPin className="w-2.5 h-2.5 text-slate-400" />
              </div>
              <p className="font-bold text-slate-600 text-lg leading-none mb-1">Arriving at</p>
              <p className="text-sm text-slate-500 font-medium truncate">{selectedAddress}</p>
            </div>
            
          </div>
        </motion.div>

      </div>

      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 p-4 pb-safe z-50">
        <button
          onClick={() => navigate('/')}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95 transition-transform"
        >
          Track on Map <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  )
}
