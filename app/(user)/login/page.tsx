"use client"
import { useState } from "react"
import { useRouter } from "next/navigation";
export default function login(){
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [error, setError] =useState<string[]>([]);
    const [success, setSuccess] =useState("");
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    
    const handleSubmit: NonNullable<
        React.ComponentProps<"form">["onSubmit"]> = async (e) => {
            e.preventDefault();
            setError([]);
            setSuccess("");
            const errors: string[] = [];

            if (!email.trim()) {
                errors.push("Email is required");
            }

            if (!password.trim()) {
                errors.push("Password is required");
            }

            if (errors.length > 0) {
                setError(errors);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/v1/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                const data = await response.json().catch(() => ({}));

                console.log("HTTP status:", response.status);
                console.log("Rails response:", data);

                if (!response.ok) {
                    setError(data.errors || ["Login failed"]);
                    return;
                }

                setSuccess(data.message);
                console.log("Logged in user:", data.user);
                router.push("/");

            } catch (error) {
                console.error("Login error:", error);
                setError(["Unable to connect to the server. Please try again."]);
            }
        };
    return(
        <>
        <div>
            <div>
                <p>Login Page</p>
            </div>

            <div>
                <form onSubmit={handleSubmit}>
                    <p>Email:</p>
                    <input type="email" name="email" value={email} placeholder="Enter your email" onChange={(e)=> setEmail(e.target.value)} />
                    <p>Password:</p>
                    <input type="password" name="password" value={password}  placeholder="Enter your password" onChange={(e)=> setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                    {error.length > 0 && (
                        <div>
                            {error.map((message, index) => (
                                <p key={index} className="text-red-500">
                                    {message}
                                </p>
                            ))}
                        </div>
                    )}

                    {success && (
                        <p className="text-green-500">{success}</p>
                    )}
                </form>
                
            </div>
        </div>
        </>
    )
}
