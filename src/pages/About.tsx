import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Target, Eye, Heart, Shield, Users, CheckCircle,
  MapPin, Star, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { FeatureCard } from "@/components/cards/FeatureCard";

import teamImage from "@/assets/team-about.jpg";
import neighborhoodImage from "@/assets/neighborhood.jpg";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We verify every listing and provide accurate, honest information to our users."
  },
  {
    icon: Heart,
    title: "Community First",
    description: "We believe a home is about the community, not just four walls."
  },
  {
    icon: Users,
    title: "User-Centric",
    description: "Every feature we build is designed with our users' needs in mind."
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "We continuously improve to provide the best rental experience."
  }
];

const whatSetsUsApart = [
  "Comprehensive neighborhood details beyond just schools and malls",
  "Information on daily essentials like vegetable shops and milk delivery",
  "Details on local services—mechanics, electricians, plumbers, laundry",
  "Fresh food locations—chicken shops, fish markets, local vegetable markets",
  "Transport connectivity—bus stops, railway stations, petrol pumps",
  "All listings verified by our dedicated team"
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-warm overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container-section relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About RenTelMe
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
              A Home is More Than Just <span className="text-primary">Four Walls</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At RenTelMe, we believe a home is the life that surrounds it. We provide you with an in-depth look at your future neighborhood, ensuring you know all the little things that make a big difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={teamImage}
                alt="RenTelMe team"
                className="rounded-2xl shadow-elevated w-full h-[400px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-primary">
                  <Target className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-navy mb-2">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To help you not just find a house, but build a home in a community that fits your needs perfectly. We reimagine how rental listings work by including detailed information about everyday essentials.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-secondary flex items-center justify-center shrink-0">
                  <Eye className="w-7 h-7 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-semibold text-navy mb-2">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To redefine the rental experience by offering transparency, trust, and convenience—right down to the smallest details. Every renter deserves a home that feels just right.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 bg-muted/50">
        <div className="container-section">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                The RenTelMe Difference
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2 mb-6">
                What Sets Us Apart?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We understand that convenience is key when choosing a place to live. That's why we've reimagined how rental listings work by including detailed information about everyday essentials.
              </p>
              <ul className="space-y-4">
                {whatSetsUsApart.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={neighborhoodImage}
                alt="Local neighborhood amenities"
                className="rounded-2xl shadow-elevated w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Promise
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl shadow-soft border border-border text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-primary mx-auto flex items-center justify-center mb-4 shadow-primary">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                Verified Listings
              </h3>
              <p className="text-muted-foreground text-sm">
                Accurate and up-to-date details for every property and amenity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-8 rounded-2xl shadow-soft border border-border text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-secondary mx-auto flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                Seamless Experience
              </h3>
              <p className="text-muted-foreground text-sm">
                Easy-to-navigate platform that puts all the information you need at your fingertips.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card p-8 rounded-2xl shadow-soft border border-border text-center sm:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                Personalized Touch
              </h3>
              <p className="text-muted-foreground text-sm">
                Because every renter deserves a home that feels just right.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-warm">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mt-2">
              What Drives Us Forward
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...value} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary">
        <div className="container-section text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-foreground"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
              Join Us on This Journey
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Make renting stress-free, comfortable, and convenient like never before. Your perfect home is just a search away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-property">
                <Button size="lg" variant="secondary" className="font-medium">
                  Find Your Home
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-medium border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
