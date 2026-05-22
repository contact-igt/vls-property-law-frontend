import { _axios } from "@/helper/axios";

// Must match the client_key value in the clients DB table
// Run Step 1 first: POST /api/v1/clients { name: "VLS Law", client_key: "vls_law" }
const PROPERTY_LAW_CLIENT_KEY = "vls_law";

export class PropertyLawApi {
  PropertyLawRegister = async (data) => {
    return await _axios(
      "post",
      "/property-law/register",
      { ...data, client_key: data?.client_key || PROPERTY_LAW_CLIENT_KEY },
      "application/json",
      {},
      { "X-Client-Key": PROPERTY_LAW_CLIENT_KEY }
    );
  };
}
