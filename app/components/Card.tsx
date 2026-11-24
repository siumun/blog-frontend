
import Link from "next/link"
import { Post } from "../types/post"
import { Favorite } from "../types/favorite"

export default function Card({
    post
}: {
    post: Post
}){
   
    return(
        <>
<div key={post.id}>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                        <div className="min-w-70 flex justify-center">
                            {post.top_image_url && (
                                <img
                                    className="h-35 w-fit" src={post.top_image_url}/>
                            )}
                        </div>

                        <div>
                            <div>
                                <h2>
                                    <Link className="font-bold text-md hover:text-[lightblue]" href={`/posts/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>
                            </div>

                            <div>
                                <p>{post.excerpt}</p>
                                <p>View Count: {post.view_count}</p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}
