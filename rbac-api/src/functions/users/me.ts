import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { cognitoClient } from "../../lib/cognitoClient";
import { response } from "../../utils/response";
import { formatCognitoRoles } from "../../utils/formatCognitoRoles";

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const command = new GetUserCommand({
    AccessToken: event.headers.authorization?.replace("Bearer ", ""),
  });

  const { UserAttributes } = await cognitoClient.send(command);

  const userData = UserAttributes?.reduce((acc, { Name, Value }) => {
    acc[Name as string] = Value as string;

    return acc;
  }, {} as Record<string, string>);

  const roles = formatCognitoRoles(
    event.requestContext.authorizer.jwt.claims["cognito:groups"] as string
  );

  return response({ statusCode: 200, body: { ...userData, roles } });
}
