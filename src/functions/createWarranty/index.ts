import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";
import { WarrantyRecordType } from "src/types/dynamo.t";
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;
        const body = JSON.parse(event.body);
        const { email, orderId, warrantyDate } = body;

        //validate inputs
        const validationErrors = validateInputs({ email, orderId, warrantyDate });
        if (validationErrors) {
            return validationErrors;
        }

        const data: WarrantyRecordType = {
            id: uuid().slice(0, 8),
            pk: email,
            sk: warrantyDate.toString(),
            email,
            orderId,
            TTL: warrantyDate / 1000,
            warrantyDate
        };
        //create warranty in dynamo table
        const response = await dynamo.write(data, tableName);
        //return success message
        return formatJSONResponse({
            statusCode: 201, data: {
                message: `Warranty Created for Order: ${orderId}`,
                warranty: response,
            },
        });

    } catch (error) {
        console.log(error);
        return;
    }
};

const validateInputs = ({ email, orderId, warrantyDate }: { email?: string; orderId?: string; warrantyDate?: number; }) => {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (!email || !email.match(pattern)) {
        return formatJSONResponse({
            statusCode: 400, data: {
                message: 'Valid email is required to create an order'
            }
        });
    }

    if (!orderId) {
        return formatJSONResponse({
            statusCode: 400, data: {
                message: 'No orderId passed'
            }
        });
    }

    if (!warrantyDate) {
        return formatJSONResponse({
            statusCode: 400, data: {
                message: 'Warranty Date required'
            }
        });
    }
}