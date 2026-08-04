export function applyFloydSteinbergDither(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  
  // Convert to grayscale and copy to avoid modifying original immediately
  // But wait, Floyd-Steinberg needs to modify the pixel values including neighbors.
  // We'll work directly on the data array (clamped Uint8ClampedArray).
  // Note: We need a temporary float array to handle error diffusion properly since Uint8ClampedArray clips values between 0-255.
  
  const buffer = new Float32Array(width * height);
  
  // Initialize buffer with grayscale values
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      // standard grayscale conversion
      const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
      buffer[y * width + x] = gray;
    }
  }

  // Apply Floyd-Steinberg
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const oldPixel = buffer[idx];
      const newPixel = oldPixel < 128 ? 0 : 255;
      buffer[idx] = newPixel;
      
      const quantError = oldPixel - newPixel;
      
      // Right
      if (x + 1 < width) {
        buffer[y * width + (x + 1)] += quantError * (7 / 16);
      }
      // Bottom Left
      if (y + 1 < height && x - 1 >= 0) {
        buffer[(y + 1) * width + (x - 1)] += quantError * (3 / 16);
      }
      // Bottom
      if (y + 1 < height) {
        buffer[(y + 1) * width + x] += quantError * (5 / 16);
      }
      // Bottom Right
      if (y + 1 < height && x + 1 < width) {
        buffer[(y + 1) * width + (x + 1)] += quantError * (1 / 16);
      }
    }
  }

  // Write back to image data
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const val = buffer[y * width + x];
      // Clamped implicitly by Uint8ClampedArray but safe to just assign
      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255; // Keep alpha fully opaque
    }
  }
  
  return imageData;
}
