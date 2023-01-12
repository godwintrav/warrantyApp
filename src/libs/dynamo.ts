import { DynamoDBClient, AttributeValue } from "@aws-sdk/client-dynamodb";
import { PutCommand, PutCommandInput, QueryCommandInput, QueryCommand } from "@aws-sdk/lib-dynamodb";

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
    },

    query: async <T = Item>({
        tableName,
        index,

        pkValue,
        pkKey = 'pk',

        skValue,
        skKey = 'sk',


    }: {
        tableName: string;
        index: string;
        pkValue: string;
        pkKey?: string;
        skValue?: string;
        skKey?: string;
    }) => {

        console.log(pkValue);
        const skExpression = skValue ? ` AND ${skKey} = :rangeValue` : "";
        const params: QueryCommandInput = {
            TableName: tableName,
            IndexName: index,
            KeyConditionExpression: `${pkKey} = :hashValue${skExpression}`,
            ExpressionAttributeValues: {
                ":hashValue": pkValue,
            },
        };

        if (skValue) {
            params.ExpressionAttributeValues[":rangeValue"] = skValue;
        }

        const command = new QueryCommand(params);
        const res = await dynamoClient.send(command);

        return res.Items as T[];
    }
}