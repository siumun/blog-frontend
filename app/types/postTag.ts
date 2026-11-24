import { Post } from "./post";
import { Tag } from "./tag";

export interface PostTag {
    id: number;
    tag: Tag;
    posts: Post[];
}