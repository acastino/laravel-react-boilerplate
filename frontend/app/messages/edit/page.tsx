"use client";

import MessageForm from "../MessageForm";
import { useEffect, useState } from "react";
import { useMessageContext } from "../MessageContext";
import { replacePageUrlWith404 } from "@utils/navigate";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = parseInt(searchParams.get("id") || "") || 0;

  const [isLoading, setIsLoading] = useState(true);
  const { message, asyncGetRecord } = useMessageContext();

  useEffect(() => {
    const asyncFetchMessage = async () => {
      const success = await asyncGetRecord({
        id,
        notFound: () => {
          replacePageUrlWith404(router);
        },
      });
      if (!success) return;
      setIsLoading(false);
    };
    asyncFetchMessage();
  }, []);

  return (
    <div>
      {isLoading && <div>loading...</div>}
      {!isLoading && (
        <div>
          <MessageForm edit={message} />
        </div>
      )}
    </div>
  );
};

export default Page;
