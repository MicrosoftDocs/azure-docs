---
title: Manage secrets by using Bicep
description: Describes how to manage secrets by using Bicep and Azure Key Vault.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 07/20/2022
---
# Manage secrets by using Bicep

Deployments often require secrets to be stored and propagated securely throughout your Azure environment. Bicep and Azure provide many features to assist you with managing secrets in your deployments.

## Avoid secrets where you can

In many situations, it's possible to avoid using secrets at all. [Many Azure resources support managed identities](../../active-directory/managed-identities-azure-resources/overview.md), which enable them to authenticate and be authorized to access other resources within Azure, without you needing to handle or manage any credentials. Additionally, some Azure services can generate HTTPS certificates for you automatically, avoiding you handling certificates and private keys. Use managed identities and service-managed certificates wherever possible.

## Use secure parameters

When you need to provide secrets to your Bicep deployments as parameters, [use the `@secure()` decorator](parameters.md#secure-parameters). When you mark a parameter as secure, Azure Resource Manager avoids logging the value or displaying it in the Azure portal, Azure CLI, or Azure PowerShell.

## Avoid outputs for secrets

Don't use Bicep outputs for secure data. Outputs are logged to the deployment history, and anyone with access to the deployment can view the values of a deployment's outputs.

If you need to generate a secret within a Bicep deployment and make it available to the caller or to other resources, consider using one of the following approaches.

## Look up secrets dynamically

Sometimes, you need to access a secret from one resource to configure another resource.

For example, you might have created a storage account in another deployment, and need to access its primary key to configure an Azure Functions app. You can use the `existing` keyword to obtain a strongly typed reference to the pre-created storage account, and then use the storage account's `listKeys()` method to create a connection string with the primary key:

> The following example is part of a larger example. For a Bicep file that you can deploy, see the [complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-secrets/function-app.bicep).

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-secrets/function-app.bicep" range="8-46" highlight="1-3, 5, 22, 34" :::

By using this approach, you avoid passing secrets into or out of your Bicep file.

You can also use this approach to store secrets in a key vault.

## Use Key Vault

[Azure Key Vault](../../key-vault/general/overview.md) is designed to store and manage secure data. Use a key vault to manage your secrets, certificates, keys, and other data that needs to be protected and shared.

You can create and manage vaults and secrets by using Bicep. Define your vaults by creating a resource with the type [`Microsoft.KeyVault/vaults`](/azure/templates/microsoft.keyvault/vaults?tabs=bicep).

When you create a vault, you need to determine who and what can access its data. If you plan to read the vault's secrets from within a Bicep file, set the `enabledForTemplateDeployment` property to `true`.

### Add secrets to a key vault

Secrets are a [child resource](child-resource-name-type.md) and can be created by using the type [`Microsoft.KeyVault/vaults/secrets`](/azure/templates/microsoft.keyvault/vaults/secrets?tabs=bicep). The following example demonstrates how to create a vault and a secret:

> The following example is part of a larger example. For a Bicep file that you can deploy, see the [complete file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/scenarios-secrets/key-vault-secret.bicep).

::: code language="bicep" source="~/azure-docs-bicep-samples/samples/scenarios-secrets/key-vault-secret.bicep" range="4-25" :::

> [!TIP]
> When you use automated deployment pipelines, it can sometimes be challenging to determine how to bootstrap key vault secrets for your deployments. For example, if you've been provided with an API key to use when communicating with an external API, then the secret needs to be added to a vault before it can be used in your deployments.
> 
> When you work with secrets that come from a third party, you may need to manually add them to your vault, and then you can reference the secret for all subsequent uses.

### Use a key vault with modules

When you use Bicep modules, you can provide secure parameters by using [the `getSecret` function](bicep-functions-resource.md#getsecret).

You can also reference a key vault defined in another resource group by using the `existing` and `scope` keywords together. In the following example, the Bicep file is deployed to a resource group named *Networking*. The value for the module's parameter *mySecret* is defined in a key vault named *contosonetworkingsecrets* located in the *Secrets* resource group:

```bicep
resource networkingSecretsKeyVault 'Microsoft.KeyVault/vaults@2019-09-01' existing = {
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

Reference the KeyVault by providing the subscription ID, resource group name, and key vault name. You can get the value of the secret by providing the secret name. You can optionally provide the secret version. If you don't provide the secret version, the latest version is used.

```bicep
using './main.bicep'

param secureUserName = az.getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>', '<secretVersion>')
param securePassword = az.getSecret('<subscriptionId>', '<resourceGroupName>', '<keyVaultName>', '<secretName>')
```

## Work with secrets in pipelines

When you deploy your Azure resources by using a pipeline, you need to take care to handle your secrets appropriately.

- Avoid storing secrets in your code repository. For example, don't add secrets to parameter files, or to your pipeline definition YAML files.
- In GitHub Actions, use [encrypted secrets](https://docs.github.com/actions/security-guides/encrypted-secrets) to store secure data. Use [secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning) to detect any accidental commits of secrets.
- In Azure Pipelines, use [secret variables](/azure/devops/pipelines/process/variables#secret-variables) to store secure data.

## Related resources

- Resource documentation
  - [`Microsoft.KeyVault/vaults`](/azure/templates/microsoft.keyvault/vaults?tabs=bicep)
  - [`Microsoft.KeyVault/vaults/secrets`](/azure/templates/microsoft.keyvault/vaults/secrets?tabs=bicep)
- Azure features
  - [Managed identities](../../active-directory/managed-identities-azure-resources/overview.md)
  - [Azure Key Vault](../../key-vault/general/overview.md)
- Bicep features
  - [Secure parameters](parameters.md#secure-parameters)
  - [Referencing existing resources](existing-resource.md)
  - [`getSecret` function](bicep-functions-resource.md#getsecret)
- Quickstart templates
  - [Create a user-assigned managed identity and role assignments](https://github.com/Azure/azure-quickstart-templates/tree/master/modules/Microsoft.ManagedIdentity/user-assigned-identity-role-assignment/1.0)
  - [Create an Azure Key Vault and a secret](https://azure.microsoft.com/resources/templates/key-vault-create/)
  - [Create a Key Vault and a list of secrets](https://azure.microsoft.com/resources/templates/key-vault-secret-create/)
  - [Onboard a custom domain and managed TLS certificate with Front Door](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-custom-domain)
- Azure Pipelines
  - [Secret variables](/azure/devops/pipelines/process/variables#secret-variables)
- GitHub Actions
  - [Encrypted secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)
  - [Secret scanning](https://docs.github.com/code-security/secret-scanning/about-secret-scanning)
