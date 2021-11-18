param location string = resourceGroup().location
param keyVaultName string = 'mykv${uniqueString(resourceGroup().id)}'

resource keyVault 'Microsoft.KeyVault/vaults@2019-09-01' = {
  name: keyVaultName
  location: location
  properties: {
    enabledForTemplateDeployment: true
    tenantId: tenant().tenantId
    accessPolicies: [
    ]
    sku: {
      name: 'standard'
      family: 'A'
    }
  }
}

resource keyVaultSecret 'Microsoft.KeyVault/vaults/secrets@2019-09-01' = {
  parent: keyVault
  name: 'MySecretName'
  properties: {
    value: 'MyVerySecretValue'
  }
}
