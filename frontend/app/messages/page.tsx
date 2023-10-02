"use client";

import {
  navigateNowTo,
  navigateLaterTo,
  replacePageUrlWith,
} from "@utils/navigate";
import Link from "next/link";
import Pagination from "@app/Pagination";
import { useEffect, useState } from "react";
import MessageType from "@models/MessageType";
import { useMessageContext } from "./MessageContext";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "") || 1;

  const [isLoading, setIsLoading] = useState(true);
  const { messages, paginationClues, asyncGetListPage, asyncDeleteRecord } =
    useMessageContext();

  const generateListPageUrl = (pageNum: number) => {
    return `/messages?page=${pageNum}`;
  };

  const fetchListHandler = async () => {
    return await asyncGetListPage({
      pageNum: page,
      pageNumTooLarge(lastPage) {
        const targetPageUrl = generateListPageUrl(lastPage);
        replacePageUrlWith(targetPageUrl, router);
      },
    });
  };

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true);
      const success = await fetchListHandler();
      if (!success) return;
      setIsLoading(false);
    };
    fetchList();
  }, [page]);

  const pageNumChanged = (chosenPageNum: number) => {
    setIsLoading(true);
    const targetPageUrl = generateListPageUrl(chosenPageNum);
    navigateNowTo(targetPageUrl, router);
  };

  const deleteRow = (id: number) => {
    return async () => {
      if (!confirm("Are you sure?")) {
        return;
      }
      setIsLoading(true);
      await asyncDeleteRecord({ id });
      const success = await fetchListHandler();
      if (!success) return;
      setIsLoading(false);
    };
  };

  return (
    <div>
      {isLoading && <div>loading...</div>}
      {!isLoading && (
        <div>
          <h2>Messages</h2>
          <button onClick={navigateLaterTo("/", router)}>Home</button>
          &nbsp;
          <button onClick={navigateLaterTo("/messages/new", router)}>
            Create New Message
          </button>
          <p>&nbsp;</p>
          <table>
            <thead>
              <tr>
                <th style={{ width: 500 }} align="left">
                  Subject
                </th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {messages.length <= 0 && (
                <tr>
                  <td style={{ textAlign: "center", height: 100 }}>
                    No messages yet. Try to create a new one.
                  </td>
                </tr>
              )}
              {messages &&
                messages.map((message: MessageType) => (
                  <tr key={message.id}>
                    <td>
                      <Link href={`/messages/view?id=${message.id}`}>
                        {message.subject}
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={navigateLaterTo(
                          "messages/edit?id=" + message.id,
                          router
                        )}
                      >
                        Edit
                      </button>
                      &nbsp;
                      <button onClick={deleteRow(message.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>&nbsp;</p>
          <Pagination clues={paginationClues} onChange={pageNumChanged} />
        </div>
      )}
    </div>
  );
};

export default Page;
