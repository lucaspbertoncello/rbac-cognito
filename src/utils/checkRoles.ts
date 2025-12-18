import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyEventV2WithRequestContext,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { formatCognitoRoles } from "./formatCognitoRoles";
import { response } from "./response";

interface CheckRolesProps {
  role: string;
  callbackFn(event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyResultV2>;
}

export function checkRoles(params: CheckRolesProps) {
  return async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    const { role, callbackFn } = params;
    const userRoles = formatCognitoRoles(
      event.requestContext.authorizer.jwt.claims["cognito:groups"] as string
    );

    const hasRequiredRoles = userRoles.includes(role);

    if (!hasRequiredRoles) {
      return response({
        statusCode: 403,
        body: { message: "You dont have permission to access this feature" },
      });
    }

    return callbackFn(event);
  };
}
