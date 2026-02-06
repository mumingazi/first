"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Menu() {
  const pathname = usePathname();

  const menu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className=" justify-center items-center mt-3">
      <Image
        src="https://vartag.com/assets/img/vartag-yazilim.svg"
        alt="logo"
        width={200}
        height={200}
        className="w-[200px] h-[auto] mx-auto mb-2 mt-5"
      />
      <br />
      <nav className="flex gap-6 border-b pb-3 justify-center items-center bg-gray-100 rounded-md p-2">
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${
              pathname === item.href
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
