"use client";

import { useEffect, useState } from "react";
import { Post } from "../types/post";
import Card from "./Card";

interface Cursor {
    cursor_date: string;
    cursor_id: number;
}

interface PostsResponse {
    posts: Post[];
    next_cursor: Cursor | null;
    has_more: boolean;
}

export default function CursorPagination() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [nextCursor, setNextCursor] = useState<Cursor | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (cursor: Cursor | null = null) => {
        try {
            setLoading(true);

            let url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`;

            // Add cursor parameters for subsequent requests
            if (cursor) {
                const params = new URLSearchParams({
                    cursor_date: cursor.cursor_date,
                    cursor_id: String(cursor.cursor_id)
                });

                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }

            const data: PostsResponse = await response.json();

            // Append new posts to existing posts
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);

            // Store the next cursor
            setNextCursor(data.next_cursor);

            // Check whether more posts exist
            setHasMore(data.has_more);

        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLoadMore = () => {
        if (nextCursor && hasMore && !loading) {
            fetchPosts(nextCursor);
        }
    };

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                    <Card post={post} key={post.id}/>
                ))}
            </div>

            {loading && (
                <p className="text-center">
                    Loading posts...
                </p>
            )}

            {!loading && hasMore && posts.length > 0 && (
                <div className="text-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Load More
                    </button>
                </div>
            )}

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500">
                    You have reached the end.
                </p>
            )}

            {!loading && posts.length === 0 && (
                <p className="text-center text-gray-500">
                    No posts found.
                </p>
            )}

        </div>
    );
}
