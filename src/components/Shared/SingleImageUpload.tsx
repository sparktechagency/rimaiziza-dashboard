import { useEffect, useState } from "react"
import { ImageIcon, Upload, X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { imageUrl } from "../../redux/base/baseAPI"


interface SingleImageUploadProps {
  file: File | null
  onChange: (file: File | null) => void
  onRemove: () => void
  existingImage?: string
  title?: string
  loading?: boolean
  width?: number | string
  height?: number | string
  cover?: boolean
}

export function SingleImageUpload({
  file,
  onChange,
  onRemove,
  existingImage,
  title = "Product Image",
  loading = false,
  width = "100%",
  height = 250,
  cover = false
}: SingleImageUploadProps) {
  const [preview, setPreview] = useState<string>("")

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview("")
    }
  }, [file])

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      onChange(droppedFile)
    }
  }

  const displayImage = preview || existingImage
  const hasImage = !!displayImage

  return (
    <div className="space-y-2" style={{ width }}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 transition hover:bg-muted",
          loading && "pointer-events-none opacity-70"
        )}
        style={{ height }}
      >
        {hasImage ? (
          <>
            <img
              src={displayImage}
              alt={title}
              className={`h-full w-full rounded-lg ${cover ? "object-cover" :  "object-contain" } p-2`}
            />

            <Button
              size="icon"              
              onClick={() => {
                onChange(null)
                onRemove()
              }}
              className="absolute bg-red-600! right-2 top-2 h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop image here
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, GIF, WebP supported
            </p>

            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                />
              </label>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
