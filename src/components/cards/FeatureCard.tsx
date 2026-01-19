import { forwardRef } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 shadow-primary">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-heading text-lg font-semibold text-navy mb-1">
            {title}
          </h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
