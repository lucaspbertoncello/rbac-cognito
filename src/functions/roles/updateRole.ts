import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { ListGroupsCommand, UpdateGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";
import z from "zod";
import { schemaValidator } from "../../utils/schemaValidator";

const schema = z.object({
  description: z.string(),
});

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new UpdateGroupCommand({
    UserPoolId: env.COGNITO_POOL_ID,
    GroupName: event.pathParameters?.roleName,
    Description: data.description,
  });

  await cognitoClient.send(command);

  return response({ statusCode: 200 });
}
