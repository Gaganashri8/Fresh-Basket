import { useNavigate } from 'react-router-dom'
import { Frown } from 'lucide-react'
import { TopNav, BottomNav } from '../components/Navigation'

export default function NoResults() {
  const navigate = useNavigate()

  const handleChipClick = (keyword) => {
    // Navigate home, the user can select it again or we can prefill
    // But per spec: "Try again button -> back to Home"
    // For chips, let's just send them to home to restart
    navigate('/')
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <TopNav title="" showBack={true} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center -mt-10">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Frown className="w-12 h-12 text-slate-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">We couldn't find matching items 🥲</h2>
        <p className="text-slate-500 mb-8">Try searching for some of our popular categories.</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10 w-full max-w-xs">
          {['Milk', 'Eggs', 'Bread', 'Apple'].map((item) => (
            <button
              key={item}
              onClick={() => handleChipClick(item)}
              className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-full font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
            >
              {item}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-xs py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
        >
          Try again
        </button>
      </div>
      
      <BottomNav />
    </div>
  )
}
