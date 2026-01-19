import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Shield, Home, Building2, Users,
  Carrot, Wrench, Fuel, Bus, ShoppingBag, CheckCircle,
  ArrowRight, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { AmenityCard } from "@/components/cards/AmenityCard";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { Layout } from "@/components/layout/Layout";

import heroImage from "@/assets/hero-home.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import neighborhoodImage from "@/assets/neighborhood.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const featuredProperties = [
  {
    image: property1,
    title: "Modern Family Villa",
    location: "Koramangala, Bangalore",
    price: "35,000",
    type: "Villa",
    bedrooms: 3,
    bathrooms: 2,
    parking: "Car + Bike",
    propertyFor: "For Families"
  },
  {
    image: property2,
    title: "Cozy Studio Apartment",
    location: "Andheri West, Mumbai",
    price: "18,000",
    type: "Apartment",
    bedrooms: 1,
    bathrooms: 1,
    parking: "Bike",
    propertyFor: "For Students"
  },
  {
    image: property3,
    title: "Spacious 3BHK Flat",
    location: "Salt Lake, Kolkata",
    price: "28,000",
    type: "Flat",
    bedrooms: 3,
    bathrooms: 2,
    parking: "Car + Bike",
    propertyFor: "For Families"
  }
];

const amenities = [
  {
    icon: Carrot,
    title: "Daily Essentials",
    description: "Everything you need for everyday life",
    items: ["Vegetable Shops", "Milk Delivery", "Newspaper Vendors"],
    color: "primary" as const
  },
  {
    icon: Wrench,
    title: "Services",
    description: "Reliable services at your fingertips",
    items: ["Mechanics", "Electricians", "Plumbers", "Laundry"],
    color: "secondary" as const
  },
  {
    icon: ShoppingBag,
    title: "Fresh Food",
    description: "Quality groceries nearby",
    items: ["Chicken-Mutton Shops", "Fish Markets", "Local Markets"],
    color: "primary" as const
  },
  {
    icon: Bus,
    title: "Connectivity",
    description: "Stay connected with transport",
    items: ["Bus Stops", "Railway Stations", "Petrol Pumps"],
    color: "secondary" as const
  }
];

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description: "Every property is verified by our team for accuracy and authenticity"
  },
  {
    icon: MapPin,
    title: "Local Insights",
    description: "Complete neighborhood information from shops to services"
  },
  {
    icon: Users,
    title: "Live Like a Local",
    description: "Understand your new neighborhood before you move in"
  },
  {
    icon: CheckCircle,
    title: "Hassle-Free",
    description: "Simplified renting process with all information at your fingertips"
  }
];

const testimonials = [
  {
    content: "RenTelMe helped me find not just a house, but a complete neighborhood that fits my lifestyle. The local insights were incredibly helpful!",
    author: "Priya Sharma",
    role: "Working Professional",
    rating: 5
  },
  {
    content: "As a student moving to a new city, knowing about nearby services and shops made settling in so much easier. Highly recommend!",
    author: "Rahul Verma",
    role: "Engineering Student",
    rating: 5
  },
  {
    content: "Finally, a platform that understands renting is about more than just the property. The verified listings gave us peace of mind.",
    author: "Meera & Arun",
    role: "Young Family",
    rating: 5
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section - Luxury & Immersive */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Luxury home interior"
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        <div className="container-section relative z-10 pt-20 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-5 py-2 rounded-full glass-card text-primary text-sm font-semibold tracking-widest uppercase mb-8 backdrop-blur-md border-white/30">
              Elevated Living Awaits
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] mb-8 drop-shadow-2xl">
              Find Your <span className="text-secondary italic font-light">Sanctuary</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 leading-relaxed font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
              Discover verified homes with complete neighborhood insights.
              We curate the lifestyle, not just the listing.
            </p>

            {/* Immersive Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-white/20 shadow-2xl max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/60" />
                  <Input
                    placeholder="Search by city, neighborhood, or landmark..."
                    className="pl-12 h-14 border-none text-lg bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/70 text-foreground w-full"
                  />
                </div>
                <div className="hidden sm:block w-px h-10 bg-border" />
                <Button size="lg" className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg w-full sm:w-auto hover:scale-105 transition-transform">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {["Family Villas", "Student Housing", "Commercial", "Luxury Apartments"].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 text-sm rounded-full bg-black/20 text-white/90 border border-white/10 hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 mt-16 max-w-4xl mx-auto"
            >
              {[
                { value: "500+", label: "Premium Listings" },
                { value: "50+", label: "Curated Cities" },
                { value: "2k+", label: "Happy Residents" },
                { value: "24/7", label: "Support" }
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 rounded-xl hover:bg-white/5 transition-colors">
                  <p className="text-3xl md:text-4xl font-bold text-white mb-1 font-serif">{stat.value}</p>
                  <p className="text-sm text-white/70 uppercase tracking-widest font-medium">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-gradient-warm">
        <div className="container-section">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
              Why Choose Us
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">
              What Makes Us Different?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              Unlike other platforms that stop at schools and malls, we go the extra mile to ensure you know everything about your new neighborhood.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Beyond The Basics
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">
                Amenities That Matter to You
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Finding a new home isn't just about the property—it's about the life around it. We make sure you know all the details that matter most for your day-to-day convenience.
              </p>
              <img
                src={neighborhoodImage}
                alt="Local neighborhood"
                className="rounded-2xl shadow-medium w-full h-64 object-cover"
              />
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 gap-6"
            >
              {amenities.map((amenity, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <AmenityCard {...amenity} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-muted/50">
        <div className="container-section">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          >
            <div>
              <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
                Featured Listings
              </motion.span>
              <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2">
                Discover Your Perfect Home
              </motion.h2>
            </div>
            <motion.div variants={fadeInUp}>
              <Link to="/find-property">
                <Button variant="outline" className="mt-4 md:mt-0">
                  View All Properties
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredProperties.map((property, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary-foreground transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container-section relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary-foreground"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
                Have a Property to Rent?
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                List your property with RenTelMe and reach thousands of verified renters. Our team ensures your listing is accurate and reaches the right audience.
              </p>
              <Link to="/list-property">
                <Button size="lg" variant="secondary" className="font-medium">
                  List Your Property
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary-foreground"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
                Looking for a Rental?
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-6">
                Discover homes with complete neighborhood insights. Know everything about your new area before you move in—from shops to services.
              </p>
              <Link to="/find-property">
                <Button size="lg" variant="secondary" className="font-medium">
                  Find Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container-section">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span variants={fadeInUp} className="text-primary font-medium text-sm uppercase tracking-wider">
              Testimonials
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2">
              What Our Users Say
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-accent">
        <div className="container-section text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of happy renters who found their ideal home with complete neighborhood insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-property">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
                  Start Your Search
                  <Search className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
