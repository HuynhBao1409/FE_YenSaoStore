"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { getArticlesSummary } from '@/services/apiService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

interface Post {
    id: string;
    title: string;
    subtitle?: string;
    category: string;
    image: string;
    images?: { src: string; caption: string[] }[];
    content?: { title?: string; text: string[] }[];
    publish_time: string;
}

interface CardItem {
    id: string;
    img: string;
    title: string;
    tag: string;
    time: string;
}

interface Props {
    postId: string;
}

// Function để parse HTML content với hỗ trợ links và embeds
const parseHtmlContent = (htmlString: string) => {
    if (!htmlString) return [];

    // Tạo DOM parser để xử lý HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const paragraphs: string[] = [];
    const elements = doc.body.children;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        // Xử lý thẻ <p>
        if (element.tagName === 'P') {
            let text = element.textContent?.trim() || '';
            const originalHtml = element.innerHTML;

            // Chuyển đổi thẻ <strong>
            const strongElements = element.querySelectorAll('strong');
            strongElements.forEach(strong => {
                const boldText = strong.textContent || '';
                if (boldText) {
                    text = text.replace(boldText, `**${boldText}**`);
                }
            });

            // Chuyển đổi thẻ <a>
            const linkElements = element.querySelectorAll('a');
            linkElements.forEach(link => {
                const linkText = link.textContent || '';
                const linkHref = link.getAttribute('href') || '';
                if (linkText && linkHref) {
                    text = text.replace(linkText, `[${linkText}](${linkHref})`);
                }
            });

            if (text && text !== '') {
                paragraphs.push(text);
            }
        }
        // Xử lý thẻ <iframe> - nội dung nhúng (YouTube, etc.)
        else if (element.tagName === 'IFRAME') {
            const src = element.getAttribute('src') || '';
            const width = element.getAttribute('width') || '100%';
            const height = element.getAttribute('height') || '400';

            if (src) {
                paragraphs.push(`[EMBED:IFRAME:${src}:${width}:${height}]`);
            }
        }
        // Xử lý thẻ <script> - script nhúng (Twitter, Telegram, etc.)
        else if (element.tagName === 'SCRIPT') {
            const src = element.getAttribute('src') || '';
            const content = element.textContent || '';

            if (src) {
                paragraphs.push(`[EMBED:SCRIPT:${src}]`);
            } else if (content) {
                paragraphs.push(`[EMBED:SCRIPT_CONTENT:${content}]`);
            }
        }
        // Xử lý thẻ <blockquote> - trích dẫn hoặc Twitter embed
        else if (element.tagName === 'BLOCKQUOTE') {
            const tweetId = element.getAttribute('data-tweet-id') || '';
            const content = element.textContent?.trim() || '';

            if (tweetId) {
                paragraphs.push(`[EMBED:TWITTER:${tweetId}]`);
            } else if (content) {
                paragraphs.push(`[EMBED:QUOTE:${content}]`);
            }
        }
    }

    return paragraphs;
};

// Component để hiển thị văn bản với formatting, links và embeds
const FormattedText = ({ text }: { text: string }) => {
    // Xử lý embeds trước
    if (text.startsWith('[EMBED:')) {
        return <EmbedContent text={text} />;
    }

    // Tách text theo các pattern: **bold**, [link](url)
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

    return (
        <>
            {parts.map((part, index) => {
                // Xử lý bold text
                if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return <strong key={index}>{boldText}</strong>;
                }

                // Xử lý links
                const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
                if (linkMatch) {
                    const [, linkText, linkUrl] = linkMatch;

                    // Kiểm tra nếu là internal link
                    const isInternalLink = linkUrl.startsWith('/') || linkUrl.includes(window.location.hostname);

                    if (isInternalLink) {
                        return (
                            <Link
                                key={index}
                                href={linkUrl}
                                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                            >
                                {linkText}
                            </Link>
                        );
                    } else {
                        // Sử dụng thẻ <a> cho external links
                        return (
                            <a
                                key={index}
                                href={linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors duration-200"
                            >
                                {linkText}
                            </a>
                        );
                    }
                }

                return part;
            })}
        </>
    );
};

