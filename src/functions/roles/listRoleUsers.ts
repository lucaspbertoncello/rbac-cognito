import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { ListUsersInGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const command = new ListUsersInGroupCommand({
    UserPoolId: env.COGNITO_POOL_ID,
    GroupName: event.pathParameters?.roleName,
  });

  const { Users } = await cognitoClient.send(command);

  return response({ statusCode: 200, body: { Users } });
}
