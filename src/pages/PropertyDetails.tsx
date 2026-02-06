import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { fixImageUrl } from "@/lib/utils";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import {
    MapPin, BedDouble, Bath, Car, Users, Utensils, IndianRupee,
    ArrowLeft, Share2, Heart, Phone, Mail, Calendar, CheckCircle, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    const allImages = property ? (property.images && property.images.length > 0 ? property.images : [property.image]) : [];

    useEffect(() => {
        const fetchProperty = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const docRef = doc(db, "properties", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    let ownerPhotoURL = null;

                    // Fetch Owner Details
                    if (data.ownerId) {
                        try {
                            const ownerRef = doc(db, "users", data.ownerId);
                            const ownerSnap = await getDoc(ownerRef);
                            if (ownerSnap.exists()) {
                                ownerPhotoURL = ownerSnap.data().photoURL;
                            }
                        } catch (err) {
                            console.error("Error fetching owner details", err);
                        }
                    }

                    setProperty({ id: docSnap.id, ...data, ownerPhotoURL });
                    setActiveImage(data.image || (data.images && data.images[0]) || null);
                } else {
                    toast.error("Property not found");
                    navigate("/find-property");
                }
            } catch (error) {
                console.error("Error fetching property:", error);
                toast.error("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, navigate]);

    const nextPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (allImages.length === 0) return;
        setPhotoIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (allImages.length === 0) return;
        setPhotoIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };

    const openGallery = (index: number) => {
        setPhotoIndex(index);
        setIsGalleryOpen(true);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isGalleryOpen) return;
            if (e.key === "ArrowRight") nextPhoto();
            if (e.key === "ArrowLeft") prevPhoto();
            if (e.key === "Escape") setIsGalleryOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGalleryOpen, allImages.length]);

    if (loading) {
        return (
            <Layout>
                <div className="container-section py-20 flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground animate-pulse">Loading property details...</p>
                </div>
            </Layout>
        );
    }

    if (!property) return null;

    return (
        <Layout>
            <div className="bg-gray-50/50 min-h-screen pb-20">
                {/* Navigation Bar */}
                <div className="bg-white border-b sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90 supports-[backdrop-filter]:bg-white/60">
                    <div className="container-section py-4 flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-all -ml-2" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-secondary/20 hover:text-secondary" title="Share">
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="rounded-full hover:bg-red-50 hover:text-red-500" title="Save">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container-section pt-6 md:pt-8">
                    {/* Gallery Grid - Modern Layout */}
                    <section className="mb-10 rounded-3xl overflow-hidden shadow-soft border border-gray-200/50 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[50vh] min-h-[400px] md:h-[500px] p-2">
                            {/* Main Hero Image */}
                            <div className="md:col-span-3 h-full relative group cursor-pointer overflow-hidden rounded-xl" onClick={() => openGallery(0)}>
                                <ImageWithSkeleton
                                    src={allImages[0]}
                                    alt="Main view"
                                    containerClassName="w-full h-full bg-muted"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute bottom-4 left-4 z-10">
                                    <Button variant="secondary" size="sm" className="backdrop-blur-md bg-white/90 shadow-lg hover:bg-white gap-2">
                                        <Utensils className="w-4 h-4" /> View Gallery
                                    </Button>
                                </div>
                            </div>

                            {/* Right Side Stack */}
                            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                                {allImages.slice(1, 3).map((img: string, idx: number) => (
                                    <div key={idx} className="relative h-full overflow-hidden cursor-pointer group rounded-xl" onClick={() => openGallery(idx + 1)}>
                                        <ImageWithSkeleton
                                            src={img}
                                            alt={`View ${idx + 2}`}
                                            containerClassName="w-full h-full bg-muted"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        {idx === 1 && allImages.length > 3 && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-medium text-lg backdrop-blur-sm transition-opacity hover:bg-black/70">
                                                +{allImages.length - 3} Photos
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {allImages.length < 2 && (
                                    <div className="row-span-2 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-muted-foreground border border-dashed border-gray-300">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                            <ImageWithSkeleton src="" alt="" className="hidden" />
                                            <Users className="w-6 h-6 opacity-20" /> {/* Placeholder icon */}
                                        </div>
                                        <span className="text-sm font-medium">No more images</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* Main Info */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="space-y-4">
                                {/* Badges Row */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {property.status === 'Verified' && (
                                        <Badge className="bg-emerald-100 text-emerald-800 border-none px-3 py-1 text-xs hover:bg-emerald-100 ring-1 ring-emerald-200/50">
                                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Verified Listing
                                        </Badge>
                                    )}
                                    {/* Parse and Display Tags Correctly */}
                                    {(() => {
                                        const tags = Array.isArray(property.propertyFor)
                                            ? property.propertyFor
                                            : (typeof property.propertyFor === 'string' ? property.propertyFor.split(',') : []);

                                        // Also try type if propertyFor is empty
                                        const typeTag = property.type;

                                        return (
                                            <>
                                                {tags.map((tag: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="capitalize bg-white border border-gray-200 text-gray-700 px-3 shadow-sm hover:bg-gray-50">
                                                        {tag.replace(/([A-Z])/g, ' $1').trim()}
                                                    </Badge>
                                                ))}
                                                {!tags.includes(typeTag) && typeTag && (
                                                    <Badge variant="secondary" className="capitalize bg-blue-50 text-blue-700 border border-blue-100 px-3 shadow-sm">
                                                        {typeTag}
                                                    </Badge>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>

                                {/* Title & Location */}
                                <div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-navy leading-[1.15] mb-4">
                                        {property.title}
                                    </h1>
                                    <div className="flex items-center gap-2 text-muted-foreground text-lg">
                                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                                        <span>{property.location}{property.city ? `, ${property.city}` : ''}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Key Features Grid - Enhanced */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100">
                                {[
                                    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms, color: "text-blue-600", bg: "bg-blue-50" },
                                    { icon: Bath, label: "Bathrooms", value: property.bathrooms, color: "text-indigo-600", bg: "bg-indigo-50" },
                                    { icon: Car, label: "Parking", value: property.parking, color: "text-orange-600", bg: "bg-orange-50" },
                                    { icon: Utensils, label: "Kitchen", value: property.kitchenType, color: "text-emerald-600", bg: "bg-emerald-50" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
                                        <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center ${item.color} mb-3 shadow-inner`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1 font-medium">{item.label}</p>
                                        <p className="font-bold text-gray-900 capitalize text-lg">{item.value || "N/A"}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold font-heading text-navy">About this property</h2>
                                <div className="prose prose-gray max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-lg">
                                    {property.description}
                                </div>
                            </div>

                            {/* Location / Address Card */}
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <MapPin className="w-6 h-6 text-primary" />
                                    <h2 className="text-xl font-bold font-heading">Location Details</h2>
                                </div>
                                <p className="text-gray-600 mb-6 text-lg">{property.address}</p>
                                <div className="aspect-[21/9] bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-400 border border-slate-200/60 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-122.4241,37.78,14.25,0,0/600x300?access_token=...')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                    <MapPin className="w-8 h-8 mb-2 opacity-50 text-slate-500" />
                                    <span className="font-medium text-slate-600">Interactive Map Preview</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar - Sticky Payment/Contact */}
                        <div className="lg:col-span-4 relative">
                            <div className="sticky top-24 space-y-6">
                                {/* Price Card */}
                                <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden ring-1 ring-black/5">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary"></div>
                                    <div className="mb-8 mt-2">
                                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Rent Amount</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-extrabold text-navy">₹{property.price}</span>
                                            <span className="text-muted-foreground font-medium">/ month</span>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 py-1">Negotiable</Badge>
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 py-1">Deposit: 2 Months</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2 rounded-xl" size="lg">
                                            <Phone className="w-5 h-5" /> View Phone Number
                                        </Button>
                                        <Button variant="outline" className="w-full h-12 text-lg bg-white border-2 border-gray-100 hover:bg-gray-50 text-gray-700 gap-2 rounded-xl font-semibold">
                                            <Mail className="w-5 h-5" /> Send Message
                                        </Button>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span className="font-medium">Verified Owner (ID Checked)</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                            <span className="font-medium">100% Safe Transaction</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Owner Mini Profile */}
                                <div className="bg-white rounded-3xl p-6 border border-gray-200 flex items-center gap-5 shadow-sm">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                        {property.ownerPhotoURL ? (
                                            <img src={fixImageUrl(property.ownerPhotoURL)} alt={property.ownerName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                                {property.ownerName ? property.ownerName[0] : "O"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Posted by</p>
                                        <p className="font-bold text-xl text-navy">{property.ownerName || "Property Owner"}</p>
                                        <p className="text-xs text-gray-500 font-medium">Member since {new Date(property.createdAt).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fullscreen Lightbox */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="absolute top-4 right-4 z-50">
                            <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full w-12 h-12" onClick={() => setIsGalleryOpen(false)}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </Button>
                        </div>

                        <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10">
                            {/* Main Image */}
                            <div className="relative w-full max-w-6xl h-[70vh] md:h-[80vh] flex items-center justify-center">
                                <img
                                    src={fixImageUrl(allImages[photoIndex])}
                                    alt={`Gallery view ${photoIndex + 1}`}
                                    className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                                />

                                {/* Nav Buttons */}
                                {allImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            className="absolute left-0 md:-left-16 text-white hover:bg-white/10 rounded-full top-1/2 -translate-y-1/2 h-16 w-16"
                                            onClick={prevPhoto}
                                        >
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="absolute right-0 md:-right-16 text-white hover:bg-white/10 rounded-full top-1/2 -translate-y-1/2 h-16 w-16"
                                            onClick={nextPhoto}
                                        >
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails Strip */}
                            <div className="mt-6 flex gap-2 overflow-x-auto max-w-4xl px-4 py-2 scrollbar-none">
                                {allImages.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => setPhotoIndex(idx)}
                                        className={`relative h-16 w-24 shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${idx === photoIndex ? 'border-primary ring-2 ring-primary/50' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={fixImageUrl(img)} className="w-full h-full object-cover" alt="thumbnail" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PropertyDetails;
