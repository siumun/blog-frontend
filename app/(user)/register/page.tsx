"use client";

import React, { useState } from "react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string[]>([]);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    console.log("API URL:", API_URL);
    console.log("Request URL:", `${API_URL}/api/v1/users`);

    const handleSubmit: NonNullable<
        React.ComponentProps<"form">["onSubmit"]
    > = async (e) => {
        e.preventDefault();

        // Clear previous messages
        setError([]);
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/v1/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            console.log("HTTP status:", response.status);
            console.log("Rails response:", data);

            if (!response.ok) {
                const messages = Array.isArray(data.errors)
                    ? data.errors
                    : ["Registration failed"];

                setError(messages);
                return;
            }

            console.log("Registration successful:", data);

            setSuccess("Registration successful!");

            // Clear form
            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Registration error:", error);
            setError(["Unable to connect to the server. Please try again."]);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row gap-8 border border-white w-fit p-6">

            <div className="bg-blue">
                <p>Registration Form</p>
            </div>

            <div>
                <form onSubmit={handleSubmit}>

                    <p>Name:</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <p>Email:</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <p>Password:</p>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error.length > 0 && (
                        <div className="mt-2">
                            {error.map((message, index) => (
                                <p key={index} className="text-red-500">
                                    {message}
                                </p>
                            ))}
                        </div>
                    )}

                    {success && (
                        <p className="text-green-500 mt-2">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>
            </div>
        </div>
    );
}
