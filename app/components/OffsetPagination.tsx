"use client"
interface PostsResponse {
    posts: Post[];
    current_page: number;
    total_pages: number;
    total_posts: number;
}


import { useEffect, useState } from "react";
import Card from "./Card";
import { Post } from "../types/post";

export default function OffsetPagination() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts?page=${currentPage}&per_page=10`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data: PostsResponse = await response.json();

                setPosts(data.posts);
                setTotalPages(data.total_pages);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage]);

    const changePage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No posts available</p>
            ) : (
                <div className="w-full">
                    <div className="mx-auto flex max-w-[1300px] flex-col justify-center gap-5 p-5">
                        {posts.map((post) => (
                            <div key={post.id}>
                                <Card post={post} key={post.id}/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center items-center gap-2">
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {Array.from(
                    { length: Math.min(5, totalPages) },
                    (_, index) => {
                        let startPage = Math.max(
                            1,
                            Math.min(currentPage - 2, totalPages - 4)
                        );
                         return startPage + index;
                    }
                ).map((number) => (
                    <button
                        key={number}
                        onClick={() => changePage(number)}
                        disabled={currentPage === number}
                        className={
                            currentPage === number
                                ? "bg-blue-500 text-white px-3 py-2 rounded"
                                : "bg-gray-200 px-3 py-2 rounded"
                        }
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
