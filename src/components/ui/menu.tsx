"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const pathname = usePathname();

  const menu = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="flex gap-6 border-b pb-3">
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
  );
}
