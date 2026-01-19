import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, MapPin, Car, Users, IndianRupee, Camera,
  CheckCircle, Info, ArrowRight, Home, Building2
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
];

const imageCategories = [
  { id: "rooms", label: "Rooms", icon: Home },
  { id: "bathroom", label: "Bathroom", icon: Building2 },
  { id: "kitchen", label: "Kitchen", icon: Home },
  { id: "parking", label: "Parking Area", icon: Car },
  { id: "front", label: "Front of House", icon: Home },
];

const ListProperty = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    area: "",
    pincode: "",
    parking: "",
    propertyTypes: [] as string[],
    expectedRent: "",
    description: "",
  });
  const [uploadedImages, setUploadedImages] = useState<Record<string, File[]>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Show success screen
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
              List Your Property
            </span>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
              Renting Out Your Property?
            </h1>
            <p className="text-muted-foreground">
              List your property with RenTelMe and reach thousands of verified renters. Our team reviews every listing to ensure accuracy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 md:py-16">
        <div className="container-section max-w-4xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
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

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border"
            >
              <h2 className="font-heading text-2xl font-semibold text-navy mb-6">
                Tell Us About Your Property
              </h2>

              <form className="space-y-8">
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
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-accent rounded-xl">
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      You can also pin your exact location on Google Maps after submission.
                    </p>
                  </div>
                </div>

                {/* Parking */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Car className="w-5 h-5 text-primary" />
                    Parking Availability
                  </h3>
                  <Select
                    value={formData.parking}
                    onValueChange={(value) => setFormData({ ...formData, parking: value })}
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

                {/* Property Type */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Property Type (Select all that apply)
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

                {/* Expected Rent */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    Expected Rent
                  </h3>
                  <div className="relative max-w-sm">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={formData.expectedRent}
                      onChange={(e) => setFormData({ ...formData, expectedRent: e.target.value })}
                      className="pl-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Note: Price should be fair & negotiable
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Property Description</h3>
                  <Textarea
                    placeholder="Describe your property, amenities, and any special features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  size="lg"
                  className="w-full bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90"
                >
                  Continue to Upload Photos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
                Upload Property Images
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
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90"
                  >
                    Submit for Review
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
                Sit Back & Relax!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Thank you for submitting your property details! Our team is reviewing your listing to ensure all information is accurate and complete.
              </p>
              <div className="bg-accent p-4 rounded-xl max-w-md mx-auto mb-8">
                <p className="text-sm text-foreground">
                  This process may take up to <strong>24 hours</strong>. You will receive an email/SMS once your profile is approved.
                </p>
              </div>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      {step < 3 && (
        <section className="py-12 bg-muted/50">
          <div className="container-section">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">Verified Listings</h3>
                <p className="text-sm text-muted-foreground">
                  All listings are reviewed by our team to ensure accuracy and authenticity.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">Reach More Renters</h3>
                <p className="text-sm text-muted-foreground">
                  Your property is visible to thousands of verified users actively looking.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-soft border border-border">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-navy mb-2">Easy Management</h3>
                <p className="text-sm text-muted-foreground">
                  Update your listing anytime. Request edits or deletions easily.
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
