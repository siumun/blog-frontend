"use client";
import { useRef, useState, useEffect } from "react";
import useCurrentUser from "./CurrentUser";

interface FavoriteProps {
    postId: number,
}

type FavoriteStatus = {
    favorited: boolean;
};

export default function Favorite({
    postId,
}: FavoriteProps) {
    const [favorited, setFavorited] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const requestInProgress = useRef(false);
    const { user, loading } = useCurrentUser();

    useEffect(() => {
        if(loading){
            return;
        }

        if(!user){
            setIsChecking(false);
            return;
        }
        
        const checkFavorite = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/favorite`,
                    {
                        credentials: "include",
                    }
                );

                if(!response.ok) {
                    throw new Error ("Failed to check the favorite status");
                }

                const data: FavoriteStatus = await response.json();
                setFavorited(data.favorited);
            }catch (error){
                console.error("Favorite status error:", error);
            }finally {
                setIsChecking(false);
            }
        }
        checkFavorite();
    },[user,loading,postId])

    


    const handleToggle = async () => {
        if (requestInProgress.current) return;

        const method = favorited ? "DELETE" : "POST";

        requestInProgress.current = true;
        setIsSaving(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts/${postId}/favorites`,
                {
                    method,
                    credentials: "include",
                }
            );

            if (response.ok) {
                setFavorited(!favorited);
                console.log("Favorite updated");
            }else {
                console.log("Favorite request failed:", response.status);
            }
        } finally {
            requestInProgress.current = false;
            setIsSaving(false);
        }
    };

    return user ? (
        <button
            onClick={handleToggle}
            disabled={isSaving}
        >
            {favorited ? "Remove Favourite" : "Add Favourite"}
        </button>
    ) : (
        <p>Login to add to favorite</p>
    );
}
