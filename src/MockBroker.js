import Axios from "axios";

export default class {
    #axios;
    constructor(mockServer) {
        this.#axios = Axios.create({ baseURL: mockServer.url });
    }
    async call(actionName,
        params,
        opts) {
        // this.#axios.post()
        const httpResp = await this.#axios.post(`/${actionName}`, {
            params,
            opts
        });
        //TODO handle ctx also
        //TODO check and throw err here if data returned does not match protocol
        return httpResp.data.willReturn;
    }
}