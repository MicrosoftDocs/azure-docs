---
title: Bicep functions - deployment
description: Describes the functions to use in a Bicep file to retrieve deployment information.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 05/16/2025
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

This function returns the object that is passed during deployment. The properties in the returned object differ based on whether you are:

* deploying a local Bicep file.
* deploying to a resource group or deploying to one of the other scopes ([Azure subscription](deploy-to-subscription.md), [management group](deploy-to-management-group.md), or [tenant](deploy-to-tenant.md)).

When deploying a local Bicep file to a resource group, the function returns the following format:

```json
{
  "name": "",
  "properties": {
    "template": {
      "$schema": "",
      "contentVersion": "",
      "parameters": {},
      "variables": {},
      "resources": [],
      "outputs": {}
    },
    "templateHash": "",
    "parameters": {},
    "mode": "",
    "provisioningState": ""
  }
}
```

When you deploy to an Azure subscription, management group, or tenant, the return object includes a `location` property. The `location` property isn't included when deploying a local Bicep file. The format is:

```json
{
  "name": "",
  "location": "",
  "properties": {
    "template": {
      "$schema": "",
      "contentVersion": "",
      "resources": [],
      "outputs": {}
    },
    "templateHash": "",
    "parameters": {},
    "mode": "",
    "provisioningState": ""
  }
}
```

### Example

The following example returns the deployment object:

```bicep
output deploymentOutput object = deployment()
```

The preceding example returns the following object:

```json
{
  "name": "deployment",
  "properties": {
    "template": {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": [],
      "outputs": {
        "deploymentOutput": {
          "type": "Object",
          "value": "[deployment()]"
        }
      }
    },
    "templateHash": "13135986259522608210",
    "parameters": {},
    "mode": "Incremental",
    "provisioningState": "Accepted"
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
