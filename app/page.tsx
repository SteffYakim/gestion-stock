'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Product {
  id: string
  name: string
  sku: string
  quantity: number
  price: number // Prix en Ariary
  min_threshold: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
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

  // Fonction pour formater le prix au format Ariary (ex: 15 000 Ar)
  const formatAriary = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestionnaire de Stock</h1>
      {loading ? (
        <p>Chargement du stock...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Produit</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Prix Unitaire</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4 text-sm text-gray-500">{p.sku}</td>
                  <td className="p-4 font-semibold text-gray-700">
                    {formatAriary(p.price)}
                  </td>
                  <td className="p-4">
                    <span className={p.quantity <= p.min_threshold ? 'text-red-600 font-bold' : ''}>
                      {p.quantity} {p.quantity <= p.min_threshold && '⚠️ (Stock bas)'}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    <button 
                      onClick={() => updateQuantity(p.id, p.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <button 
                      onClick={() => updateQuantity(p.id, p.quantity + 1)}
                      className="px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
                    >
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
