"use client";
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Params {
  id: string;
}

export default function OTPVerification({ params }: { params: Promise<Params> }) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<Params | null>(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    params.then((data) => setResolvedParams(data));
    setSuccess("");
    setError("");
  }, [params]);

  const handleSubmit = async (id: string) => {
    if (otp.length !== 6) {
      setError("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setSuccess("");
    setError("");

    const token = Cookies.get("token");
    
    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/closeorder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, OTP: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/Deliveritems");
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    // Add your resend OTP logic here
    setError("");
    setSuccess("");
    setOtp("");
    // You can add an API call to resend OTP here
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        {/* Header Section */}
        <div className="header-section">
          <div className="icon-container">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="otp-icon"
            >
              <path
                d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="title">Verify Order</h2>
          <p className="subtitle">
            {resolvedParams ? (
              <>
                Enter the 6-digit OTP to close order{" "}
                <span className="order-id">#{resolvedParams.id}</span>
              </>
            ) : (
              "Loading order details..."
            )}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-container">
            <div className="success-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" fill="#22C55E" />
                <path
                  d="M9 12L11 14L15 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="success-message">{success}</h3>
            <p className="success-subtitle">Redirecting to delivery items...</p>
          </div>
        )}

        {/* OTP Input Section */}
        {!success && (
          <div className="otp-section">
            <div className="input-container">
              <label className="input-label">Enter OTP</label>
              <OtpInput
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError("");
                }}
                numInputs={6}
                renderSeparator={<span className="separator">-</span>}
                renderInput={(props) => <input {...props} className="otp-input" />}
                inputStyle={{
                  width: "48px",
                  height: "48px",
                  fontSize: "18px",
                  fontWeight: "600",
                  textAlign: "center",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  outline: "none",
                  transition: "all 0.2s ease-in-out",
                }}
                // Removed focusStyle as it is not supported by react-otp-input
              />
            </div>

            {/* Error Message */}
            {error && (
              <Alert variant="danger" className="error-alert">
                <div className="error-content">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="error-icon"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{error}</span>
                </div>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="button-container">
              <Button
                variant="primary"
                onClick={() => resolvedParams && handleSubmit(resolvedParams.id)}
                disabled={loading || otp.length !== 6}
                className="submit-button"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="spinner"
                    />
                    Verifying...
                  </>
                ) : (
                  "Verify & Close Order"
                )}
              </Button>

              <button
                type="button"
                onClick={handleResendOTP}
                className="resend-button"
                disabled={loading}
              >
                Didn&apos;t receive code? Resend OTP
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .otp-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .otp-card {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 40px;
          width: 100%;
          max-width: 480px;
          border: 1px solid #f1f5f9;
        }

        .header-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .icon-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 50%;
          color: white;
          margin-bottom: 24px;
        }

        .otp-icon {
          width: 48px;
          height: 48px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 8px;
          margin-top: 0;
        }

        .subtitle {
          font-size: 16px;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 0;
        }

        .order-id {
          font-weight: 600;
          color: #3b82f6;
        }

        .success-container {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          margin-bottom: 24px;
        }

        .success-message {
          font-size: 24px;
          font-weight: 600;
          color: #22c55e;
          margin-bottom: 8px;
        }

        .success-subtitle {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 0;
        }

        .otp-section {
          width: 100%;
        }

        .input-container {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
          text-align: center;
        }

        .separator {
          margin: 0 8px;
          color: #d1d5db;
          font-weight: 600;
        }

        .error-alert {
          margin-bottom: 24px;
          border: none;
          border-radius: 8px;
          background: #fef2f2;
          border-left: 4px solid #ef4444;
        }

        .error-content {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #dc2626;
        }

        .error-icon {
          flex-shrink: 0;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .submit-button {
          width: 100%;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          transition: all 0.2s ease-in-out;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          margin-right: 8px;
        }

        .resend-button {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 500;
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s ease-in-out;
        }

        .resend-button:hover:not(:disabled) {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .resend-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .otp-card {
            padding: 24px;
            margin: 16px;
          }

          .title {
            font-size: 24px;
          }

          .subtitle {
            font-size: 14px;
          }

          .icon-container {
            width: 64px;
            height: 64px;
          }

          .otp-icon {
            width: 32px;
            height: 32px;
          }

          .otp-input {
            width: 40px !important;
            height: 40px !important;
            font-size: 16px !important;
          }

          .separator {
            margin: 0 4px;
          }
        }

        @media (max-width: 480px) {
          .otp-container {
            padding: 16px;
          }

          .otp-card {
            padding: 20px;
          }

          .otp-input {
            width: 36px !important;
            height: 36px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}