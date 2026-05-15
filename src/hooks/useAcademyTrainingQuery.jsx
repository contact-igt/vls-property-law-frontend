import { AcademyTrainingApi } from "@/service/AcademyTraining";
import { useSnackbar } from "notistack";
import { useMutation, useQueryClient } from "react-query";

const AcademyApiData = new AcademyTrainingApi();

export const AcademyRegisterQuery = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async ({ value }) => {
      return await AcademyApiData.AcademyTrainingRegister(value);
    },
    {
      onSuccess: (data) => {
        enqueueSnackbar("Registered successfully", { variant: "success" });
        queryClient.invalidateQueries(["Academy Register"]);
        return data;
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
