import type { AWS } from '@serverless/typescript';

const functions: AWS["functions"] = {
    createWarranty: {
        handler: 'src/functions/createWarranty/index.handler',
        events: [
            {
                httpApi: {
                    path: "/",
                    method: "POST",
                },
            },
        ],
    },
    sendWarrantyExpiry: {
        handler: 'src/functions/sendWarrantyExpiry/index.handler',
        events: [
            {
                stream: {
                    type: 'dynamodb',
                    arn: {
                        "Fn::GetAtt": ["warrantyTable", "StreamArn"],
                    },
                    filterPatterns: [{ eventName: ["REMOVE"] }],
                },
            },
        ],
        //@ts-expect-error
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    "ses:sendEmail", "sns:Publish"
                ],
                Resource: '*'
            }
        ],
    },
    updateWarranty: {
        handler: 'src/functions/updateWarranty/index.handler',
        events: [
            {
                httpApi: {
                    path: "/",
                    method: "GET",
                },
            },
        ],
    },
}

export default functions;