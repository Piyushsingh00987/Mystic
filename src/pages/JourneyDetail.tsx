
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Calendar, Map, Navigation, Star, ArrowLeft, Clock, Activity, Route } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import JourneyTimeline from '@/components/journey/JourneyTimeline';
import JourneyActivities from '@/components/journey/JourneyActivities';
import CabBooking from '@/components/journey/CabBooking';
import { getJourneyById } from '@/data/journeys';

const JourneyDetail = () => {
  const { journeyId } = useParams<{ journeyId: string }>();
  const [journey, setJourney] = useState<any | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Find the journey data based on journeyId
    if (journeyId) {
      const currentJourney = getJourneyById(parseInt(journeyId));
      setJourney(currentJourney || null);
    }
  }, [journeyId]);

  if (!journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium mb-4">Journey not found</h2>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[60vh]">
          <div 
            className="absolute inset-0 bg-center bg-cover" 
            style={{ backgroundImage: `url(${journey.imageSrc})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="container mx-auto h-full relative z-10 flex flex-col justify-end pb-16 px-6">
            <Link 
              to="/" 
              className="absolute top-8 left-6 text-white flex items-center hover:underline"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Home
            </Link>
            <ScrollReveal>
              <h1 className="text-white text-5xl md:text-6xl font-serif mb-4">{journey.title}</h1>
              <div className="flex flex-wrap gap-6 text-white">
                <div className="flex items-center">
                  <Map size={18} className="mr-2" />
                  <span>Location: {journey.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span>Duration: {journey.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star size={18} className="mr-2" fill="#FFD700" stroke="#FFD700" />
                  <span>Rating: {journey.rating}/5</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto border border-white/20 dark:border-white/10 backdrop-blur-md rounded-lg p-6 bg-white/30 dark:bg-white/10">
                <h2 className="section-title after:left-0 mb-8">Journey Overview</h2>
                <p className="text-lg leading-relaxed mb-8">
                  {journey.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                  <div className="bg-white/40 dark:bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Clock className="text-spice-500 mb-2" size={24} />
                    <h3 className="font-medium mb-2">Duration</h3>
                    <p className="text-foreground/70">{journey.duration}</p>
                  </div>
                  <div className="bg-white/40 dark:bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Route className="text-spice-500 mb-2" size={24} />
                    <h3 className="font-medium mb-2">Destinations</h3>
                    <p className="text-foreground/70">{journey.location}</p>
                  </div>
                  <div className="bg-white/40 dark:bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <Activity className="text-spice-500 mb-2" size={24} />
                    <h3 className="font-medium mb-2">Activities</h3>
                    <p className="text-foreground/70">{journey.activities?.length || 0} activities included</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="py-16 px-6 bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-lg">
          <div className="container mx-auto">
            <ScrollReveal>
              <Tabs defaultValue="timeline" className="max-w-4xl mx-auto">
                <TabsList className="w-full flex mb-8 bg-transparent p-0 space-x-2 overflow-x-auto">
                  <TabsTrigger 
                    value="timeline"
                    className="px-6 py-3 data-[state=active]:bg-spice-50 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-spice-600 dark:data-[state=active]:text-spice-400 data-[state=active]:border-b-2 data-[state=active]:border-spice-500 data-[state=active]:shadow-none rounded-full"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activities"
                    className="px-6 py-3 data-[state=active]:bg-spice-50 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-spice-600 dark:data-[state=active]:text-spice-400 data-[state=active]:border-b-2 data-[state=active]:border-spice-500 data-[state=active]:shadow-none rounded-full"
                  >
                    Activities
                  </TabsTrigger>
                  <TabsTrigger 
                    value="booking"
                    className="px-6 py-3 data-[state=active]:bg-spice-50 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-spice-600 dark:data-[state=active]:text-spice-400 data-[state=active]:border-b-2 data-[state=active]:border-spice-500 data-[state=active]:shadow-none rounded-full"
                  >
                    Book a Cab
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="timeline" className="mt-0">
                  <div className="bg-background dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Journey Timeline</h3>
                    <JourneyTimeline journey={journey} />
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="mt-0">
                  <div className="bg-background dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Activities & Experiences</h3>
                    <JourneyActivities journey={journey} />
                  </div>
                </TabsContent>

                <TabsContent value="booking" className="mt-0">
                  <div className="bg-background dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium mb-4">Book a Cab for Your Journey</h3>
                    <CabBooking journey={journey} />
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JourneyDetail;
