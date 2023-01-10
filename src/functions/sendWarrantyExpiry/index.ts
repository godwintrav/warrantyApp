import { DynamoDBStreamEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";

const sesClient = new SESClient({});

export const handler = async (event: DynamoDBStreamEvent) => {
    try {

        const warrantyPromises = event.Records.map(async (record) => {

            const data = unmarshall(record.dynamodb.OldImage as Record<string, AttributeValue>);

            const { email, orderId, warrantyDate } = data;

            await sendEmail({ email, orderId, warrantyDate });
        });


        await Promise.all(warrantyPromises);
    } catch (e) {
        console.log(e);
    }
}

const sendEmail = async ({ email, orderId, warrantyDate }: { email: string; orderId: string; warrantyDate: number; }) => {

    const params: SendEmailCommandInput = {
        Source: 'godwintrav@gmail.com',
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: "Your Warranty"
            },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `Your warranty is about to expire click the link to increase the warranty by 2 years: ${process.env.baseUrl}`
                }
            }
        }
    };

    const command = new SendEmailCommand(params);

    const res = await sesClient.send(command);
    return res.MessageId;
}