import { Heart, MapPin, BedDouble, Bath, Car, Users, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: string;
  isVerified?: boolean;
  propertyFor?: string;
  kitchenType?: string;
}

export const PropertyCard = ({
  image,
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
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isVerified && (
            <Badge className="bg-secondary text-secondary-foreground font-medium">
              Verified
            </Badge>
          )}
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
            {type}
          </Badge>
        </div>

        {/* Favorite Button */}
        <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-foreground line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bedrooms && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{bedrooms} Beds</span>
            </div>
          )}
          {bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{bathrooms} Bath</span>
            </div>
          )}
          {parking && (
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4" />
              <span>{parking}</span>
            </div>
          )}
          {kitchenType && (
            <div className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4" />
              <span className="capitalize">{kitchenType === 'both' ? 'Both Veg/Non-Veg' : kitchenType}</span>
            </div>
          )}
        </div>

        {propertyFor && (
          <div className="flex items-center gap-1.5 text-sm text-primary">
            <Users className="w-4 h-4" />
            <span>{propertyFor}</span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">₹{price}</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
