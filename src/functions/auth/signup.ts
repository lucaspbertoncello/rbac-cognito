import { APIGatewayProxyEventV2 } from "aws-lambda";
import { response } from "../../utils/response";
import { z } from "zod";
import { schemaValidator } from "../../utils/schemaValidator";
import { SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../../lib/cognitoClient";
import { env } from "../../config/env";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export async function handler(event: APIGatewayProxyEventV2) {
  const { success, data, error } = schemaValidator(schema, event);

  if (!success) {
    return response({ statusCode: 400, body: { error } });
  }

  const command = new SignUpCommand({
    ClientId: env.COGNITO_CLIENT_ID,
    Username: data.email,
    Password: data.password,
    UserAttributes: [
      {
        Name: "email",
        Value: data.email,
      },
      {
        Name: "given_name",
        Value: data.name,
      },
    ],
  });

  await cognitoClient.send(command);

  return response({ statusCode: 201 });
}
