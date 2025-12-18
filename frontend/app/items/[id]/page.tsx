"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

interface Params {
  id: string;
}

interface Item {
  id: string;
  ItemName: string;
  price: number;
  Description: string;
  Category: string;
  Sellername: string;
  ImageURL: string;
  SellerID: string;
}

export default function Items({ params }: { params: Promise<Params> }) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item | null>(null);

  useEffect(() => {
    setSuccess("");
    setError("");
    const fetchData = async () => {
      const resolvedParams = await params;
      const token = Cookies.get("token");
      if (token && resolvedParams?.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/items/getitembyid?id=${resolvedParams.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          console.log("response", data.message);
          console.log("items", data.items);
          setItems(data.items);
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      }
    };
    fetchData();
  }, [params]);

  const Onsumbit = async (id: string) => {
    setSuccess("");
    setError("");
    console.log("onSubmit");
    const token = Cookies.get("token");
    if (token) {
      try {
        console.log("id", id);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/addtocart`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ItemID: id }),
          }
        );
        if (response.ok) {
          console.log("response", response);
          const data = await response.json();
          console.log("response", data.message);
          setSuccess(data.message);
        } else {
          console.log("response", response);
          const data = await response.json();
          console.log("response", data.message);
          setError(data.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  return (
    <>
      {items ? (
        <section className="max-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-screen mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-3/5 relative overflow-hidden flex items-center justify-center bg-gray-100">
                  <div className="aspect-square lg:aspect-[4/3] lg:h-[600px] lg:w-[800px] relative flex items-center justify-center">
                    <Image
                      alt={items.ItemName}
                      src={items.ImageURL || "/iit.png"}
                      width={800} // Specify width
                      height={600} // Specify height
                      className="max-w-full max-h-full object-contain object-center rounded-lg shadow-lg"
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent lg:hidden"></div>
                  </div>
                </div>
                {/* Content Section - Right Side */}
                <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-between">
                  {/* Header */}
                  <div>
                    <div className="mb-6">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {items.ItemName}
                      </h1>
                      <div className="flex items-center mb-4">
                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                          ₹{items.price}
                        </span>
                      </div>
                    </div>
                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {items.Description}
                      </p>
                    </div>
                    {/* Category and Seller Info */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <svg
                          className="w-6 h-6 mr-3 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <div>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Category
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {items.Category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <svg
                          className="w-6 h-6 mr-3 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Seller
                          </span>
                          <p className="text-lg font-semibold text-gray-900">
                            {items.Sellername}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Alerts and Action Button */}
                  <div className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                        <div className="flex">
                          <svg
                            className="w-5 h-5 text-red-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </div>
                    )}
                    {success && (
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                        <div className="flex">
                          <svg
                            className="w-5 h-5 text-green-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-green-700 font-medium">
                            {success}
                          </p>
                        </div>
                      </div>
                    )}
                    <button
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      onClick={() => Onsumbit(items.id)}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3H1m6 10a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
                        />
                      </svg>
                      <span className="text-lg">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-4"></div>
            <p className="text-xl text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}
