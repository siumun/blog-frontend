export interface Comment{
    id: number;
    user_id: number;
    user_name: string;
    body: string;
    post_id: number;
    parent_id: number;
}