import { create } from 'zustand'

export const useAppStore = create((set) => ({
  isLoggedIn: false,
  appState: 'idle', // idle, loading, showResults, ordering, success, noResults
  searchQuery: '',
  phoneNumber: '',
  cart: [],
  selectedAddress: 'Delivering to Home',
  
  // Initialize with a mock order so "past orders" feature works immediately
  orders: [
    {
      id: "order_mock_1",
      items: [
        { name: "Eggs 🥚", quantity: 12 },
        { name: "Milk 🥛", quantity: 2 }
      ],
      totalPrice: 220,
      date: new Date().toISOString(),
      address: 'Delivering to Home'
      // Store item names as a flat string for easy searching
    }
  ],
  
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, phoneNumber: '', orders: [], cart: [], appState: 'idle' }),
  
  setAppState: (state) => set({ appState: state }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPhoneNumber: (number) => set({ phoneNumber: number }),
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  
  resetApp: () => set({ appState: 'idle', searchQuery: '', cart: [] })
}))
