import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { toast } from "sonner";

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    likedProperties: string[];
    toggleLike: (propertyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
    likedProperties: [],
    toggleLike: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [likedProperties, setLikedProperties] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribeAuth;
    }, []);

    useEffect(() => {
        if (!currentUser) {
            setLikedProperties([]);
            return;
        }

        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setLikedProperties(data.likedProperties || []);

                // Sync Profile Data if missing or outdated (e.g. from Google Auth)
                const updates: any = {};
                if (currentUser.photoURL && data.photoURL !== currentUser.photoURL) {
                    updates.photoURL = currentUser.photoURL;
                }
                if (currentUser.displayName && data.displayName !== currentUser.displayName) {
                    updates.displayName = currentUser.displayName;
                }

                if (Object.keys(updates).length > 0) {
                    try {
                        await updateDoc(userRef, updates);
                    } catch (e) {
                        console.error("Profile sync error:", e);
                    }
                }
            } else {
                // Create user doc if it doesn't exist
                try {
                    await setDoc(userRef, {
                        email: currentUser.email,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                        likedProperties: []
                    }, { merge: true });
                } catch (e) {
                    console.error("User init error:", e);
                }
            }
        });

        return () => unsubscribeSnapshot();
    }, [currentUser]);

    const toggleLike = async (propertyId: string) => {
        if (!currentUser) {
            toast.error("Please login to save favorites");
            return;
        }

        const isLiked = likedProperties.includes(propertyId);
        const userRef = doc(db, "users", currentUser.uid);

        try {
            if (isLiked) {
                await updateDoc(userRef, {
                    likedProperties: arrayRemove(propertyId)
                });
                toast.success("Removed from favorites");
            } else {
                await updateDoc(userRef, {
                    likedProperties: arrayUnion(propertyId)
                });
                toast.success("Added to favorites");
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            toast.error("Failed to update favorites");
        }
    };

    const value = {
        currentUser,
        loading,
        likedProperties,
        toggleLike
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
