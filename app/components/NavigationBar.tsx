"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Tag {
    id: number;
    name: string;
    slug: string;
}

export default function NavigationBar() {
    const [tags, setTags] = useState<Tag[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchTags = async () => {
            const response = await fetch(`${API_URL}/api/v1/tags`);

            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }

            const data = await response.json();
            setTags(data);
        };

        fetchTags().catch(console.error);
    }, [API_URL]);

    return (
        <nav className="flex gap-6 justify-center text-[18px] border-b border-b-[#D3D3D3] flex-wrap">
            <Link className="hover:font-bold hover:text-[lightblue]" href="/">All Posts</Link>

            {tags.map((tag) => (
                <Link
                    className="hover:font-bold hover:text-[lightblue]"
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                >
                    {tag.name}
                </Link>
            ))}
        </nav>
    );
}