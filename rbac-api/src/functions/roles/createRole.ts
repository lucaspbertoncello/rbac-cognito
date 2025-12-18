import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import z from "zod";
import { schemaValidator } from "../../utils/schemaValidator";
import { CreateGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "../../config/env";
import { cognitoClient } from "../../lib/cognitoClient";

const schema = z.object({
  roleName: z.string().min(1),
  description: z.string().optional(),
});

export async function handler(event: APIGatewayProxyEventV2WithJWTAuthorizer) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new CreateGroupCommand({
    GroupName: data.roleName,
    Description: data.description,
    UserPoolId: env.COGNITO_POOL_ID,
  });

  await cognitoClient.send(command);

  return response({
    statusCode: 201,
  });
}
