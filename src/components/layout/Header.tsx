
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Search, PlusCircle, Users, Phone, User as UserIcon, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Find Property", path: "/find-property", icon: Search },
  { name: "List Property", path: "/list-property", icon: PlusCircle },
  { name: "About Us", path: "/about", icon: Users },
  { name: "Contact", path: "/contact", icon: Phone },
];

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
    // Optional: Refresh or navigate if needed, but AuthContext updates automatically
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-lg border-b border-border/50 py-3 shadow-sm"
          : "bg-white/70 backdrop-blur-md border-b border-white/20 py-4"
          }`}
      >
        <div className="container-section">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group z-50 relative">
              <img
                src="/logo.png"
                alt="RenTelMe Logo"
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                RenTel<span className="italic font-light text-secondary-foreground">Me</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${isActive(link.path)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons - PC */}
            <div className="hidden lg:flex items-center gap-4">
              {!loading && currentUser ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full overflow-hidden border border-gray-200 shadow-sm">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{currentUser.email?.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.displayName || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/favorites" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>My Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/signin">
                    <Button variant="ghost" className="font-semibold text-foreground/70 hover:text-primary hover:bg-transparent px-2">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="rounded-full px-6 font-bold shadow-lg bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-black/5 text-primary transition-colors z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col pt-24 px-6"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-xl font-serif font-medium transition-all ${isActive(link.path)
                      ? "bg-primary/10 text-primary translate-x-2"
                      : "text-foreground/80 hover:bg-gray-50 hover:translate-x-2"
                      }`}
                  >
                    <div className={`p-2 rounded-full ${isActive(link.path) ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Account Link */}
              {currentUser && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-xl font-serif font-medium transition-all ${isActive('/profile')
                      ? "bg-primary/10 text-primary translate-x-2"
                      : "text-foreground/80 hover:bg-gray-50 hover:translate-x-2"
                      }`}
                  >
                    <div className={`p-2 rounded-full ${isActive('/profile') ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Settings className="w-5 h-5" />
                    </div>
                    Account Settings
                  </Link>
                </motion.div>
              )}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto mb-8 space-y-4"
            >
              {!loading && currentUser ? (
                <Button variant="outline" onClick={handleLogout} className="w-full text-lg py-6 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50">
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-lg py-6 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full text-lg py-6 rounded-xl bg-primary text-white shadow-xl shadow-primary/30 font-bold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
