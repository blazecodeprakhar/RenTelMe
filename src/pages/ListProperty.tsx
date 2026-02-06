
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload, MapPin, Car, Users, IndianRupee, Camera,
  CheckCircle, Info, ArrowRight, Home, Building2, Plus, AlertCircle, Power, Clock, XCircle, Phone, Repeat, Trash2, Loader2, TrendingUp, Calendar, BedDouble, Bath
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const propertyTypes = [
  { id: "students", label: "For Students" },
  { id: "families", label: "For Families" },
  { id: "girls", label: "Only for Girls" },
  { id: "boys", label: "Only for Boys" },
  { id: "couples", label: "Married Couples" },
  { id: "commercial", label: "Commercial Property" },
];

const parkingOptions = [
  { value: "car-bike", label: "1 Car + 1 Bike" },
  { value: "2bikes-cycle", label: "2 Bikes + 1 Bicycle" },
  { value: "bike-only", label: "Only Bike Parking" },
  { value: "none", label: "No Parking Available" },
  { value: "other", label: "Other" },
];

const imageCategories = [
  { id: "front", label: "Front of House", icon: Home },
  { id: "rooms", label: "Rooms", icon: Home },
  { id: "bathroom", label: "Bathroom", icon: Building2 },
  { id: "kitchen", label: "Kitchen", icon: Home },
  { id: "parking", label: "Parking Area", icon: Car },
];

