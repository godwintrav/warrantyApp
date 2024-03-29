import type { AWS } from '@serverless/typescript';

import functions from './serverless/functions';
import dynamoResources from './serverless/dynamoResources';

const serverlessConfiguration: AWS = {
  service: 'warrantyapp',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-iam-roles-per-function'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "eu-west-2",
    profile: "serverlessUser",
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'dynamodb:*',
        Resource: [
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.warrantyTable}',
          'arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.warrantyTable}/index/index1'
        ],
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',

      warrantyTable: "${self:custom.warrantyTable}",

      baseUrl: {
        "Fn::Join": [
          "",
          ["https://", { Ref: "HttpApi" }, ".execute-api.${self:provider.region}.amazonaws.com",]
        ]
      }
    },
  },
  // import the function via paths
  functions,
  resources: {
    Resources: {
      ...dynamoResources
    }
  },
  package: { individually: true },
  custom: {
    warrantyTable: '${sls:stage}-warranty-table',

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
