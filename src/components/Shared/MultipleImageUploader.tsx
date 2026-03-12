import { useEffect, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { imageUrl } from "../../redux/base/baseAPI"


interface MultipleImageUploaderProps {
    files: File[]
    onChange: (files: File[]) => void
    onRemove: (index: number) => void
    existingImages?: string[]
    title?: string
    loading?: boolean
    width?: number | string
    height?: number | string
    maxImages?: number
}

export function MultipleImageUploader({
    files,
    onChange,
    onRemove,
    existingImages = [],
    title = "Images",
    loading = false,
    width = "100%",
    height = 250,
    maxImages = 10,
}: MultipleImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>([])

    useEffect(() => {
        if (!files.length) {
            setPreviews([])
            return
        }

        const readers = files.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result as string)
                reader.readAsDataURL(file)
            })
        })

        Promise.all(readers).then(setPreviews)
    }, [files])

    const handleFilesAdd = (newFiles: FileList | null) => {
        if (!newFiles) return

        const validImages = Array.from(newFiles).filter((file) =>
            file.type.startsWith("image/")
        )

        const combined = [...files, ...validImages].slice(0, maxImages)
        onChange(combined)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        handleFilesAdd(e.dataTransfer.files)
    }

    const totalImages = previews.length + existingImages.length

    return (
        <div className="space-y-2" style={{ width }}>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>

            <div className="flex flex-wrap gap-4">
                {/* LEFT: Image Grid (only when images exist) */}
                {totalImages > 0 && (
                    <div
                        className={cn(
                            "grid gap-3",
                            totalImages === 1 && "grid-cols-1",
                            totalImages === 2 && "grid-cols-2",
                            totalImages >= 3 && "grid-cols-3"
                        )}
                    >
                        {/* Existing Images */}
                        {existingImages.map((img, index) => (
                            <div
                                key={`existing-${index}`}
                                className="relative overflow-hidden rounded-lg border"
                                style={{ height }}
                            >
                                <img
                                    src={imageUrl + img}
                                    className="h-full w-full object-cover"
                                    alt="existing"
                                />

                                <Button
                                 type="button"  
                                    size="icon"                                    
                                    className="absolute right-1 top-1 h-6 w-6"
                                    onClick={() => onRemove(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        {/* New Images */}
                        {previews.map((preview, index) => {
                            const actualIndex = existingImages.length + index

                            return (
                                <div
                                    key={preview}
                                    className="relative overflow-hidden rounded-lg border"
                                    style={{ height }}
                                >
                                    <img
                                        src={preview}
                                        className="h-full w-full object-cover"
                                        alt="preview"
                                    />

                                    <Button
                                     type="button"  
                                        size="icon"                                        
                                        className="absolute right-1 top-1 h-6 w-6 bg-red-600!"
                                        onClick={() => onRemove(actualIndex)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* RIGHT: Upload Box (always visible until maxImages) */}
                {totalImages < maxImages && (
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className={cn(
                            "flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-4 transition",
                            loading && "pointer-events-none opacity-70"
                        )}
                        style={{
                            height,
                            minWidth: 200,
                        }}
                    >
                        <div className="flex flex-col items-center gap-2 text-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Drag & drop images here
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Max {maxImages} images
                            </p>

                            <Button variant="outline" size="sm" asChild>
                                <label className="cursor-pointer">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Choose Images
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => handleFilesAdd(e.target.files)}
                                    />
                                </label>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}
