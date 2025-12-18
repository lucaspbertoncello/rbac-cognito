import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { AdminRemoveUserFromGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const roleName = event.pathParameters?.roleName;
  const userEmail = event.pathParameters?.userEmail;

  const command = new AdminRemoveUserFromGroupCommand({
    UserPoolId: env.COGNITO_POOL_ID,
    GroupName: roleName,
    Username: userEmail,
  });

  await cognitoClient.send(command);

  return response({ statusCode: 201 });
}
