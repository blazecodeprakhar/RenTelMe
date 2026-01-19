
import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "tenant", // 'tenant' or 'owner'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle sign up logic here
        console.log("Sign up with:", formData);
    };

    return (
        <Layout>
            <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-warm">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-elevated p-8 md:p-10 border border-white/20">
                        <div className="text-center mb-8">
                            <h2 className="font-serif text-3xl font-bold text-navy mb-2">Create Account</h2>
                            <p className="text-muted-foreground">Join RenTelMe for a seamless premium experience</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'tenant' })}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'tenant'
                                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                            : 'border-gray-200 hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="font-medium text-sm">I'm a Renter</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'owner'
                                            ? 'border-primary bg-primary/5 text-primary shadow-sm'
                                            : 'border-gray-200 hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium text-sm">Property Owner</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:bg-white"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-10 h-12 bg-white/50 border-gray-200 focus:bg-white"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        className="pl-10 pr-10 h-12 bg-white/50 border-gray-200 focus:bg-white"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                    required
                                />
                                <label htmlFor="terms" className="text-sm text-muted-foreground">
                                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all duration-300"
                            >
                                Create Account <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/signin" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default SignUp;
