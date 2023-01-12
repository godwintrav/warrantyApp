import { formatJSONResponse } from "@libs/apiGateway";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.singleTable;

        //get warrantyId



    } catch (error) {
        console.log(error);
        return;
    }
};