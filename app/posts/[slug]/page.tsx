import TopBanner from "../../components/TopBanner";
import NavigationBar from "../../components/NavigationBar";
import Link from "next/link";
import Favorite from "../../components/Favorite";
import { Post } from "../../types/post";
import Comment from "../../components/Comment";
export default async function PostDetails({
    params,
}: {
    params: Promise<{slug: string}>;
}) {

    const { slug } = await params;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${slug}`,
        {
            cache: "no-store"
        }
    );

    if(!response.ok){
        throw new Error("Failed to fetch posts");
    }
    
    const data: {post: Post} = await response.json();
    const post = data.post;


    return (
        <>
        <TopBanner/>
        <NavigationBar/>
        <div>
            <div>
                <div className="w-full min-w-70 flex justify-center">
                    {post.top_image_url && (
                        <img
                            className="h-[300px] w-full max-h-[500px] object-contain" src={post.top_image_url}/>
                    )}
                </div>
                <div><h1 className="text-[clamp(24px,4vw,32px)]">{post.title}</h1></div>
                <div><p className="text-[gray]">{post.slug}</p></div>
                <div>View Count: {post.view_count}</div>

                <div>
                    {post.post_tags.map((postTag) =>(
                        <Link key={postTag.id} href={`/tags/${postTag.tag.slug}`}>Tag: {postTag.tag.name}</Link>
                    ))}
                </div>
            </div>

            <div>{post.body}</div>

            <div>
                    <Favorite postId={post.id}/>
            </div>

            <div>
                <Comment postId={post.id}/>
            </div>
        </div>
        </>
    )
}
