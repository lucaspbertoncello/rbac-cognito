import { APIGatewayProxyEventV2 } from "aws-lambda";
import { response } from "../../utils/response";

export async function handler(event: APIGatewayProxyEventV2) {
  return response({
    statusCode: 201,
    body: { lesson: "any lesson" },
  });
}
