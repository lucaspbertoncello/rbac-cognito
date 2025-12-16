import { APIGatewayProxyEventV2 } from "aws-lambda";
import { response } from "../../utils/response";
import { z } from "zod";
import { schemaValidator } from "../../utils/schemaValidator";
import { InitiateAuthCommand, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../lib/cognitoClient";
import { env } from "../../config/env";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new InitiateAuthCommand({
    ClientId: env.COGNITO_CLIENT_ID,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: data.email,
      PASSWORD: data.password,
    },
  });

  const { AuthenticationResult } = await cognitoClient.send(command);

  return response({
    statusCode: 200,
    body: {
      accessToken: AuthenticationResult?.AccessToken,
      refreshToken: AuthenticationResult?.RefreshToken,
    },
  });
}
