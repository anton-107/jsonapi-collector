/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { ClientRequest, IncomingMessage } from "http";
import { RequestOptions } from "https";
export type GetRequestCallback = (res: IncomingMessage) => void;
type PostRequest = (options: RequestOptions, callback: GetRequestCallback) => ClientRequest;
interface JSONAPIReaderProperties {
    httpClient: {
        post: PostRequest;
    };
}
export declare class JSONAPIReader {
    private properties;
    constructor(properties: JSONAPIReaderProperties);
    version(): number;
    fetchPost<T>(request: RequestOptions, postBody: string, jsonPathString: string): Promise<T>;
}
export {};
