import { get, customFetch, deleteEmpty } from "@/api";

export function getGroups() {
  return get("/apis/storage.halo.run/v1alpha1/groups", { labelSelector: "!halo.run/hidden" });
}


export function getFileList(page = 1, size = 60, ungrouped: boolean, fieldSelector?: string) {
  return get("/apis/api.console.halo.run/v1alpha1/attachments", deleteEmpty({ 
    page, size, ungrouped, fieldSelector
  }));
}