const ListProperty = () => {
  const [step, setStep] = useState(0); // 0 = Dashboard, 1 = Details, 2 = Images, 3 = Success
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    area: "",
    pincode: "",
    parking: "",
    propertyTypes: [] as string[],
    expectedRent: "",
    description: "",
    ownerPhone: "",
    kitchenType: "",
    bedrooms: "",
    bathrooms: "",
    isNegotiable: false,
    deposit: ""
  });
  const [uploadedImages, setUploadedImages] = useState<Record<string, File[]>>({});
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs of existing images
  const [coverSelection, setCoverSelection] = useState<string | { category: string, index: number } | null>(null); // URL (if existing) or Object (if new)
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Ad Request State
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [selectedPropertyForAd, setSelectedPropertyForAd] = useState<any>(null);
  const [adDuration, setAdDuration] = useState("7");
  const [adSubmitting, setAdSubmitting] = useState(false);
  const [adRequests, setAdRequests] = useState<any[]>([]);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Ad Request Handlers
  const handleOpenAdDialog = (property: any) => {
    // Check if property already has active ad or pending request
    if (property.isSponsored && property.sponsoredUntil && new Date(property.sponsoredUntil) > new Date()) {
      toast.error("This property is already sponsored!");
      return;
    }

    const pendingRequest = adRequests.find(req =>
      req.propertyId === property.id && req.status === "pending"
    );

    if (pendingRequest) {
      toast.error("You already have a pending request for this property!");
      return;
    }

    setSelectedPropertyForAd(property);
    setAdDialogOpen(true);
  };

  const handleSubmitAdRequest = async () => {
    if (!selectedPropertyForAd) {
      toast.error("No property selected for advertisement.");
      return;
    }
    if (!currentUser) {
      toast.error("You must be logged in to submit an ad request.");
      return;
    }

    setAdSubmitting(true);
    try {
      const durationVal = parseInt(adDuration);

      const adData = {
        propertyId: String(selectedPropertyForAd.id),
        propertyTitle: selectedPropertyForAd.title || "Untitled Property",
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || "Anonymous",
        ownerEmail: currentUser.email || "no-email@example.com",
        status: "pending",
        duration: isNaN(durationVal) ? 7 : durationVal, // Default to 7 days if parsing fails
        createdAt: new Date().toISOString()
      };

      console.log("Submitting Ad Request:", adData);
      await addDoc(collection(db, "ad_requests"), adData);

      toast.success("Request submitted successfully!");
      setAdDialogOpen(false);
      setAdDuration("7");

      // Refresh ad requests
      fetchAdRequests(); // Reset duration
    } catch (err: any) {
      console.error("Ad request failed:", err);
      toast.error(`Failed to submit request: ${err.message || "Unknown error"}`);
    } finally {
      setAdSubmitting(false);
    }
  };

  // Fetch Ad Requests
  const fetchAdRequests = async () => {
    if (!currentUser) return;

    try {
      const q = query(collection(db, "ad_requests"), where("ownerId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdRequests(requests);
    } catch (error) {
      console.error("Error fetching ad requests:", error);
    }
  };

  // Fetch User's Properties
  useEffect(() => {
    if (!currentUser) return;

    const fetchMyProperties = async () => {
      setLoadingProperties(true);
      try {
        const q = query(collection(db, "properties"), where("ownerId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyProperties(properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchMyProperties();
    fetchAdRequests();
  }, [currentUser, step]); // Re-fetch when step changes (e.g. after submission)

  const handlePropertyTypeChange = (typeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: checked
        ? [...prev.propertyTypes, typeId]
        : prev.propertyTypes.filter(t => t !== typeId)
    }));
  };

  const handleImageUpload = (category: string, files: FileList | null) => {
    if (files) {
      setUploadedImages(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), ...Array.from(files)]
      }));
    }
  };

  const removeImage = (category: string, index: number) => {
    setUploadedImages(prev => {
      const newFiles = [...(prev[category] || [])];
      newFiles.splice(index, 1);
      return { ...prev, [category]: newFiles };
    });
  };

  const handleReapply = (property: any) => {
    setEditingId(property.id);
    setFormData({
      address: property.address || "",
      city: property.city || "",
      area: property.location ? property.location.split(',')[0].trim() : "",
      pincode: property.pincode || "",
      parking: property.parking || "",
      propertyTypes: property.type || [],
      expectedRent: property.price || "",
      description: property.description || "",
      ownerPhone: property.ownerPhone || "",
      kitchenType: property.kitchenType || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      isNegotiable: property.isNegotiable || false,
      deposit: property.deposit || ""
    });
    setExistingImages(property.images || []);
    setCoverSelection(property.image || (property.images && property.images[0]) || null);
    setStep(1);
    toast.info("Updating existing application. You can now edit images.");
  };

  // Helper to remove existing image (from UI and potentially Server immediately or on save? 
  // For safety, let's delete strictly on 'Save' or separate delete button. 
  // User requested "delete images from uploading process". 
  // For existing images, we will delete them immediately for simplicity as per previous "Delete from Client and Admin" request which implied strict sync.
  const deleteExistingImage = async (url: string) => {
    try {
      toast.loading("Deleting image...");
      // Extract ID and delete from server
      if (url.includes('/image/')) {
        const fileId = url.split('/image/')[1];
        await fetch(`https://rentelme-server.onrender.com/image/${fileId}`, { method: 'DELETE' });
      }
      setExistingImages(prev => prev.filter(img => img !== url));
      if (coverSelection === url) setCoverSelection(null);
      toast.dismiss();
      toast.success("Image removed");
    } catch (e) {
      toast.error("Failed to delete image");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // 1. Get the property data to find image URLs
      const propertyToDelete = myProperties.find(p => p.id === id);

      if (propertyToDelete && propertyToDelete.images && propertyToDelete.images.length > 0) {
        toast.loading("Deleting associated images...", { id: "delete-toast" }); // Optional: Show progress

        // 2. Extract File IDs from URLs and delete from server
        // URL format is likely: https://rentelme-server.onrender.com/image/FILE_ID
        const deletionPromises = propertyToDelete.images.map(async (url: string) => {
          try {
            // simple extraction logic assuming strict format
            const fileId = url.split('/image/')[1];
            if (fileId) {
              await fetch(`https://rentelme-server.onrender.com/image/${fileId}`, {
                method: 'DELETE'
              });
            }
          } catch (err) {
            console.error("Failed to delete image from Drive:", url, err);
          }
        });

        await Promise.all(deletionPromises);
      }

      // 3. Delete from Firestore
      await deleteDoc(doc(db, "properties", id));
      setMyProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Property and images deleted successfully.", { id: "delete-toast" });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.", { id: "delete-toast" });
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to list a property");
      navigate("/signin");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Processing your request...");

    try {
      // 1. Prepare Property Data
      let propertyData: any = {
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || "Unknown User",
        ownerEmail: currentUser.email,
        ownerPhone: formData.ownerPhone,
        title: `${formData.propertyTypes.map(id => propertyTypes.find(p => p.id === id)?.label).join(", ")} in ${formData.area}`,
        location: `${formData.area}, ${formData.city}`,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        parking: formData.parking,
        kitchenType: formData.kitchenType,
        bedrooms: parseInt(formData.bedrooms as string) || 0,
        bathrooms: parseInt(formData.bathrooms as string) || 0,
        isNegotiable: formData.isNegotiable,
        deposit: formData.deposit,
        type: formData.propertyTypes, // Array of types
        price: formData.expectedRent,
        description: formData.description,
        status: "Pending", // Always reset to Pending on edit/new
        isUserActive: true,
        isReapplication: !!editingId,
        updatedAt: new Date().toISOString(),
      };

      // 2. Upload Images to Google Drive
      const uploadedImageUrls: string[] = [];
      let newMainImageUrl: string | null = null;

      const allFiles: { file: File, category: string, index: number }[] = [];

      // Flatten files while keeping track of their origin for cover selection matching
      Object.keys(uploadedImages).forEach(cat => {
        uploadedImages[cat].forEach((file, idx) => {
          allFiles.push({ file, category: cat, index: idx });
        });
      });

      if (allFiles.length > 0) {
        setUploadProgress(5);
        let completed = 0;
        const total = allFiles.length;

        for (const item of allFiles) {
          setStatusMessage(`Uploading image ${completed + 1} of ${total}...`);

          const formData = new FormData();
          formData.append('image', item.file);

          try {
            const response = await fetch('https://rentelme-server.onrender.com/upload', { method: 'POST', body: formData });

            if (!response.ok) {
              throw new Error("Upload failed");
            }

            const data = await response.json();

            if (data.displayUrl) {
              uploadedImageUrls.push(data.displayUrl);

              // Check if this was the selected cover
              if (
                typeof coverSelection === 'object' &&
                coverSelection !== null &&
                coverSelection.category === item.category &&
                coverSelection.index === item.index
              ) {
                newMainImageUrl = data.displayUrl;
              }
            }
          } catch (uploadError) {
            console.error("Upload failed for file:", item.file.name, uploadError);
            toast.error(`Failed to upload ${item.file.name}.`, { id: toastId });
          }

          completed++;
          setUploadProgress(5 + Math.round((completed / total) * 85));
        }
      }

      setStatusMessage("Finalizing property details...");
      setUploadProgress(95);

      // 3. Finalize Data
      // Combine Existing + New
      const finalImages = [...existingImages, ...uploadedImageUrls];

      if (finalImages.length > 0) {
        // Determine Main Image
        if (newMainImageUrl) {
          propertyData.image = newMainImageUrl;
        } else if (typeof coverSelection === 'string' && existingImages.includes(coverSelection)) {
          propertyData.image = coverSelection;
        } else {
          // Default to first image
          propertyData.image = finalImages[0];
        }

        propertyData.images = finalImages;
        propertyData.imagesCount = finalImages.length;
      } else if (!editingId) {
        propertyData.image = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
        propertyData.images = [];
        propertyData.imagesCount = 0;
      }

      if (!editingId) {
        // NEW Listing
        propertyData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "properties"), propertyData);
        toast.success("Property listed successfully! Pending approval.", { id: toastId });
      } else {
        // UPDATE Listing
        propertyData.rejectionReason = null; // Clear rejection
        if (uploadedImageUrls.length === 0) {
          delete propertyData.image;
          delete propertyData.images;
          delete propertyData.imagesCount;
        }

        await updateDoc(doc(db, "properties", editingId), propertyData);
        toast.success("Re-application submitted successfully!", { id: toastId });
      }

      setStep(3);
      setEditingId(null);
      setUploadedImages({}); // Clear uploads
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to submit property. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean, approvalStatus: string) => {
    if (approvalStatus !== 'Verified') {
      toast.error("Only approved properties can be activated.");
      return;
    }

    try {
      await updateDoc(doc(db, "properties", propertyId), {
        isUserActive: !currentStatus
      });
      // Optimistic update
      setMyProperties(prev => prev.map(p => p.id === propertyId ? { ...p, isUserActive: !currentStatus } : p));
      toast.success(`Property ${!currentStatus ? "activated" : "paused"} successfully.`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-warm">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Property Management
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
              {step === 0 ? "My Listings" : (editingId ? "Update / Reapply" : "List New Property")}
            </h1>
            <p className="text-muted-foreground">
              {step === 0
                ? "Manage your rental listings, check approval status, and control availability."
                : "Complete the form below to submit your property for review."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-section max-w-4xl">

          {/* STEP 0: GUEST VIEW */}
          {step === 0 && !currentUser && (
            <div className="text-center py-20 px-4 bg-card rounded-2xl border border-dashed shadow-sm">
              <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6 text-primary">
                <Home className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-3">Login to List Your Property</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                You need to be logged in to post ads, manage listings, and view tenant inquiries.
              </p>
              <Button onClick={() => navigate('/signin')} size="lg" className="bg-primary text-white shadow-lg hover:bg-primary/90 px-8">
                Login / Sign Up
              </Button>
            </div>
          )}

          {/* STEP 0: DASHBOARD (Logged In) */}
          {step === 0 && currentUser && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-navy">Your Properties</h2>
                <Button onClick={() => {
                  setEditingId(null); setStep(1); setFormData({
                    address: "", city: "", area: "", pincode: "", parking: "", propertyTypes: [], expectedRent: "", description: "", ownerPhone: "", kitchenType: "", bedrooms: "", bathrooms: "", isNegotiable: false, deposit: ""
                  });
                }} className="bg-primary text-white shadow-lg hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> List New Property
                </Button>
              </div>

              {loadingProperties ? (
                <div className="text-center py-20 text-muted-foreground">Loading your properties...</div>
              ) : myProperties.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {myProperties.map((property) => (
                    <Card key={property.id} className="overflow-hidden border border-border shadow-soft group hover:shadow-elevated transition-shadow">
                      <ImageWithSkeleton
                        src={property.image}
                        alt={property.title}
                        containerClassName="aspect-video w-full"
                        className={`w-full h-full object-cover ${!property.isUserActive ? 'grayscale opacity-70' : ''}`}
                      >
                        {property.isReapplication && (
                          <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md">Reapplied</div>
                        )}

                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${property.status === 'Verified' ? 'bg-white text-emerald-600' :
                            property.status === 'Rejected' ? 'bg-white text-red-600' :
                              'bg-white text-amber-600'
                            }`}>
                            {property.status === 'Verified' ? 'Approved' : property.status || "Pending"}
                          </span>

                          {property.isSponsored && property.sponsoredUntil && new Date(property.sponsoredUntil) > new Date() && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-indigo-600 text-white flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Exp: {new Date(property.sponsoredUntil).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {!property.isUserActive && property.status === 'Verified' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-full font-medium backdrop-blur-sm">
                              <Power className="w-4 h-4" /> Paused
                            </span>
                          </div>
                        )}
                      </ImageWithSkeleton>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                            <CardDescription>{property.location}</CardDescription>
                          </div>
                          <p className="font-bold text-primary">₹{property.price}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        {property.status === 'Rejected' && (
                          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700 space-y-2">
                            <div className="flex items-center gap-2 font-semibold">
                              <XCircle className="w-4 h-4" /> Application Rejected
                            </div>
                            <p className="text-red-600/90 pl-6 text-xs">
                              Reason: {property.rejectionReason || "Criteria not met."}
                            </p>
                            <Button size="sm" variant="outline" className="w-full bg-white text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800" onClick={() => handleReapply(property)}>
                              <Repeat className="w-3 h-3 mr-2" /> Re-apply & Edit
                            </Button>
                          </div>
                        )}
                        {property.status === 'Pending' && (
                          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>Waiting for admin approval. This usually takes 24 hours.</span>
                          </div>
                        )}
                        {property.status === 'Verified' && (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-sm text-emerald-700 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>Your property is live!</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-2 border-t bg-gray-50/50 flex gap-2">
                        {property.status === 'Verified' ? (
                          <>
                            <Button
                              variant={property.isUserActive ? "outline" : "default"}
                              size="sm"
                              onClick={() => togglePropertyStatus(property.id, property.isUserActive, property.status)}
                              className={`flex-1 ${!property.isUserActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                            >
                              <Power className="w-4 h-4 mr-2" />
                              {property.isUserActive ? "Pause" : "Activate"}
                            </Button>
                            {property.isSponsored && property.sponsoredUntil && new Date(property.sponsoredUntil) > new Date() ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 cursor-default"
                                disabled
                              >
                                <TrendingUp className="w-4 h-4 mr-1" /> Active Ad
                              </Button>
                            ) : adRequests.find(req => req.propertyId === property.id && req.status === "pending") ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 cursor-default"
                                disabled
                              >
                                <Clock className="w-4 h-4 mr-1" /> Pending
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200"
                                onClick={() => handleOpenAdDialog(property)}
                              >
                                <TrendingUp className="w-4 h-4 mr-1" /> Promote
                              </Button>
                            )}
                          </>
                        ) : (
                          <div className="flex-1"></div>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this property? This action is permanent and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(property.id)} className="bg-destructive hover:bg-destructive/90">Delete Permanently</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-6 text-muted-foreground">
                    <Home className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Properties Listed Yet</h3>
                  <p className="text-muted-foreground mb-6">Start your journey as a host today.</p>
                  <Button onClick={() => setStep(1)} size="lg">List Your Property</Button>
                </div>
              )}
            </div>
          )}

          {/* Ad Request Dialog */}
          <Dialog open={adDialogOpen} onOpenChange={setAdDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Promote Your Property</DialogTitle>
                <DialogDescription>
                  Request to feature <strong>{selectedPropertyForAd?.title}</strong> in our Premium Collection.
                  Ads are subject to admin approval.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <Label>Select Duration</Label>
                  <Select value={adDuration} onValueChange={setAdDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="7">7 Days (Standard)</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days (Best Value)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Premium listings get 10x more views on average.</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAdDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmitAdRequest} disabled={adSubmitting}>
                  {adSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Details Form Step */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border"
            >
              {/* Progress Steps (1 to 3, but offset visually) */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s
                      ? "bg-gradient-primary text-primary-foreground shadow-primary"
                      : "bg-muted text-muted-foreground"
                      }`}>
                      {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`w-20 md:w-32 h-1 ${step > s ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="font-heading text-2xl font-semibold text-navy mb-6">
                {editingId ? "Edit Property Details" : "Tell Us About Your Property"}
              </h2>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">
                        Complete Address <span className="text-xs text-muted-foreground font-normal ml-1">(Max 250 chars)</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Include building name, landmark, and road details.
                      </p>
                      <Textarea
                        id="address"
                        placeholder="Enter complete property address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value.slice(0, 250) })}
                        className="mt-1.5"
                        required
                        maxLength={250}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Area/Locality</Label>
                      <Input
                        id="area"
                        placeholder="Enter area"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="mt-1.5"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        placeholder="123456"
                        value={formData.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setFormData({ ...formData, pincode: val });
                        }}
                        className="mt-1.5"
                        required
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Configuration Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bedrooms" className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-muted-foreground" /> Bedrooms
                      </Label>
                      <Select value={String(formData.bedrooms)} onValueChange={(val) => setFormData({ ...formData, bedrooms: val })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select Bedrooms" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 BHK / 1 RK</SelectItem>
                          <SelectItem value="2">2 BHK</SelectItem>
                          <SelectItem value="3">3 BHK</SelectItem>
                          <SelectItem value="4">4 BHK</SelectItem>
                          <SelectItem value="5">5+ BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bathrooms" className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-muted-foreground" /> Bathrooms
                      </Label>
                      <Select value={String(formData.bathrooms)} onValueChange={(val) => setFormData({ ...formData, bathrooms: val })}>
                        <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select Bathrooms" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Bathroom</SelectItem>
                          <SelectItem value="2">2 Bathrooms</SelectItem>
                          <SelectItem value="3">3 Bathrooms</SelectItem>
                          <SelectItem value="4">4+ Bathrooms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Parking, Type, Rent... (Keep existing form fields) */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Parking
                    </h3>
                    <Select
                      value={formData.parking}
                      onValueChange={(value) => setFormData({ ...formData, parking: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parking option" />
                      </SelectTrigger>
                      <SelectContent>
                        {parkingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils text-primary"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                      Kitchen Preference
                    </h3>
                    <Select
                      value={formData.kitchenType}
                      onValueChange={(value) => setFormData({ ...formData, kitchenType: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select food preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Vegetarian Only</SelectItem>
                        <SelectItem value="non-veg">Non-Vegetarian Only</SelectItem>
                        <SelectItem value="both">Both Veg & Non-Veg (Allowed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-primary" />
                      Expected Rent
                    </h3>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        type="number"
                        placeholder="25000"
                        value={formData.expectedRent}
                        onChange={(e) => setFormData({ ...formData, expectedRent: e.target.value })}
                        className="pl-8"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="negotiable"
                        checked={formData.isNegotiable}
                        onCheckedChange={(c) => setFormData({ ...formData, isNegotiable: c as boolean })}
                      />
                      <Label htmlFor="negotiable" className="cursor-pointer font-normal text-sm text-muted-foreground">
                        Rent is Negotiable
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <span className="font-bold text-primary border-2 border-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">₹</span>
                      Security Deposit
                    </h3>
                    <Input
                      placeholder="e.g. 2 Months Rent"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      required
                    />
                  </div>

                  {/* Phone Number Input */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      Contact Number
                    </h3>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">+91</span>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        value={formData.ownerPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, ownerPhone: val });
                        }}
                        className="pl-12"
                        required
                        inputMode="numeric"
                        minLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Property Type
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {propertyTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.propertyTypes.includes(type.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                          }`}
                      >
                        <Checkbox
                          checked={formData.propertyTypes.includes(type.id)}
                          onCheckedChange={(checked) => handlePropertyTypeChange(type.id, checked as boolean)}
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Property Description</h3>
                  <p className="text-sm text-muted-foreground">
                    Write a clear and attractive property description (50–500 characters) including property type, key amenities, nearby locations, and ideal tenants.
                  </p>
                  <Textarea
                    placeholder="E.g., Spacious 2BHK with balcony, near metro station, perfect for families..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
                    rows={4}
                    required
                    minLength={50}
                    maxLength={500}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" className="flex-[2] bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
                    {editingId ? "Update & Continue" : "Continue to Photos"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border"
            >
              <h2 className="font-heading text-2xl font-semibold text-navy mb-2">
                {editingId ? "Update Property Images (Optional)" : "Upload Property Images"}
              </h2>
              <p className="text-muted-foreground mb-6">
                Add clear photos of your property. Good photos attract more renters!
                <br />
                <span className="text-primary font-medium text-sm flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" /> Select one image as the "Front Thumbnail" to be displayed on search cards.
                </span>
              </p>

              <div className="space-y-6">

                {/* EXISTING IMAGES SECTION */}
                {existingImages.length > 0 && (
                  <div className="space-y-3 pb-6 border-b border-dashed">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <img src="/placeholder.svg" className="w-0 h-0" onError={(e) => e.currentTarget.style.display = 'none'} /> {/* Hack to keep consistent */}
                      Current Images
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {existingImages.map((imgUrl, idx) => (
                        <div key={idx} className={`relative group aspect-square rounded-lg overflow-hidden border shadow-sm ${coverSelection === imgUrl ? 'ring-4 ring-primary border-primary' : 'border-border'}`}>
                          <img src={imgUrl} alt="Existing" className="w-full h-full object-cover" />

                          {/* Cover Badge */}
                          {coverSelection === imgUrl && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                              THUMBNAIL
                            </div>
                          )}

                          {/* Overlay Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {coverSelection !== imgUrl && (
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-7 text-xs bg-white/90 hover:bg-white text-black"
                                onClick={() => setCoverSelection(imgUrl)}
                              >
                                Set as Thumbnail
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => deleteExistingImage(imgUrl)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imageCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-primary" />
                      {category.label}
                    </Label>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative bg-card/50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={(e) => handleImageUpload(category.id, e.target.files)}
                      />
                      <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">
                        Click to upload photos
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        Supports JPG, PNG
                      </p>
                    </div>

                    {/* Image Previews */}
                    {uploadedImages[category.id]?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {uploadedImages[category.id].map((file, index) => (
                          <div key={`${file.name}-${index}`} className={`relative group aspect-square rounded-lg overflow-hidden border shadow-sm ${typeof coverSelection === 'object' && coverSelection?.category === category.id && coverSelection?.index === index ? 'ring-4 ring-primary border-primary' : 'border-border'}`}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                            />

                            {/* Cover Badge */}
                            {typeof coverSelection === 'object' && coverSelection?.category === category.id && coverSelection?.index === index && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10">
                                THUMBNAIL
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              {/* Make Cover Button */}
                              {!(typeof coverSelection === 'object' && coverSelection?.category === category.id && coverSelection?.index === index) && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="secondary"
                                  className="h-7 text-xs bg-white/90 hover:bg-white text-black"
                                  onClick={() => setCoverSelection({ category: category.id, index })}
                                >
                                  Set as Thumbnail
                                </Button>
                              )}

                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => removeImage(category.id, index)}
                              >
                                <XCircle className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90"
                  >
                    {submitting ? "Submitting..." : (editingId ? "Submit Re-application" : "Submit for Review")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-soft border border-border text-center"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/10 mx-auto flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-semibold text-navy mb-4">
                Submitted Successfully!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Your property has been sent to our admin team for review. You can track its status in your dashboard.
              </p>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Go to Dashboard
                </Button>
                <Link to="/contact">
                  <Button variant="ghost">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section (Only show on Dashboard) */}
      {step === 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container-section">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Fast Approval</h3>
                <p className="text-sm text-muted-foreground">
                  We review listings within 24 hours to ensure quality.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <Power className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Full Control</h3>
                <p className="text-sm text-muted-foreground">
                  Pause your listing anytime when you find a tenant.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-3">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-1">Rejection Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  If rejected, we'll tell you exactly what to fix.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Submission Overlay */}
      {submitting && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card w-full max-w-sm md:max-w-md rounded-2xl p-8 shadow-2xl border border-border text-center space-y-8"
          >
            <div className="mx-auto w-24 h-24 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <Loader2 className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-heading">Submitting Property</h2>
              <p className="text-muted-foreground text-sm font-medium">{statusMessage || "Preparing..."}</p>
            </div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-secondary/10 rounded-full overflow-hidden border border-secondary/20">
                <motion.div
                  className="h-full bg-gradient-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right tabular-nums">{uploadProgress}%</p>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default ListProperty;
