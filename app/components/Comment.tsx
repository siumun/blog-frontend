
"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Comment } from "../types/comment";
import useCurrentUser from "./CurrentUser";

interface CommentProps {
    postId: number;
}

export default function CommentPage({ postId }: CommentProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputComment, setInputComment] = useState<string>("");
    const [showDelete, setShowDelete] = useState<number | null>(null);
    const [error, setError] = useState<string>("");

    const {user, loading} = useCurrentUser();

    const fetchComments = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/comments`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }

            const data = await response.json();
            setComments(data.comments);
        } catch (error) {
            console.error(error);
            setError("Unable to load comments.");
        } finally {
            setIsLoading(false);
        }
    };

    const makeComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!inputComment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/comments`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        body: inputComment,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create comment");
            }

            // Add the newly created comment to the list
            setComments((previousComments) => [
                ...previousComments,
                data.comment,
            ]);

            setInputComment("");
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to create comment."
            );
        }
    };

    const deleteComment = async (commentId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            setShowDelete(null);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/${commentId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete comment");
            }

            // Remove the deleted comment from the list
            setComments((previousComments) =>
                previousComments.filter(
                    (comment) => comment.id !== commentId
                )
            );

            setShowDelete(null);
        } catch (error) {
            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete comment."
            );
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div>
            <h2>Comments</h2>

            {/* Create comment form */}
            {user && (
                <form onSubmit={makeComment}>
                    <textarea
                        value={inputComment}
                        onChange={(event) =>
                            setInputComment(event.target.value)
                        }
                        placeholder="Write your comment..."
                        rows={4}
                    />

                    <button type="submit">
                        Submit Comment
                    </button>
                </form>
            )}

            {error && <p>{error}</p>}

            {isLoading ? (
                <p>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <div
                        key={comment.id}
                        onContextMenu={(event) => {
                            if (user?.id !== comment.user_id) {
                                return;
                            }

                            event.preventDefault();
                            setShowDelete(comment.id);
                        }}
                    >
                        <p>{comment.user_name}</p>
                        <p>{comment.body}</p>

                        {/* Custom right-click menu */}
                        {showDelete === comment.id && (
                            <div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteComment(comment.id)
                                    }
                                >
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowDelete(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
