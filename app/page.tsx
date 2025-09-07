"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import VirtualTryOnModal from "@/components/virtual-try-on"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState("M")
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false)
  const [selectedAccessories, setSelectedAccessories] = useState([])

  const colors = [
    { id: "home", name: "Local - Azul", color: "bg-blue-600", image: "/Camiseta_Local_Universidad_de_Chile_2025_Azul_IV6035_01_laydown.jpg" },
    { id: "away", name: "Visitante - Roja", color: "bg-red-400", image: "/Camiseta_Visita_Universidad_de_Chile_2025_Rojo_IV6036_01_laydown.jpg" },
    { id: "third", name: "Tercera - Amarillo", color: "bg-lime-400", image: "/Tercera_Camiseta_Universidad_de_Chile_Amarillo_KL2132_01_laydown.jpg" },
  ]

  const accessories = [
    { id: "bufanda", name: "Bufanda", price: 14990, image: "/bufanda.png" },
    { id: "jockey", name: "Jockey", price: 32990, image: "/jockey.png" },
    { id: "crossbag", name: "Crossbag", price: 14990, image: "/crossbag.png" },
  ]

  const [selectedColor, setSelectedColor] = useState(colors[0].id)
  const [selectedImage, setSelectedImage] = useState(colors[0].image)
  const [quantity, setQuantity] = useState(1)

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <img src="/logo.png" alt="BullaStore" className="h-34 w-34" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {quantity}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-card shadow-sm">
              <img
                key={selectedImage}
                src={selectedImage}
                alt="Camiseta Universidad de Chile"
                className="h-full w-full object-cover transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(color.image)}
                  className={`aspect-square transform overflow-hidden rounded-md border-2 transition-all duration-200 hover:border-primary hover:scale-105 ${selectedImage === color.image ? "border-primary shadow-lg scale-105" : "border-border"
                    }`}
                >
                  <img
                    src={color.image || "/placeholder.svg"}
                    alt={`Vista ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="default" className="mb-2">
                Oficial
              </Badge>
              <h1 className="text-3xl font-bold text-balance">Camiseta Universidad de Chile 2025</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-yellow-400"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(127 reseñas)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">$57.391</span>
                <span className="text-lg text-muted-foreground line-through">$69.990</span>
                <Badge variant="destructive">-18%</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Envío gratis en pedidos superiores a $50.000</p>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Color: {colors.find((c) => c.id === selectedColor)?.name}</h3>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setSelectedColor(color.id)
                      setSelectedImage(color.image)
                    }}
                    className={`h-12 w-12 rounded-full border-2 border-transparent transition-all duration-200 ${color.color} ${selectedColor === color.id
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:border-primary"
                      }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <h3 className="font-semibold">Talla: {selectedSize}</h3>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200 ${selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Accesorios */}
            <div className="space-y-3">
              <h3 className="font-semibold">Accesorios</h3>
              <ToggleGroup type="multiple" value={selectedAccessories} onValueChange={setSelectedAccessories}>
                {accessories.map((accessory) => (
                  <ToggleGroupItem
                    key={accessory.id}
                    value={accessory.id}
                    className="flex-col size-auto h-24 p-2 gap-1 data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:shadow-md transition-all"
                    aria-label={`Seleccionar ${accessory.name}`}
                  >
                    <img src={accessory.image} alt={accessory.name} className="size-24 object-contain" />
                    <span className="text-xs font-medium">{accessory.name}</span>
                    <span className="text-[10px] text-muted-foreground">${accessory.price.toLocaleString("es-CL")}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-semibold">Cantidad</h3>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button size="lg" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Añadir al carrito
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Heart className="mr-2 h-4 w-4" />
                Añadir a favoritos
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={() => setIsTryOnModalOpen(true)}>
                Prueba Virtual
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4">
              <div className="text-center">
                <Truck className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">Envío gratis</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">Garantía oficial</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-xs text-muted-foreground">30 días devolución</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="mb-4 text-2xl font-bold">Descripción del producto</h2>
                <div className="prose prose-sm max-w-none text-pretty">
                  <p>
                    Con el clásico azul de 'La U', esta camiseta local celebra la pasión y el legado del club. La frase ‘Eres mi vida entera’ destaca en su diseño, reflejando la conexión única entre los hinchas y su equipo. Su diseño moderno avanza hacia el futuro, mientras evoca los valores y tradiciones que unen a todas las generaciones, con detalles de líneas finas y un acabado láser que aporta un toque vanguardista. Con tecnología AEROREADY para máxima comodidad y frescura, es la prenda ideal para llevar el orgullo de la Universidad de Chile en cada momento. Perfecta para los fanáticos que siguen al Bulla con corazón y alma, en cada partido.
                  </p>
                  <h3 className="mb-2 mt-4 font-semibold">Características principales:</h3>
                  <ul className="list-inside list-disc space-y-1">
                    <li>SLIM</li>
                    <li>CUELLO REDONDO</li>
                    <li>Escudo Universidad de Chile</li>
                    <li>AEROREADY</li>
                    <li>Frase: "Eres mi vida entera"</li>
                    <li>Escudo de Club Universidad de Chile tejido</li>
                    <li>Número de artículo: IV6035</li>
                  </ul>
                  <h3 className="mb-2 mt-4 font-semibold">Cuidados:</h3>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Lavar a máquina a 30°C</li>
                    <li>No usar lejía</li>
                    <li>Secar al aire libre</li>
                    <li>Planchar a baja temperatura</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 font-bold">Información de envío</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Envío estándar:</span>
                    <span>3-5 días laborables</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío express:</span>
                    <span>1-2 días laborables</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recogida en tienda:</span>
                    <span>Disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isTryOnModalOpen && (
        <VirtualTryOnModal
          isOpen={isTryOnModalOpen}
          onClose={() => setIsTryOnModalOpen(false)}
          productImage={selectedImage}
          accessories={accessories}
          selectedAccessories={selectedAccessories}
        />
      )}
    </div>
  )
}