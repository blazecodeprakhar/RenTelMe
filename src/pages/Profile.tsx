
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Camera, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";
import { toast } from "sonner";

const Profile = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: "",
        role: "tenant"
    });

    useEffect(() => {
        if (!authLoading && !currentUser) {
            navigate("/signin");
            return;
        }

        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData({
                            displayName: data.fullName || currentUser.displayName || "",
                            email: data.email || currentUser.email || "",
                            phoneNumber: data.phoneNumber || "",
                            photoURL: data.photoURL || currentUser.photoURL || "",
                            role: data.role || "tenant"
                        });
                    } else {
                        // If user exists in Auth but not in DB, fallback to Auth data
                        setUserData({
                            displayName: currentUser.displayName || "",
                            email: currentUser.email || "",
                            phoneNumber: "",
                            photoURL: currentUser.photoURL || "",
                            role: "tenant"
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [currentUser, authLoading, navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!currentUser) return;

            // 1. Update Authentication Profile
            if (currentUser.displayName !== userData.displayName || currentUser.photoURL !== userData.photoURL) {
                await updateProfile(currentUser, {
                    displayName: userData.displayName,
                    photoURL: userData.photoURL
                });
            }

            // 2. Update Firestore Document (safely)
            const docRef = doc(db, "users", currentUser.uid);

            // Check if doc exists, if not use setDoc with merge, otherwise updateDoc
            // (setDoc with merge is generally safer if we're unsure)
            await setDoc(docRef, {
                fullName: userData.displayName,
                phoneNumber: userData.phoneNumber,
                photoURL: userData.photoURL
                // We typically don't update email here as it requires re-auth flow
            }, { merge: true });

            toast.success("Profile updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            // Check specifically for permissions error
            if (error.code === 'permission-denied') {
                toast.error("Permission denied. Database rules might be blocking this action.");
            } else {
                toast.error("Failed to update profile: " + (error.message || "Unknown error"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    if (authLoading) return <div>Loading...</div>;

    // Helper to get initials
    const getInitials = () => {
        const name = userData.displayName || userData.email || "U";
        return name.charAt(0).toUpperCase();
    };

    return (
        <Layout>
            <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-navy">Account Settings</h1>
                            <p className="text-muted-foreground">Manage your profile and preferences</p>
                        </div>
                        <Button variant="destructive" onClick={handleLogout} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your contact details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="flex flex-col items-center sm:flex-row gap-6 mb-8">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                                            {userData.photoURL ? (
                                                <img src={userData.photoURL} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-3xl font-bold text-gray-500">
                                                    {getInitials()}
                                                </span>
                                            )}
                                            {loading && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>

                                        <input
                                            type="file"
                                            id="photo-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                const formData = new FormData();
                                                formData.append('image', file);

                                                setLoading(true);
                                                toast.loading("Uploading photo...");

                                                try {
                                                    const response = await fetch('https://rentelme-server.onrender.com/upload', {
                                                        method: 'POST',
                                                        body: formData,
                                                    });

                                                    if (!response.ok) throw new Error('Upload failed');

                                                    const data = await response.json();
                                                    setUserData(prev => ({ ...prev, photoURL: data.displayUrl }));
                                                    toast.dismiss();
                                                    toast.success("Photo uploaded! Click Save internally.");
                                                } catch (error) {
                                                    console.error("Upload error:", error);
                                                    toast.dismiss();
                                                    toast.error("Failed to upload photo");
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm cursor-pointer z-10"
                                            onClick={() => document.getElementById('photo-upload')?.click()}
                                            disabled={loading}
                                        >
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-1 text-center sm:text-left">
                                        <h3 className="font-medium text-lg">{userData.displayName || "User"}</h3>
                                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary mt-2">
                                            {userData.role === 'owner' ? 'Property Owner' : 'Tenant'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="fullName"
                                                value={userData.displayName}
                                                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={userData.phoneNumber}
                                                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
                                                className="pl-9"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                value={userData.email}
                                                disabled
                                                className="pl-9 bg-muted"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
