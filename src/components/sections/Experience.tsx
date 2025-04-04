
import React, { memo } from 'react';
import { Calendar, Map, Star, ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import ScrollReveal from '../ui/ScrollReveal';
import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeProvider';
import { Link } from 'react-router-dom';
import { journeys } from '@/data/journeys';
import HorizontalScroll from '../ui/horizontal-scroll';
import useMobile from '@/hooks/use-mobile';

// Extract card component and memoize it for better performance
const JourneyCard = memo(({ journey, theme, starColor, textAccentColor }: { 
  journey: any; 
  theme: string;
  starColor: string;
  textAccentColor: string;
}) => {
  return (
    <motion.div 
      className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'experience-card' : 'bg-white'} h-full flex flex-col card-hover`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="relative h-52 overflow-hidden">
        <img 
          src={journey.imageSrc} 
          alt={journey.title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white/80 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Star size={14} className={`mr-1`} fill={starColor} stroke={starColor} />
            {journey.rating}
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-semibold mb-3">{journey.title}</h3>
        
        <p className="text-foreground/80 mb-4">{journey.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-4 text-sm mt-auto">
          <div className="flex items-center text-foreground/70">
            <Calendar size={16} className="mr-1" />
            {journey.duration}
          </div>
          <div className="flex items-center text-foreground/70">
            <Map size={16} className="mr-1" />
            {journey.location}
          </div>
        </div>
        
        <motion.div>
          <Link 
            to={`/journey/${journey.id}`}
            className={`inline-flex items-center font-medium transition-colors mt-2`}
            style={{ color: textAccentColor }}
          >
            <motion.span
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex items-center"
            >
              View Details <ArrowRight size={16} className="ml-1" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
});

JourneyCard.displayName = 'JourneyCard';

const Experience: React.FC = () => {
  const { theme } = useTheme();
  const isMobile = useMobile();
  
  const starColor = theme === 'dark' ? "#e94cff" : "#ff7e11";
  const textAccentColor = theme === 'dark' ? "#53a6ff" : "#ff7e11";

  return (
    <section id="experience" className={`relative py-24 px-6 section-experience`}>
      <div className="absolute inset-12 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/30 z-0"></div>
      <div className="container mx-auto">
        {/* Section Header */}
        <SectionHeader
          subtitle="Curated Experiences"
          title="Our Signature Journeys"
          description="Immerse yourself in handcrafted experiences that blend cultural immersion, natural wonders, and authentic encounters with local communities."
        />

        {/* Experiences Cards */}
        {isMobile ? (
          <div className="mt-12">
            <HorizontalScroll>
              {journeys.map((journey) => (
                <div key={journey.id} className="min-w-[90%] snap-start">
                  <JourneyCard 
                    journey={journey} 
                    theme={theme} 
                    starColor={starColor} 
                    textAccentColor={textAccentColor} 
                  />
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {journeys.map((journey, index) => (
              <ScrollReveal key={journey.id} delay={index * 0.1}>
                <JourneyCard 
                  journey={journey} 
                  theme={theme} 
                  starColor={starColor} 
                  textAccentColor={textAccentColor} 
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* CTA */}
        <ScrollReveal className="mt-16">
          <div className="text-center">
            <motion.a 
              href="#contact" 
              className="btn-primary inline-flex items-center px-6 py-3 rounded-md font-medium"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              whileTap={{ y: 0 }}
            >
              Plan Your Journey 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowRight size={16} className="ml-2" />
              </motion.span>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Experience;
