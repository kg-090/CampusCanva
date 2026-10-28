import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Campus media',
  className = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <span className="text-xs text-slate-400">Loading...</span>
        </div>
      )}

      {error ? (
        <div className="w-full h-full min-h-[140px] bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-slate-400" />
          <span className="text-xs text-slate-500">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src || fallbackSrc}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          {...props}
        />
      )}
    </div>
  );
};
