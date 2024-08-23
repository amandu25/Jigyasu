"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

interface Course {
  id: number;
  course_name: string;
  course_price: number;
  quantity: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<Course[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const handleQuantityChange = (id: number, delta: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.course_price * item.quantity,
      0
    );
  };

  return (
    <div className="p-4">
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <Link href="/" className="text-white">
          Home
        </Link>
        <Link href="/cart" className="flex items-center text-white">
          <FaShoppingCart className="text-2xl" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-1 -translate-x-1/2 translate-y-1/2">
              {cart.length}
            </span>
          )}
        </Link>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Course Name</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Total</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">
                  {item.course_name}
                </td>
                <td className="border border-gray-300 p-2">
                  ${item.course_price}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    +
                  </button>
                </td>
                <td className="border border-gray-300 p-2">
                  ${item.course_price * item.quantity}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {cart.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Total: ${calculateTotal()}</h2>
        </div>
      )}
    </div>
  );
};

export default CartPage;
