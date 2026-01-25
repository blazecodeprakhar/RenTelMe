
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload, MapPin, Car, Users, IndianRupee, Camera,
  CheckCircle, Info, ArrowRight, Home, Building2, Plus, AlertCircle, Power, Clock, XCircle, Phone, Repeat, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { Checkbox } from "@/components/ui/checkbox";
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
  { id: "rooms", label: "Rooms", icon: Home },
  { id: "bathroom", label: "Bathroom", icon: Building2 },
  { id: "kitchen", label: "Kitchen", icon: Home },
  { id: "parking", label: "Parking Area", icon: Car },
  { id: "front", label: "Front of House", icon: Home },
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
    kitchenType: ""
  });
  const [uploadedImages, setUploadedImages] = useState<Record<string, File[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

  const handleReapply = (property: any) => {
    setEditingId(property.id);
    setFormData({
      address: property.address || "",
      city: property.city || "",
      area: property.location ? property.location.split(',')[0].trim() : "", // Simple heuristic
      pincode: property.pincode || "",
      parking: property.parking || "",
      propertyTypes: property.type || [],
      expectedRent: property.price || "",
      description: property.description || "",
      ownerPhone: property.ownerPhone || "",
      kitchenType: property.kitchenType || ""
    });
    setStep(1);
    toast.info("Updating existing application. Please review and submit.");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "properties", id));
      setMyProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Property deleted successfully.");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to list a property");
      navigate("/signin");
      return;
    }

    setSubmitting(true);
    try {
      const propertyData: any = {
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
        type: formData.propertyTypes, // Array of types
        price: formData.expectedRent,
        description: formData.description,
        status: "Pending",
        isUserActive: true, // Auto-activate on re-submission
        isReapplication: !!editingId, // Flag for admin
        updatedAt: new Date().toISOString(),
      };

      if (!editingId) {
        // New Listing
        propertyData.createdAt = new Date().toISOString();
        propertyData.image = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Mock
        propertyData.imagesCount = Object.values(uploadedImages).reduce((acc, curr) => acc + curr.length, 0);

        await addDoc(collection(db, "properties"), propertyData);
      } else {
        // Re-application / Update
        // We keep existing images if no new ones, or add logic to update them. For this demo, we assume keeping existing unless overwritten.
        // Reset rejection reason
        propertyData.rejectionReason = null;

        await updateDoc(doc(db, "properties", editingId), propertyData);
      }

      setStep(3);
      toast.success(editingId ? "Re-application submitted successfully!" : "Property listed successfully! Pending approval.");
      setEditingId(null);
    } catch (error) {
      console.error("Error listing property:", error);
      toast.error("Failed to submit property. Please try again.");
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

          {/* STEP 0: DASHBOARD */}
          {step === 0 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-navy">Your Properties</h2>
                <Button onClick={() => {
                  setEditingId(null); setStep(1); setFormData({
                    address: "", city: "", area: "", pincode: "", parking: "", propertyTypes: [], expectedRent: "", description: "", ownerPhone: "", kitchenType: ""
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
                      <div className="aspect-video w-full bg-muted relative">
                        {property.isReapplication && (
                          <div className="absolute top-3 left-3 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md">Reapplied</div>
                        )}
                        <img
                          src={property.image}
                          alt={property.title}
                          className={`w-full h-full object-cover ${!property.isUserActive ? 'grayscale opacity-70' : ''}`}
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${property.status === 'Verified' ? 'bg-white text-emerald-600' :
                            property.status === 'Rejected' ? 'bg-white text-red-600' :
                              'bg-white text-amber-600'
                            }`}>
                            {property.status === 'Verified' ? 'Approved' : property.status || "Pending"}
                          </span>
                        </div>

                        {!property.isUserActive && property.status === 'Verified' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="flex items-center gap-2 px-4 py-2 bg-black/70 text-white rounded-full font-medium backdrop-blur-sm">
                              <Power className="w-4 h-4" /> Paused
                            </span>
                          </div>
                        )}
                      </div>
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
                          <Button
                            variant={property.isUserActive ? "outline" : "default"}
                            size="sm"
                            onClick={() => togglePropertyStatus(property.id, property.isUserActive, property.status)}
                            className={`flex-1 ${!property.isUserActive ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {property.isUserActive ? "Pause Listing" : "Activate Listing"}
                          </Button>
                        ) : (
                          // Placeholder to keep spacing
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
                      <Label htmlFor="address">Complete Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter full address..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="mt-1.5"
                        required
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
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="mt-1.5"
                        required
                      />
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
                        onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                        className="pl-12"
                        required
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
                  <Textarea
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
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
              </p>

              <div className="space-y-6">
                {imageCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <category.icon className="w-4 h-4 text-primary" />
                      {category.label}
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageUpload(category.id, e.target.files)}
                      />
                      <Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      {uploadedImages[category.id]?.length > 0 && (
                        <p className="text-sm text-primary mt-2">
                          {uploadedImages[category.id].length} image(s) selected
                        </p>
                      )}
                    </div>
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
    </Layout>
  );
};

export default ListProperty;
