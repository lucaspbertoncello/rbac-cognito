import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { DeleteGroupCommand, ListGroupsCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const command = new DeleteGroupCommand({
    UserPoolId: env.COGNITO_POOL_ID,
    GroupName: event.pathParameters?.roleName,
  });

  await cognitoClient.send(command);

  return response({ statusCode: 201 });
}
