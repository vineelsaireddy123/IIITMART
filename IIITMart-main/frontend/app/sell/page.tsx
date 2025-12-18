"use client";
import React, {useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  Package,

  FileText,
  Tag,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ReceiptIndianRupee,
} from "lucide-react";

interface FormData {
  ItemName: string;
  Price: string;
  Description: string;
  Category: string;
  ImageUrl: string;
}

interface AlertState {
  message: string;
  type: "success" | "error" | "";
}

export default function ProductListingForm() {
  const [alert, setAlert] = useState<AlertState>({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    ItemName: "",
    Price: "",
    Description: "",
    Category: "",
    ImageUrl: "",
  });
  const router = useRouter();

  const categories = [
    "Electronics",
    "Clothing & Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Books & Media",
    "Health & Beauty",
    "Toys & Games",
    "Automotive",
    "Jewelry & Accessories",
    "Other",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 5000);
  };

  const validateForm = (): boolean => {
    if (!formData.ItemName.trim()) {
      showAlert("Please enter an item name", "error");
      return false;
    }
    if (!formData.Price || Number(formData.Price) <= 0) {
      showAlert("Please enter a valid price", "error");
      return false;
    }
    if (!formData.Description.trim()) {
      showAlert("Please enter a description", "error");
      return false;
    }
    if (!formData.Category.trim()) {
      showAlert("Please select a category", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/additems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          ItemName: formData.ItemName,
          Price: formData.Price,
          Description: formData.Description,
          Category: formData.Category,
          ImageUrl: formData.ImageUrl,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        showAlert("Product listed successfully! Redirecting...", "success");

        // Reset form
        setFormData({
          ItemName: "",
          Price: "",
          Description: "",
          Category: "",
          ImageUrl: "",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        const errorData = await response.json();
        showAlert(
          errorData.message || "Failed to list product. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert(
        "Network error. Please check your connection and try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            List Your Product
          </h1>
          <p className="text-gray-600">
            Share your amazing products with the world
          </p>
        </div>

        {/* Alert */}
        {alert.message && (
          <div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
              alert.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrindian-rupeeink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="font-medium">{alert.message}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Package className="h-4 w-4" />
                  Product Name
                </label>
                <input
                  type="text"
                  name="ItemName"
                  value={formData.ItemName}
                  onChange={handleInputChange}
                  placeholder="Enter your product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  required
                />
              </div>

              {/* Price */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  {/* < /> */}
                  <ReceiptIndianRupee className="h-4 w-4" />
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    Rs
                  </span>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="h-4 w-4" />
                  Category
                </label>
                <select
                  name="Category"
                  value={formData.Category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Upload className="h-4 w-4" />
                  Image URL
                </label>
                <input
                  type="text"
                  name="ImageUrl"
                  value={formData.ImageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter the image URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  required
                />
              </div>
              {/* Description */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  Description
                </label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your product in detail. Include features, condition, and any other relevant information..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 resize-none"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.Description.length}/500 characters
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Listing Product...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      List Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              By listing your product, you agree to our terms of service and
              privacy policy.
            </p>
          </div>
        </div>

        {/* Tips Card */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 Tips for better listings
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use clear, descriptive product names</li>
            <li>• Set competitive prices based on market research</li>
            <li>• Write detailed descriptions highlighting key features</li>
            <li>
              • Choose the most appropriate category for better visibility
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
