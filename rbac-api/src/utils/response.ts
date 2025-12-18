import { APIGatewayProxyResultV2 } from "aws-lambda";

interface ResponseParams {
  statusCode: number;
  body?: Record<string, any>;
}

export function response(params: ResponseParams): APIGatewayProxyResultV2 {
  const { statusCode, body } = params;

  return {
    statusCode,
    body: body && JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
}
