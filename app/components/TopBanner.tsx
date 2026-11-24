"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCurrentUser from "./CurrentUser";
import { Heart, UserRound } from "lucide-react";

export default function TopBanner() {

    const { user } = useCurrentUser();
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    async function handleLogout() {
        try{
            const respsonse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/logout`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if(respsonse.ok) {
                const data = await respsonse.json();
                console.log(data.message);
                setShowMenu(false);
            }
        }catch (error) {
            console.error("Logout failed:", error);
        }
        
    }
    return (
        <div className="flex flex-row justify-between w-full h-auto items-center bg-[lightblue]">
            <div>
                <Link href="/" className="text-[32px] font-bold">The Blog</Link>
            </div>

            <div className="flex flex-row gap-3 relative">
                {user && (
                    <Link href="/favorites">
                        <Heart size={32}/>
                    </Link>
                )}

                <div>
                    <button onClick={()=>{
                        if (!user) {
                            router.push("/login");
                        }else {
                            setShowMenu(!showMenu);
                        }
                    }}><UserRound size={32}/></button>

                    {showMenu && user && (
                        <div className="absolute right-0 top-full mt-2 z-50 flex min-w-40 flex-col rounded-lg border items-center border-gray-200 bg-white py-2 shadow-lg">
                            <Link href="/profile" className="hover:text-[lightblue]">
                                <p>Profile</p>
                            </Link>

                            <button className="hover:text-[lightblue]" onClick={handleLogout}>Log Out</button>
                        </div>
                    )}
                </div>


            </div>

        </div>
    );
}