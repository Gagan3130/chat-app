import {
  Box,
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";

type props = {
  input: InputProps;
  label: string;
  errorMsg?: string;
  showPassword?: boolean;
};

const TextInput = (props: props) => {
  const { input, label, errorMsg, showPassword } = props;
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow((val) => !val);
  };

  const getInputType = () => {
    if (!showPassword) return input.type;
    else return show ? "text" : "password";
  };
  
  return (
    <Box width="100%">
      <FormLabel fontWeight="medium">{label}</FormLabel>
      <InputGroup size="md">
        <Input {...input} type={getInputType()} />
        {showPassword && (
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage mt={1}>{errorMsg}</FormErrorMessage>
    </Box>
  );
};

export default TextInput;
