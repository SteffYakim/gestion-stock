'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Product {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  min_threshold: number
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) setProducts(data)
    setLoading(false)
  }

  async function updateQuantity(id: string, newQty: number) {
    if (newQty < 0) return
    await supabase.from('products').update({ quantity: newQty }).eq('id', id)
    fetchProducts()
  }

  return (
    
      Gestionnaire de Stock
      {loading ? (
        Chargement...
      ) : (
        
          
              {products.map((p) => (
                
              ))}
            
            
              
                Produit
                SKU
                Prix
                Stock
                Action
              
            
            
                  {p.name}
                  {p.sku}
                  {p.price} €
                  
                    
                      {p.quantity} {p.quantity <= p.min_threshold && '⚠️'}
                    
                  
                  
                     updateQuantity(p.id, p.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    
                     updateQuantity(p.id, p.quantity + 1)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      +
                    
                  
                
          
        
      )}
    
  )
}
