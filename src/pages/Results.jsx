import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, ShoppingBag, Zap } from 'lucide-react'
import { TopNav, BottomNav } from '../components/Navigation'
import { useAppStore } from '../store/useAppStore'

export default function Results() {
  const navigate = useNavigate()
  const searchQuery = useAppStore(state => state.searchQuery)
  const [addingId, setAddingId] = useState(null)
  
  // Database mock
  const ALL_ITEMS = [
    { key: 'milk', name: 'Milk 1L', emoji: '🥛', basePrice: 66, trend: 'buy_now' },
    { key: 'eggs', name: 'Farm Eggs 12pk', emoji: '🥚', basePrice: 85, trend: 'wait' },
    { key: 'bread', name: 'Whole Wheat Bread', emoji: '🍞', basePrice: 45, trend: 'stable' },
    { key: 'cheese', name: 'Cheddar Cheese 200g', emoji: '🧀', basePrice: 120, trend: 'buy_now' },
    { key: 'apple', name: 'Kashmir Apples 1kg', emoji: '🍎', basePrice: 180, trend: 'stable' },
    { key: 'banana', name: 'Robusta Bananas 1kg', emoji: '🍌', basePrice: 60, trend: 'wait' },
    { key: 'rice', name: 'Basmati Rice 1kg', emoji: '🍚', basePrice: 150, trend: 'buy_now' },
    { key: 'oil', name: 'Sunflower Oil 1L', emoji: '🛢️', basePrice: 140, trend: 'stable' },
  ]
  
  // Extract items based on keywords matched in searchQuery
  const products = useMemo(() => {
    const q = searchQuery.toLowerCase()
    const matches = ALL_ITEMS.filter(i => q.includes(i.key))
    
    // If no match directly, let's just show top 1 based on whatever was typed
    if (matches.length === 0) {
      return [{
        id: 'item_1',
        name: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1),
        emoji: '📦',
        trend: 'buy_now',
        shops: [
          { name: 'Swiggy', price: 65, isBest: false },
          { name: 'Blinkit', price: 62, isBest: true },
          { name: 'Zepto', price: 68, isBest: false },
        ]
      }]
    }

    return matches.map((item, idx) => {
      // Create price variations
      const offsets = [-4, 2, 5]; // Random offsets to make one "best"
      // Ensure Blinkit or another is visibly best
      const prices = [
        { name: 'Swiggy', price: item.basePrice + 2, isBest: false },
        { name: 'Blinkit', price: item.basePrice - 4, isBest: true },
        { name: 'Zepto', price: item.basePrice + 5, isBest: false },
      ]
      
      return {
        id: `item_${idx}`,
        name: item.name,
        emoji: item.emoji,
        trend: item.trend,
        shops: prices
      }
    })
  }, [searchQuery])

  // Calculate cart total from best prices
  const totalPrice = products.reduce((sum, p) => sum + p.shops.find(s => s.isBest).price, 0)
  const savings = products.reduce((sum, p) => {
    const highest = Math.max(...p.shops.map(s => s.price));
    const lowest = Math.min(...p.shops.map(s => s.price));
    return sum + (highest - lowest);
  }, 0)

  // Stringify item names for the Order History Store
  const compiledOrderItemsArray = products.map(p => ({
    name: `${p.name} ${p.emoji}`,
    quantity: 1
  }))

  const compiledOrderEmojiString = products.map(p => p.emoji).join(' ')

  useEffect(() => {
    // Auto-order after showing results 
    // Spec: "After showing results (2 sec delay): navigate('/ordering')"
    const timer = setTimeout(() => {
      if (!addingId) {
        handleGlobalOrder()
      }
    }, 2500) // 2.5s to let user read
    return () => clearTimeout(timer)
  }, [addingId, products])

  const handleGlobalOrder = () => {
    setAddingId('all')
    useAppStore.setState({ 
      pendingOrder: { 
        id: Math.random().toString(36).substr(2, 9),
        items: compiledOrderItemsArray, 
        emoji: compiledOrderEmojiString,
        totalPrice: totalPrice, 
        date: new Date().toISOString(),
        address: useAppStore.getState().selectedAddress
      } 
    })

    setTimeout(() => {
      navigate('/ordering')
    }, 800)
  }

  const TrendTag = ({ type }) => {
    if (type === 'buy_now') return <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3"/> Buy now</div>
    if (type === 'wait') return <div className="flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full"><TrendingDown className="w-3 h-3"/> Wait</div>
    return <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"><Minus className="w-3 h-3"/> Stable</div>
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 relative pb-20">
      <TopNav title="" showBack={true} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 -mt-2">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-sm-primary to-emerald-800 rounded-3xl p-6 mb-6 shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <Zap className="absolute bottom-[-10px] right-2 w-24 h-24 text-white/10" />
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-emerald-100 mb-1 flex items-center gap-1.5"><Zap className="w-4 h-4"/> AI Insight</h3>
            <p className="text-2xl font-black mb-2 tracking-tight">You save ₹{savings} today.</p>
            <p className="text-sm text-emerald-50 leading-relaxed font-medium">Blinkit offers the cheapest combined cart. We are auto-locking the best deal for you...</p>
          </div>
          
          <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              className="h-full bg-white"
            />
          </div>
        </motion.div>

        <h3 className="font-bold text-slate-800 mb-4 px-1 flex justify-between items-end">
          Best Deals matched
          <span className="text-sm text-sm-primary bg-emerald-50 px-3 py-1 rounded-full">Total: ₹{totalPrice}</span>
        </h3>

        <div className="space-y-4">
          {products.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 flex items-center justify-center text-3xl rounded-2xl">
                    {p.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{p.name}</h4>
                    <div className="mt-1.5"><TrendTag type={p.trend} /></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {p.shops.map((shop, i) => (
                  <div key={i} className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center relative transition-all ${shop.isBest ? 'border-sm-primary bg-emerald-50/50 scale-105 shadow-sm shadow-emerald-500/10 z-10' : 'border-slate-100 bg-slate-50'}`}>
                    {shop.isBest && (
                      <span className="absolute -top-3 bg-sm-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        Best
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-slate-500 mb-0.5">{shop.name}</span>
                    <span className={`text-sm font-black ${shop.isBest ? 'text-sm-primary' : 'text-slate-800'}`}>₹{shop.price}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}
