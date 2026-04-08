import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { ArrowLeft } from 'lucide-react'

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', ''])
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const login = useAppStore(state => state.login)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (!value) return
    
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)
    
    if (index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleVerify = () => {
    if (otp.every(v => v !== '')) {
      login() // Authenticate user
      navigate('/address')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center p-4 bg-white sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer active:scale-95">
          <ArrowLeft className="w-6 h-6 text-slate-800" />
        </button>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-center -mt-16">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-sm mx-auto w-full text-center"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-sm-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Enter OTP</h2>
          <p className="text-slate-500 mb-8">We've sent a 4-digit code to your phone</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-sm-primary focus:bg-emerald-50 outline-none transition-colors shadow-sm"
              />
            ))}
          </div>
          
          <button
            onClick={handleVerify}
            disabled={!otp.every(v => v !== '')}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all cursor-pointer ${
              otp.every(v => v !== '') 
                ? 'bg-gradient-to-r from-sm-primary to-sm-secondary shadow-lg shadow-emerald-500/30 active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed hidden'
            }`}
          >
            Verify & Proceed
          </button>
          {!otp.every(v => v !== '') && (
             <button disabled className="w-full py-4 rounded-xl font-bold text-white transition-all bg-slate-300 cursor-not-allowed">
              Verify & Proceed
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
