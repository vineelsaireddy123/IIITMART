"use client";
import MultiActionAreaCard from "@/components/cards";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";

interface Item {
  _id: string;
  ItemName: string;
  ImageURL:string;
  price: number;
  Description: string;
  Category: string;
  SellerName: string;
  SellerID: string;
}

export default function SearchItems() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const priceRanges = [
    { label: "₹0 - ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹5000", min: 1000, max: 5000 },
    { label: "₹5000+", min: 5001, max: Infinity },
  ];

  const categories = [
    "Electronics", 
    "Sports & Outdoors", 
    "Home & Kitchen",
    "Travel Accessories",
    "Office Supplies",
    "Furniture"
  ];

  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      const token = Cookies.get("token");
      
      if (token) {
        try {
          setIsLoading(true);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/allitems`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          
          if (response.ok && data.items) {
            console.log(data.items);
            
            setItems(data.items);
          } else {
            console.error("Failed to fetch items:", data.message);
          }
        } catch (error) {
          console.error("Error fetching items:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCardClick = (ID: string) => {
    router.push(`/items/${ID}`);
  };

  const handleFilterClick = (category: string) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handlePriceFilterClick = (range: string) => {
    setSelectedPriceRange(selectedPriceRange === range ? "" : range);
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSelectedPriceRange("");
    setSearch("");
  };

  // Fixed filtering logic with proper null/undefined checks
  const filteredItems = items.filter((item) => {
    // Safe search matching with null/undefined checks
    const itemName = item?.ItemName || "";
    const searchQuery = search || "";
    const matchesSearch = 
      searchQuery.trim() === "" || 
      itemName.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filtering
    const matchesCategory =
      selectedFilters.length === 0 || 
      selectedFilters.includes(item?.Category || "");

    // Price filtering
    const priceFilter = priceRanges.find(
      (range) => range.label === selectedPriceRange
    );
    const itemPrice = item?.price || 0;
    const matchesPrice =
      !priceFilter ||
      (itemPrice >= priceFilter.min && itemPrice <= priceFilter.max);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const activeFiltersCount = selectedFilters.length + (selectedPriceRange ? 1 : 0);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <div className="container-fluid px-3 py-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold text-dark mb-2">Discover Amazing Items</h1>
              <p className="text-muted">Find exactly what you&apos;re looking for from our curated collection</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="position-relative">
              <Search 
                className="position-absolute text-muted" 
                style={{ 
                  top: '50%', 
                  left: '15px', 
                  transform: 'translateY(-50%)',
                  zIndex: 10 
                }} 
                size={20}
              />
              <input
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                type="text"
                className="form-control form-control-lg shadow-sm"
                style={{
                  paddingLeft: '50px',
                  borderRadius: '50px',
                  border: '2px solid #e9ecef',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Search for items..."
                onFocus={(e) => {
                  e.target.style.borderColor = '#007bff';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
              />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="row justify-content-center mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center me-3">
                <Filter size={18} className="text-muted me-2" />
                <span className="fw-semibold text-dark">Filters:</span>
                {activeFiltersCount > 0 && (
                  <span className="badge bg-primary ms-2">{activeFiltersCount}</span>
                )}
              </div>
              
              {/* Category Filters */}
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedFilters.includes(category) ? "primary" : "outline-primary"}
                  size="sm"
                  className="rounded-pill"
                  style={{
                    transition: 'all 0.3s ease',
                    fontWeight: '500'
                  }}
                  onClick={() => handleFilterClick(category)}
                >
                  {category}
                </Button>
              ))}

              {/* Price Range Dropdown */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant={selectedPriceRange ? "primary" : "outline-primary"}
                  size="sm" 
                  className="rounded-pill"
                  style={{ fontWeight: '500' }}
                >
                  {selectedPriceRange || "Price Range"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-lg border-0">
                  {priceRanges.map((range) => (
                    <Dropdown.Item
                      key={range.label}
                      onClick={() => handlePriceFilterClick(range.label)}
                      className={selectedPriceRange === range.label ? "active" : ""}
                      style={{
                        fontWeight: selectedPriceRange === range.label ? '600' : '400'
                      }}
                    >
                      {range.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="rounded-pill d-flex align-items-center"
                  onClick={clearAllFilters}
                >
                  <X size={16} className="me-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">
                {isLoading ? "Loading..." : `Showing ${filteredItems.length} of ${items.length} items`}
              </p>
              {search && (
                <p className="text-muted mb-0 small">
                  Search results for &quot;{search}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <Box sx={{ flexGrow: 1 }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <Search size={64} className="text-muted" />
              </div>
              <h4 className="text-muted mb-3">No items found</h4>
              <p className="text-muted">
                {search || selectedFilters.length > 0 || selectedPriceRange
                  ? "Try adjusting your search criteria or filters"
                  : "No items available at the moment"}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline-primary"
                  className="mt-3"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <Grid
              container
              spacing={{ xs: 2, sm: 3, md: 4 }}
              columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
            >
              {filteredItems.map((item, index) => (
                <Grid 
                  key={item._id || index} 
                  size={{ xs: 4, sm: 4, md: 4, lg: 3 }}
                >
                  <div 
                    style={{
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* console.l */}
                    {/* console.lo */}
                    <MultiActionAreaCard
                      Category={item.Category || "Uncategorized"}
                      id={item._id}
                      title={item.ItemName || "Untitled"}
                      ImageUrl={item.ImageURL || "/iiit.png"}
                      description={item.Description || "No description available"}
                      price={item.price || 0}
                      name={item.SellerName || "Unknown Seller"}
                      onClick={() => handleCardClick(item._id)}
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
        }
        
        .btn:hover {
          transform: translateY(-1px);
        }
        
        .dropdown-menu {
          border-radius: 15px !important;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa !important;
        }
        
        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.8rem !important;
          }
          
          .btn-sm {
            font-size: 0.8rem !important;
            padding: 0.4rem 0.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}