import TopBanner from "@/app/components/TopBanner";
import NavigationBar from "@/app/components/NavigationBar";
import Link from "next/link";
export default async function TagDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tags/${slug}/posts`
  );

  if (!response.ok) {
    return <p>Tag not found.</p>;
  }

  const data = await response.json();

  return (
    <main>
      <TopBanner/>
      <NavigationBar/>
      <div className="w-full">
        <h1>{data.tag.name}</h1>
        <div className="mx-auto flex max-w-[1300px] flex-col justify-center gap-5 p-5">
          {data.posts.map((post: any) => (
            <article key={post.id}>
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
                              <Link className="font-bold text-[clamp(16px,4vw,24px)] hover:text-[lightblue]" href={`/posts/${post.slug}`}>
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
          </article>
        ))}
        </div>
      </div>
    </main>
  );
}