import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AmenityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  color?: "primary" | "secondary" | "accent";
}

export const AmenityCard = ({
  icon: Icon,
  title,
  description,
  items,
  color = "primary",
}: AmenityCardProps) => {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/20 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all border border-border"
    >
      <div className={`w-14 h-14 rounded-xl ${colorStyles[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-navy mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
