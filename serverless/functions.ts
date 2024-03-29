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
    getWarranties: {
        handler: 'src/functions/getWarranties/index.handler',
        events: [
            {
                httpApi: {
                    path: "/{email}",
                    method: "GET",
                },
            },
        ],
    },
    getWarranty: {
        handler: 'src/functions/getWarranty/index.handler',
        events: [
            {
                httpApi: {
                    path: "/warranty/{warrantyId}",
                    method: "GET",
                },
            },
        ],
    },
}

export default functions;