import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const userId = event.requestContext.authorizer.jwt.claims.sub as string;

  const command = new AdminGetUserCommand({
    Username: userId,
    UserPoolId: env.COGNITO_POOL_ID,
  });

  const { UserAttributes } = await cognitoClient.send(command);

  return response({
    statusCode: 201,
    body: { UserAttributes },
  });
}
