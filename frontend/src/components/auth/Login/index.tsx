import { Button, FormControl, VStack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../../ui/TextInput";
import { AppConstants } from "../../../lib/constants";
import { AppConfig } from "../../../api/endpoints";
import { cookiesStore } from "../../../lib/utils.lb";
import { useNavigate } from "react-router-dom";
import { useApiRequest } from "../../../hooks/useApiRequestService";

type FormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const { formState, handleSubmit, control } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { errors } = formState;
  const navigate = useNavigate();
  const { apiRequestService, loading } = useApiRequest();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
    };
    const response = await apiRequestService<
      FormValues,
      { token: string; id: string }
    >({
      url: AppConfig.endpoints.login,
      method: "post",
      body: payload,
    });
    // console.log(response?.data,"response")
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
        <Button
          width="100%"
          marginTop="20px"
          colorScheme="teal"
          variant="solid"
          type="submit"
          isLoading={loading}
        >
          Login
        </Button>
        <Button width="100%" colorScheme="red" variant="solid">
          Get Guest User Details
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
