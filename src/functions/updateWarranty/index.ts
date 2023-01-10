import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;
        const { email, orderId } = event.pathParameters || {};
        console.log(email, orderId);



        formatJSONResponse({});

    } catch (error) {
        console.log(error);
        return formatJSONResponse({ statusCode: 500, data: error.message });
    }
};