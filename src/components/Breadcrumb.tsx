// src/components/Breadcrumb.tsx
"use client";

import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="text-sm text-gray-500 mb-4 px-4 md:px-0" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center space-x-1">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {item.href ? (
                            <Link href={item.href} className="hover:underline text-xs md:text-sm">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-600 text-xs md:text-sm">{item.label}</span>
                        )}
                        {index < items.length - 1 && <span className="mx-1 text-xs md:text-sm">&gt;</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
