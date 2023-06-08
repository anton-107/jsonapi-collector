import { ClientRequest, IncomingMessage } from "http";
import { RequestOptions } from "https";
import { JSONPath } from "jsonpath-plus";

export type GetRequestCallback = (res: IncomingMessage) => void;
type PostRequest = (
  options: RequestOptions,
  callback: GetRequestCallback
) => ClientRequest;

interface JSONAPIReaderProperties {
  httpClient: { post: PostRequest };
}

async function postJsonAndParseResponse<T>(
  postMethod: PostRequest,
  options: RequestOptions,
  requestData: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    let data = "";
    const req = postMethod({ ...options, method: "POST" }, (res) => {
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });
    req.on("error", (error) => {
      reject(error);
    });
    req.write(requestData);
    req.end();
  });
}

export class JSONAPIReader {
  constructor(private properties: JSONAPIReaderProperties) {}
  public async fetchPost<T>(
    request: RequestOptions,
    postBody: string,
    jsonPathString: string
  ): Promise<T> {
    const json = await postJsonAndParseResponse<string>(
      this.properties.httpClient.post,
      request,
      postBody
    );
    return JSONPath({ path: jsonPathString, json });
  }
}
