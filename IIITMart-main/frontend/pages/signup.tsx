"use client";
import React, { FormEvent } from "react";
import styles from "../styles/signup.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function Signup() {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Password strength checker function
  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: "Too Short", color: "red", score: 0 };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score <= 2) return { strength: "Weak", color: "red", score };
    if (score <= 3) return { strength: "Fair", color: "orange", score };
    if (score <= 4) return { strength: "Good", color: "blue", score };
    return { strength: "Strong", color: "green", score };
  };

  const passwordStrength = getPasswordStrength(password);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    console.log("onSubmit");
    event.preventDefault();

    // Check password length before submission
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    console.log("form submitted");
    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      age: formData.get("age"),
      contactNumber: formData.get("contactNumber"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("response", response);
    if (response.ok) {
      const responseData = await response.json();
      console.log("Signup successful:", responseData);
      router.push("/");
      Cookies.set("token", responseData.token, { expires: 30000, path: "/" });
      const userdetails = [responseData.id, responseData.Name];
      Cookies.set("userdetails", JSON.stringify(userdetails), {
        expires: 30000, path: "/",
      });
      console.log("cookie is set");
      setAge("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setPassword("");
    } else {
      const responseData = await response.json();
      const er = responseData.message;
      setError(er);
      setAge("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setPassword("");
      console.error("Signup failed:", response.statusText);
    }
  }

  return (
    <div className={styles.Signupcontainer} id="Signupcontainer">
      <div className={styles.Signupform} id="Signupform">
        <h1 style={{ color: "blue" }}> Sign up</h1>
        <Form onSubmit={onSubmit}>
          <div className="form-row">
            <Form.Group
              className="mb-2"
              controlId="formGroupFirstName"
              style={{ flex: 1 }}
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                required={true}
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Form.Group>
            <Form.Group
              className="mb-4"
              controlId="formGroupLastName"
              style={{ flex: 1 }}
            >
              <Form.Label>LastName</Form.Label>

              <Form.Control
                type="text"
                placeholder="Last name"
                required={true}
                name="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-4" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="IIIT Mail ID"
              name="email"
              required={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          
          {/* Enhanced Password Field */}
          <Form.Group className="mb-4" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password (minimum 6 characters)"
                name="password"
                required={true}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#6c757d"
                }}
              >
              {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: "8px" }}>
                <div style={{ 
                  fontSize: "12px", 
                  color: passwordStrength.color,
                  fontWeight: "bold"
                }}>
                  Password Strength: {passwordStrength.strength}
                </div>
                <div style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "2px",
                  marginTop: "4px"
                }}>
                  <div style={{
                    width: `${(passwordStrength.score / 5) * 100}%`,
                    height: "100%",
                    backgroundColor: passwordStrength.color,
                    borderRadius: "2px",
                    transition: "width 0.3s ease"
                  }}></div>
                </div>
                <div style={{ fontSize: "11px", color: "#6c757d", marginTop: "4px" }}>
                  {password.length < 6 && "Password must be at least 6 characters"}
                  {password.length >= 6 && passwordStrength.score < 5 && 
                    "Include uppercase, lowercase, numbers, and symbols for stronger security"
                  }
                </div>
              </div>
            )}
          </Form.Group>

          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Group className="mb-4" controlId="formGroupNumber">
              <Form.Label>Age:</Form.Label>
              <Form.Control
                type="number"
                placeholder="age"
                required={true}
                name="age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formGroupContact">
              <Form.Label>Contact number:</Form.Label>
              <Form.Control
                type="tel"
                placeholder="contact number"
                required={true}
                name="contactNumber"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
              />
            </Form.Group>
          </div>
          
          {error && (
            <Alert
              key={"danger"}
              variant={"danger"}
            >
              {error}
            </Alert>
          )}
          
          <div className="login-link-container">
            <span>Already have an account?</span>
            <Link href="/login" style={{ textDecoration: "none" }}>
              Login here
            </Link>
          </div>
          
          <Button
            variant="primary"
            type="submit"
            disabled={password.length < 6}
            style={{
              width: "100%",
              padding: "12px",
              margin: "4px",
              opacity: password.length < 6 ? 0.6 : 1
            }}
          >
            Signup
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Signup;