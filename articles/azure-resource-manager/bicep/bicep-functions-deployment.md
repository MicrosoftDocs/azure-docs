---
title: Bicep functions - deployment
description: Describes the functions to use in a Bicep file to retrieve deployment information.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 01/06/2026
---

# Deployment functions for Bicep

This article describes the Bicep functions for getting values related to the current deployment.

## deployer

`deployer()`

Returns information about the principal (identity) that initiated the current deployment. The principal can be a user, service principal, or managed identity, depending on how the deployment was started.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Return value

This function returns an object with details about the deployment principal, including:

- `objectId`: The Microsoft Entra ID object ID of the principal.
- `tenantId`: The Microsoft Entra ID tenant ID.
- `userPrincipalName`: The user principal name (UPN) if available. For service principals or managed identities, this property may be empty.

> [!NOTE]
> The returned values depend on the deployment context. For example, `userPrincipalName` may be empty for service principals or managed identities.

```json
{
  "objectId": "<principal-object-id>",
  "tenantId": "<tenant-id>",
  "userPrincipalName": "<user@domain.com or empty>"
}
```

### Example

The following example Bicep file returns the deployer object.

```bicep
output deployer object = deployer()
```

Sample output (values differ based on your deployment):

```json
{
  "objectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
  "tenantId":"aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
  "userPrincipalName":"john.doe@contoso.com"
}
```

For more information about Azure identities, see [What is an Azure Active Directory identity?](/azure/active-directory/fundamentals/active-directory-whatis).

## deployment

`deployment()`

Returns information about the current deployment operation. 

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Return value

Bicep files are sometimes compiled to [languageVersion 2.0](../templates/syntax.md#languageversion-20) ARM templates. Therefore, Bicep type checking considers the `deployment()` function to return only the subset of properties as would be returned in a languageVersion 2.0 ARM template. For more information, see [deployment() function for languageVersion 2.0](../templates/template-functions-deployment.md#deployment ).

### Example

The following example returns the deployment object:

```bicep
output deploymentOutput object = deployment()
```

The preceding example returns the following object:

```json
{
  "name": "deploymentOutput",
  "location": "",
  "properties": {
    "template": {
      "contentVersion": "1.0.0.0",
      "metadata": {
        "_EXPERIMENTAL_WARNING": "This template uses ARM features that are experimental. Experimental features should be enabled for testing purposes only, as there are no guarantees about the quality or stability of these features. Do not enable these settings for any production usage, or your production environment may be subject to breaking.",
        "_EXPERIMENTAL_FEATURES_ENABLED": [
          "Asserts"
        ],
        "_generator": {
          "name": "bicep",
          "version": "0.39.26.7824",
          "templateHash": "10348958332696598785"
        }
      }
    }
  }
}
```

## environment

`environment()`

Returns information about the Azure environment used for deployment. The `environment()` function isn't aware of resource configurations. It can only return a single default DNS suffix for each resource type.

Namespace: [az](bicep-functions.md#namespaces-for-functions).

### Remarks

To see a list of registered environments for your account, use [az cloud list](/cli/azure/cloud#az-cloud-list) or [Get-AzEnvironment](/powershell/module/az.accounts/get-azenvironment).

### Return value

This function returns properties for the current Azure environment. The following example shows the properties for global Azure. Sovereign clouds may return slightly different properties.

```json
{
  "name": "",
  "gallery": "",
  "graph": "",
  "portal": "",
  "graphAudience": "",
  "activeDirectoryDataLake": "",
  "batch": "",
  "media": "",
  "sqlManagement": "",
  "vmImageAliasDoc": "",
  "resourceManager": "",
  "authentication": {
    "loginEndpoint": "",
    "audiences": [
      "",
      ""
    ],
    "tenant": "",
    "identityProvider": ""
  },
  "suffixes": {
    "acrLoginServer": "",
    "azureDatalakeAnalyticsCatalogAndJob": "",
    "azureDatalakeStoreFileSystem": "",
    "azureFrontDoorEndpointSuffix": "",
    "keyvaultDns": "",
    "sqlServerHostname": "",
    "storage": ""
  }
}
```

### Example

The following example Bicep file returns the environment object.

```bicep
output environmentOutput object = environment()
```

The preceding example returns the following object when deployed to global Azure:

```json
{
  "name": "AzureCloud",
  "gallery": "https://gallery.azure.com/",
  "graph": "https://graph.windows.net/",
  "portal": "https://portal.azure.com",
  "graphAudience": "https://graph.windows.net/",
  "activeDirectoryDataLake": "https://datalake.azure.net/",
  "batch": "https://batch.core.windows.net/",
  "media": "https://rest.media.azure.net",
  "sqlManagement": "https://management.core.windows.net:8443/",
  "vmImageAliasDoc": "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/master/arm-compute/quickstart-templates/aliases.json",
  "resourceManager": "https://management.azure.com/",
  "authentication": {
    "loginEndpoint": "https://login.microsoftonline.com/",
    "audiences": [ "https://management.core.windows.net/", "https://management.azure.com/" ],
    "tenant": "common",
    "identityProvider": "AAD"
  },
  "suffixes": {
    "acrLoginServer": ".azurecr.io",
    "azureDatalakeAnalyticsCatalogAndJob": "azuredatalakeanalytics.net",
    "azureDatalakeStoreFileSystem": "azuredatalakestore.net",
    "azureFrontDoorEndpointSuffix": "azurefd.net",
    "keyvaultDns": ".vault.azure.net",
    "sqlServerHostname": ".database.windows.net",
    "storage": "core.windows.net"
  }
}
```

## Next steps

* To get values from resources, resource groups, or subscriptions, see [Resource functions](./bicep-functions-resource.md).
