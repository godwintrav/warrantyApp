import { DynamoDBClient, AttributeValue } from "@aws-sdk/client-dynamodb";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});
type Item = Record<string, AttributeValue>;

export const dynamo = {
    write: async <T = Item>(data: Record<string, any>, tableName: string) => {
        const params: PutCommandInput = {
            TableName: tableName,
            Item: data,
        };

        const command = new PutCommand(params);

        await dynamoClient.send(command);

        return params.Item as T;
    }
}