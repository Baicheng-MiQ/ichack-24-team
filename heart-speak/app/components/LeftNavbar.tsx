"use client";

import React from "react";
import Link from "next/link";

import image1 from "../../public/assets/image1.png";

const LeftNavbar = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white fixed">
      <img src="/assets/logo.png"alt="logo" />
      <ul>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/">Home</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/about">About</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/services">Services</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftNavbar;
