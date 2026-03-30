"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { apiGet } from "@/lib/api";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [orgName, setOrgName] = useState<string>("");

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await apiGet("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.organization_name) {
            setOrgName(data.organization_name);
          }
        }
      } catch {}
    };
    fetchOrg();
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/products" },
    { name: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tighter text-white group-hover:text-accent transition-colors">
                {orgName || "StockFlow"}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-accent ${
                  isActive(link.href) ? "text-accent" : "text-primary-muted"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute -bottom-[21px] left-0 w-full h-0.5 bg-accent rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </Link>
            ))}
            <div className="h-6 w-px bg-border" />
            <Button variant="ghost" onClick={logout} className="text-xs uppercase tracking-widest px-4 py-1.5 h-auto">
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-primary-muted hover:text-white hover:bg-surface focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l18 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border animate-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href) 
                    ? "bg-accent/10 text-accent" 
                    : "text-primary-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-danger hover:bg-danger/5 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
