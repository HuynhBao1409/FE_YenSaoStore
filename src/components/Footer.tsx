// src/components/Footer.tsx
'use client'

import Image from 'next/image';

const navItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khám phá", path: "/kham-pha" },
    { label: "A.I", path: "/ai" },
    { label: "Mobile", path: "/mobile" },
    { label: "Game", path: "/game" },
    { label: "Đánh giá", path: "/danh-gia" },
    { label: "Đồ chơi số", path: "/do-choi-so" },
];

const socialLinks = [
    { platform: "youtube", url: "https://www.youtube.com/" },
    { platform: "facebook", url: "https://www.facebook.com/" },
    { platform: "tiktok", url: "https://www.tiktok.com/" },
    { platform: "instagram", url: "https://www.instagram.com/" },
];


export default function Footer() {
    return (
        <footer className="bg-[#F9FAFB] py-[56px] w-full flex flex-col gap-[10px] justify-center">
            <div className="flex flex-col gap-10 lg:gap-[48px] w-full max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Desktop Layout */}
                <div className="hidden lg:flex justify-between items-center gap-[32px]">
                    {/* Nav menu */}
                    <div className="flex gap-[32px] text-[19px] font-medium leading-[28px]">
                        {navItems.map(({ label, path }, index) => (
                            <a key={index} href={path} className="text-black hover:text-[#62BC27] transition-colors whitespace-nowrap">
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Social icons */}
                    <div className="flex gap-4">
                        {socialLinks.map(({ platform, url }) => (
                            <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-black bg-white cursor-pointer flex items-center justify-center hover:bg-[#DAFFB3] transition-colors"
                            >
                                <Image
                                    src={`/assets/icons/${platform}.svg`}
                                    alt={platform}
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden flex flex-col gap-10">
                    {/* Logo and Company Info */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                            <Image
                                src="/assets/images/Logo.svg"
                                alt="HCM57"
                                width={214}
                                height={113}
                                className="max-w-[160px] sm:max-w-[214px] max-h-[96px] object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-black">
                            <p><strong>CÔNG TY TNHH HCM57 TECHNOLOGY</strong></p>
                            <p>Hotline: 091.990.5757</p>
                            <p>Email: contact@hcm57.com</p>
                            <p>Địa chỉ: Tầng 5, Tòa nhà VCN TOWER 02 Tố Hữu, Phước Hải, Khánh Hòa, Việt Nam.</p>
                        </div>
                    </div>

                    {/* Social icons - Mobile */}
                    <div className="flex gap-4 justify-center w-[272px] h-[56px] mx-auto">
                        {socialLinks.map(({ platform, url }) => (
                            <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-black bg-white cursor-pointer flex items-center justify-center hover:bg-[#DAFFB3] transition-colors"
                            >
                                <Image
                                    src={`/assets/icons/${platform}.svg`}
                                    alt={platform}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            </a>
                        ))}
                    </div>

                    {/* Navigation Menu - Mobile Vertical */}
                    <div className="flex flex-col gap-8 text-[16px] sm:text-[18px] font-medium leading-[24px] sm:leading-[28px]">
                        {navItems.map(({ label, path }, index) => (
                            <a key={index} href={path} className="text-black hover:text-[#62BC27] transition-colors">
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Desktop Company Info */}
                <div className="hidden lg:flex gap-6 items-start">
                    <Image
                        src="/assets/images/Logo.svg"
                        alt="HCM57"
                        width={214}
                        height={113}
                        className="max-h-[96px] object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col gap-1 text-[16px] leading-[24px] text-black">
                        <p><strong>CÔNG TY TNHH HCM57 TECHNOLOGY</strong></p>
                        <p>Hotline: 091.990.5757</p>
                        <p>Email: contact@hcm57.com</p>
                        <p>Địa chỉ: Tầng 5, Tòa nhà VCN TOWER 02 Tố Hữu, Phước Hải, Khánh Hòa, Việt Nam.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}