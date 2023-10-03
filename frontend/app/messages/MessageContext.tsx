"use client";

import MessageApi from "@services/MessageApi";
import MessageType from "@models/MessageType";
import PaginationClues from "@models/PaginationClues";
import ValidationErrors from "@models/ValidationErrors";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface asyncGetListPageArgs {
  pageNum: number;
  responseNotOk?: (response: Response) => void;
  pageNumTooLarge: (lastPage: number) => void;
}

interface asyncGetRecordArgs {
  id: number;
  notFound: () => void;
  responseNotOk?: (response: Response) => void;
}

interface asyncSaveRecordArgs {
  message: MessageType;
  responseNotOk?: (response: Response) => void;
  validationErrors: (errors: ValidationErrors) => void;
}

interface asyncDeleteRecordArgs {
  id: number;
  responseNotOk?: (response: Response) => void;
}

interface MessageContextProps {
  message: MessageType;
  messages: MessageType[];
  paginationClues: PaginationClues;
  asyncGetListPage: (params: asyncGetListPageArgs) => Promise<boolean>;
  asyncGetRecord: (params: asyncGetRecordArgs) => Promise<boolean>;
  asyncSaveRecord: (params: asyncSaveRecordArgs) => Promise<boolean>;
  asyncDeleteRecord: (params: asyncDeleteRecordArgs) => Promise<boolean>;
}

const MessageContext = createContext<MessageContextProps>({
  messages: [],
  paginationClues: {
    currentPage: 0,
    lastPage: 0,
    perPage: 0,
    total: 0,
  },
  message: {
    id: 0,
    recipients: [],
    subject: "",
    message: "",
  },
  asyncGetListPage: async ({}) => false,
  asyncGetRecord: async ({}) => false,
  asyncSaveRecord: async ({}) => false,
  asyncDeleteRecord: async ({}) => false,
});

export const MessageContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const messageApi = new MessageApi();

  // objects below are related to fetching all rows of a given page number

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [paginationClues, setPaginationClues] = useState<PaginationClues>({
    currentPage: 0,
    lastPage: 0,
    perPage: 0,
    total: 0,
  });

  const asyncGetListPage = async ({
    pageNum,
    responseNotOk = () => {},
    pageNumTooLarge,
  }: asyncGetListPageArgs): Promise<boolean> => {
    const sortColumn = "created_at";
    const sortDirection = "desc";
    const response = await messageApi.index(pageNum, sortColumn, sortDirection);
    if (!response.ok) {
      responseNotOk(response);
      return false;
    }
    const json = await response.json();
    const pagination = json.pagination;
    const { currentPage, lastPage } = pagination;
    if (currentPage > lastPage) {
      pageNumTooLarge(lastPage);
      return false;
    }
    setPaginationClues(pagination);
    setMessages(json.data);
    return true;
  };

  // fetching a single record

  const [message, setMessage] = useState<MessageType>({
    id: 0,
    recipients: [],
    subject: "",
    message: "",
  });

  const asyncGetRecord = async ({
    id,
    notFound,
    responseNotOk = () => {},
  }: asyncGetRecordArgs): Promise<boolean> => {
    const response = await messageApi.read(id);
    if (response.status == 404) {
      notFound();
      return false;
    }
    if (!response.ok) {
      responseNotOk(response);
      return false;
    }
    const message = await response.json();
    setMessage(message);
    return true;
  };

  // saving a new record, or updating an existing one

  const asyncSaveRecord = async ({
    message,
    validationErrors,
    responseNotOk = () => {},
  }: asyncSaveRecordArgs): Promise<boolean> => {
    var response;
    if (message.id > 0) {
      response = await messageApi.update(message.id, message);
    } else {
      response = await messageApi.create(message);
    }
    const data = await response.json();
    if (data.errors) {
      validationErrors(data.errors);
      return false;
    }
    if (!response.ok) {
      responseNotOk(response);
      return false;
    }
    setMessage(data);
    return true;
  };

  // deleting a record

  const asyncDeleteRecord = async ({
    id,
    responseNotOk = () => {},
  }: asyncDeleteRecordArgs): Promise<boolean> => {
    const response = await messageApi.delete(id);
    if (!response.ok) {
      responseNotOk(response);
      return false;
    }
    return true;
  };

  return (
    <MessageContext.Provider
      value={{
        message,
        messages,
        paginationClues,
        asyncGetListPage,
        asyncGetRecord,
        asyncSaveRecord,
        asyncDeleteRecord,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => useContext(MessageContext);
