import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";
import { response } from "../../utils/response";
import { formatCognitoRoles } from "../../utils/formatCognitoRoles";
import { checkRoles } from "../../utils/checkRoles";

export const handler = checkRoles({
  role: "admin",
  callbackFn: async (event: APIGatewayProxyEventV2WithJWTAuthorizer) => {
    return response({ statusCode: 201, body: { message: "passou" } });
  },
});
