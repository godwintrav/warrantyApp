import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";
import { WarrantyRecordType } from "src/types/dynamo.t";

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;

        const { email } = event.pathParameters || {};

        if (!email) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: "Missing email address in path",
                }
            });
        }
        //query dynamodb for orders
        const queryResult = await dynamo.query<WarrantyRecordType>({ tableName, index: "index1", pkValue: email });
        const result = queryResult.map(({ orderId, email, warrantyDate, ...queryResult }) => {
            return { orderId, email, warrantyDate: new Date(warrantyDate) }
        });
        console.log(queryResult);
        //format response
        //return response
        return formatJSONResponse({
            data: {
                message: "Success",
                response: result
            }
        })


    } catch (error) {
        console.log(error);
        return formatJSONResponse({ statusCode: 500, data: error.message });;
    }
};