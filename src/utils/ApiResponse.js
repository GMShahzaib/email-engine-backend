import { SUCCESSFUL } from "./constants.js";

class ApiResponse {
    constructor(statusCode, data, message = SUCCESSFUL) {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400

    }
}

export default ApiResponse