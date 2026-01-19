import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Find Property", path: "/find-property" },
  { name: "List Property", path: "/list-property" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms & Conditions", path: "/terms" },
  { name: "Cookie Policy", path: "/cookie-policy" },
  { name: "Disclaimer", path: "/disclaimer" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "#" },
  { name: "Instagram", icon: Instagram, url: "#" },
  { name: "Twitter", icon: Twitter, url: "#" },
  { name: "LinkedIn", icon: Linkedin, url: "#" },
];

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 border-t border-primary/20 relative overflow-hidden">
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-black/10" />
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="container-section relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand - Spans 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="RenTelMe Logo"
                className="w-14 h-14 object-contain"
              />
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                RenTel<span className="font-light italic text-secondary">Me</span>
              </span>
            </Link>
            <p className="text-white/80 text-base leading-relaxed font-light max-w-sm">
              Elevating the rental experience. We provide curated homes with verified neighborhood insights for a seamless transition.
            </p>

            {/* Newsletter */}
            <div className="pt-4 max-w-sm">
              <h5 className="font-serif text-lg font-medium text-white mb-2">Subscribe to our newsletter</h5>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-secondary"
                />
                <Button size="icon" className="bg-secondary text-primary hover:bg-white shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full border border-white/20 hover:bg-white hover:text-primary flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Quick Links - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-xl font-semibold text-white mb-6">
              Explore
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary hover:translate-x-1 transition-all duration-300 text-sm font-medium tracking-wide flex items-center gap-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal - Spans 2 columns */}
          <div className="lg:col-span-2">
            <h4 className="font-serif text-xl font-semibold text-white mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-secondary hover:translate-x-1 transition-all duration-300 text-sm font-medium tracking-wide flex items-center gap-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Spans 3 columns */}
          <div className="lg:col-span-3">
            <h4 className="font-serif text-xl font-semibold text-white mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-white/80 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-primary transition-colors border border-white/5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-white text-sm mb-0.5">Head Office</p>
                  <span className="text-sm font-light opacity-80 leading-relaxed">Civil Lines, Prayagraj 211001</span>
                </div>
              </li>
              <li className="flex items-start gap-4 text-white/80 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-primary transition-colors border border-white/5">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-white text-sm mb-0.5">Phone</p>
                  <span className="text-sm font-light opacity-80">+91-8707392962</span>
                </div>
              </li>
              <li className="flex items-start gap-4 text-white/80 group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-primary transition-colors border border-white/5">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="font-medium text-white text-sm mb-0.5">Email</p>
                  <span className="text-sm font-light opacity-80">rentelme0@gmail.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50 font-light tracking-wider">
            © {new Date().getFullYear()} RenTelMe. Crafted for Excellence.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-white/40 uppercase tracking-widest">Privacy First</span>
            <span className="text-xs text-white/40 uppercase tracking-widest">Secure Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
