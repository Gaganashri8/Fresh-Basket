import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, PackageSearch, CreditCard } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function Ordering() {
  const navigate = useNavigate()
  const { setAppState, pendingOrder, addOrder } = useAppStore()
  const [stage, setStage] = useState(0)
  
  useEffect(() => {
    setAppState('ordering')
    
    // Simulate order pipeline
    const t1 = setTimeout(() => setStage(1), 1000)
    const t2 = setTimeout(() => setStage(2), 2500)
    
    const t3 = setTimeout(() => {
      // Save order
      if (pendingOrder) {
        addOrder(pendingOrder)
        useAppStore.setState({ pendingOrder: null })
      }
      
      setAppState('success')
      navigate('/success', { replace: true })
    }, 4500)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [navigate, setAppState, pendingOrder, addOrder])

  return (
    <div className="flex flex-col h-screen bg-slate-50 items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 z-0 bg-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-100 rounded-full blur-3xl pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-100 rounded-full blur-3xl pointer-events-none"
        ></motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
        
        <div className="w-28 h-28 relative mb-10">
          <svg className="w-full h-full text-slate-100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor"/>
          </svg>
          <motion.svg 
            initial={{ rotate: -90, strokeDashoffset: 283 }}
            animate={{ rotate: 270, strokeDashoffset: 0 }}
            transition={{ duration: 4.5, ease: "linear" }}
            className="w-full h-full text-sm-primary absolute top-0 left-0" 
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" strokeDasharray="283"/>
          </motion.svg>
          
          <div className="absolute inset-0 flex items-center justify-center text-sm-primary">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {stage < 2 ? <PackageSearch className="w-10 h-10" /> : <CreditCard className="w-10 h-10" />}
            </motion.div>
          </div>
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">
          {stage < 2 ? "Order in progress..." : "Processing Payment..."}
        </h2>
        
        <div className="space-y-5 w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className={`flex items-center gap-4 transition-all duration-500 ${stage >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stage > 0 ? <CheckCircle2 className="w-6 h-6 text-sm-primary" /> : <div className="w-6 h-6 border-2 border-slate-200 border-t-sm-primary rounded-full animate-spin"></div>}
            <span className={`font-bold text-sm ${stage > 0 ? 'text-slate-800' : 'text-slate-500'}`}>Connecting to delivery partner</span>
          </div>
          
          <div className={`flex items-center gap-4 transition-all duration-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {stage > 1 ? <CheckCircle2 className="w-6 h-6 text-sm-primary" /> : (stage === 1 ? <div className="w-6 h-6 border-2 border-slate-200 border-t-sm-primary rounded-full animate-spin"></div> : <div className="w-6 h-6 rounded-full border-2 border-slate-100"></div>)}
            <span className={`font-bold text-sm ${stage > 1 ? 'text-slate-800' : (stage === 1 ? 'text-slate-600' : 'text-slate-400')}`}>Reserving items</span>
          </div>

          <div className={`flex items-center gap-4 transition-all duration-500 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="w-6 h-6 border-2 border-slate-200 border-t-sm-primary rounded-full animate-spin"></div>
            <span className="font-bold text-sm text-slate-800 flex flex-col">
              Processing UPI payment...
              <span className="text-[10px] text-slate-400 font-medium">Automatic • No action needed</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
