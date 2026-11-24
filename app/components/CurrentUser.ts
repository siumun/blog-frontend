
"use client";

import { use, useEffect, useState } from "react";
import { Gender, type User } from "../types/user";

export default function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/current`,
                    {
                        credentials: "include",
                    }
                );

                // User not logged in
                if (response.status === 401) {
                    setUser(null);
                    return;
                }

                //Other errors
                if (!response.ok) {
                    const errorData = await response.text();

                    console.log("Current User API Status:", response.status);
                    console.log("Current User API Response:", errorData);

                    setUser(null);
                    return;
                }
                const data = await response.json();

                setUser(data.logged_in ? data.user : null);
                
            } catch (error) {
                console.error("Current user fetch error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return { user, loading };
}
