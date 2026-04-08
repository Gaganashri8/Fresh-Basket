import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setGlobalPhone = useAppStore(state => state.setPhoneNumber)

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value
    const numericValue = rawValue.replace(/[^0-9]/g, '')
    setPhone(numericValue)
    
    if (numericValue.length > 0 && numericValue.length < 10) {
      setError('Enter a valid 10-digit phone number')
    } else {
      setError('')
    }
  }

  const handleContinue = () => {
    if (phone.length === 10) {
      setGlobalPhone(phone)
      navigate('/otp')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-center p-6 border-b border-slate-100 bg-sm-background">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sm-primary to-green-500 drop-shadow-sm">StockMind+</h1>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto w-full"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back! 👋</h2>
          <p className="text-slate-500 mb-8">Enter your phone number to login</p>
          
          <div className="mb-6">
            <div className="flex px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-sm-primary focus-within:ring-2 focus-within:ring-sm-primary/20 transition-all">
              <span className="text-slate-500 font-semibold mr-3 border-r border-slate-200 pr-3">+91</span>
              <input
                type="text"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="00000 00000"
                className="bg-transparent border-none outline-none w-full font-semibold text-slate-800"
                autoFocus
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="text-red-500 text-sm mt-2 font-medium"
              >
                {error}
              </motion.p>
            )}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={phone.length !== 10}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all cursor-pointer ${
              phone.length === 10 
                ? 'bg-gradient-to-r from-sm-primary to-sm-secondary hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed hidden'
            }`}
          >
            Continue
          </button>
          {phone.length !== 10 && (
             <button disabled className="w-full py-4 rounded-xl font-bold text-white transition-all bg-slate-300 cursor-not-allowed">
              Continue
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
