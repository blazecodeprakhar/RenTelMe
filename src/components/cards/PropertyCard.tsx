import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, BedDouble, Bath, Car, Users, Utensils, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/contexts/AuthContext";

interface PropertyCardProps {
  id?: string;
  image: string;
  images?: string[];
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: string;
  isVerified?: boolean;
  propertyFor?: string | string[];
  kitchenType?: string;
}

export const PropertyCard = ({
  id,
  image,
  images = [],
  title,
  location,
  price,
  type,
  bedrooms,
  bathrooms,
  parking,
  isVerified = true,
  propertyFor,
  kitchenType,
}: PropertyCardProps) => {
  const { likedProperties, toggleLike } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isLiked = id ? likedProperties.includes(id) : false;

  // Combine cover image with additional images, ensuring unique list
  const allImages = images && images.length > 0 ? images : [image]; // Assuming images[0] is cover if provided, else use image prop
  // If images array is empty or just contains the cover, ensure we have at least the cover
  const displayImages = allImages.length > 0 ? allImages : [image];

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      toggleLike(id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (displayImages.length <= 1) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const percentage = x / width;
    const index = Math.min(
      Math.max(0, Math.floor(percentage * displayImages.length)),
      displayImages.length - 1
    );
    setActiveImageIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveImageIndex(0);
  };

  // Parse Tags
  const tags = Array.isArray(propertyFor)
    ? propertyFor
    : (typeof propertyFor === 'string' ? propertyFor.split(',') : []);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border flex flex-col h-full"
    >
      {/* Image Link with Scrub Interaction */}
      <Link
        to={id ? `/property/${id}` : '#'}
        className="relative aspect-[4/3] overflow-hidden bg-muted block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Skeleton Loader - Only for first load */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-20">
            <ImageIcon className="w-10 h-10 text-gray-400 opacity-50" />
          </div>
        )}

        {/* Stacked Images for Smooth Transitions */}
        {displayImages.map((img, idx) => (
          <img
            key={`${img}-${idx}`}
            src={img}
            alt={`${title} - view ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out ${activeImageIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            onLoad={() => idx === 0 && setIsLoading(false)}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              if (idx === 0) setIsLoading(false);
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />

        {/* Image Indicators (Dots/Bars) */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 left-3 right-3 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            {displayImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/30 backdrop-blur-sm'}`}
              />
            ))}
          </div>
        )}

        {/* Badges - Floating on Top */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20 max-w-[85%]">
          {isVerified && (
            <Badge className="bg-emerald-500/90 text-white font-medium border-0 hover:bg-emerald-600 backdrop-blur-md shadow-sm">
              Verified
            </Badge>
          )}
          {tags.slice(0, 2).map((tag, i) => (
            <Badge key={i} variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-md capitalize shadow-sm">
              {tag.replace(/([A-Z])/g, ' $1').trim()}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-md shadow-sm">+{tags.length - 2}</Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLike(e);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center transition-all z-30 ${isLiked
            ? "bg-red-500 text-white hover:bg-red-600 border-red-500 shadow-lg scale-110"
            : "bg-black/20 text-white hover:bg-white hover:text-red-500"
            }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-5 space-y-4 flex flex-col flex-1">
        <div>
          <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={id ? `/property/${id}` : '#'} className="outline-none">{title}</Link>
          </h3>
          <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Features Minimal */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <BedDouble className="w-3.5 h-3.5 text-primary" />
            <span>{bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <Bath className="w-3.5 h-3.5 text-primary" />
            <span>{bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
            <Utensils className="w-3.5 h-3.5 text-primary" />
            <span className="capitalize">{kitchenType}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-dashed border-border mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">₹{price}</span>
              <span className="text-muted-foreground text-xs font-medium">/mo</span>
            </div>
          </div>
          <Link to={id ? `/property/${id}` : '#'}>
            <Button size="sm" className="rounded-full px-5 bg-navy hover:bg-primary transition-colors text-white font-medium text-xs h-9 shadow-md hover:shadow-lg">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
