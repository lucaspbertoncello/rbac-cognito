import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import z from "zod";
import { schemaValidator } from "../../utils/schemaValidator";
import { AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

const schema = z.object({
  userEmail: z.email(),
});

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new AdminAddUserToGroupCommand({
    UserPoolId: env.COGNITO_POOL_ID,
    GroupName: event.pathParameters?.roleName,
    Username: data.userEmail,
  });

  await cognitoClient.send(command);

  return response({
    statusCode: 201,
  });
}
