// @ts-nocheck

function customFetch(url: string, options = {}, responseType = "json") {
  const requestInterceptors = [
    (config) => {
      return config;
    },
  ];

  const responseInterceptors = [
    (response) => {
      return response;
    },
  ];

  options = requestInterceptors.reduce(
    (acc, interceptor) => interceptor(acc),
    options,
  );

  return fetch(url, options)
    .then((response) => {
      response = responseInterceptors.reduce(
        (acc, interceptor) => interceptor(acc),
        response,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      switch (responseType) {
        case "json":
          return response.json();
        case "text":
          return response.text();
        case "blob":
          return response.blob();
        case "formData":
          return response.formData();
        case "arrayBuffer":
          return response.arrayBuffer();
        default:
          return response.json();
      }
    })
    .catch((error) => {
      console.error("Fetch Error:", error);
      throw error;
    });
}

function toQueryString(params) {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map((k) => esc(k) + "=" + esc(params[k]))
    .join("&");
}


function get(url, params = {}, options = {}) {
  if (params && Object.keys(params).length) {
    url += (url.indexOf("?") === -1 ? "?" : "&") + toQueryString(params);
  }
  return customFetch(url, { ...options, method: "GET" });
}

function post(url, data = {}, json = true, options = {}) {
  const headers = new Headers(options.headers || {});

  let bodyData;
  if (json) {
    headers.append("Content-Type", "application/json");
    bodyData = JSON.stringify(data);
  } else {
    bodyData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      bodyData.append(key, value);
    }
  }

  return customFetch(url, {
    ...options,
    method: "POST",
    headers,
    body: bodyData,
  });
}

function download(url, data, fileName, method = "GET") {
  if (method === "GET") {
    if (data && Object.keys(data).length) {
      url += (url.indexOf("?") === -1 ? "?" : "&") + toQueryString(data);
    }
  }
  const options =
    method === "POST"
      ? {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      : {
          method: method,
        };

  customFetch(url, options, "blob")
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "file");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Download Error:", error);
    });
}


// 删除对象中空数据
function deleteEmpty(obj) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  }
  return obj;
}

export { get, post, customFetch, download, deleteEmpty };
