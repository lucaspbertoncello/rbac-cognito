export function formatCognitoRoles(roles: string): Array<string> {
  const formattedRoles = roles.slice(1, -1).split(" ");
  return formattedRoles ?? [];
}
