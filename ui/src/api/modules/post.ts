import { get, customFetch, deleteEmpty } from "@/api";

export function getPost(params: any) {
  return get("/apis/api.console.halo.run/v1alpha1/posts", deleteEmpty(params));
}

export function getPostDetail(name: string) {
  return get(`/apis/content.halo.run/v1alpha1/posts/${name}`);
}

export function updatePostDetail(name: string, info: any) {
  return customFetch(`/apis/content.halo.run/v1alpha1/posts/${name}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
     },
    body: JSON.stringify(info),
  });
}
