import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;



        formatJSONResponse({ data: {} });

    } catch (error) {
        console.log(error);
        return;
    }
};