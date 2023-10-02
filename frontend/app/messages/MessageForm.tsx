"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MessageType from "@models/MessageType";
import { useMessageContext } from "./MessageContext";

interface apiErrors {
  [key: string]: string[];
}
interface uiValues {
  [key: string]: string;
}

const MessageForm = ({ edit }: { edit?: MessageType }) => {
  const router = useRouter();

  const emptyValues = {
    subject: "",
    recipients: "",
    message: "",
  } as uiValues;

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(emptyValues);
  const [errors, setErrors] = useState(emptyValues);
  const { asyncSaveRecord } = useMessageContext();

  useEffect(() => {
    if (!edit) {
      return;
    }
    setFormValues({
      ...edit,
      id: edit.id + "",
      recipients: edit.recipients.join("\n"),
    });
  }, []);

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors(emptyValues);
    setIsLoading(true);

    const message = {
      ...formValues,
      id: parseInt(formValues.id),
      recipients: formValues.recipients.split("\n"),
    } as MessageType;

    const success = await asyncSaveRecord({
      message,
      validationErrors: (errors) => {
        handleErrors(errors);
        setIsLoading(false);
      },
    });
    if (!success) return;
    router.back();
  };

  const handleErrors = (errors: apiErrors) => {
    const recipientErrors = [];
    const errorsFound = { ...emptyValues } as uiValues;
    for (let key in errors) {
      const error = errors[key].join("\n");
      if (["subject", "message"].includes(key)) {
        errorsFound[key] = error;
        continue;
      }
      recipientErrors.push(error);
    }
    errorsFound.recipients = recipientErrors.join("\n");
    setErrors(errorsFound);
  };

  return (
    <div>
      <h2>{edit ? "Edit" : "Create New"} Message</h2>
      <p>&nbsp;</p>
      <fieldset style={{ border: 0 }} disabled={isLoading}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject">
              <span>Subject:</span>
              <input
                type="text"
                id="subject"
                value={formValues.subject}
                onChange={onChange}
              />
              {errors.subject && (
                <div style={{ paddingBottom: 8 }}>
                  <small style={{ color: "red" }}>{errors.subject}</small>
                </div>
              )}
            </label>
          </div>
          <div>
            <label htmlFor="recipients">
              <span>Recipients:</span>
              <textarea
                id="recipients"
                rows={3}
                value={formValues.recipients}
                onChange={onChange}
              />
              {errors.recipients && (
                <div style={{ paddingBottom: 8 }}>
                  <small style={{ color: "red" }}>{errors.recipients}</small>
                </div>
              )}
            </label>
          </div>
          <div>
            <label htmlFor="message">
              <span>Message:</span>
              <textarea
                id="message"
                rows={10}
                value={formValues.message}
                onChange={onChange}
              />
              {errors.message && (
                <div style={{ paddingBottom: 8 }}>
                  <small style={{ color: "red" }}>{errors.message}</small>
                </div>
              )}
            </label>
          </div>
          <button type="reset" onClick={router.back}>
            Cancel
          </button>
          &nbsp;
          <button>{edit ? "Save Changes" : "Create Message"}</button>
        </form>
      </fieldset>
    </div>
  );
};

export default MessageForm;
