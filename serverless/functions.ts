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
}

export default functions;