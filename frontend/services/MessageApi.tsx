import BaseApi from "./BaseApi";
import MessageType from "@models/MessageType";

export default class MessageApi extends BaseApi<number, MessageType> {
  protected resourceGroupName = "message";
}
