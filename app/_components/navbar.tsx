"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center justify-between border-b border-solid px-2 py-2 lg:flex-row lg:px-8 lg:py-4">
      <div className="relative h-10 w-32 lg:h-10 lg:w-44">
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          sizes="100%"
        />
      </div>
      <div className="flex w-full items-center gap-2 px-2 lg:gap-10">
        <div className="lg:pr-auto flex w-full items-center gap-2 lg:gap-10">
          <Link
            href="/"
            className={`text-sm lg:text-xl ${
              pathname === "/"
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={`text-sm lg:text-xl ${
              pathname === "/transactions"
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }`}
          >
            Transações
          </Link>
          <Link
            href="/subscription"
            className={`text-sm lg:text-xl ${
              pathname === "/subscription"
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }`}
          >
            Assinatura
          </Link>
        </div>
        <UserButton showName />
      </div>
    </nav>
  );
};

export default NavBar;
