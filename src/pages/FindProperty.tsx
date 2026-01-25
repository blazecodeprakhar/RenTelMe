
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, Grid, List, Heart,
  Users, ChevronDown, SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/cards/PropertyCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "family", label: "For Family" },
  { value: "students", label: "For Students" },
  { value: "girls", label: "Girls Only" },
  { value: "boys", label: "Boys Only" },
  { value: "couples", label: "Married Couples" },
  { value: "commercial", label: "Commercial" },
];

const FindProperty = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Only fetch verified properties for main site
        const q = query(collection(db, "properties"), where("status", "==", "Verified"));
        const querySnapshot = await getDocs(q);
        const fetchedProperties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = (property.location?.toLowerCase() || "").includes(searchLocation.toLowerCase()) ||
      (property.title?.toLowerCase() || "").includes(searchLocation.toLowerCase());

    // Normalize property type matching
    const matchesType = selectedType === "all" ||
      (property.propertyFor?.toLowerCase() || "").includes(selectedType.toLowerCase()) ||
      (property.type?.toLowerCase() || "").includes(selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-warm">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-navy mb-4">
              Find Your Ideal Rental
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search from our verified listings with complete neighborhood insights.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card p-4 md:p-6 rounded-2xl shadow-elevated max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter city, area, or property name..."
                  className="pl-10 h-12 border-border"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-[200px] h-12">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90 h-12">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["For Family", "For Students", "Girls Only", "Boys Only", "Commercial"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedType(filter.toLowerCase().replace(" ", ""))}
                  className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedType === filter.toLowerCase().replace(" ", "")
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent hover:bg-primary/10"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container-section">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-navy">
                {loading ? "Loading..." : `${filteredProperties.length} Properties Found`}
              </h2>
              <p className="text-muted-foreground text-sm">
                {selectedType !== "all" ? `Showing ${propertyTypes.find(t => t.value === selectedType)?.label}` : "All verified listings"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-20">Loading Verified Properties...</div>
          ) : filteredProperties.length > 0 ? (
            <motion.div
              layout
              className={`grid gap-6 ${viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
                }`}
            >
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PropertyCard {...property} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-navy mb-2">
                No Properties Found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters.
              </p>
              <Button onClick={() => { setSearchLocation(""); setSelectedType("all"); }}>
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Load More */}
          {filteredProperties.length > 12 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Properties
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-12 bg-accent">
        <div className="container-section">
          <div className="bg-card rounded-2xl p-8 shadow-soft">
            <h3 className="font-heading text-2xl font-semibold text-navy mb-4">
              Search Tips
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Use Specific Locations</h4>
                  <p className="text-sm text-muted-foreground">
                    Search by area name for more accurate results
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Filter by Category</h4>
                  <p className="text-sm text-muted-foreground">
                    Select property type that matches your lifestyle
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Save Favorites</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the heart icon to save properties for later
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FindProperty;
