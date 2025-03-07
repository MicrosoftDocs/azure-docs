---
title: Use Bicep to manage secrets 
description: Learn how to use Bicep and Azure Key Vault to manage secrets.
ms.topic: conceptual
ms.date: 01/10/2025
ms.custom: devx-track-bicep
author: johndowns
ms.author: jodowns
---

# Use Bicep to manage secrets 

Deployments often require secrets to be stored and propagated securely throughout your Azure environment. Bicep and Azure provide many features to assist you with managing secrets in your deployments.

## Avoid secrets where you can

It is possible to avoid using secrets altogether in many situations. [Many Azure resources enable managed identities](../../active-directory/managed-identities-azure-resources/overview.md) to authenticate and be authorized to access other resources within Azure and without you needing to handle or manage any credentials. Additionally, some Azure services can generate HTTPS certificates for you automatically, sparing you from handling certificates and private keys. Use managed identities and service-managed certificates wherever possible.

## Use secure parameters

When you need to provide secrets to your Bicep deployments as parameters, [use the `@secure()` decorator](parameters.md#secure-parameters). When you mark a parameter as secure, Azure Resource Manager avoids logging the value or displaying it in the Azure portal, the Azure CLI, or Azure PowerShell.

## Avoid outputs for secrets

Don't use Bicep outputs for secure data. Outputs are logged to the deployment history, and anyone with access to the deployment can view the values of a deployment's outputs.

If you need to generate a secret within a Bicep deployment and make it available to the caller or to other resources, consider one of the following approaches.

## Look up secrets dynamically

Sometimes, you need to access a secret from one resource to configure another one. For example, you might have created a storage account in another deployment and need to access its primary key to configure an Azure Functions app. You can use the `existing` keyword to obtain a strongly typed reference to the pre-created storage account, and then use the storage account's `listKeys()` method to create a connection string with the primary key.

> The following example is part of a larger example. For a Bicep file that you can deploy, see the [complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-secrets/function-app.bicep).

```bicep
param location string = resourceGroup().location
param storageAccountName string
param functionAppName string = 'fn-${uniqueString(resourceGroup().id)}'

var appServicePlanName = 'MyPlan'
var applicationInsightsName = 'MyApplicationInsights'

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' existing = {
  name: storageAccountName
}

var storageAccountConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  properties: {
    httpsOnly: true
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageAccountConnectionString
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: storageAccountConnectionString
        }
      ]
    }
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'Y1' 
    tier: 'Dynamic'
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  kind: 'web'
  properties: { 
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}
```

Taking this approach can help you to avoid passing secrets into or out of your Bicep file and also to store secrets in a key vault.

## Use Key Vault

[Azure Key Vault](/azure/key-vault/general/overview) is designed to store and manage secure data. Use a key vault to manage your secrets, certificates, keys, and other data that needs to be protected and shared.

You can use Bicep to create and manage vaults and secrets. Define your vaults by creating a resource with the type [`Microsoft.KeyVault/vaults`](/azure/templates/microsoft.keyvault/vaults?tabs=bicep).

When you create a vault, you need to determine who and what can access its data. If you plan to read the vault's secrets from within a Bicep file, set the `enabledForTemplateDeployment` property to `true`.

### Add secrets to a key vault

Secrets are a [child resource](child-resource-name-type.md) and can be created by using the type [`Microsoft.KeyVault/vaults/secrets`](/azure/templates/microsoft.keyvault/vaults/secrets?tabs=bicep). The following example demonstrates how to create a vault and a secret.

> The following example is part of a larger example. For a Bicep file that you can deploy, see the [complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-secrets/key-vault-secret.bicep).

```bicep
param location string = resourceGroup().location
param keyVaultName string = 'mykv${uniqueString(resourceGroup().id)}'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
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

resource keyVaultSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'MySecretName'
  properties: {
    value: 'MyVerySecretValue'
  }
}
```

> [!TIP]
> When you use automated deployment pipelines, it can sometimes be challenging to determine how to bootstrap key vault secrets for your deployments. For example, if you've been provided with an API key to use when communicating with an external API, then the secret needs to be added to a vault before it can be used in your deployments.
>
> When you work with secrets that come from a third party, you might need to manually add them to your vault before you can reference them for all subsequent uses.

### Use a key vault with modules

When you use Bicep modules, you can provide secure parameters by using [the `getSecret` function](bicep-functions-resource.md#getsecret).

You can also reference a key vault defined in another resource group by using the `existing` and `scope` keywords together. In the following example, the Bicep file is deployed to a resource group named _Networking_. The value for the module's parameter _mySecret_ is defined in a key vault named _contosonetworkingsecrets_, which is located in the _Secrets_ resource group:

```bicep
resource networkingSecretsKeyVault 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  scope: resourceGroup('Secrets')
  name: 'contosonetworkingsecrets'
}

module exampleModule 'module.bicep' = {
  name: 'exampleModule'
  params: {
    mySecret: networkingSecretsKeyVault.getSecret('mySecret')
  }
}
```

### Use a key vault in a .bicepparam file

When you use `.bicepparam` file format, you can provide secure values to parameters by using [the `getSecret` function](bicep-functions-parameters-file.md#getsecret).

Reference the key vault by providing the subscription ID, resource group name, and key vault name. You can get the value of the secret by providing the secret name. You can optionally provide the secret version; the latest version is used if you don't.

```bicep
using './main.bicep'

param secureUserName = az.getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>', '<secretVersion>')
param securePassword = az.getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>')
```

## Work with secrets in pipelines

The following best practices can help you to handle your secrets with caution when you use a pipeline to deploy your Azure resources:

- Avoid storing secrets in your code repository. For example, don't add secrets to parameters files or to pipeline definition YAML files.
- In GitHub Actions, use [encrypted secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions) to store secure data. Use [secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning) to detect any accidental commits of secrets.
- In Azure Pipelines, use [secret variables](/azure/devops/pipelines/process/variables#secret-variables) to store secure data.

## Related resources

- Resource documentation:
  - [`Microsoft.KeyVault/vaults`](/azure/templates/microsoft.keyvault/vaults?tabs=bicep)
  - [`Microsoft.KeyVault/vaults/secrets`](/azure/templates/microsoft.keyvault/vaults/secrets?tabs=bicep)
- Azure features:
  - [Managed identities](../../active-directory/managed-identities-azure-resources/overview.md)
  - [Azure Key Vault](/azure/key-vault/general/overview)
- Bicep features:
  - [Secure parameters](parameters.md#secure-parameters)
  - [Reference existing resources in Bicep](existing-resource.md)
  - [The `getSecret` function](bicep-functions-resource.md#getsecret)
- Quickstart templates:
  - [Create a user-assigned managed identity and role assignments](https://github.com/Azure/azure-quickstart-templates/tree/master/modules/Microsoft.ManagedIdentity/user-assigned-identity-role-assignment/1.0)
  - [Create an Azure Key Vault and a secret](https://azure.microsoft.com/resources/templates/key-vault-create/)
  - [Create a Key Vault and a list of secrets](https://azure.microsoft.com/resources/templates/key-vault-secret-create/)
  - [Add custom domain and managed certificate with Front Door](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-custom-domain)
- Azure Pipelines:
  - [Secret variables](/azure/devops/pipelines/process/variables#secret-variables)
- GitHub Actions:
  - [Using secrets in GitHub actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
  - [About secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning)
