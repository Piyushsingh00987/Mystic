
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseImageLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  immediate?: boolean;
  priority?: boolean;
}

const useImageLazyLoad = (
  src: string, 
  placeholderSrc: string = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E",
  options: UseImageLazyLoadOptions = {}
) => {
  const [imageSrc, setImageSrc] = useState(options.priority ? src : placeholderSrc);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(options.priority || false);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // If on home page or immediate option is true, skip lazy loading
  const skipLazyLoad = isHomePage || options.immediate === true || options.priority === true;

  const { threshold = 0.1, rootMargin = '200px' } = options;

  const onLoad = useCallback((e?: React.SyntheticEvent<HTMLImageElement>) => {
    if (isMounted.current) {
      setIsLoaded(true);
    }
  }, []);

  const onError = useCallback((e?: React.SyntheticEvent<HTMLImageElement>) => {
    if (isMounted.current) {
      setIsLoaded(false);
      setHasError(true);
      setImageSrc(placeholderSrc);
      console.error("Failed to load image:", src);
    }
  }, [placeholderSrc, src]);

  // Immediately load priority images or on home page
  useEffect(() => {
    if (skipLazyLoad && !isLoaded && !hasError) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (isMounted.current) {
          setImageSrc(src);
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (isMounted.current) {
          onError();
        }
      };
    }
  }, [skipLazyLoad, src, isLoaded, hasError, onError]);

  // Handle fallback strategy for failed images
  useEffect(() => {
    if (hasError && src.includes('unsplash')) {
      // If an Unsplash image fails, try a different source
      const fallbackSrc = src.replace(
        /unsplash\.com\/.*/, 
        `picsum.photos/${Math.floor(800 + Math.random() * 400)}/${Math.floor(600 + Math.random() * 200)}`
      );
      
      // Create an image element to preload the fallback
      const img = new Image();
      img.src = fallbackSrc;
      img.onload = () => {
        if (isMounted.current) {
          setImageSrc(fallbackSrc);
          setHasError(false);
        }
      };
    }
  }, [hasError, src]);

  useEffect(() => {
    let didCancel = false;

    // Skip intersection observer for home page content and priority images
    if (skipLazyLoad) {
      return;
    }

    if (imageRef && !isLoaded) {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if ('IntersectionObserver' in window) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // When image is visible in the viewport
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                // Create new image to preload
                const img = new Image();
                img.src = src;
                img.onload = () => {
                  if (!didCancel) {
                    setImageSrc(src);
                  }
                };
                
                // Fix for type mismatch - use proper event type
                img.onerror = () => {
                  if (!didCancel) {
                    onError();
                  }
                };
                
                // Stop watching once the entry is detected
                if (observerRef.current && imageRef) {
                  observerRef.current.unobserve(imageRef);
                }
              }
            });
          },
          {
            threshold,
            rootMargin, // Increased to start loading earlier
          }
        );
        observerRef.current.observe(imageRef);
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        setImageSrc(src);
      }
    }

    return () => {
      didCancel = true;
      if (observerRef.current && imageRef) {
        observerRef.current.unobserve(imageRef);
        observerRef.current.disconnect();
      }
    };
  }, [src, imageRef, isLoaded, threshold, rootMargin, onError, skipLazyLoad]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { imageSrc, setImageRef, isLoaded, onLoad, onError };
};

export default useImageLazyLoad;
