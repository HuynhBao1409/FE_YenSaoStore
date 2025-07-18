// app/posts/[postsId]/page.tsx
import PostBody from '@/components/PostBody';

interface PostDetailPageProps {
    params: Promise<{
        postId: string;
    }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const { postId } = await params;
    console.log('PostId from params:', postId);
    return (
        <main>
            <PostBody postId={postId} />
        </main>
    );
}