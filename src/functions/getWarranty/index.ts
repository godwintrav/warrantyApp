import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";
import { WarrantyRecordType } from "src/types/dynamo.t";

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;
        const { warrantyId } = event.pathParameters || {};

        //verify Id
        if (!warrantyId) {
            return formatJSONResponse({
                statusCode: 400,
                data: {
                    message: "Missing warranty ID in path",
                }
            });
        }
        //get Warranty
        const { email, orderId, id, warrantyDate } = await dynamo.get<WarrantyRecordType>(warrantyId, tableName);

        //return warranty
        return formatJSONResponse({
            data: {
                message: "success",
                email,
                orderId,
                id,
                date: new Date(warrantyDate)

            }
        });

    } catch (error) {
        console.log(error);
        return formatJSONResponse({
            statusCode: 500,
            data: {
                message: error.message
            }
        });
    }
};