import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useToast } from "@chakra-ui/react";

export const useApiRequest = (apiUrl?: string, canCallApi = false) => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>();
  const toast = useToast();

  const apiRequestService = useCallback(
    async <BodyType, ResponseType>(params: {
      method: "get" | "post" | "put" | "patch" | "delete";
      url?: string;
      body?: BodyType;
      baseUrl?: string;
      binaryData?: boolean;
    }): Promise<{
      success: boolean;
      message?: string;
      data?: ResponseType;
    }> => {
      setLoading(true);
      const details = await apiRequest<BodyType, ResponseType>(params);
      if (details.success) setApiData(details?.data);
      else
        toast({
          description: details.message,
          status: "error",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      setLoading(false);
      return details;
    },
    []
  );

  const getApiData = () => {
    apiUrl &&
      apiRequestService({
        method: "get",
        url: apiUrl,
      });
  };

  useEffect(() => {
    canCallApi &&
      apiRequestService({
        method: "get",
        url: apiUrl,
      });
    // eslint-disable-next-line
  }, [apiUrl, canCallApi]);

  return {
    apiRequestService,
    loading,
    apiData,
    setApiData,
    refetchData: apiRequestService,
    getApiData,
    setLoading,
  };
};
