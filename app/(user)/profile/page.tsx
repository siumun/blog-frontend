"use client"
import useCurrentUser from "@/app/components/CurrentUser"
import React, { useState, useEffect } from "react";
import TopBanner from "@/app/components/TopBanner";
import NavigationBar from "@/app/components/NavigationBar";

export default function profile(){
    const { user } = useCurrentUser();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(()=>{
        if(user){
            setName(user.name);
            setEmail(user.email);
        }
    }, [user])

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch (
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile`,
                {
                    method:"PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body : JSON.stringify({
                        user: {
                            name,
                            email,
                        },
                    }),
                }
            );

            const data = await response.json();

            if(response.ok) {
                alert(data.message);
            }else {
                alert(data.errors);
            }
        }catch (error){
            console.log(error);
        }
    }
    
    if(!user){
        return <p>Loading Profile...</p>
    }
    return(
        <>
        <TopBanner/>
        <NavigationBar/>
        <div className="w-full px-5 py-10">
            <div className="mx-auto flex flex-col max-w-[700px] overflow-hidden rounded-lg border-gray-200 shadow-md">
                <h2 className="w-full h-fit px-4 py-2 bg-[lightblue] text-[white] text-[clamp(16px,4vw,24px)]">Profile</h2>
                <form onSubmit={handleUpdate} className="flex flex-col gap-4 text-[clamp(12px,4vw,21px)] p-4">
                    <div>
                        <label>Username:</label>
                        <input type="text" value={name} onChange={(e)=> setName(e.target.value)}/>
                    </div>

                    <div>
                        <label>Email: </label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <button className="hover:text-[lightblue]" type="submit">Update Profile</button>
                </form>
            </div>
        </div>
        
        </>
    )
}