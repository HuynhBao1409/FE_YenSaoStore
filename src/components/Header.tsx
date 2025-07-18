// src/components/Header.tsx
'use client'

import Link from 'next/link';
import Image from 'next/image'
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // useEffect(() => {
    //     fetch("http://10.208.50.7:3019/gateway/category/2")
    //         .then(res => res.json())
    //         .then(data => {

    //             const formatted = rawItems.map((item: any) => ({
    //                 label: item.name,
    //                 path: `/${item.name
    //                     .toLowerCase()
    //                     .normalize("NFD")
    //                     .replace(/[\u0300-\u036f]/g, "")
    //                     .replace(/\s+/g, "-")}`,
    //             }));

    //             // Chỉ lấy danh mục từ API
    //             setNavItems(formatted);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching categories:", error);
    //             // Fallback nếu API lỗi
    //             setNavItems([]);
    //         });
    // }, []);


    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = [
        { label: "Khám phá", path: "/kham-pha" },
        { label: "A.I", path: "/ai" },
        { label: "Mobile", path: "/mobile" },
        { label: "Game", path: "/game" },
        { label: "Đánh giá", path: "/danh-gia" },
        { label: "Đồ chơi số", path: "/do-choi-so" },
    ];
    return (
        <>
            <header className={`
                bg-white border-b border-[#e5e5e5] transition-all duration-300 z-50
                ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-md' : 'relative'}
                h-[96px] px-4 sm:px-8 md:px-16 lg:px-[256px] 
                flex items-center justify-center
            `}>
                <div className="flex items-center justify-between w-full max-w-[1512px]">
                    {/* Logo */}
                    <Link href="/">
                        <div className="font-bold text-[20px] sm:text-[24px] leading-[20px] text-[#020618] flex items-center cursor-pointer">
                            Edgetech <span className="ml-1">79</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-4 h-[28px]">
                        {navItems.map(({ label, path }, index) => (
                            <Link
                                key={index}
                                href={path}
                                className="text-black text-[17px] xl:text-[19px] leading-[28px] font-medium px-2 hover:text-[#62BC27] transition-colors whitespace-nowrap"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side - Search + Mobile Menu */}
                    <div className="flex items-center gap-6">
                        {/* Search Icon */}
                        <div className="w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg border border-[#CAD5E2] p-2 hover:bg-[#F9FAFB] hover:scale-105 transition-all duration-300">
                            <Image src="/assets/icons/search.svg" alt="Search" width={24} height={24} className="sm:w-6 sm:h-6" />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-[#F9FAFB] hover:scale-105 transition-all duration-300"
                        >
                            <div className="flex flex-col gap-1">
                                <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-black transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-black transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`
                lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300
                ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
            `} onClick={toggleMobileMenu}>
                <div className={`
                    fixed top-[96px] left-0 right-0 bg-white border-b border-[#e5e5e5] transform transition-transform duration-300
                    ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
                `} onClick={(e) => e.stopPropagation()}>
                    <nav className="flex flex-col py-4">
                        {navItems.map(({ label, path }, index) => (
                            <Link
                                key={index}
                                href={path}
                                onClick={toggleMobileMenu}
                                className="text-black text-[18px] leading-[28px] font-medium px-6 py-3 hover:text-[#62BC27] hover:bg-[#DAFFB3] transition-colors"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Spacer to prevent content jump when header becomes fixed */}
            {isScrolled && (
                <div className="h-[96px]"></div>
            )}
        </>
    );
}
