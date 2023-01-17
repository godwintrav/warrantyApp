import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/functions/createWarranty/index";

describe("createWarrantyTest", () => {
    it("should create warranty", async () => {
        const data = JSON.stringify({
            email: "godwintrav@gmail.com",
            orderId: "22333445"
        });
        const response = await handler({});
        console.log(response);
    })

});