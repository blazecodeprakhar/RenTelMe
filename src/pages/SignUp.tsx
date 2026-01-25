
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "tenant", // 'tenant' or 'owner'
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // Update Profile Display Name
            await updateProfile(user, {
                displayName: formData.fullName,
            });

            // Store User Details in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                createdAt: new Date().toISOString(),
            });

            toast.success("Account created successfully!");
            navigate("/"); // Redirect to home
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user already exists
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Create new user with selected role (default tenant if unchanged)
                await setDoc(docRef, {
                    uid: user.uid,
                    fullName: user.displayName,
                    email: user.email,
                    role: formData.role, // Use the selected role from state
                    createdAt: new Date().toISOString(),
                    photoURL: user.photoURL
                });
            }

            toast.success("Successfully signed up with Google!");
            navigate("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Google sign up failed.");
        } finally {
            setLoading(false);
        }
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
                                disabled={loading}
                                className="w-full h-12 bg-gradient-primary text-white font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all duration-300"
                            >
                                {loading ? "Creating Account..." : (
                                    <>
                                        Create Account <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 gap-4">
                            <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50" onClick={handleGoogleLogin} disabled={loading}>
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>

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
