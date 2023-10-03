const apiBaseUri = process.env.NEXT_PUBLIC_API_BASEURL;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export default abstract class BaseApi<idType, ModelType> {
  protected abstract resourceGroupName: string;

  private resourceGroupUri() {
    return `${apiBaseUri}/${this.resourceGroupName}`;
  }

  private request(
    method: string,
    endpoint: string,
    data?: ModelType
  ): Promise<Response> {
    return fetch(`${this.resourceGroupUri()}${endpoint}`, {
      body: data && JSON.stringify(data),
      headers,
      method,
    });
  }

  /**
   * index
   */
  public index(
    pageNum: number,
    column?: string,
    direction?: string
  ): Promise<Response> {
    return this.request(
      "get",
      `?page=${pageNum}&column=${column}&direction=${direction}`
    );
  }

  /**
   * create
   */
  public create(data: ModelType): Promise<Response> {
    return this.request("post", "", data);
  }

  /**
   * read
   */
  public read(id: idType): Promise<Response> {
    return this.request("get", `/${id}`);
  }

  /**
   * update
   */
  public update(id: idType, data: ModelType): Promise<Response> {
    return this.request("put", `/${id}`, data);
  }

  /**
   * delete
   */
  public delete(id: idType): Promise<Response> {
    return this.request("delete", `/${id}`);
  }
}
