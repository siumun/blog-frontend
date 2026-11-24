import Link from "next/link";
import type { Post } from "../types/post";
import Card from "./Card";

export default async function PostsList() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    const posts: Post[] = await response.json();

    if (posts.length === 0) {
        return <p>No posts available</p>;
    }

    return (
        <>
        <div className="w-full">

        
        <div className="mx-auto flex max-w-[1300px] flex-col justify-center gap-5 p-5">
            {posts.map((post) => (
                <Card post={post} key={post.id} />
            ))}
        </div>
        </div>
        </>
    );
}