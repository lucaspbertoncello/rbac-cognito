import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import z from "zod";

type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;

export function schemaValidator<TOutput>(schema: z.ZodType<TOutput>, event: Event) {
  return schema.safeParse(JSON.parse(event.body ?? ""));
}
