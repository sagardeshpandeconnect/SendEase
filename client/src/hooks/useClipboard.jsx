// hooks/useClipboard.js

import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const useClipboard = () => {
  const [copyButtonText, setCopyButtonText] = useState(
    <Button
      leftIcon={<CopyIcon />}
      colorScheme="blue"
      variant="solid"
      size="sm"
    >
      Copy Link
    </Button>
  );

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopyButtonText(
      <Button colorScheme="blue" variant="solid" size="sm">
        Copied
      </Button>
    );
    setTimeout(() => {
      setCopyButtonText(
        <Button
          leftIcon={<CopyIcon />}
          colorScheme="blue"
          variant="solid"
          size="sm"
        >
          Copy Link
        </Button>
      );
    }, 2000);
  };

  return {
    copyButtonText,
    copyToClipboard,
  };
};

export default useClipboard;
