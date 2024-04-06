import { ArrowBackIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/react";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import { debounce } from "../../../lib/utils.lb";

type PropType = {
  placeholder?: string;
  handleQueryChange?: (str: string) => void;
};

const SearchInputBox = (props: PropType) => {
  const { placeholder = "", handleQueryChange = () => null } = props;
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    debounce<string, void>(handleQueryChange),
    []
  );

  const onChange = (query: string) => {
    setQuery(query);
    handleChange(query);
  };

  useEffect(()=>{
  console.log("input box")
  },[])

  return (
    <div className="pl-16 pr-8 bg-c-panel-header-background flex-1 rounded-lg relative">
      <Input
        variant="unstyled"
        placeholder={placeholder}
        onChange={(e)=>onChange(e.target.value)}
        value={query}
        borderRadius="8px"
        height="35px"
        fontSize="15px"
        w="100%"
      />
      <span className="absolute left-[15px] top-[3px]">
        {query.length ? (
          <ArrowBackIcon
            w={6}
            h={6}
            color="#00a884"
            className=" cursor-pointer"
            onClick={()=>onChange("")}
          />
        ) : (
          <SearchIcon color="#54656f" w={3.5} h={3.5} />
        )}
      </span>
      {query.length > 0 && (
        <span
          className="absolute right-[15px] top-[3px] cursor-pointer"
          onClick={()=>onChange("")}
        >
          <CloseIcon color="#54656f" w={2.5} h={2.5} />
        </span>
      )}
    </div>
  );
};

export default SearchInputBox;
