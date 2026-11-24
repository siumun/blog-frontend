import { PostTag } from './postTag'
export interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    view_count: number;
    status: string;
    publication_date: string;
    top_image_url: string | null;
    post_tags: PostTag[]; //not related about db, it describe about api response
    is_favorited: boolean;
}