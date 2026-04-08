import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap } from 'lucide-react'
import { TopNav, BottomNav, AddressBar } from '../components/Navigation'
import { useAppStore } from '../store/useAppStore'

const VALID_KEYWORDS = ["milk", "eggs", "bread", "rice", "oil", "cheese", "apple", "banana"]
const REORDER_KEYWORDS = ["past orders", "previous orders", "my usual", "repeat last order", "repeat order"]

export default function Home() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery, appState, setAppState, orders } = useAppStore()
  const [localInput, setLocalInput] = useState(searchQuery)

  useEffect(() => {
    if (appState !== 'loading') {
      setAppState('idle')
    }
  }, [appState, setAppState])

  const handleSearch = (query) => {
    let trimmedQuery = query.trim().toLowerCase()
    
    // Detect Past Order keywords
    const isReorder = REORDER_KEYWORDS.some(k => trimmedQuery.includes(k))
    
    if (isReorder) {
      if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1]
        // Extract items string, e.g. "milk eggs"
        const pastItemsStr = lastOrder.items.map(item => item.name.replace(/[^a-zA-Z]/g, '').trim().toLowerCase()).join(' ')
        trimmedQuery += ` ${pastItemsStr}` // Combine new items + past order items as requested
      }
    }

    // Check if input is empty after trimming
    if (!trimmedQuery) return

    // Simple validation: includes any keyword from valid list (or is a reorder)
    const isValid = VALID_KEYWORDS.some(k => trimmedQuery.includes(k)) || isReorder
    
    if (!isValid) {
      setAppState('noResults')
      navigate('/no-results')
      return
    }

    setSearchQuery(trimmedQuery)
    setAppState('loading')
    
    setTimeout(() => {
      setAppState('showResults')
      navigate('/results')
    }, 1500)
  }

  const onAnalyseClick = () => handleSearch(localInput)
  
  // Quick Chips only prepopulate and show results. No Auto Order.
  const handleChipClick = (keyword) => {
    setLocalInput(keyword)
    handleSearch(keyword)
  }

  const chips = [
    { label: "Today's best deals ✨", key: "milk eggs" },
    { label: "Cheapest eggs & milk", key: "eggs milk" },
    { label: "My Usual 📦", key: "my usual" }
  ]

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 relative pb-20">
      <TopNav showBack={false} />
      <AddressBar />
      
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sm-primary to-green-400 drop-shadow-sm">Smartest</span> Prices 
          </h2>
          <p className="text-slate-500 font-medium text-sm">Compare across Swiggy, Blinkit & Zepto 🚀</p>
        </motion.div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full bg-white border-2 border-slate-100 text-slate-800 text-sm font-semibold rounded-2xl block pl-11 p-4 shadow-sm focus:border-sm-primary focus:ring-4 focus:ring-sm-primary/10 outline-none transition-all"
            placeholder="Type 'my usual' or 'milk eggs'..."
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAnalyseClick()}
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(chip.key)}
              className="px-4 py-2 bg-white border-2 border-slate-100 shadow-sm rounded-xl text-sm font-bold text-slate-700 hover:border-sm-primary hover:text-sm-primary transition-all active:scale-95 flex items-center gap-1"
            >
              {chip.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={onAnalyseClick}
          disabled={!localInput.trim()}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all ${
            localInput.trim() 
              ? 'bg-gradient-to-r from-sm-primary to-green-500 text-white shadow-emerald-500/30' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed hidden'
          }`}
        >
          <Zap className={`w-5 h-5 ${localInput.trim() ? 'text-yellow-200' : 'text-slate-300'}`} />
          Analyse & Find Best Deal
        </button>
        {!localInput.trim() && (
           <button disabled className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-slate-200 text-slate-400 cursor-not-allowed">
            <Zap className="w-5 h-5 text-slate-300" />
            Analyse & Find Best Deal
          </button>
        )}
      </div>

      <AnimatePresence>
        {appState === 'loading' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col pt-24 px-4"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-sm-primary rounded-full animate-spin mb-6"></div>
              <p className="text-sm font-black text-slate-800 tracking-widest uppercase">Fetching Best Deals</p>
              <p className="text-xs text-slate-500 font-medium mt-2">Checking Swiggy, Blinkit & Zepto 🛒</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  )
}
