import { Suspense } from "react";
import TopBanner from "./components/TopBanner";
import NavigationBar from "./components/NavigationBar";
import PostCard from "./components/PostCard";
import Subcription from "./components/Subscription"; 
import CursorPagination from "./components/CursorPagination";
export default function HomePage() {
    return (
        <>
            <TopBanner />
            <NavigationBar />
            
            <CursorPagination/>

            <Subcription/>
        </>
    );
}
