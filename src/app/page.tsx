"use client";

import { useState, useRef, ChangeEvent } from "react";
import { applyFloydSteinbergDither } from "@/utils/dither";

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
        drawOriginalImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const drawOriginalImage = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
  };

  const convertToEInk = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsProcessing(true);

    // Use a small timeout to let the UI update (e.g. showing processing state)
    setTimeout(() => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const processedData = applyFloydSteinbergDither(imageData);
      ctx.putImageData(processedData, 0, 0);
      setIsProcessing(false);
    }, 50);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "e-ink-dithered.png";
    link.click();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            E-Ink Image Converter
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Convert your images to 1-bit black and white using Floyd-Steinberg dithering. 100% secure, everything happens in your browser.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              
              {/* Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {imageSrc && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={convertToEInk}
                    disabled={isProcessing}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Convert to E-Ink"}
                  </button>
                  <button
                    onClick={downloadImage}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Download (.png)
                  </button>
                </div>
              )}

              {/* Canvas Preview */}
              <div className="mt-6 flex flex-col items-center overflow-hidden border rounded bg-gray-100 min-h-[300px] justify-center relative">
                {!imageSrc && (
                  <p className="text-gray-400 absolute">No image uploaded</p>
                )}
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto object-contain"
                  style={{ display: imageSrc ? "block" : "none" }}
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
