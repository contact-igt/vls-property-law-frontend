import { _axios } from "@/helper/axios";

export class AcademyTrainingApi {
  AcademyTrainingRegister = async (data) => {
    return await _axios("post", "/vls-law-practice/create", data);
  };
}
