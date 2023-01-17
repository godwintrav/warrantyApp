import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent } from "aws-lambda";
import { WarrantyRecordType } from "src/types/dynamo.t";
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent) => {

    try {
        const tableName = process.env.warrantyTable;
        const { queryStringParameters = {} } = event;
        const { email, orderId } = queryStringParameters;
        const todayDate = Date.now();
        //add two years to current date
        const warrantyDate: number = todayDate + 63113852000;

        //validate inputs
        const validationErrors = validateInputs({ email, orderId });
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
        let response = await dynamo.write(data, tableName);

        //return success message
        return formatJSONResponse({
            statusCode: 201, data: {
                message: `Warranty Created for Order: ${orderId}`,
                email,
                warrantyDate,
                orderId
            },
        });

    } catch (error) {
        console.log(error);
        return formatJSONResponse({ statusCode: 500, data: error.message });
    }
};

const validateInputs = ({ email, orderId }: { email?: string; orderId?: string; }) => {
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

}