// src/components/Body.tsx
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SectionLayout from '@/components/SectionLayout';
import SectionGroupLayout from '@/components/SectionGroupLayout';
import SliderSection from './SliderSection';
import Link from 'next/link';
import { getArticlesSummary } from '@/services/apiService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface Article {
    id: string;
    title: string;
    thumbnail: string;
    category_id: string;
    category_name: string;
    publish_time: string;
}

interface CardItem {
    id: string;
    img: string;
    title: string;
    time: string;
}

interface SectionData {
    id: string;
    img: string;
    title: string;
    categoryName: string;
    mainTime?: string;
    cards: CardItem[];
}

export default function Body() {
    const [highlightedPosts, setHighlightedPosts] = useState<Article[]>([]);
    const [exploreMain, setExploreMain] = useState<SectionData | null>(null); // Khám Phá
    const [aiMain, setAiMain] = useState<SectionData | null>(null); // A.I
    const [mobileMain, setMobileMain] = useState<SectionData | null>(null); // Mobile
    const [gameMain, setGameMain] = useState<SectionData | null>(null); // Game

    // Fetch data từ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getArticlesSummary();
                console.log('✅ API Response:', data);
                console.log('✅ Available Categories:', Object.keys(data?.latest_per_category ?? {}));

                // Handle highlighted posts
                const highlighted =
                    data?.highlighted ??
                    data?.data?.highlighted ??
                    data?.data?.data?.highlighted ??
                    [];
                if (Array.isArray(highlighted)) {
                    setHighlightedPosts(highlighted.slice(0, 5));
                } else {
                    console.warn('❗ No valid highlighted data found');
                }

                // Handle latest_per_category
                const latestPerCategory = data?.latest_per_category ?? {};

                // Khám Phá
                const investmentCategory = latestPerCategory['ĐẦU TƯ']?.new_list ?? [];
                if (investmentCategory.length >= 1) {
                    setExploreMain({
                        id: investmentCategory[0].id,
                        img: investmentCategory[0].thumbnail,
                        title: investmentCategory[0].title,
                        categoryName: investmentCategory[0].category_name || 'Khám phá',
                        mainTime: investmentCategory[0].publish_time ? dayjs(investmentCategory[0].publish_time).fromNow() : 'Vừa đăng',
                        cards: investmentCategory.slice(1, 5).map((article: any) => ({
                            id: article.id,
                            img: article.thumbnail,
                            title: article.title,
                            time: article.publish_time ? dayjs(article.publish_time).fromNow() : 'Vừa đăng',
                        })),
                    });
                } else {
                    console.warn('❗ Not enough articles for ĐẦU TƯ category, using fallback');
                    setExploreMain({
                        id: '0',
                        img: '/assets/images/controller.png',
                        title: 'Doodles (DOOD) là gì? Dự án NFT gọi vốn $54 triệu Đô với các ông lớn Web2 có gì đặc biệt?',
                        categoryName: 'Khám phá',
                        cards: rightCards,
                    });
                }

                // A.I
                const stockCategory = latestPerCategory['CHỨNG KHOÁN']?.new_list ?? [];
                if (stockCategory.length >= 1) {
                    setAiMain({
                        id: stockCategory[0].id,
                        img: stockCategory[0].thumbnail,
                        title: stockCategory[0].title,
                        categoryName: stockCategory[0].category_name || 'A.I',
                        mainTime: stockCategory[0].publish_time ? dayjs(stockCategory[0].publish_time).fromNow() : 'Vừa đăng',
                        cards: stockCategory.slice(1, 5).map((article: any) => ({
                            id: article.id,
                            img: article.thumbnail,
                            title: article.title,
                            time: article.publish_time ? dayjs(article.publish_time).fromNow() : 'Vừa đăng',
                        })),
                    });
                } else {
                    console.warn('❗ Not enough articles for CHỨNG KHOÁN category, using fallback');
                    setAiMain({
                        id: '0',
                        img: '/assets/images/grok.png',
                        title: 'AI crypto và những tiềm năng thay đổi blockchain trong tương lai',
                        categoryName: 'A.I',
                        cards: aiCards,
                    });
                }

                // Mobile
                const marketCategory = latestPerCategory['THỊ TRƯỜNG']?.new_list ?? [];
                if (marketCategory.length >= 1) {
                    setMobileMain({
                        id: marketCategory[0].id,
                        img: marketCategory[0].thumbnail,
                        title: marketCategory[0].title,
                        categoryName: marketCategory[0].category_name || 'Mobile',
                        mainTime: marketCategory[0].publish_time ? dayjs(marketCategory[0].publish_time).fromNow() : 'Vừa đăng',
                        cards: marketCategory.slice(1, 5).map((article: any) => ({
                            id: article.id,
                            img: article.thumbnail,
                            title: article.title,
                            time: article.publish_time ? dayjs(article.publish_time).fromNow() : 'Vừa đăng',
                        })),
                    });
                } else {
                    console.warn('❗ Not enough articles for THỊ TRƯỜNG category, using fallback');
                    setMobileMain({
                        id: '0',
                        img: '/assets/images/phone4.png',
                        title: 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển',
                        categoryName: 'Mobile',
                        cards: mobileCards,
                    });
                }

                // Game
                const realEstateCategory = latestPerCategory['CHUYỂN ĐỔI SỐ']?.new_list ?? [];
                if (realEstateCategory.length >= 1) {
                    setGameMain({
                        id: realEstateCategory[0].id,
                        img: realEstateCategory[0].thumbnail,
                        title: realEstateCategory[0].title,
                        categoryName: realEstateCategory[0].category_name || 'Game',
                        mainTime: realEstateCategory[0].publish_time ? dayjs(realEstateCategory[0].publish_time).fromNow() : 'Vừa đăng',
                        cards: realEstateCategory.slice(1, 5).map((article: any) => ({
                            id: article.id,
                            img: article.thumbnail,
                            title: article.title,
                            time: article.publish_time ? dayjs(article.publish_time).fromNow() : 'Vừa đăng',
                        })),
                    });
                } else {
                    console.warn('❗ Not enough articles for CHUYỂN ĐỔI SỐ category, using fallback');
                    setGameMain({
                        id: '0',
                        img: '/assets/images/starfield.png',
                        title: 'Web3 Game và làn sóng AI tích hợp, bùng nổ hay thoái trào?',
                        categoryName: 'Game',
                        cards: gameCards,
                    });
                }
            } catch (err) {
                console.error('❌ Error fetching API:', err);
                // Fallback tĩnh nếu API lỗi
                setExploreMain({
                    id: '0',
                    img: '/assets/images/controller.png',
                    title: 'Doodles (DOOD) là gì? Dự án NFT gọi vốn $54 triệu Đô với các ông lớn Web2 có gì đặc biệt?',
                    categoryName: 'Khám phá',
                    cards: rightCards,
                });
                setAiMain({
                    id: '0',
                    img: '/assets/images/grok.png',
                    title: 'AI crypto và những tiềm năng thay đổi blockchain trong tương lai',
                    categoryName: 'A.I',
                    cards: aiCards,
                });
                setMobileMain({
                    id: '0',
                    img: '/assets/images/phone4.png',
                    title: 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển',
                    categoryName: 'Mobile',
                    cards: mobileCards,
                });
                setGameMain({
                    id: '0',
                    img: '/assets/images/starfield.png',
                    title: 'Web3 Game và làn sóng AI tích hợp, bùng nổ hay thoái trào?',
                    categoryName: 'Game',
                    cards: gameCards,
                });
            }
        };

        fetchData();
    }, []);

    // Dữ liệu tĩnh cho fallback
    const rightCards: CardItem[] = [
        {
            id: '1',
            img: '/assets/images/coin.png',
            title: 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển',
            time: '1 giờ trước',
        },
        {
            id: '2',
            img: '/assets/images/disk.png',
            title: 'Một số xu hướng AI crypto nổi bật trong tháng 6/2025 bạn nên biết',
            time: '1 giờ trước',
        },
        {
            id: '3',
            img: '/assets/images/ssd.png',
            title: 'DeFAI tăng trưởng mạnh mẽ nhờ sự góp mặt của meme coin AI',
            time: '1 giờ trước',
        },
        {
            id: '4',
            img: '/assets/images/marksafe.png',
            title: 'Thị trường AI blockchain đang thay đổi, đâu là cơ hội?',
            time: '1 giờ trước',
        },
    ];

    const aiCards: CardItem[] = [
        {
            id: '5',
            img: '/assets/images/phone2.png',
            title: 'Gemini và Grok đang cạnh tranh vị trí dẫn đầu AI',
            time: '1 giờ trước',
        },
        {
            id: '6',
            img: '/assets/images/airpod.png',
            title: 'Meme coin AI chiếm đỉnh thị trong xu hướng crypto 2025',
            time: '1 giờ trước',
        },
        {
            id: '7',
            img: '/assets/images/phone3.png',
            title: 'Thị trường AI blockchain: Đâu là "chatGPT" tiếp theo?',
            time: '1 giờ trước',
        },
        {
            id: '8',
            img: '/assets/images/ring.png',
            title: 'AI crypto vành đai mới của blockchain trong tương lai',
            time: '1 giờ trước',
        },
    ];

    const mobileCards: CardItem[] = [
        {
            id: '9',
            img: '/assets/images/smartwacth.png',
            title: 'Nhiều coin mới nổi bật trong mảng Mobile AI',
            time: '1 giờ trước',
        },
        {
            id: '10',
            img: '/assets/images/cpu.png',
            title: 'Xu hướng thiết bị AI di động thay đổi trải nghiệm người dùng',
            time: '1 giờ trước',
        },
        {
            id: '11',
            img: '/assets/images/tablet.png',
            title: 'Meme AI Mobile dẫn đầu tăng trưởng',
            time: '1 giờ trước',
        },
        {
            id: '12',
            img: '/assets/images/phone5.png',
            title: 'Top thiết bị AI Mobile được ưa chuộng 2025',
            time: '1 giờ trước',
        },
    ];

    const gameCards: CardItem[] = [
        {
            id: '13',
            img: '/assets/images/game1.png',
            title: 'Web3 game AI tích hợp dẫn đầu xu hướng',
            time: '1 giờ trước',
        },
        {
            id: '14',
            img: '/assets/images/game2.png',
            title: 'Starfield AI Mode nhận phản hồi tích cực',
            time: '1 giờ trước',
        },
        {
            id: '15',
            img: '/assets/images/game3.png',
            title: 'Tương lai game AI: Metaverse hay thực tế?',
            time: '1 giờ trước',
        },
        {
            id: '16',
            img: '/assets/images/game4.png',
            title: 'AI game giải trí hay công cụ giáo dục?',
            time: '1 giờ trước',
        },
    ];

    return (
        <div className="w-full flex flex-col items-center">
            {/* Banner image */}
            <img
                src="/assets/images/banner.png"
                alt="Banner"
                width={1512}
                height={248}
                className="w-full h-[248px] md:h-[200px] sm:h-[148px] xs:h-[120px] object-cover"
            />

            {/* Highlighted Cards */}
            <div className="w-full max-w-[1000px] mt-[-200px] md:mt-[-160px] sm:mt-[-120px] xs:mt-[-80px] mb-[80px] md:mb-[60px] sm:mb-[40px] z-20 relative px-4 sm:px-6">
                {/* Top 2 cards */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    {highlightedPosts.slice(0, 2).map((item) => (
                        <Link
                            key={item.id}
                            href={`/posts/${item.id}`}
                            className="relative w-full lg:w-[488px] h-[326px] md:h-[280px] sm:h-[240px] xs:h-[200px] rounded-lg overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.25)] bg-cover bg-center cursor-pointer hover:scale-105 transition-transform duration-300"
                            style={{ backgroundImage: `url('${item.thumbnail}')` }}
                        >
                            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-4 xs:p-3 rounded-lg text-white bg-gradient-to-t from-[#008F41F2] to-[#008F4100] via-[#008F4180]">
                                <span className="bg-[#D8F999] text-black text-[11px] xs:text-[10px] px-2 py-0.5 rounded-full w-fit font-medium">
                                    {item.category_name}
                                </span>
                                <h3 className="mt-2 text-[18px] md:text-[16px] sm:text-[15px] xs:text-[14px] font-semibold leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-[13px] xs:text-[12px] mt-1">
                                    {item.publish_time ? dayjs(item.publish_time).fromNow() : 'Vừa đăng'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom 3 cards */}
                <div className="flex flex-col lg:flex-row lg:flex-wrap xl:flex-nowrap gap-6">
                    {highlightedPosts.slice(2, 5).map((item) => (
                        <Link
                            key={item.id}
                            href={`/posts/${item.id}`}
                            className="w-full lg:w-[317px] h-[346px] md:h-[320px] sm:h-[300px] xs:h-[256px] rounded-lg overflow-hidden shadow-[0_8px_16px_rgba(0,0,0,0.15)] bg-white cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-full h-[196px] md:h-[180px] sm:h-[160px] xs:h-[140px] overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 xs:p-3 flex flex-col justify-between h-[150px] md:h-[140px] sm:h-[140px] xs:h-[116px]">
                                <div>
                                    <span className="bg-[#D8F999] text-black text-[10px] xs:text-[9px] px-2 py-0.5 rounded-full w-fit font-medium">
                                        {item.category_name}
                                    </span>
                                    <h3 className="mt-2 text-[16px] md:text-[15px] sm:text-[14px] xs:text-[13px] font-semibold text-black line-clamp-3">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="text-[13px] xs:text-[12px] text-gray-600">
                                    {item.publish_time ? dayjs(item.publish_time).fromNow() : 'Vừa đăng'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* Highlighted cards End */}

            {/* Banner 2 */}
            <div className="w-full flex justify-center px-4 sm:px-6 md:px-[40px] lg:px-[256px] mb-10">
                <Link href="/khuyen-mai/mazda" className="block w-full max-w-[1000px]">
                    <Image
                        src="/assets/images/banner2.png"
                        alt="Banner quảng cáo giữa trang"
                        width={1000}
                        height={208}
                        className="w-full h-[208px] md:h-[180px] sm:h-[120px] xs:h-[111px] object-cover rounded-[12px] sm:rounded-[8px] xs:rounded-[6px] transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
                    />
                </Link>
            </div>

            {/* Section Khám phá */}
            <div className="w-full flex flex-col items-center">
                <SectionLayout
                    title={exploreMain?.categoryName || 'Khá phá'}
                    tag={exploreMain?.categoryName || 'Khám phá'}
                    banner="/assets/images/banner2.png"
                    mainImg={exploreMain?.img || '/assets/images/controller.png'}
                    mainTitle={exploreMain?.title || 'Doodles (DOOD) là gì? Dự án NFT gọi vốn $54 triệu Đô với các ông lớn Web2 có gì đặc biệt?'}
                    mainId={exploreMain?.id || '0'}
                    mainTime={exploreMain?.mainTime}
                    cards={exploreMain?.cards || rightCards}
                />

                {/* Section A.I */}
                <SectionGroupLayout
                    title={aiMain?.categoryName || 'A.I'}
                    tag={aiMain?.categoryName || 'A.I'}
                    banner="/assets/images/banner2.png"
                    mainImg={aiMain?.img || '/assets/images/grok.png'}
                    mainTitle={aiMain?.title || 'AI crypto và những tiềm năng thay đổi blockchain trong tương lai'}
                    mainId={aiMain?.id || '0'}
                    mainTime={aiMain?.mainTime}
                    cards={aiMain?.cards || aiCards}
                />

                {/* SLIDER SECTION */}
                <SliderSection />

                {/* Section Mobile */}
                <SectionGroupLayout
                    title={mobileMain?.categoryName || 'Mobile'}
                    tag={mobileMain?.categoryName || 'Mobile'}
                    banner="/assets/images/banner2.png"
                    mainImg={mobileMain?.img || '/assets/images/phone4.png'}
                    mainTitle={mobileMain?.title || 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển'}
                    mainId={mobileMain?.id || '0'}
                    mainTime={mobileMain?.mainTime}
                    cards={mobileMain?.cards || mobileCards}
                />

                {/* Section Game */}
                <SectionGroupLayout
                    title={gameMain?.categoryName || 'Game'}
                    tag={gameMain?.categoryName || 'Game'}
                    banner="/assets/images/banner2.png"
                    mainImg={gameMain?.img || '/assets/images/starfield.png'}
                    mainTitle={gameMain?.title || 'Web3 Game và làn sóng AI tích hợp, bùng nổ hay thoái trào?'}
                    mainId={gameMain?.id || '0'}
                    mainTime={gameMain?.mainTime}
                    cards={gameMain?.cards || gameCards}
                />
            </div>

            {/* Banner 3 */}
            <div className="w-full mt-[41px] md:mt-[30px] sm:mt-[20px]">
                <Link href="/khuyen-mai/mazda" className="block w-full">
                    <div className="w-full h-[314px] md:h-[250px] sm:h-[173px] xs:h-[150px] overflow-hidden cursor-pointer transition-all duration-300">
                        <img
                            src="/assets/images/banner2.png"
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
            </div>
        </div>
    );
}