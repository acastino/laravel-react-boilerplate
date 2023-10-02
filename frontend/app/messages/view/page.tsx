"use client";

import { useEffect, useState } from "react";
import { useMessageContext } from "../MessageContext";
import { useRouter, useSearchParams } from "next/navigation";
import { navigateLaterTo, replacePageUrlWith404 } from "@utils/navigate";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = parseInt(searchParams.get("id") || "") || 0;

  const [isLoading, setIsLoading] = useState(true);
  const { message, asyncGetRecord, asyncDeleteRecord } = useMessageContext();

  useEffect(() => {
    const fetchMessage = async () => {
      setIsLoading(true);
      const success = await asyncGetRecord({
        id,
        notFound: () => {
          replacePageUrlWith404(router);
        },
      });
      if (!success) return;
      setIsLoading(false);
    };
    fetchMessage();
  }, []);

  const deleteRow = (id: number) => {
    return async () => {
      if (!confirm("Are you sure?")) {
        return;
      }
      setIsLoading(true);
      await asyncDeleteRecord({ id });
      router.back();
    };
  };

  return (
    <div>
      {isLoading && <div>loading...</div>}
      {!isLoading && (
        <div>
          <h2>View Message</h2>
          <p>&nbsp;</p>
          <table border={1}>
            <tbody>
              <tr>
                <th style={{ width: 200 }} align="right">
                  subject
                </th>
                <td style={{ width: 500 }}>{message.subject}</td>
              </tr>
              <tr>
                <th style={{ width: 200 }} align="right">
                  recipients
                </th>
                <td style={{ width: 500 }}>
                  {message.recipients.map((recipient) => (
                    <div key={recipient}>{recipient}</div>
                  ))}
                </td>
              </tr>
              <tr>
                <th style={{ width: 200 }} align="right">
                  message
                </th>
                <td style={{ width: 500 }}>{message.message}</td>
              </tr>
            </tbody>
          </table>
          <p>&nbsp;</p>
          <button onClick={router.back}>&lt; Back to all Messages</button>
          &nbsp;
          <button
            onClick={navigateLaterTo(`/messages/edit?id=${message.id}`, router)}
          >
            Edit
          </button>
          &nbsp;
          <button onClick={deleteRow(message.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Page;
