"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from 'lucide-react';
import { Search } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { ShoppingBag } from 'lucide-react';
import { Store } from "lucide-react";
import { MessageCircleMore } from 'lucide-react';
import {
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Cookies from "js-cookie";

const VerticalSidebarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Profile");
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  // Ensure consistent hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const menuItems = [
    {
      id: "Profile",
      title: "Profile",
      icon: <User className="w-5 h-5" />,
      href: "/",
    },
    {
      id: "SearchItems",
      title: "Search Items",
      icon: <Search className="w-5 h-5" />,
      href: "/searchitems",
    },
    {
      id: "My Cart",
      title: "My Cart",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/mycart",
    },
    {
      id: "Orders",
      title: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      href: "/orders",
    },
    {
      id: "Deliveritems",
      title: "Deliver Items",
      icon: <Store className="w-5 h-5" />,
      href: "/Deliveritems",
    },
    {
      id: "Chat",
      title: "Chat",
      icon: <MessageCircleMore className="w-5 h-5" />,
      href: "/chat",
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userdetails");
    console.log("Logout clicked");
    router.push("/login");
  };

  const handleLinkClick = (id, href) => {
    setActiveLink(id);
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  // Show a consistent layout during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Desktop Sidebar - Fixed width during hydration */}
        <aside className="hidden lg:flex flex-col bg-white shadow-lg w-64 fixed left-0 top-0 h-screen z-40">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
            <div>
              <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                Buy & Sell <span className="text-blue-600">@IIITH</span>
              </h1>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  activeLink === item.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="ml-3">{item.title}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-gray-200">
            <button className="w-full flex items-center px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md">
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3 h-16">
              <button className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">
                Buy & Sell <span className="text-blue-600">@IIITH</span>
              </h1>
              <div className="w-9"></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-6">
            <div className="h-full">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full p-4 lg:p-6 overflow-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } fixed left-0 top-0 h-screen z-40`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
            <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
              Buy & Sell <span className="text-blue-600">@IIITH</span>
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id, item.href)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                activeLink === item.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className={`flex-shrink-0 ${!isSidebarOpen && 'mx-auto'}`}>{item.icon}</span>
              <span className={`ml-3 transition-all duration-300 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                {item.title}
              </span>
              
              {/* Tooltip for collapsed sidebar */}
              {!isSidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  {item.title}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md group relative"
          >
            <LogOut className={`w-4 h-4 flex-shrink-0 ${!isSidebarOpen && 'mx-auto'}`} />
            <span className={`ml-3 transition-all duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              Logout
            </span>
            
            {/* Tooltip for collapsed sidebar */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                Logout
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">
            Buy & Sell <span className="text-blue-600">@IIITH</span>
          </h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id, item.href)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeLink === item.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Logout */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      }`}>
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3 h-16">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              Buy & Sell <span className="text-blue-600">@IIITH</span>
            </h1>
            <div className="w-9"></div> {/* Spacer for alignment */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full p-4 lg:p-6 overflow-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerticalSidebarLayout;