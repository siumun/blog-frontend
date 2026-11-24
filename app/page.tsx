import { Suspense } from "react";
import TopBanner from "./components/TopBanner";
import NavigationBar from "./components/NavigationBar";
import PostCard from "./components/PostCard";
import Subcription from "./components/Subscription"; 

export default function HomePage() {
    return (
        <>
            <TopBanner />
            <NavigationBar />
            
            <Suspense fallback={<p>Loading posts...</p>}>
                <PostCard/>
            </Suspense>

            <Subcription/>
        </>
    );
}
