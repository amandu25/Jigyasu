"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { useToast } from "../../../@/components/ui/use-toast";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

interface Course {
  id: number;
  course_name: string;
  course_price: number;
  course_duration: string;
  course_rating: string;
}

const toastContainerStyle = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 9999,
};

export default function ProductList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const { toast } = useToast();
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItemCount(savedCart.length);
  }, []);

  const handleAddToCart = (course: Course) => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = savedCart.find(
      (item: Course & { quantity: number }) => item.id === course.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      savedCart.push({ ...course, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(savedCart));
    setCartItemCount(savedCart.length);
    toast({
      description: `${course.course_name} has been added to cart.`,
    });
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex space-x-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="relative">
          <Link href="/cart" className="flex items-center text-white">
            <FaShoppingCart className="text-2xl" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-1 -translate-x-1/2 translate-y-1/2">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
      <Table>
        <TableCaption>A list of available courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Course Price</TableHead>
            <TableHead>Course Duration</TableHead>
            <TableHead>Course Rating</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                {course.course_name}
              </TableCell>
              <TableCell>${course.course_price}</TableCell>
              <TableCell>{course.course_duration}</TableCell>
              <TableCell>{course.course_rating}</TableCell>
              <TableCell>
                <button
                  onClick={() => handleAddToCart(course)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add to Cart
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
