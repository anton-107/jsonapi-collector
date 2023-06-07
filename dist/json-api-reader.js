import { JSONPath } from "jsonpath-plus";
async function postJsonAndParseResponse(postMethod, options, requestData) {
    return new Promise((resolve, reject) => {
        let data = "";
        const req = postMethod({ ...options, method: "POST" }, (res) => {
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("error", (error) => {
                reject(error);
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
    properties;
    constructor(properties) {
        this.properties = properties;
    }
    version() {
        return 1;
    }
    async fetchPost(request, postBody, jsonPathString) {
        const json = await postJsonAndParseResponse(this.properties.httpClient.post, request, postBody);
        return JSONPath({ path: jsonPathString, json });
    }
}
//# sourceMappingURL=json-api-reader.js.map