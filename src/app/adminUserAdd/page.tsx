"use client";

import React, { useState } from "react";
import { z } from "zod";

// Define the validation schema
const schema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email cannot be longer than 255 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password cannot be longer than 255 characters")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
});

// TypeScript type for form data
type FormData = z.infer<typeof schema>;

const UserForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using Zod schema
    const result = schema.safeParse({ email, password });

    if (!result.success) {
      // If validation fails, display the errors
      setError(result.error.errors.map((err) => err.message).join(", "));
      return;
    }

    try {
      const res = await fetch("/api/adminUserAdd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setEmail("");
        setPassword("");
        setError(null);
      } else {
        setError(data.error || "Unknown error");
        setMessage("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit form");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </label>
        <br />
        <label className="block text-gray-700 mb-2">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </label>
        <br />
        <button
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="submit"
        >
          Submit
        </button>
        {message && (
          <p className="mt-4 text-green-500 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default UserForm;
