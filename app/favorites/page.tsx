"use client";

import { useEffect, useState } from "react";
import type { Post } from "../types/post";
import Link from "next/link";
import TopBanner from "../components/TopBanner";
import NavigationBar from "../components/NavigationBar";
import Card from "../components/Card";

type Favorite = {
    id: number;
    post: Post;
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favorites);
            }
        };

        fetchFavorites(); 
    }, []);

    if (favorites.length === 0) {
        return <p>No favourite posts available.</p>;
    }

    return (
    <>
        <TopBanner/>
        <NavigationBar/>
        <div className="w-full">
            <div className="mx-auto flex max-w-[1300px] flex-col justify-center gap-5 p-5">
                {favorites.map((favorite) => (
                    <Card post={favorite.post} key={favorite.id}/>
            ))}
            </div>
        </div>
        
    </>
    )
}