'use client'

import { useEffect, useState } from 'react';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setVisible(window.scrollY > 50);
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`
            fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50
            w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] p-0 rounded-full
            flex items-center justify-center cursor-pointer 
            transition-all duration-300 hover:scale-110 bg-transparent
            ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        >
            <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="w-[36px] h-[36px] text-[#BABABA] mt-1 transition-transform duration-500 ease-in-out animate-bounce scale-155"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="m6.293 13.293 1.414 1.414L12 10.414l4.293 4.293 1.414-1.414L12 7.586z"></path>
            </svg>
        </button>

    );
}
