import { MessageContextProvider } from "./MessageContext";

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MessageContextProvider>
      <center style={{ height: "100vh" }}>{children}</center>
    </MessageContextProvider>
  );
}
