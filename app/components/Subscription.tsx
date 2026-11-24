"use client";
import { useState } from "react";
export default function Subcription() {
    const [email, setEmail]= useState("");
    const [isSubmitting, setIsSubmitting]= useState(false);

    const handleSubcribe = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        const response = await fetch (
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            }
        )
        const data = await response.json();

        console.log("Response status:", response.status);
        console.log("Rails response:", data);
        if(response.ok){
            alert(data.message);
        }else {
            alert(data.errors?.join(", ") || data.message || "Subscription failed");
        }
    }
    

    return (
        <div className="w-full bg-[lightblue] h-fit py-5">
            <div className="mx-auto flex w-full flex-col items-center max-w-[1300px]">
            <form onSubmit={handleSubcribe}>
                <label className="text-[clamp(16px,4vw,24px)]">Enter your email to subcribe:</label>
                <div className="flex flex-row gap-4">
                    <input className="text-[clamp(16px,4vw,24px)]  w-[1000px] max-w-[70vw] p-2 border border gray" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required placeholder="Enter your email"/>
                    <button className="text-[clamp(16px,4vw,24px)] hover:text-[white]" type="submit" disabled={isSubmitting}>{isSubmitting ? "Subscribing..." : "Subscribe"}</button>
                </div>
            </form>
            </div>
        </div>
    )
}