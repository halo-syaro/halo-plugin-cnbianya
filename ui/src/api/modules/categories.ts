import { get } from "@/api";

export function getCategory() {
  return get("/apis/api.content.halo.run/v1alpha1/categories", { page: 1, size: 9999 });
}
