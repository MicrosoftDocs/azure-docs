---
title: Template functions - deployment
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to retrieve deployment information.
ms.topic: reference
ms.custom: devx-track-arm-template
ms.date: 01/06/2026
---

# Deployment functions for ARM templates

Azure Resource Manager provides the following functions for getting values related to the current deployment of your Azure Resource Manager template (ARM template):

* [`deployer`](#deployer)
* [`deployment`](#deployment)
* [`environment`](#environment)
* [`parameters`](#parameters)
* [`variables`](#variables)

To get values from resources, resource groups, or subscriptions, see [resource functions](template-functions-resource.md).

> [!TIP]
> [Bicep](../bicep/overview.md) is recommended since it offers the same capabilities as ARM templates, and the syntax is easier to use. To learn more, see [`deployment`](../bicep/bicep-functions-deployment.md) functions.

## deployer

`deployer()`

Returns the information about the current deployment principal.

In Bicep, use the [`deployer`](../bicep/bicep-functions-deployment.md#deployer) function.

### Return value

This function returns the information about the current deployment principal, including tenant ID, object ID, and user principal name:

```json
{
  "objectId": "",
  "tenantId": "",
  "userPrincipalName": ""
}
```

### Example

The following example returns the deployer object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "developerOutput": {
      "type": "object",
      "value": "[deployer()]"
    }
  }
}
```

The preceding example returns the following object:

```json
{
  "objectId":"aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb",
  "tenantId":"aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e",
  "userPrincipalName":"john.doe@contoso.com"
}
```

## deployment

`deployment()`

Returns information about the current deployment operation.

In Bicep, use the [`deployment`](../bicep/bicep-functions-deployment.md#deployment) function.

### Return value

This function returns the object that's  passed during deployment. The properties in the returned object differ based on if you're:

* Deploying a template or a template spec.
* Deploying a template that's  a local file or deploying a template that's  a remote file accessed through a URI.
* Deploying to a resource group or deploying to one of the other scopes ([Azure subscription](deploy-to-subscription.md), [management groups](deploy-to-management-group.md), or [tenants](deploy-to-tenant.md)).

When deploying a local template to a resource group, the function returns the following format:

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

If the template is remote, the `templateLink` property is included in the returned object. The `templateLink` property contains the URI of the template. The format is:

```json
{
  "name": "",
  "properties": {
    "templateLink": {
      "uri": ""
    },
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

For more information, see [Using variables to link templates](./linked-templates.md#use-variables-to-link-templates).

When deploying a template spec to a resource group, the function returns the following format:

```json
{
  "name": "",
  "properties": {
    "templateLink": {
      "id": ""
    },
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

When you deploy to an Azure subscription, management group, or tenant, the return object includes a `location` property. The location property is included when deploying either a local template or an external template. The format is:

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

When deploying a [languageVersion 2.0](./syntax.md#languageversion-20) template, the `deployment` function returns a limited subset of properties:

```json
{
  "name": "",
  "location": "",
  "properties": {
    "template": {
      "contentVersion": "",
      "metadata": {}
    },
    "templateLink": {
      "id": "",
      "uri": ""
    }
  }
}
```

The `location` property is included only for deployments at the [subscription](./deploy-to-subscription.md), [management group](./deploy-to-management-group.md), or [tenant](./deploy-to-tenant.md) scope. The `templateLink` property is included only when the user provides a linked template rather than an inline template.

### Remarks

You can use `deployment()` to link to another template based on the URI of the parent template:

```json
"variables": {
  "sharedTemplateUrl": "[uri(deployment().properties.templateLink.uri, 'shared-resources.json')]"
}
```

If you redeploy a template from the deployment history in the portal, the template is deployed as a local file. The `templateLink` property isn't returned in the deployment function. If your template relies on `templateLink` to construct a link to another template, don't use the portal to redeploy. Instead, use the commands you used to originally deploy the template.

### Example

The following example returns a deployment object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "deploymentOutput": {
      "type": "object",
      "value": "[deployment()]"
    }
  }
}
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

For a subscription deployment, the following example returns a deployment object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2018-05-01/subscriptionDeploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [],
  "outputs": {
    "exampleOutput": {
      "type": "object",
      "value": "[deployment()]"
    }
  }
}
```

## environment

`environment()`

Returns information about the Azure environment used for deployment. The `environment()` function isn't aware of resource configurations. It can only return a single default DNS suffix for each resource type.

In Bicep, use the [`environment`](../bicep/bicep-functions-deployment.md#environment) function.

### Remarks

To see a list of registered environments for your account, use [`az cloud list`](/cli/azure/cloud#az-cloud-list) or [`Get-AzEnvironment`](/powershell/module/az.accounts/get-azenvironment).

### Return value

This function returns properties for the current Azure environment. The following example shows the properties for global Azure; sovereign clouds might return slightly different properties:

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

The following example template returns the environment object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [],
  "outputs": {
    "environmentOutput": {
      "type": "object",
      "value": "[environment()]"
    }
  }
}
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
    "audiences": [
      "https://management.core.windows.net/",
      "https://management.azure.com/"
    ],
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

## parameters

`parameters(parameterName)`

Returns a parameter value. The specified parameter name must be defined in the **parameters** section of the template.

In Bicep, directly reference [parameters](../bicep/parameters.md) by using their symbolic names.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| parameterName |Yes |string |The name of the parameter to return. |

### Return value

The value of the specified parameter.

### Remarks

Typically, you use parameters to set resource values. The following example sets the name of web site to the parameter value passed in during deployment.

```json
"parameters": {
  "siteName": {
    "type": "string"
  }
}, "resources": [
  {
    "type": "Microsoft.Web/Sites",
    "apiVersion": "2025-03-01",
    "name": "[parameters('siteName')]",
    ...
  }
]
```

### Example

The following example shows a simplified use of the `parameters` function:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "stringParameter": {
      "type": "string",
      "defaultValue": "option 1"
    },
    "intParameter": {
      "type": "int",
      "defaultValue": 1
    },
    "objectParameter": {
      "type": "object",
      "defaultValue": {
        "one": "a",
        "two": "b"
      }
    },
    "arrayParameter": {
      "type": "array",
      "defaultValue": [ 1, 2, 3 ]
    },
    "crossParameter": {
      "type": "string",
      "defaultValue": "[parameters('stringParameter')]"
    }
  },
  "variables": {},
  "resources": [],
  "outputs": {
    "stringOutput": {
      "type": "string",
      "value": "[parameters('stringParameter')]"
    },
    "intOutput": {
      "type": "int",
      "value": "[parameters('intParameter')]"
    },
    "objectOutput": {
      "type": "object",
      "value": "[parameters('objectParameter')]"
    },
    "arrayOutput": {
      "type": "array",
      "value": "[parameters('arrayParameter')]"
    },
    "crossOutput": {
      "type": "string",
      "value": "[parameters('crossParameter')]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| stringOutput | String | option 1 |
| intOutput | Int | 1 |
| objectOutput | Object | {"one": "a", "two": "b"} |
| arrayOutput | Array | [1, 2, 3] |
| crossOutput | String | option 1 |

For more information about using parameters, see [parameters in ARM templates](./parameters.md).

## variables

`variables(variableName)`

Returns the value of a variable. The specified variable name must be defined in the **variables** section of the template.

In Bicep, directly reference [variables](../bicep/variables.md) by using their symbolic names.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| variableName |Yes |String |The name of the variable to return. |

### Return value

The value of the specified variable.

### Remarks

Typically, you use variables to simplify your template by constructing complex values only once. The following example constructs a unique name for a storage account:

```json
"variables": {
  "storageName": "[concat('storage', uniqueString(resourceGroup().id))]"
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[variables('storageName')]",
    ...
  },
  {
    "type": "Microsoft.Compute/virtualMachines",
    "dependsOn": [
      "[variables('storageName')]"
    ],
    ...
  }
],

```

### Example

The following example returns different variable values:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {
    "var1": "myVariable",
    "var2": [ 1, 2, 3, 4 ],
    "var3": "[ variables('var1') ]",
    "var4": {
      "property1": "value1",
      "property2": "value2"
    }
  },
  "resources": [],
  "outputs": {
    "exampleOutput1": {
      "type": "string",
      "value": "[variables('var1')]"
    },
    "exampleOutput2": {
      "type": "array",
      "value": "[variables('var2')]"
    },
    "exampleOutput3": {
      "type": "string",
      "value": "[variables('var3')]"
    },
    "exampleOutput4": {
      "type": "object",
      "value": "[variables('var4')]"
    }
  }
}
```

The output of default values from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| exampleOutput1 | String | myVariable |
| exampleOutput2 | Array | [1, 2, 3, 4] |
| exampleOutput3 | String | myVariable |
| exampleOutput4 |  Object | {"property1": "value1", "property2": "value2"} |

For more information about using variables, see [variables in ARM template](./variables.md).

## Next steps

To learn more about the sections in an ARM template, see [the structure and syntax of ARM templates](./syntax.md).
