"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Item {
  _id: string;
  productName: string;
  price: number;
  Description: string;
  Category: string;
  sellerName: string;
  SellerID: string;
}

export default function MyCart() {
  // move defaults here:
  const apiBaseUrl = "";
  const currency = "RS";
  const defaultTheme = {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#10b981",
    text: "#1f2937",
    background: "#ffffff",
    cardBackground: "#ffffff"
  };
  const theme = defaultTheme;

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [placing, setPlacing] = useState<boolean>(false);
  const [removing, setRemoving] = useState<string>("");
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [sum, setSum] = useState<number>(0);

  const calculateTotal = (cartItems: Item[]): number => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  useEffect(() => {
    const fetchCartData = async (): Promise<void> => {
      setError("");
      setLoading(true);

      const token = Cookies.get("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/getcart`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setItems(data.cart || []);
        setSum(calculateTotal(data.cart || []));
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [apiBaseUrl]);

  const handlePlaceOrder = async (): Promise<void> => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setPlacing(true);
    setError("");

    const token = Cookies.get("token");
    if (!token) {
      setError("Authentication required");
      setPlacing(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/placeorder`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const otpMessage = [
          `OTP: ${data.OTP}`,
          "Please show this OTP to the delivery person.",
          "Thank you for shopping with us!",
          "Remember the OTP for future reference."
        ].join("\n\n");

        alert(otpMessage);
        router.push("/orders");
      } else {
        setError(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const handleRemoveItem = async (itemId: string): Promise<void> => {
    setRemoving(itemId);
    setError("");

    const token = Cookies.get("token");
    if (!token) {
      setError("Authentication required");
      setRemoving("");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/removefromcart`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ItemID: itemId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.cart || []);
      setSum(calculateTotal(data.cart || []));
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    } finally {
      setRemoving("");
    }
  };

  const formatPrice = (price: number): string => {
    return `${currency} ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen pt-20 flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: theme.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 pb-12"
      style={{ backgroundColor: theme.background, color: theme.text }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.text }}
          >
            Shopping Cart
          </h1>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: theme.primary }}
          ></div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: theme.secondary }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Your cart is empty
            </h3>
            <p className="mb-8" style={{ color: theme.secondary }}>
              Looks like you haven’t added any items to your cart yet.
            </p>
            <button
              onClick={() => router.push("/searchitems")}
              className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                backgroundColor: theme.primary,
                color: theme.background
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: theme.text }}
                >
                  Cart Items ({items.length})
                </h2>
              </div>

              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="group relative rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                  style={{
                    backgroundColor: theme.cardBackground,
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 mb-4 sm:mb-0">
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: theme.text }}
                      >
                        {item.productName}
                      </h3>
                      <p className="mb-2" style={{ color: theme.secondary }}>
                        {item.Description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span
                          className="px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: `${theme.primary}20`,
                            color: theme.primary
                          }}
                        >
                          {item.Category}
                        </span>
                        <span style={{ color: theme.secondary }}>
                          Seller: {item.sellerName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-4">
                      <div className="text-right">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: theme.text }}
                        >
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        disabled={removing === item._id}
                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        {removing === item._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="sticky top-24 rounded-2xl border border-gray-100 p-6 shadow-sm"
                style={{ backgroundColor: theme.cardBackground }}
              >
                <h3
                  className="text-xl font-semibold mb-6"
                  style={{ color: theme.text }}
                >
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span style={{ color: theme.secondary }}>
                      Subtotal ({items.length} items)
                    </span>
                    <span style={{ color: theme.text }}>
                      {formatPrice(sum)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: theme.secondary }}>Shipping</span>
                    <span style={{ color: theme.accent }}>Free</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span
                        className="text-lg font-semibold"
                        style={{ color: theme.text }}
                      >
                        Total
                      </span>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: theme.text }}
                      >
                        {formatPrice(sum)}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing || items.length === 0}
                  className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.background
                  }}
                >
                  {placing ? (
                    <div className="flex items-center justify-center">
                      <div
                        className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3"
                        style={{ borderColor: theme.background }}
                      ></div>
                      Processing...
                    </div>
                  ) : (
                    `Place Order • ${formatPrice(sum)}`
                  )}
                </button>

                <button
                  onClick={() => router.push("/searchitems")}
                  className="w-full mt-3 py-3 rounded-xl font-medium border-2 transition-all duration-200 hover:shadow-md"
                  style={{
                    borderColor: theme.primary,
                    color: theme.primary,
                    backgroundColor: "transparent"
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
