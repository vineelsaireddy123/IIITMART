"use client";
import React, { useState, FormEvent } from "react";
import styles from "../styles/login.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import Alert from "react-bootstrap/Alert";

function Login() {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  const Router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    console.log("onSubmit");
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("response", response);
    if (response.ok) {
      const responseData = await response.json();
      Router.push("/");
      setEmail("");
      setPassword("");
      Cookies.set("token", responseData.token, { expires: 30000, path: "/" });
      const userdetails = [responseData.id, responseData.Name];
      Cookies.set("userdetails", JSON.stringify(userdetails), {
        expires: 30000,
        path: "/",
      });
      console.log("cookie is set");
    } else {
      const responseData = await response.json();
      const er = responseData.message;
      setError(er);
      setEmail("");
      setPassword("");
      setRefreshReCaptcha(!refreshReCaptcha);
    }
  }

  return (
    <div
      className={styles.logincontainer}
      id="logincontainer"
      style={{ overflow: "hidden" }}
    >
      <div className={styles.loginform} id="loginform">
        <h1
          style={{
            color: "blue",
          }}
        >
          Login
        </h1>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-4" controlId="formGroupEmail">
            <Form.Label>Email </Form.Label>
            <Form.Control
              type="email"
              placeholder="a.b@iiit.ac.in"
              name="email"
              required={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              name="password"
              required={true}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            Submit
          </Button>
          <div
            style={{
              position: "relative",
              textDecoration: "none",
              padding: "8px",
            }}
          >
            <span>Don&apos;t have an account? </span>
            <Link href="/signup" style={{ textDecoration: "none" }}>
              signup
            </Link>
          </div>

          {error && (
            <Alert
              key={"danger"}
              variant={"danger"}
            >
              {error}
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
}

export default Login;
