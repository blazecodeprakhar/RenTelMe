import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { documentId, collection, query, where, getDocs } from "firebase/firestore";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";

const Favorites = () => {
    const { likedProperties, loading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (authLoading) return;

            if (likedProperties.length === 0) {
                setFavorites([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Should use 'in' query for array of IDs, but it has limit of 10-30 depending on version
                // For robustness, we will fetch individual docs if list is small, or mapped queries.
                // Simple approach: Fetch all properties where ID is in list.
                // Firestore 'in' limit is 10. If user has 20 favorites, we need batches.
                // EASIER: Promise.all of getDoc. It's parallel and cost effective for typical user (< 50 favs).

                const propertyPromises = likedProperties.map(id => getDoc(doc(db, "properties", id)));
                const propertySnapshots = await Promise.all(propertyPromises);

                const fetchedProperties = propertySnapshots
                    .filter(doc => doc.exists())
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                setFavorites(fetchedProperties);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [likedProperties, authLoading]);

    if (loading) {
        return (
            <Layout>
                <div className="container-section py-20 min-h-[60vh] flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground animate-pulse">Loading your favorites...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container-section">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold font-heading text-navy flex items-center gap-3">
                                <Heart className="fill-red-500 text-red-500 w-8 h-8" />
                                My Favorites
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
                            </p>
                        </div>
                        <Link to="/find-property">
                            <Button variant="outline" className="gap-2">
                                <Search className="w-4 h-4" /> Browse More
                            </Button>
                        </Link>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((property) => (
                                <div key={property.id} className="h-full">
                                    <PropertyCard {...property} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <Heart className="w-10 h-10 text-red-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
                            <p className="text-gray-500 max-w-md mb-8">
                                You haven't saved any properties yet. Start exploring and click the heart icon to add homes to your wishlist!
                            </p>
                            <Link to="/find-property">
                                <Button size="lg" className="rounded-full font-bold shadow-lg hover:shadow-primary/20">
                                    Find Your Dream Home
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Favorites;
