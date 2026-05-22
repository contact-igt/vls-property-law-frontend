import { PropertyLawApi } from "@/service/AcademyTraining";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

export const PropertyLawRegisterQuery = () => {
  const propertyLawApi = new PropertyLawApi();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async ({ value }) => {
      return await propertyLawApi.PropertyLawRegister(value);
    },
    {
      onSuccess: () => {
        enqueueSnackbar("Registered successfully", { variant: "success" });
      },
      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";

        enqueueSnackbar(message, { variant: "error" });

        throw error;
      },
    }
  );
};
