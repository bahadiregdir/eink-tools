"use client";

import { useState, useRef, ChangeEvent } from "react";
import { applyFloydSteinbergDither } from "@/utils/dither";
import Script from "next/script";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "E-Ink Image Converter",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "description": "A free, client-side online tool to convert images to 1-bit black and white format using Floyd-Steinberg dithering for E-Paper displays.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Floyd-Steinberg dithering?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Floyd-Steinberg dithering is an image processing algorithm used to create the illusion of color depth in images with a limited color palette (like 1-bit black and white). It works by pushing the quantization error of a pixel to its neighboring pixels."
            }
          },
          {
            "@type": "Question",
            "name": "Which devices support this?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The resulting 1-bit black and white images are perfect for E-Paper and E-Ink displays, such as Amazon Kindle, reMarkable tablets, Waveshare e-paper modules, and DIY Raspberry Pi/Arduino e-ink projects."
            }
          },
          {
            "@type": "Question",
            "name": "Is my data secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! The conversion happens 100% locally in your web browser using HTML5 Canvas. Your images are never uploaded to any server."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-slate-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl w-full space-y-16">
          
          <header className="text-center space-y-6">
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
              E-Ink Image Converter
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 font-light">
              Convert your images to 1-bit black and white using Floyd-Steinberg dithering. 100% secure, everything happens in your browser.
            </p>
          </header>

          <section className="bg-white shadow-xl shadow-slate-200/50 sm:rounded-3xl border border-slate-100 overflow-hidden" aria-label="Image Converter Tool">
            <div className="px-4 py-8 sm:p-12 space-y-10">
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">
                  Upload Image
                </label>
                <div className="flex justify-center px-6 pt-8 pb-10 border-2 border-slate-200 border-dashed rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors duration-200 group cursor-pointer" onClick={() => document.getElementById("file-upload")?.click()}>
                  <div className="space-y-3 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors duration-200"
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
                    <div className="flex text-sm text-slate-600 justify-center">
                      <span className="relative rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Click to upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          aria-label="Upload an image file"
                        />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {imageSrc && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={convertToEInk}
                    disabled={isProcessing}
                    aria-label="Convert uploaded image to E-Ink format"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors duration-200 cursor-pointer"
                  >
                    {isProcessing ? "Processing..." : "Convert to E-Ink"}
                  </button>
                  <button
                    onClick={downloadImage}
                    aria-label="Download the converted image as PNG"
                    className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 text-base font-medium rounded-xl shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 cursor-pointer"
                  >
                    Download (.png)
                  </button>
                </div>
              )}

              <div className="flex flex-col items-center overflow-hidden border border-slate-200 rounded-2xl bg-slate-50/50 min-h-[300px] justify-center relative shadow-inner">
                {!imageSrc && (
                  <p className="text-slate-400 absolute font-medium">Preview will appear here</p>
                )}
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto object-contain"
                  style={{ display: imageSrc ? "block" : "none" }}
                  aria-label="Image Preview Canvas"
                  role="img"
                />
              </div>

            </div>
          </section>

          <section className="bg-white shadow-sm sm:rounded-3xl p-8 sm:p-12 border border-slate-100" aria-labelledby="how-it-works">
            <h2 id="how-it-works" className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">How It Works</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Our <strong>1-bit BMP dither online</strong> tool allows you to convert standard images into an <strong>image for e-paper displays</strong> completely within your browser. 
              By leveraging HTML5 Canvas, the image is converted to grayscale, and the <strong>Floyd-Steinberg online tool</strong> algorithm distributes pixel quantization errors across adjacent pixels. 
              This results in a highly optimized, high-contrast, black-and-white output perfectly tailored for E-Ink technology. Since everything runs locally, your privacy is 100% guaranteed.
            </p>
          </section>

          <section className="bg-white shadow-sm sm:rounded-3xl p-8 sm:p-12 border border-slate-100" aria-labelledby="faq-section">
            <h2 id="faq-section" className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">What is Floyd-Steinberg dithering?</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Floyd-Steinberg dithering is a popular image processing algorithm used to create the illusion of depth in images with a restricted color palette (like a 1-bit black and white format). It achieves this by taking the quantization error of a pixel and distributing (or "diffusing") it to neighboring pixels.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Which devices support this format?</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  The generated 1-bit black and white images are ideal for virtually all E-Paper and E-Ink displays. This includes devices like Amazon Kindle, reMarkable tablets, Waveshare e-paper modules, and DIY Arduino or Raspberry Pi e-ink projects.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900">Is my data and image secure?</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  Absolutely. We take your privacy seriously. The entire conversion process occurs locally on your machine using your browser&apos;s native capabilities. Your images are never uploaded or stored on any server.
                </p>
              </div>
            </div>
          </section>

        </article>
      </main>
    </>
  );
}
