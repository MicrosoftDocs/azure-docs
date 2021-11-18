param roleDefinitionResourceId string
param principalId string

targetScope = 'subscription'

resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(subscription().id, principalId, roleDefinitionResourceId)
  properties: {
    roleDefinitionId: roleDefinitionResourceId
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
