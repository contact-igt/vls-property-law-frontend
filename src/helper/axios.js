import axios from "axios";

export const _axios = async (
  method,
  url,
  body,
  contentType = "application/json",
  params = {},
  extraHeaders = {}
) => {
  const APISERVER =
    process.env.NEXT_PUBLIC_API_SERVER === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL
      : process.env.NEXT_PUBLIC_API_SERVER === "stage"
        ? process.env.NEXT_PUBLIC_STAGE_API_URL
        : process.env.NEXT_PUBLIC_LOCALHOST_API_URL;

  const endpoint = `${APISERVER}${url}`;

  const isFormData = body instanceof FormData;

  try {
    const response = await axios({
      method,
      url: endpoint,
      data: body,
      params,
      headers: {
        ...(isFormData ? {} : { "Content-Type": contentType }),
        ...extraHeaders,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(error?.message);
    }
    console.error("AXIOS ERROR:", error.response?.data || error.message);
    throw error;
  }
};
