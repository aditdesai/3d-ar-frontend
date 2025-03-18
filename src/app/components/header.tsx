'use client';

import { useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut, SignUpButton, useUser } from "@clerk/nextjs";

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isSignedIn } = useUser();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="border-b border-[hsl(var(--primary))]/30 bg-[hsl(var(--background))]/50 backdrop-blur sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo with responsive text size */}
                <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text whitespace-nowrap">
                    RealView3D
                </Link>

                {/* Desktop Navigation 
                <nav className={`hidden md:flex space-x-6 ${isSignedIn ? 'mr-30' : ''}`}>
                    <Link href="/" className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer">
                        Home
                    </Link>
                    <Link href="#pricing" className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer">
                        Pricing
                    </Link>
                    <Link href="#gallery" className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer">
                        Gallery
                    </Link>
                </nav>
                */}

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-3 py-1.5 text-sm sm:text-md sm:px-4 sm:py-2 border border-[hsl(var(--primary))]/50 text-white rounded-lg transition-colors duration-300 hover:border-[hsl(var(--primary))] hover:cursor-pointer">
                                Sign In
                            </button>
                        </SignInButton>

                        <SignUpButton mode="modal">
                            <button className="px-3 py-1.5 text-sm sm:text-md sm:px-4 sm:py-2 bg-[hsl(var(--primary))] text-white rounded-lg shadow-md transition-all duration-300 hover:bg-[hsl(var(--primary))]/80 hover:shadow-lg hover:cursor-pointer">
                                Register
                            </button>
                        </SignUpButton>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                    
                    {/* Mobile Menu Hamburger Button - Now positioned last (on the right) 
                    <button 
                        className="md:hidden ml-2 flex flex-col justify-center items-center w-6 h-6 space-y-1 focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                        <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                    </button>
                    */}
                </div>
            </div>

            {/* Mobile Menu Dropdown - Centered content 
            <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-40 py-2' : 'max-h-0'}`}>
                <nav className="flex flex-col space-y-2 px-4 bg-[hsl(var(--background))]">
                    <Link href="/" 
                        className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer py-2 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link href="#pricing" 
                        className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer py-2 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Pricing
                    </Link>
                    <Link href="#gallery" 
                        className="text-white hover:text-[hsl(var(--primary))] transition-colors hover:cursor-pointer py-2 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Gallery
                    </Link>
                </nav>
            </div>
            */}
        </header>
    );
};