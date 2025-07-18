// src/components/SectionLayout.tsx
import Link from 'next/link';

type CardItem = {
    id: string;
    img: string;
    title: string;
    time: string;
};

type Props = {
    title: string;
    tag: string;
    banner: string;
    mainImg: string;
    mainId: string;
    mainTitle: string;
    mainTime?: string;
    cards: CardItem[];
};

export default function SectionLayout({ title, tag, banner, mainImg, mainId, mainTitle, mainTime, cards }: Props) {
    return (
        <div className="w-full flex justify-center mt-[80px] md:mt-[60px] sm:mt-[40px] px-4 sm:px-6">
            <div className="w-full max-w-[1000px] flex flex-col gap-[29px] md:gap-6 sm:gap-4">
                {/* Header - Desktop */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#D8F999] border border-black" />
                    <h2 className="text-[28px] md:text-[24px] sm:text-[22px] leading-[36px] md:leading-[32px] sm:leading-[28px] font-bold text-black">{title}</h2>
                    <div className="flex-grow h-px bg-black ml-4" />
                    <Link href="#">
                        <button className="px-4 py-2 border border-black rounded-full bg-[#D8F999] text-[#0F172B] text-[19px] md:text-[16px] sm:text-[14px] leading-[24px] md:leading-[20px] sm:leading-[18px] font-semibold
                            cursor-pointer hover:bg-[#C5E866] hover:scale-105 transition-all duration-300">
                            Xem tất cả
                        </button>
                    </Link>
                </div>

                {/* Header - Mobile */}
                <div className="flex sm:hidden items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D8F999] border border-black" />
                    <h2 className="text-[20px] leading-[24px] font-bold text-black">{title}</h2>
                    <div className="flex-grow h-px bg-black ml-3" />
                </div>

                {/* Layout */}
                <div className="w-full flex flex-col lg:flex-row gap-6 md:gap-5 sm:gap-4">
                    {/* Left */}
                    <div className="w-full lg:w-[488px] flex flex-col gap-4 md:gap-3">
                        <Link href={`/posts/${mainId}`} className="w-full flex flex-col gap-4 md:gap-3 cursor-pointer hover:scale-105 transition-all duration-300">
                            <img src={mainImg} alt="Main" className="w-full h-[284px] md:h-[240px] sm:h-[200px] xs:h-[200px] object-cover rounded-[12px] md:rounded-[10px] sm:rounded-[8px] xs:rounded-[12px]" />
                            <div className="flex flex-col gap-2 px-4 md:px-3 py-3 xs:px-3 xs:py-2 bg-white rounded-b-[12px] md:rounded-b-[10px] sm:rounded-b-[8px] xs:rounded-b-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                                <span className="bg-[#D8F999] text-black text-[10px] md:text-[9px] xs:text-[9px] px-2 py-0.5 rounded-full font-medium leading-tight w-fit">
                                    {tag}
                                </span>
                                <h3 className="text-[19px] md:text-[16px] sm:text-[15px] xs:text-[14px] font-semibold leading-snug text-black">{mainTitle}</h3>
                                <p className="text-[13px] md:text-[12px] sm:text-[11px] xs:text-[10px] text-gray-600">{mainTime || 'Vừa đăng'}</p>
                            </div>
                        </Link>
                        {/* Banner 2*/}
                        <Link href="/khuyen-mai/mazda" className="block w-full">
                            <img
                                src={banner}
                                alt="Banner khuyến mãi"
                                className="w-full h-[141px] md:h-[120px] sm:h-[100px] xs:h-[135px] object-cover rounded-[8px] md:rounded-[6px] xs:rounded-[8px] cursor-pointer hover:opacity-95 transition-opacity duration-300"
                            />
                        </Link>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col gap-4 md:gap-3 w-full lg:flex-1">
                        {/* Desktop */}
                        <div className="hidden sm:block">
                            {[0, 1].map((row) => (
                                <div key={row} className="flex gap-4 md:gap-3 mb-4 md:mb-3 last:mb-0">
                                    {cards.slice(row * 2, row * 2 + 2).map((card, i) => (
                                        <Link href={`/posts/${card.id}`}
                                            key={i}
                                            className="flex-1 h-[289px] md:h-[260px] bg-white rounded-[12px] md:rounded-[10px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col
                                                cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
                                            <img src={card.img} alt={card.title} className="w-full h-[139px] md:h-[120px] object-cover" />
                                            <div className="p-3 md:p-2.5 flex flex-col gap-2 flex-1">
                                                <span className="bg-[#D8F999] text-black text-[10px] md:text-[9px] px-2 py-0.5 rounded-full font-medium leading-tight w-fit">{tag}</span>
                                                <h3 className="text-[14px] md:text-[13px] font-semibold leading-snug text-black line-clamp-3 flex-1">{card.title}</h3>
                                                <p className="text-[11px] md:text-[10px] text-gray-600 mt-auto">{card.time}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Mobile Cards */}
                        <div className="block sm:hidden">
                            {/* First Row */}
                            <div className="flex gap-3 mb-3 justify-center">
                                {cards.slice(0, 2).map((card, i) => (
                                    <Link href={`/posts/${card.id}`}
                                        key={i}
                                        className="flex-1 max-w-[178px] h-[281px] bg-white rounded-[12px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col
                                            cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
                                        <img src={card.img} alt={card.title} className="w-full h-[140px] object-cover" />
                                        <div className="p-3 flex flex-col gap-2 flex-1">
                                            <span className="bg-[#D8F999] text-black text-[9px] px-2 py-0.5 rounded-full font-medium leading-tight w-fit">{tag}</span>
                                            <h3 className="text-[12px] font-semibold leading-tight text-black line-clamp-4 flex-1">{card.title}</h3>
                                            <p className="text-[10px] text-gray-600 mt-auto">{card.time}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Second Row */}
                            <div className="flex gap-3 justify-center">
                                {cards.slice(2, 4).map((card, i) => (
                                    <Link href={`/posts/${card.id}`}
                                        key={i}
                                        className="flex-1 max-w-[178px] h-[281px] bg-white rounded-[12px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col
                                            cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
                                        <img src={card.img} alt={card.title} className="w-full h-[140px] object-cover" />
                                        <div className="p-3 flex flex-col gap-2 flex-1">
                                            <span className="bg-[#D8F999] text-black text-[9px] px-2 py-0.5 rounded-full font-medium leading-tight w-fit">{tag}</span>
                                            <h3 className="text-[12px] font-semibold leading-tight text-black line-clamp-4 flex-1">{card.title}</h3>
                                            <p className="text-[10px] text-gray-600 mt-auto">{card.time}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button - Mobile */}
                <div className="flex sm:hidden items-center justify-end pr-[23px] pl-[23px]">
                    <span className="w-[248px] h-[1px] bg-black mr-3"></span>
                    <Link href="#">
                        <button className="w-[132px] h-[40px] border border-black rounded-[80px] bg-[#D8F999] text-black text-[13px] leading-[16px] font-bold 
                            cursor-pointer hover:bg-[#C5E866] hover:scale-105 transition-all duration-300 flex items-center justify-center">
                            Xem tất cả
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}