// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from 'next/router';

// import image1 from "../../public/assets/image1.png";

// const LeftNavbar = () => {
//   return (
//     <div className="w-full w-64 bg-gray-800 bg-opacity-25 text-white fixed flex">
//       <img src="/assets/logo.png" alt="logo"></img>

//       <ul>
//         <li className="p-4 hover:bg-gray-700">
//           <Link href="/">Home</Link>
//         </li>
//         <li className="p-4 hover:bg-gray-700">
//           <Link href="/record">Record</Link>
//         </li>
//         <li className="p-4 hover:bg-gray-700">
//           <Link href="/services">Services</Link>
//         </li>
//         <li className="p-4 hover:bg-gray-700">
//           <Link href="/contact">Contact</Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default LeftNavbar;

import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
];
const LeftNavbar = () => {
  return (
    <header className="w-full w-64 bg-gray-800 bg-opacity-25 text-white fixed flex">
      <nav className="flex justify-between items-center px-6 md:px-20 py-4 bg-gray-800">
        <Link href="/" className="flex items-center gap-1">
          <img src="/assets/logo.png" alt="logo"></img>
        </Link>

        <div className="flex itms-center gap-1"></div>
      </nav>
    </header>
  );
};

export default LeftNavbar;
