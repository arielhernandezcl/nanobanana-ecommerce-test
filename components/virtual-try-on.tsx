"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function VirtualTryOnModal({ isOpen, onClose, productImage, accessories, selectedAccessories }) {
    const [userImage, setUserImage] = useState(null)
    const [generatedImage, setGeneratedImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setUserImage(URL.createObjectURL(file))
            setGeneratedImage(null)
            setError(null)
        }
    }

    const handleTryOn = async () => {
        if (!userImage) {
            setError("Por favor, sube una imagen tuya para comenzar.")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const userImageBlob = await fetch(userImage).then(res => res.blob());
            const userImageBase64 = await toBase64(userImageBlob);

            const productImageBlob = await fetch(productImage).then(res => res.blob());
            const productImageBase64 = await toBase64(productImageBlob);
            const productImageMimeType = productImageBlob.type;

            if (productImageMimeType === 'image/avif') {
                setError("El formato de imagen AVIF no es compatible con la API de Gemini. Por favor, usa una imagen en formato JPG o PNG.");
                setIsLoading(false);
                return;
            }

            const selectedAccessoryImages = accessories
                .filter(accessory => selectedAccessories.includes(accessory.id))
                .map(accessory => ({ url: accessory.image }));

            const accessoryPromises = selectedAccessoryImages.map(async (acc) => {
                const accBlob = await fetch(acc.url).then(res => res.blob());
                const accBase64 = await toBase64(accBlob);
                return {
                    data: accBase64.split(',')[1],
                    mimeType: accBlob.type
                };
            });
            const accessoriesData = await Promise.all(accessoryPromises);

            const response = await fetch("/api/try-on", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userImage: userImageBase64.split(',')[1],
                    productImage: productImageBase64.split(',')[1],
                    productImageMimeType: productImageMimeType,
                    accessories: accessoriesData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ocurrió un error al generar la imagen.");
            }

            const data = await response.json();
            setGeneratedImage(data.imageUrl);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl md:max-w-7xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Prueba Virtual Nano Banana</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Sube una foto tuya y prueba esta camiseta virtualmente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="picture">Tu foto</Label>
                            <Input id="picture" type="file" onChange={handleFileChange} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Tu imagen</p>
                                <div className="rounded-lg border p-2 shadow-sm">
                                    <img src={userImage || "/placeholder-user.jpg"} alt="Tu foto" className="rounded-md w-full h-auto object-contain max-h-60" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-2">Prenda seleccionada</p>
                                <div className="rounded-lg border p-2 shadow-sm">
                                    <img src={productImage} alt="Camiseta" className="rounded-md w-full h-auto object-contain max-h-60" />
                                </div>
                            </div>
                        </div>

                        {selectedAccessories.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-center md:text-left">Accesorios seleccionados</h3>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {accessories.filter(acc => selectedAccessories.includes(acc.id)).map(acc => (
                                        <div key={acc.id} className="flex flex-col items-center gap-1">
                                            <img src={acc.image} alt={acc.name} className="size-22 object-contain" />
                                            <span className="text-xs font-medium">{acc.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button
                            onClick={handleTryOn}
                            disabled={!userImage || isLoading}
                            className="w-full md:w-auto px-10 h-12 text-lg font-semibold"
                        >
                            {isLoading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                            {isLoading ? "Generando..." : "Generar Prueba Virtual"}
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
                        {generatedImage && (
                            <div className="text-center w-full">
                                <h3 className="text-xl font-bold mb-4">Así te vas a ver</h3>
                                <div className="rounded-lg border shadow-lg p-4">
                                    <img src={generatedImage} alt="Prueba virtual" className="rounded-md w-full h-auto" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}