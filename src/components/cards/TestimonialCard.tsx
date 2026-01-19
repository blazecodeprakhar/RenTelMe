import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  rating: number;
  avatar?: string;
}

export const TestimonialCard = ({
  content,
  author,
  role,
  rating,
  avatar,
}: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 relative group">
      <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
        <Quote className="w-12 h-12" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted"
              }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-foreground/80 text-lg leading-relaxed mb-8 font-light italic">
        "{content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-xl font-serif font-bold text-accent-foreground shadow-md">
          {avatar ? (
            <img src={avatar} alt={author} className="w-full h-full rounded-full object-cover" />
          ) : (
            author.charAt(0)
          )}
        </div>
        <div>
          <p className="font-serif font-bold text-lg text-primary">{author}</p>
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
};
