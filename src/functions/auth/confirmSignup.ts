import { APIGatewayProxyEventV2 } from "aws-lambda";
import { response } from "../../utils/response";
import { z } from "zod";
import { schemaValidator } from "../../utils/schemaValidator";
import { ConfirmSignUpCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../lib/cognitoClient";
import { env } from "../../config/env";

const schema = z.object({
  email: z.email(),
  code: z.string(),
});

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new ConfirmSignUpCommand({
    ClientId: env.COGNITO_CLIENT_ID,
    ConfirmationCode: data.code,
    Username: data.email,
  });

  await cognitoClient.send(command);

  return response({ statusCode: 201 });
}
