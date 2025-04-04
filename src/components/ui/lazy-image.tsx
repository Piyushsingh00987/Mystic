
import React, { memo, useState, useEffect } from 'react';
import useImageLazyLoad from '@/hooks/useImageLazyLoad';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  rootMargin?: string;
  loadingClassName?: string;
  immediate?: boolean;
  priority?: boolean; // For critical images like hero section
}

const LazyImage = memo(({
  src,
  alt,
  placeholderSrc,
  className,
  rootMargin = '150px',
  loadingClassName,
  immediate,
  priority = false,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Skip lazy loading animation on home page or when immediate prop is true
  const skipLazyEffects = isHomePage || immediate === true || priority === true;
  
  const { imageSrc, setImageRef, onLoad, onError } = useImageLazyLoad(
    src,
    placeholderSrc,
    { 
      rootMargin, 
      immediate: skipLazyEffects,
      priority 
    }
  );

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad(e);
    if (props.onLoad) props.onLoad(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    onError(e);
    if (props.onError) props.onError(e);
  };

  useEffect(() => {
    // If we're on home page or priority image, set as loaded immediately
    if (skipLazyEffects) {
      setIsLoaded(true);
    }
  }, [skipLazyEffects]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={setImageRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "will-change-transform transition-opacity duration-300", 
          !isLoaded && !skipLazyEffects && "opacity-0 blur-[2px]",
          isLoaded && "opacity-100",
          className
        )}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...props}
      />
      {!isLoaded && !skipLazyEffects && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-gray-100/30 dark:bg-gray-800/30 backdrop-blur-sm",
          loadingClassName
        )}>
          <div className="h-6 w-6 border-2 border-spice-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
