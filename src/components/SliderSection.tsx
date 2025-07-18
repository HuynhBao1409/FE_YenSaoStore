import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getArticlesSummary } from '@/services/apiService';

interface Slide {
    id: string;
    img: string;
    title: string;
    tag: string;
    description: string;
}

const SliderSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastInteraction, setLastInteraction] = useState(Date.now());
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Trạng thái cử chỉ vuốt
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Khoảng cách vuốt tối thiểu (tính bằng px)
    const minSwipeDistance = 50;

    // Dữ liệu tĩnh cho fallback
    const staticSlides: Slide[] = [
        {
            id: '1',
            img: '/assets/images/slider1.png',
            title: 'Meme coin chiếm 41% thị phần thị trường AI crypto',
            tag: 'Khám phá',
            description: 'DeFAI đang phát triển mạnh mẽ với sự tham gia của các dự án AI hàng đầu'
        },
        {
            id: '2',
            img: '/assets/images/slider2.png',
            title: 'Web3 Game và làn sóng AI tích hợp bùng nổ',
            tag: 'Game',
            description: 'Công nghệ AI đang thay đổi cách chúng ta tương tác với game'
        },
        {
            id: '3',
            img: '/assets/images/slider3.png',
            title: 'Xu hướng thiết bị AI di động 2025',
            tag: 'Mobile',
            description: 'Thiết bị AI di động đang thay đổi trải nghiệm người dùng'
        },
        {
            id: '4',
            img: '/assets/images/slider4.png',
            title: 'Gemini và Grok cạnh tranh vị trí dẫn đầu AI',
            tag: 'A.I',
            description: 'Cuộc đua AI giữa các ông lớn công nghệ ngày càng gay gắt'
        },
        {
            id: '5',
            img: '/assets/images/cpu.png',
            title: 'Blockchain và AI: Tương lai của công nghệ',
            tag: 'Blockchain',
            description: 'Sự kết hợp giữa blockchain và AI mở ra nhiều cơ hội mới'
        },
        {
            id: '6',
            img: '/assets/images/ssd.png',
            title: 'NFT và metaverse phát triển mạnh',
            tag: 'NFT',
            description: 'Thị trường NFT và metaverse đang tạo ra làn sóng mới'
        }
    ];

    // Cử chỉnh vuốt trên MOBILE
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsDragging(true);
        handleUserInteraction();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        setIsDragging(false);
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Tương tác người dùng
    const handleUserInteraction = () => {
        setLastInteraction(Date.now());
    };

    // Phát hiện MOBILE
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                setIsLoading(true);
                const data = await getArticlesSummary();
                console.log('✅ API Response for SliderSection:', data);

                const monthlyPosts = data?.hot_news?.monthly ?? [];
                const fetchedSlides: Slide[] = [];

                for (let i = 0; i < Math.min(monthlyPosts.length, 6); i++) {
                    const post = monthlyPosts[i];
                    if (post && post.id) {
                        fetchedSlides.push({
                            id: post.id,
                            img: post.thumbnail || staticSlides[i % staticSlides.length].img,
                            title: post.title || staticSlides[i % staticSlides.length].title,
                            tag: post.category_name || staticSlides[i % staticSlides.length].tag,
                            description: post.description?.replace(/<[^>]+>/g, '') || staticSlides[i % staticSlides.length].description
                        });
                    }
                }

                if (fetchedSlides.length < 6) {
                    console.warn('❗ Not enough valid articles in hot_news/monthly, supplementing with static data');
                    for (let i = fetchedSlides.length; i < 6; i++) {
                        fetchedSlides.push(staticSlides[i % staticSlides.length]);
                    }
                }

                setSlides(fetchedSlides);
            } catch (err) {
                console.error('❌ Error fetching API for SliderSection:', err);
                setSlides(staticSlides.slice(0, 6));
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // SMART AUTO-SLIDE DESKTOP/MOBILE
    useEffect(() => {
        if (isLoading || isDragging) return;

        const interval = setInterval(() => {
            if (isMobile) {
                // Mobile: Smart auto-slide
                const timeSinceLastInteraction = Date.now() - lastInteraction;
                if (timeSinceLastInteraction > 5000) {
                    setCurrentSlide((prev) => (prev + 1) % (slides.length || staticSlides.length));
                }
            } else {
                // Desktop: Auto-slide 
                if (!isHovered) {
                    setCurrentSlide((prev) => (prev + 1) % (slides.length || staticSlides.length));
                }
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [currentSlide, isHovered, isLoading, lastInteraction, isDragging, slides.length, isMobile]);

    // Lấy 4 slides hiện tại để hiển thị (desktop)
    const getCurrentSlides = () => {
        if (slides.length === 0) return staticSlides.slice(0, 4);
        const result = [];
        for (let i = 0; i < 4; i++) {
            const index = (currentSlide + i) % slides.length;
            result.push(slides[index] || staticSlides[index % staticSlides.length]);
        }
        return result;
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (slides.length || staticSlides.length));
        handleUserInteraction();
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + (slides.length || staticSlides.length)) % (slides.length || staticSlides.length));
        handleUserInteraction();
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        handleUserInteraction();
    };

    interface ArrowProps {
        onClick: () => void;
    }

    // Component Arrow 
    const LeftArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 rounded-full text-white p-2 cursor-pointer transition-colors z-10 hidden lg:block"
            disabled={isLoading}
        >
            <img src="/assets/icons/arrow-left.svg" alt="Previous" className="w-14 h-14" />
        </button>
    );

    const RightArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 rounded-full text-white p-2 cursor-pointer transition-colors z-10 hidden lg:block"
            disabled={isLoading}
        >
            <img src="/assets/icons/arrow-right.svg" alt="Next" className="w-14 h-14" />
        </button>
    );

    // LOADING STATE 
    if (isLoading) {
        return (
            <div className="w-full mt-12 md:mt-16 lg:mt-20">
                <div
                    className="w-full min-h-[400px] md:min-h-[500px] lg:h-[611px] bg-cover bg-center bg-no-repeat relative px-4 md:px-6 lg:px-0"
                    style={{ backgroundImage: "url('/assets/images/bg-slide.png')" }}
                >
                    <div className="w-full max-w-[1200px] mx-auto lg:translate-y-[4px]">
                        <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center pt-6 mb-6 md:mb-8">
                            TIÊU ĐIỂM TRONG THÁNG
                        </h2>
                        <div className="text-white text-center">Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    // MAIN RENDER 
    return (
        <div className="w-full mt-12 md:mt-16 lg:mt-20">
            <div
                className="w-full min-h-[400px] md:min-h-[500px] lg:h-[611px] bg-cover bg-center bg-no-repeat relative px-4 md:px-6 lg:px-0"
                style={{ backgroundImage: "url('/assets/images/bg-slide.png')" }}
            >
                <div className="w-full max-w-[1200px] mx-auto lg:translate-y-[4px]">
                    <h2 className="text-white text-lg md:text-xl lg:text-2xl font-bold text-center pt-6 mb-6 md:mb-8">
                        TIÊU ĐIỂM TRONG THÁNG
                    </h2>
                    <div className="relative w-full overflow-hidden">
                        {/* DESKTOP VIEW */}
                        <div className="hidden lg:flex gap-4 h-[427px] justify-center items-center">
                            {getCurrentSlides().map((slide, index) => (
                                <Link
                                    href={`/posts/${slide?.id || '0'}`}
                                    key={`${slide?.id || index}-${currentSlide}`}
                                    onMouseEnter={() => {
                                        setIsHovered(true);
                                        setHoveredIndex(index);
                                        handleUserInteraction();
                                    }}
                                    onMouseLeave={() => {
                                        setIsHovered(false);
                                        setHoveredIndex(null);
                                    }}
                                    className={`w-[232px] h-[427px] cursor-pointer transition-all duration-300 flex-shrink-0 
                                        ${hoveredIndex === index ? 'scale-105 opacity-100 ring-2' : 'scale-100 opacity-80'}
                                        hover:scale-105 hover:opacity-100`}
                                >
                                    <div className="w-full h-full relative rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/1 hover:backdrop-blur-md group">
                                        {/* Hình ảnh slide */}
                                        <div className="w-full h-[280px] relative">
                                            <img
                                                src={slide?.img || staticSlides[0].img}
                                                alt={slide?.title || staticSlides[0].title}
                                                className="w-full h-full object-cover rounded-t-xl"
                                                style={{ borderRadius: '12px 12px 12px 12px' }}
                                            />
                                            {hoveredIndex === index && (
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#D8F999]" style={{ borderRadius: '12px 12px 0 0' }}></div>
                                            )}
                                        </div>
                                        {/* Nội dung slide */}
                                        <div className="w-full h-[147px] p-4 flex flex-col">
                                            {/* Tag/Category */}
                                            <span className="bg-[#D8F999] text-black text-[11px] px-2 py-1 rounded-full inline-block leading-tight font-medium mb-2 w-fit">
                                                {slide?.tag || staticSlides[0].tag}
                                            </span>
                                            {/* Tiêu đề */}
                                            <h3 className="text-white text-sm font-bold mb-2 leading-tight flex-1 overflow-hidden">
                                                <span className="line-clamp-3">{slide?.title || staticSlides[0].title}</span>
                                            </h3>
                                            {/* Mô tả */}
                                            <p className="text-white/80 text-xs leading-relaxed flex-1 overflow-hidden">
                                                <span className="line-clamp-2">{slide?.description || staticSlides[0].description}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* MOBILE */}
                        <div className="lg:hidden flex flex-col items-center">
                            <div
                                className="w-full max-w-[280px] md:max-w-[340px] mx-auto mb-6 touch-pan-x"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                <Link
                                    href={`/posts/${slides[currentSlide]?.id || staticSlides[0].id}`}
                                    className="block w-full"
                                    onClick={handleUserInteraction}
                                >
                                    <div className="w-full relative rounded-xl overflow-hidden transition-all duration-300">
                                        <div className="w-full h-[200px] md:h-[240px] relative">
                                            <img
                                                src={slides[currentSlide]?.img || staticSlides[0].img}
                                                alt={slides[currentSlide]?.title || staticSlides[0].title}
                                                className="w-full h-full object-cover rounded-t-xl"
                                                style={{ borderRadius: '12px 12px 12px 12px' }}
                                            />
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-[#D8F999]" style={{ borderRadius: '12px 12px 0 0' }}></div>
                                        </div>
                                        <div className="w-full p-4 flex flex-col bg-black/20 backdrop-blur-sm">
                                            {/* Tag/Category */}
                                            <span className="bg-[#D8F999] text-black text-xs px-3 py-1 rounded-full inline-block leading-tight font-medium mb-3 w-fit">
                                                {slides[currentSlide]?.tag || staticSlides[0].tag}
                                            </span>
                                            {/* Tiêu đề */}
                                            <h3 className="text-white text-base md:text-lg font-bold mb-3 leading-tight">
                                                {slides[currentSlide]?.title || staticSlides[0].title}
                                            </h3>
                                            {/* Mô tả */}
                                            <p className="text-white/80 text-sm leading-relaxed">
                                                {slides[currentSlide]?.description || staticSlides[0].description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Nút điều hướng - Mobile */}
                            <div className="flex items-center justify-center gap-8 mb-4">
                                <button
                                    onClick={prevSlide}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
                                    disabled={isLoading}
                                >
                                    <img src="/assets/icons/arrow-left.svg" alt="Previous" className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors active:scale-95"
                                    disabled={isLoading}
                                >
                                    <img src="/assets/icons/arrow-right.svg" alt="Next" className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Dots indicator cho mobile */}
                            <div className="flex justify-center gap-2 pb-6">
                                {(slides.length > 0 ? slides : staticSlides).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                            ? 'bg-[#D8F999] w-8'
                                            : 'bg-white/40 hover:bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Nút mũi tên cho desktop */}
                        <LeftArrow onClick={prevSlide} />
                        <RightArrow onClick={nextSlide} />

                        {/* Dots indicator cho desktop */}
                        <div className="hidden lg:flex justify-center gap-2 mt-6">
                            {(slides.length > 0 ? slides : staticSlides).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'bg-[#D8F999] w-8'
                                        : 'bg-white/40 hover:bg-white/60'
                                        }`}
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SliderSection;