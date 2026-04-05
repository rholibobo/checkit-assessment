"use client";

import { useState, useEffect } from "react";
import { HamburgerMenu } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
      }
    }, 300);
  };


  return (
    <header>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-primary-200"
            : "bg-transparent border-b border-primary-400"
        }`}
      >
        <div className="app-container">
          <div className="flex items-center justify-between h-18">
            <div className="px-4 h-20 flex items-center">
              <Link href={"/"} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-800 flex items-center justify-center shrink-0 font-bold text-white">
                  MZ
                </div>
                <span className="font-bold text-grey-1000 text-lg">Movie Zone</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-10">
              <button
                className="bg-primary text-white font-semibold px-7 py-3 rounded-full hover:bg-primary-600 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Get Started
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center z-60"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block w-full h-0.5 bg-primary rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "rotate-45 translate-y-2.25" : ""
                  }`}
                />
                <span
                  className={`block w-full h-0.5 bg-primary rounded-full transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-full h-0.5 bg-primary rounded-full transition-all duration-300 origin-center ${
                    isMenuOpen ? "-rotate-45 -translate-y-2.25" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-75 max-w-[85vw] bg-white z-50 md:hidden transition-transform duration-300 ease-out shadow-xl ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-18 px-6 border-b border-gray-100">
            <span className="text-lg font-semibold text-primary">Menu</span>
            <HamburgerMenu size="32" color="#FF8A65" />
          </div>

          <nav className="flex flex-col px-6 pt-4"></nav>

          <div className="px-6 mt-8">
            <button
              onClick={() => scrollToSection("get-started")}
              className="w-full bg-primary text-white font-semibold py-4 rounded-full hover:bg-primary-600 active:scale-95 transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          <div className="mt-auto px-6 pb-8">
            <p className="text-grey-700 text-sm">
              Need help?{" "}
              <span className="text-primary font-medium">
                Reach out to support
              </span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export function NavbarWrapper() {
  const pathname = usePathname();

  const shouldHideNavbar = pathname?.match(/^\/movies\/[^/]+\/*/);

  return shouldHideNavbar ? null : <Navbar />;
}

// export default NavbarWrapper;