// Component để hiển thị nội dung được nhúng
const EmbedContent = ({ text }: { text: string }) => {
    const [embedError, setEmbedError] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Load Twitter widget script
        if (text.includes('EMBED:TWITTER') || text.includes('EMBED:SCRIPT') && text.includes('twitter')) {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            document.head.appendChild(script);
        }
    }, [text]);

    // useEffect nhúng tập lệnh script embed
    useEffect(() => {
        if (text.startsWith('[EMBED:SCRIPT:')) {
            const scriptSrc = text.replace('[EMBED:SCRIPT:', '').replace(']', '');
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = true;
            script.onload = () => setScriptLoaded(true);
            script.onerror = () => setEmbedError(true);
            document.head.appendChild(script);

            return () => {
                // Dọn dẹp khi tháo rời thành phần
                try {
                    document.head.removeChild(script);
                } catch (e) {
                    // Script đã được remove
                }
            };
        }
    }, [text]);

    // useEffect cho inline script content
    useEffect(() => {
        if (text.startsWith('[EMBED:SCRIPT_CONTENT:')) {
            const scriptContent = text.replace('[EMBED:SCRIPT_CONTENT:', '').replace(']', '');
            try {
                // Tạo script element và execute
                const script = document.createElement('script');
                script.innerHTML = scriptContent;
                document.head.appendChild(script);

                return () => {
                    try {
                        document.head.removeChild(script);
                    } catch (e) {
                        // Script đã được remove
                    }
                };
            } catch (error) {
                console.error('Error executing embedded script:', error);
                setEmbedError(true);
            }
        }
    }, [text]);

    // Hiển thị iframe embed (YouTube, etc.)
    if (text.startsWith('[EMBED:IFRAME:')) {
        const parts = text.replace('[EMBED:IFRAME:', '').replace(']', '').split(':');
        const [src, width = '100%', height = '400'] = parts;

        return (
            <div className="w-full my-6">
                <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                    {!embedError ? (
                        <iframe
                            src={src}
                            width={width}
                            height={height}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full"
                            onError={() => setEmbedError(true)}
                        />
                    ) : (
                        // Fallback UI khi iframe không load được
                        <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <p>Không thể tải nội dung nhúng</p>
                                <a
                                    href={src}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                                >
                                    Xem tại đây
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Hiển thị Twitter embed
    if (text.startsWith('[EMBED:TWITTER:')) {
        const tweetId = text.replace('[EMBED:TWITTER:', '').replace(']', '');

        return (
            <div className="w-full my-6 flex justify-center">
                <div className="max-w-[550px] w-full">
                    <blockquote className="twitter-tweet" data-theme="light">
                        <a href={`https://twitter.com/i/status/${tweetId}`}>
                            Tweet
                        </a>
                    </blockquote>
                </div>
            </div>
        );
    }

    // Hiển thị script embed
    if (text.startsWith('[EMBED:SCRIPT:')) {
        return (
            <div className="w-full my-6">
                {embedError ? (
                    <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center text-gray-500">
                        <p>Không thể tải script nhúng</p>
                    </div>
                ) : (
                    <div className="w-full min-h-[100px] flex items-center justify-center">
                        {!scriptLoaded && (
                            <div className="text-gray-500">Đang tải...</div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Hiển thị script content
    if (text.startsWith('[EMBED:SCRIPT_CONTENT:')) {
        return (
            <div className="w-full my-6">
                {embedError ? (
                    <div className="w-full h-[200px] bg-gray-100 flex items-center justify-center text-gray-500">
                        <p>Không thể thực thi script nhúng</p>
                    </div>
                ) : (
                    <div className="w-full min-h-[100px]" />
                )}
            </div>
        );
    }

    // Hiển thị <quote>/<blockquote>
    if (text.startsWith('[EMBED:QUOTE:')) {
        const quoteContent = text.replace('[EMBED:QUOTE:', '').replace(']', '');

        return (
            <div className="w-full my-6">
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 italic text-gray-700 rounded-r-lg">
                    {quoteContent}
                </blockquote>
            </div>
        );
    }

    // Xử lý đặc biệt cho YouTube embed
    if (text.includes('youtube.com') || text.includes('youtu.be') || text.includes('ytb.com')) {
        const youtubeMatch = text.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            return (
                <div className="w-full my-6">
                    <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        />
                    </div>
                </div>
            );
        }
    }

    // Xử lý đặc biệt cho Telegram embed    
    if (text.includes('t.me') || text.includes('telegram')) {
        return (
            <div className="w-full my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-blue-800 font-medium">Nội dung Telegram</p>
                    <p className="text-blue-600 text-sm mt-2">
                        {text.replace(/\[EMBED:.*?:/, '').replace(']', '')}
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

// Component Image an toàn với fallback
const SafeImage = ({ src, alt, width, height, className }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    // Kiểm tra nếu src là external URL
    const isExternalUrl = src.startsWith('http');

    // Xử lý khi image load lỗi
    const handleError = () => {
        setHasError(true);
        setImgSrc('/assets/images/default.jpg'); // Fallback image
    };

    if (isExternalUrl && !hasError) {
        return (
            <img
                src={imgSrc}
                alt={alt}
                className={className}
                onError={handleError}
                style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: `${width}px`,
                    maxHeight: `${height}px`
                }}
            />
        );
    }

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={handleError}
        />
    );
};

// Dữ liệu tĩnh làm fallback
const sameTopicCardsStatic: CardItem[] = [
    {
        id: '21',
        img: '/assets/images/card1.png',
        title: 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '22',
        img: '/assets/images/card2.png',
        title: 'Gemini và Grok đang cạnh tranh vị trí dẫn đầu AI',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '23',
        img: '/assets/images/card3.png',
        title: 'Thị trường AI blockchain: Đâu là "chatGPT" tiếp theo?',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '24',
        img: '/assets/images/card4.png',
        title: 'AI crypto vành đai mới của blockchain trong tương lai',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '25',
        img: '/assets/images/coin.png',
        title: 'Meme coin chiếm 41% thị phần thị trường AI crypto, nhưng DeFAI đang phát triển',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '26',
        img: '/assets/images/coin.png',
        title: 'Gemini và Grok đang cạnh tranh vị trí dẫn đầu AI',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '27',
        img: '/assets/images/coin.png',
        title: 'Thị trường AI blockchain: Đâu là "chatGPT" tiếp theo?',
        tag: 'A.I',
        time: '1 giờ trước',
    },
    {
        id: '28',
        img: '/assets/images/coin.png',
        title: 'AI crypto vành đai mới của blockchain trong tương lai',
        tag: 'A.I',
        time: '1 giờ trước',
    },
];

export default function PostBody({ postId }: Props) {
    const [post, setPost] = useState<Post | null>(null);
    const [sameTopicCards, setSameTopicCards] = useState<CardItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Hàm validate và clean image URL
    const validateImageUrl = (url: string): string => {
        if (!url || url.trim() === '') {
            return '/assets/images/default.jpg';
        }

        // Nếu là relative path, return as is
        if (!url.startsWith('http')) {
            return url;
        }

        // Validate external URL
        try {
            new URL(url);
            return url;
        } catch {
            return '/assets/images/default.jpg';
        }
    };

    // Hàm scroll to top với smooth behavior
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getArticlesSummary();
                console.log('API Response:', response);

                if (!response) {
                    throw new Error('Invalid API response structure');
                }

                // Tập hợp tất cả articles từ highlighted, hot_news.monthly, và latest_per_category
                let allArticles: any[] = [];

                // Thêm highlighted articles
                if (response.highlighted && Array.isArray(response.highlighted)) {
                    allArticles = [...allArticles, ...response.highlighted];
                }

                // Thêm hot_news.monthly articles
                if (response.hot_news?.monthly && Array.isArray(response.hot_news.monthly)) {
                    allArticles = [...allArticles, ...response.hot_news.monthly];
                }

                // Thêm latest_per_category articles
                if (response.latest_per_category && typeof response.latest_per_category === 'object') {
                    Object.values(response.latest_per_category).forEach((categoryData: any) => {
                        if (categoryData?.new_list && Array.isArray(categoryData.new_list)) {
                            allArticles = [...allArticles, ...categoryData.new_list];
                        }
                    });
                }

                console.log('All Articles:', allArticles);
                console.log('Looking for postId:', postId);

                const article = allArticles.find((item: any) => item.id === postId);
                console.log('Found Article:', article);

                if (!article) {
                    throw new Error('Article not found');
                }

                // Xử lý content với HTML parsing (đã cập nhật để hỗ trợ links và embeds)
                const contentSections = article.details
                    ?.filter((detail: any) => detail?.type && (detail.type === 'text' || detail.type === 'quotes'))
                    ?.sort((a: any, b: any) => (a?.position || 0) - (b?.position || 0))
                    ?.map((detail: any) => {
                        const data = detail?.data || '';

                        // Parse HTML content thành paragraphs với hỗ trợ links và embeds
                        const parsedParagraphs = parseHtmlContent(data);

                        // Tìm title từ paragraph đầu tiên nếu có **text**
                        let title: string | undefined;
                        let textParagraphs = parsedParagraphs;

                        if (parsedParagraphs.length > 0) {
                            const firstParagraph = parsedParagraphs[0];
                            // Nếu paragraph đầu chỉ chứa bold text, coi đó là title
                            const boldMatch = firstParagraph.match(/^\*\*(.*?)\*\*$/);
                            if (boldMatch) {
                                title = boldMatch[1];
                                textParagraphs = parsedParagraphs.slice(1);
                            }
                        }

                        return {
                            title: title,
                            text: textParagraphs.filter((p: string) => p.trim() !== ''),
                        };
                    })
                    .filter((section: any) => section.text.length > 0) || [];

                // Xử lý images với validation
                const images = article.details
                    ?.filter((detail: any) => detail?.type === 'image')
                    ?.sort((a: any, b: any) => (a?.position || 0) - (b?.position || 0))
                    ?.map((detail: any) => ({
                        src: validateImageUrl(detail?.data || ''),
                        caption: Array.isArray(detail?.caption)
                            ? detail.caption
                            : detail?.caption
                                ? [detail.caption]
                                : ['Hình ảnh minh họa'],
                    })) || [];

                const postData: Post = {
                    id: article.id || postId,
                    title: article.title || 'Tiêu đề không xác định',
                    subtitle: article.description?.replace(/<[^>]+>/g, '')?.trim() || 'Mô tả không có',
                    category: article.category_name || 'Đồ chơi số',
                    image: validateImageUrl(article.thumbnail || ''),
                    images: images.length > 0 ? images : undefined,
                    content: contentSections.length > 0 ? contentSections : undefined,
                    publish_time: article.publish_time || new Date().toISOString(),
                };

                setPost(postData);

                // Xử lý related articles từ tất cả sources trừ hot_news.daily
                const related = allArticles
                    .filter((item: any) => item.id !== postId && item.category_name === postData.category)
                    .slice(0, 8)
                    .map((item: any) => ({
                        id: item.id || 'default',
                        img: validateImageUrl(item.thumbnail || ''),
                        title: item.title || 'Tiêu đề không xác định',
                        tag: item.category_name || 'Đồ chơi số',
                        time: item.publish_time ? dayjs(item.publish_time).fromNow() : 'Vừa đăng',
                    }));

                setSameTopicCards(related.length > 0 ? related : sameTopicCardsStatic);

            } catch (err) {
                console.error('Lỗi khi lấy bài viết:', err);
                setError(err instanceof Error ? err.message : 'Không thể tải bài viết');
                setSameTopicCards(sameTopicCardsStatic);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    // Scroll to top khi postId thay đổi
    useEffect(() => {
        if (postId && !loading) {
            scrollToTop();
        }
    }, [postId, loading]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center min-h-[400px]">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="w-full flex justify-center items-center min-h-[400px]">
                <div>Không tìm thấy bài viết</div>
            </div>
        );
    }
    return (
        <div className="w-full flex flex-col items-center">
            {/* Banner 1 */}
            <div className="w-full">
                <Link href="/khuyen-mai/banner">
                    <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[338px] overflow-hidden transition-transform duration-300 cursor-pointer">
                        <img
                            src="/assets/images/banner3.png"
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
            </div>
            {/* Section Posts - Advert */}
            <div className="w-full flex justify-center">
                <div className="flex flex-col justify-center lg:flex-row gap-6 max-w-[1200px] w-full px-4 py-8">
                    {/* Left column - Posts */}
                    <div className="w-full lg:w-[659px]">
                        {/* Breadcrumb */}
                        <Breadcrumb
                            items={[
                                { label: "Trang chủ", href: "/" },
                                { label: post.category },
                            ]}
                        />

                        {/* Title */}
                        <h1 className="text-[24px] md:text-[33px] leading-[32px] md:leading-[48px] font-medium text-black mb-4">
                            {post.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-[16px] md:text-[19px] leading-[24px] md:leading-[28px] font-medium text-black mb-6">
                            {post.subtitle}
                        </p>

                        {/* Section image */}
                        <div className="w-full mb-6">
                            <SafeImage
                                src={post.image}
                                alt={post.title}
                                width={659}
                                height={371}
                                className="rounded-[12px] object-cover w-full h-auto"
                            />
                            <p className="text-[11px] md:text-[13px] leading-[15px] md:leading-[17px] text-black text-center mt-2">
                                {post.title}
                            </p>
                        </div>

                        {/* Nội dung động với HTML parsing, links và embeds */}
                        {post.content?.map((section, index) => (
                            <div key={index} className="w-full flex flex-col gap-[13px] mb-6">
                                <div className="flex flex-col gap-[16px]">
                                    {section.title && (
                                        <h2 className="text-[20px] md:text-[23px] leading-[26px] md:leading-[31px] font-bold text-black">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.text.map((paragraph, i) => (
                                        <div key={i} className="text-[16px] md:text-[19px] leading-[22px] md:leading-[24px] text-black text-justify">
                                            <FormattedText text={paragraph} />
                                        </div>
                                    ))}
                                    {post.images && post.images[index] && (
                                        <>
                                            <SafeImage
                                                src={post.images[index].src}
                                                alt={post.images[index].caption[0] || post.title}
                                                width={659}
                                                height={371}
                                                className="rounded-[12px] object-cover w-full h-auto"
                                            />
                                            <p className="text-[11px] md:text-[13px] leading-[15px] md:leading-[17px] text-black text-center">
                                                {post.images[index].caption[0] || 'Hình ảnh minh họa'}
                                            </p>
                                        </>
                                    )}
                                </div>
                                {(index === 0 || index === 1) && (
                                    <div className="flex lg:hidden justify-center w-full mb-4">
                                        <Link href={`/san-pham/${index + 1}`}>
                                            <Image
                                                src={`/assets/images/ad${index + 1}.png`}
                                                alt={`Quảng cáo ${index + 1}`}
                                                width={428}
                                                height={410}
                                                className="rounded-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer object-cover"
                                            />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right column - Advertise - Desktop */}
                    <div className="hidden lg:flex w-[317px] flex-col gap-[24px]">
                        {[
                            { src: "/assets/images/ad1.png", href: "/san-pham/1" },
                            { src: "/assets/images/ad2.png", href: "/san-pham/2" },
                            { src: "/assets/images/ad3.png", href: "/san-pham/3" },
                        ].map((ad, index) => (
                            <Link key={index} href={ad.href}>
                                <Image
                                    src={ad.src}
                                    alt={`Quảng cáo ${index + 1}`}
                                    width={317}
                                    height={400}
                                    className="rounded-lg transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner 2 */}
            <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 lg:px-[256px] mb-8">
                <Link href="/khuyen-mai/mazda" className="block w-full md:w-[1000px]">
                    <Image
                        src="/assets/images/banner2.png"
                        alt="Banner quảng cáo Mazda"
                        width={1000}
                        height={208}
                        className="rounded-[12px] object-cover transition-transform duration-300 hover:scale-[1.01] cursor-pointer w-full h-[160px] sm:h-[180px] md:h-[200px] lg:h-[208px]"
                    />
                </Link>
            </div>

            {/* Section Same Topic */}
            <section className="w-full flex justify-center mt-[80px] md:mt-[60px] sm:mt-[40px] px-4 sm:px-6">
                <div className="w-full md:w-[1000px] mx-auto flex flex-col gap-[29px]">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#D8F999] border border-black" />
                        <h2 className="text-[28px] md:text-[24px] sm:text-[22px] leading-[36px] md:leading-[32px] sm:leading-[28px] font-bold text-black">
                            Cùng chủ đề
                        </h2>
                        <div className="flex-grow h-px bg-black ml-4" />
                        <button className="w-[132px] h-[40px] border border-black rounded-[80px] bg-[#D8F999] text-[#0F172B] text-[17px] leading-[16px] font-bold cursor-pointer hover:bg-[#C5E866] hover:scale-105 transition-all duration-300 flex items-center justify-center">
                            Xem tất cả
                        </button>
                    </div>
                    <div className="flex sm:hidden items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#D8F999] border border-black" />
                        <h2 className="text-[20px] leading-[24px] font-bold text-black">Cùng chủ đề</h2>
                        <div className="flex-grow h-px bg-black ml-3" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-[24px] md:gap-y-[29px]">
                        {sameTopicCards.map((card, index) => (
                            <Link
                                key={`${card.id}-${index}`}
                                href={`/posts/${card.id}`}
                                className="w-full md:w-[232px] p-4 rounded-[12px] bg-white hover:shadow-md transition-shadow duration-300 cursor-pointer"
                            >
                                <SafeImage
                                    src={card.img}
                                    alt={card.title}
                                    width={232}
                                    height={139}
                                    className="rounded-[12px] mb-4 w-full h-auto"
                                />
                                <div className="text-[10px] md:text-[12px] text-black px-2 py-[2px] inline-block bg-[#EBFFD6] rounded-full font-medium mb-2">
                                    {card.tag}
                                </div>
                                <h3 className="text-[12px] md:text-[14px] font-semibold leading-[16px] md:leading-[18px] mb-1">
                                    {card.title}
                                </h3>
                                <p className="text-[10px] md:text-[12px] text-[#555]">{card.time}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="flex sm:hidden items-center justify-end gap-2 mt-10 px-[23px]">
                        <div className="flex-grow h-[1px] bg-black" />
                        <button className="w-[132px] h-[40px] border border-black rounded-[80px] bg-[#D8F999] text-black text-[16px] leading-[14px] font-bold cursor-pointer hover:bg-[#C5E866] hover:scale-105 transition-all duration-300 flex items-center justify-center">
                            Xem tất cả
                        </button>
                    </div>
                </div>
            </section>

            {/* Banner 3 */}
            <div className="w-full mt-[80px] sm:mt-[85px] md:mt-[95px] lg:mt-[105px]">
                <Link href="/khuyen-mai/mazda" className="w-full">
                    <div className="w-full h-[180px] sm:h-[200px] md:h-[240px] lg:h-[314px] overflow-hidden cursor-pointer transition-all duration-300">
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