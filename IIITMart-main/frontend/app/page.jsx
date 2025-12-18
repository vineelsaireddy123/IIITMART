"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { User, Mail, Phone, Calendar, Edit3, ShoppingBag, Star, MapPin } from "lucide-react";

export default function Profile() {
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const validateEmail = (email) => {
    const pattern = /(@students\.iiit\.ac\.in$|@iiit\.ac\.in$|@research\.iiit\.ac\.in$)/;
    return pattern.test(email.trim());
  };

  const validateMobile = (mobile) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(mobile);
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getuserdetails`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setAge(data.age || "");
          setEmail(data.email || "");
          setPhone(data.contactNumber || "");
          console.log (data.ordersCount);
          setOrdersCount(data.ordersCount || 0);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setError("Failed to load profile data");
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const handleEditProfile = () => {
    redirect("/editprofile");
  };

  const handleSellItems = () => {
    redirect("/sell");
  };

  const generateAvatar = (firstName, lastName) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return (
      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
        {initials || <User size={48} />}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Dashboard</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {generateAvatar(firstName, lastName)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {firstName && lastName ? `${firstName} ${lastName}` : "User Profile"}
                </h2>
                <p className="text-gray-500 mb-6">IIIT Student</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <Edit3 size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSellItems}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    <ShoppingBag size={18} />
                    Sell Items
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{email || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{phone || "Not provided"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-gray-800">{age || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Reviews</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Star size={32} className="text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Items Sold</p>
                    <p className="text-3xl font-bold"> 
                     {ordersCount || 0} 
                    </p>
                  </div>
                  <ShoppingBag size={32} className="text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Rating</p>
                    <p className="text-3xl font-bold">5.0</p>
                  </div>
                  <div className="flex text-purple-200">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Recent Reviews</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              
              <div className="text-center py-12">
                <Star size={48} className="text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-600 mb-2">No Reviews Yet</h4>
                <p className="text-gray-500 mb-6">
                  Start selling items to receive your first review!
                </p>
                <button
                  onClick={handleSellItems}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  List New Item
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}