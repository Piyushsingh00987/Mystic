
// Home: Experience the timeless spirit of India

import React, { useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ParallaxSection from '../ui/ParallaxSection';
import { motion, useScroll, useTransform } from 'framer-motion';
import { textVariant, fadeIn, staggerContainer } from '@/lib/animations';

const Hero: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  // Ensure video autoplay works properly with high priority loading
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.autoplay = true;
      videoRef.current.loop = true;
      videoRef.current.playsInline = true;
      
      // Set the starting time to 18 seconds
      videoRef.current.currentTime = 18;
      
      // Set high priority for this video using a data attribute instead
      videoRef.current.setAttribute('importance', 'high');
      
      // Attempt to play immediately
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Video autoplay failed:", e);
          // Try again after user interaction
          document.body.addEventListener('click', () => {
            if (videoRef.current) {
              videoRef.current.currentTime = 18;
              videoRef.current.play().catch(e => console.error("Video play failed after click:", e));
            }
          }, { once: true });
        });
      }
    }
  }, []);

  return (
    <section id="home" ref={targetRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-10"></div>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source 
            src="https://player.vimeo.com/progressive_redirect/playback/921376317/rendition/1080p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=81fe3100ce7a792e4a2487a6a6a26a72df29adc0cfe19bf09dcae05be11dce97" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Abstract Pattern Overlay */}
      <div className="absolute inset-0 bg-repeat opacity-15 z-[1] mix-blend-soft-light" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/oriental-tiles.png")' }}>
      </div>

      {/* Content */}
      <motion.div 
        style={{ opacity, scale, y }}
        className="container mx-auto px-6 z-10 mt-16 relative"
      >
        <motion.div 
          variants={staggerContainer}
          initial="visible" // Changed from "hidden" to "visible" to skip animation on home page
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p 
            variants={textVariant(0)}  // Reduced delay to 0
            className="subtitle mb-3 text-white"
          >
            Experience the timeless spirit of India
          </motion.p>
          
          <motion.h1 
            variants={textVariant(0)}  // Reduced delay to 0
            className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-tight mb-6 text-white"
          >
            Journey Through India's <span className="text-spice-400">Rich</span> Cultural Heritage
          </motion.h1>
          
          <motion.p 
            variants={textVariant(0)}  // Reduced delay to 0
            className="text-lg text-white/90 mb-8 max-w-2xl"
          >
            Explore the vibrant tapestry of traditions, art forms, and cuisines that make up India's diverse cultural landscape, from ancient temples to living traditions passed down through generations.
          </motion.p>
          
          <motion.div 
            variants={fadeIn("up", 0)}  // Reduced delay to 0
            className="flex flex-wrap gap-4"
          >
            <a href="#states" className="btn-primary flex items-center group">
              Explore States <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#about" className="btn-outline bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors">
              Learn More
            </a>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            variants={staggerContainer}
            initial="visible"  // Changed from "hidden" to "visible" to skip animation on home page
            animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { number: "28+", label: "States" },
              { number: "1000+", label: "Cultural Traditions" },
              { number: "22+", label: "Official Languages" },
              { number: "5000+", label: "Years of History" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeIn("up", 0)}  // Reduced delay to 0
                className="glass-panel p-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-3xl font-medium text-spice-400 mb-1">{stat.number}</h3>
                <p className="text-sm text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 1 }}  // Changed from 0 to 1 to skip animation
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0 }}  // Reduced delay to 0
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-spice-400 mb-2 flex justify-center">
          <motion.div 
            className="w-1.5 h-3 bg-spice-400 rounded-full mt-2"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
        </div>
        <p className="text-xs uppercase tracking-widest text-white/80 font-light">Scroll Down</p>
      </motion.div>
    </section>
  );
};

export default Hero;
