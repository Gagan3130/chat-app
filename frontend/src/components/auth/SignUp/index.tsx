import { Button, FormControl, VStack } from "@chakra-ui/react";
import TextInput from "../../ui/TextInput";
import { Controller, useForm } from "react-hook-form";
import { AppConstants } from "../../../lib/constants";
import { useApiRequest } from "../../../hooks/useApiRequestService";
import { AppConfig } from "../../../api/endpoints";
import { cookiesStore } from "../../../lib/utils.lb";
import { useNavigate } from "react-router-dom";
import { URL } from "url";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: File;
};

type IPayload = {
  name: string;
  email: string;
  password: string;
  pic?: string;
};

const SignUp = () => {
  const { formState, handleSubmit, getValues, control } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { errors } = formState;
  const { apiRequestService, loading } = useApiRequest();
  const { apiRequestService: uploadFileToCloud, loading: uploading } =
    useApiRequest();
  const navigate = useNavigate();

  const uploadPic = async (profilePic: File) => {
    const formData = new FormData();
    formData.append("file", profilePic);
    formData.append("upload_preset", "rabbit-chat");
    formData.append("cloud_name", "dprc0e2sm");
    const resp = await uploadFileToCloud<FormData, { url: URL }>({
      url: AppConfig.endpoints.uploadImage,
      method: "post",
      body: formData,
      baseUrl: AppConfig.cloudBaseUrl,
      binaryData: true,
    });
    if (resp.success) {
      return resp.data;
    }
  };

  const onSubmit = async (data: FormValues) => {
    let picUrl;
    if (data.profilePic) {
      const response = await uploadPic(data.profilePic);
      picUrl = response?.url.toString();
    }
    const payload: IPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
      pic: picUrl,
    };
    if (!data.profilePic) {
      delete payload.pic;
    }
    const response = await apiRequestService<
      IPayload,
      { token: string; id: string }
    >({
      url: AppConfig.endpoints.user,
      method: "post",
      body: payload,
    });
    if (response?.success) {
      cookiesStore.set({
        key: AppConstants.cookieKeys.TOKEN,
        value: { token: response?.data?.token, id: response?.data?.id },
      });
      navigate("/chat");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <VStack spacing="10px">
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter the name",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <FormControl isRequired isInvalid={Boolean(errors.name?.message)}>
                <TextInput
                  label="Name"
                  input={{
                    placeholder: "Enter Your Name",
                    size: "md",
                    onChange: onChange,
                    value: value,
                  }}
                  errorMsg={errors.name?.message}
                />
              </FormControl>
            );
          }}
          name="name"
        />

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter the email",
            },
            pattern: {
              value: AppConstants.validators.email,
              message: "Please enter valid email",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <FormControl
                isRequired
                isInvalid={Boolean(errors.email?.message)}
              >
                <TextInput
                  label="Email Address"
                  input={{
                    placeholder: "Enter Your Email Address",
                    size: "md",
                    onChange: onChange,
                    value: value,
                  }}
                  errorMsg={errors.email?.message}
                />
              </FormControl>
            );
          }}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter password",
            },
            pattern: {
              value: AppConstants.validators.password,
              message:
                "At least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <FormControl
                isRequired
                isInvalid={Boolean(errors.password?.message)}
              >
                <TextInput
                  label="Password"
                  input={{
                    placeholder: "Enter Password",
                    size: "md",
                    type: "password",
                    onChange: onChange,
                    value: value,
                  }}
                  errorMsg={errors.password?.message}
                  showPassword
                />
              </FormControl>
            );
          }}
          name="password"
        />

        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please confirm password",
            },
            pattern: {
              value: AppConstants.validators.password,
              message:
                "At least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character",
            },
            validate: (val) =>
              val !== getValues("password")
                ? "Please enter the same password"
                : true,
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <FormControl
                isRequired
                isInvalid={Boolean(errors.confirmPassword?.message)}
              >
                <TextInput
                  label="Confirm Password"
                  input={{
                    placeholder: "Confirm Password",
                    size: "md",
                    type: "password",
                    onChange: onChange,
                    value: value,
                  }}
                  errorMsg={errors.confirmPassword?.message}
                  showPassword
                />
              </FormControl>
            );
          }}
          name="confirmPassword"
        />

        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <FormControl>
                <TextInput
                  label="Upload Picture"
                  input={{
                    placeholder: "Upload",
                    size: "lg",
                    type: "file",
                    p: "1.5",
                    accept: "image/*",
                    onChange: (e) => onChange(e.target.files?.[0]),
                  }}
                />
              </FormControl>
            );
          }}
          name="profilePic"
        />

        <Button
          width="100%"
          marginTop="20px"
          colorScheme="teal"
          variant="solid"
          type="submit"
          isLoading={loading || uploading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
