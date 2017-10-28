---
title: Azure Resource Manager template functions - resources | Microsoft Docs
description: Describes the functions to use in an Azure Resource Manager template to retrieve values about resources.
services: azure-resource-manager
documentationcenter: na
author: tfitzmac
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/13/2017
ms.author: tomfitz

---
# Resource functions for Azure Resource Manager templates

Resource Manager provides the following functions for getting resource values:

* [listKeys and list{Value}](#listkeys)
* [providers](#providers)
* [reference](#reference)
* [resourceGroup](#resourcegroup)
* [resourceId](#resourceid)
* [subscription](#subscription)

To get values from parameters, variables, or the current deployment, see [Deployment value functions](resource-group-template-functions-deployment.md).

<a id="listkeys" />
<a id="list" />

## listKeys and list{Value}
`listKeys(resourceName or resourceIdentifier, apiVersion)`

`list{Value}(resourceName or resourceIdentifier, apiVersion)`

Returns the values for any resource type that supports the list operation. The most common usage is `listKeys`. 

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |string |Unique identifier for the resource. |
| apiVersion |Yes |string |API version of resource runtime state. Typically, in the format, **yyyy-mm-dd**. |

### Return value

The returned object from listKeys has the following format:

```json
{
  "keys": [
    {
      "keyName": "key1",
      "permissions": "Full",
      "value": "{value}"
    },
    {
      "keyName": "key2",
      "permissions": "Full",
      "value": "{value}"
    }
  ]
}
```

Other list functions have different return formats. To see the format of a function, include it in the outputs section as shown in the example template. 

### Remarks

Any operation that starts with **list** can be used as a function in your template. The available operations include not only listKeys, but also operations like `list`, `listAdminKeys`, and `listStatus`. To determine which resource types have a list operation, you have the following options:

* View the [REST API operations](/rest/api/) for a resource provider, and look for list operations. For example, storage accounts have the [listKeys operation](/rest/api/storagerp/storageaccounts#StorageAccounts_ListKeys).
* Use the [Get-​Azure​Rm​Provider​Operation](/powershell/module/azurerm.resources/get-azurermprovideroperation) PowerShell cmdlet. The following example gets all list operations for storage accounts:

  ```powershell
  Get-AzureRmProviderOperation -OperationSearchString "Microsoft.Storage/*" | where {$_.Operation -like "*list*"} | FT Operation
  ```
* Use the following Azure CLI command to filter only the list operations:

  ```azurecli
  az provider operation show --namespace Microsoft.Storage --query "resourceTypes[?name=='storageAccounts'].operations[].name | [?contains(@, 'list')]"
  ```

Specify the resource by using either the [resourceId function](#resourceid), or the format `{providerNamespace}/{resourceType}/{resourceName}`.


### Example

The following example shows how to return the primary and secondary keys from a storage account in the outputs section.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccountId": {
            "type": "string"
        }
    },
    "resources": [],
    "outputs": {
        "storageKeysOutput": {
            "value": "[listKeys(parameters('storageAccountId'), '2016-01-01')]",
            "type" : "object"
        }
    }
}
``` 

<a id="providers" />

## providers
`providers(providerNamespace, [resourceType])`

Returns information about a resource provider and its supported resource types. If you do not provide a resource type, the function returns all the supported types for the resource provider.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| providerNamespace |Yes |string |Namespace of the provider |
| resourceType |No |string |The type of resource within the specified namespace. |

### Return value

Each supported type is returned in the following format: 

```json
{
    "resourceType": "{name of resource type}",
    "locations": [ all supported locations ],
    "apiVersions": [ all supported API versions ]
}
```

Array ordering of the returned values is not guaranteed.

### Example

The following example shows how to use the provider function:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "providerOutput": {
            "value": "[providers('Microsoft.Web', 'sites')]",
            "type" : "object"
        }
    }
}
```

The preceding example returns an object in the following format:

```json
{
  "resourceType": "sites",
  "locations": [
    "South Central US",
    "North Europe",
    "West Europe",
    "Southeast Asia",
    ...
  ],
  "apiVersions": [
    "2016-08-01",
    "2016-03-01",
    "2015-08-01-preview",
    "2015-08-01",
    ...
  ]
}
```

<a id="reference" />

## reference
`reference(resourceName or resourceIdentifier, [apiVersion])`

Returns an object representing a resource's runtime state.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| resourceName or resourceIdentifier |Yes |string |Name or unique identifier of a resource. |
| apiVersion |No |string |API version of the specified resource. Include this parameter when the resource is not provisioned within same template. Typically, in the format, **yyyy-mm-dd**. |

### Return value

Every resource type returns different properties for the reference function. The function does not return a single, predefined format. To see the properties for a resource type, return the object in the outputs section as shown in the example.

### Remarks

The reference function derives its value from a runtime state, and therefore cannot be used in the variables section. It can be used in outputs section of a template. 

By using the reference function, you implicitly declare that one resource depends on another resource if the referenced resource is provisioned within same template. You do not need to also use the dependsOn property. The function is not evaluated until the referenced resource has completed deployment.

To see the property names and values for a resource type, create a template that returns the object in the outputs section. If you have an existing resource of that type, your template returns the object without deploying any new resources. 

Typically, you use the **reference** function to return a particular value from an object, such as the blob endpoint URI or fully qualified domain name.

```json
"outputs": {
    "BlobUri": {
        "value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01').primaryEndpoints.blob]",
        "type" : "string"
    },
    "FQDN": {
        "value": "[reference(concat('Microsoft.Network/publicIPAddresses/', parameters('ipAddressName')), '2016-03-30').dnsSettings.fqdn]",
        "type" : "string"
    }
}
```

### Example

To deploy and reference the resource in the same template, use:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "storageAccountName": { 
          "type": "string"
      }
  },
  "resources": [
    {
      "name": "[parameters('storageAccountName')]",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2016-12-01",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "location": "[resourceGroup().location]",
      "tags": {},
      "properties": {
      }
    }
  ],
  "outputs": {
      "referenceOutput": {
          "type": "object",
          "value": "[reference(parameters('storageAccountName'))]"
      }
    }
}
``` 

The preceding example returns an object in the following format:

```json
{
   "creationTime": "2017-06-13T21:24:46.618364Z",
   "primaryEndpoints": {
     "blob": "https://examplestorage.blob.core.windows.net/",
     "file": "https://examplestorage.file.core.windows.net/",
     "queue": "https://examplestorage.queue.core.windows.net/",
     "table": "https://examplestorage.table.core.windows.net/"
   },
   "primaryLocation": "southcentralus",
   "provisioningState": "Succeeded",
   "statusOfPrimary": "available",
   "supportsHttpsTrafficOnly": false
}
```

The following example references a storage account that is not deployed in this template, but exists within the same resource group.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccountName": {
            "type": "string"
        }
    },
    "resources": [],
    "outputs": {
        "ExistingStorage": {
            "value": "[reference(concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName')), '2016-01-01')]",
            "type" : "object"
        }
    }
}
```

<a id="resourcegroup" />

## resourceGroup
`resourceGroup()`

Returns an object that represents the current resource group. 

### Return value

The returned object is in the following format:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}",
  "name": "{resourceGroupName}",
  "location": "{resourceGroupLocation}",
  "tags": {
  },
  "properties": {
    "provisioningState": "{status}"
  }
}
```

### Remarks

A common use of the resourceGroup function is to create resources in the same location as the resource group. The following example uses the resource group location to assign the location for a web site.

```json
"resources": [
   {
      "apiVersion": "2016-08-01",
      "type": "Microsoft.Web/sites",
      "name": "[parameters('siteName')]",
      "location": "[resourceGroup().location]",
      ...
   }
]
```

### Example

The following template returns the properties of the resource group.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "subscriptionOutput": {
            "value": "[resourceGroup()]",
            "type" : "object"
        }
    }
}
```

The preceding example returns an object in the following format:

```json
{
  "id": "/subscriptions/{subscription-id}/resourceGroups/examplegroup",
  "name": "examplegroup",
  "location": "southcentralus",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

<a id="resourceid" />

## resourceId
`resourceId([subscriptionId], [resourceGroupName], resourceType, resourceName1, [resourceName2]...)`

Returns the unique identifier of a resource. You use this function when the resource name is ambiguous or not provisioned within the same template. 

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| subscriptionId |No |string (In GUID format) |Default value is the current subscription. Specify this value when you need to retrieve a resource in another subscription. |
| resourceGroupName |No |string |Default value is current resource group. Specify this value when you need to retrieve a resource in another resource group. |
| resourceType |Yes |string |Type of resource including resource provider namespace. |
| resourceName1 |Yes |string |Name of resource. |
| resourceName2 |No |string |Next resource name segment if resource is nested. |

### Return value

The identifier is returned in the following format:

```json
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}
```

### Remarks

The parameter values you specify depend on whether the resource is in the same subscription and resource group as the current deployment.

To get the resource ID for a storage account in the same subscription and resource group, use:

```json
"[resourceId('Microsoft.Storage/storageAccounts','examplestorage')]"
```

To get the resource ID for a storage account in the same subscription but a different resource group, use:

```json
"[resourceId('otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]"
```

To get the resource ID for a storage account in a different subscription and resource group, use:

```json
"[resourceId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]"
```

To get the resource ID for a database in a different resource group, use:

```json
"[resourceId('otherResourceGroup', 'Microsoft.SQL/servers/databases', parameters('serverName'), parameters('databaseName'))]"
```

Often, you need to use this function when using a storage account or virtual network in an alternate resource group. The storage account or virtual network may be used across multiple resource groups; therefore, you do not want to delete them when deleting a single resource group. The following example shows how a resource from an external resource group can easily be used:

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "virtualNetworkName": {
          "type": "string"
      },
      "virtualNetworkResourceGroup": {
          "type": "string"
      },
      "subnet1Name": {
          "type": "string"
      },
      "nicName": {
          "type": "string"
      }
  },
  "variables": {
      "vnetID": "[resourceId(parameters('virtualNetworkResourceGroup'), 'Microsoft.Network/virtualNetworks', parameters('virtualNetworkName'))]",
      "subnet1Ref": "[concat(variables('vnetID'),'/subnets/', parameters('subnet1Name'))]"
  },
  "resources": [
  {
      "apiVersion": "2015-05-01-preview",
      "type": "Microsoft.Network/networkInterfaces",
      "name": "[parameters('nicName')]",
      "location": "[parameters('location')]",
      "properties": {
          "ipConfigurations": [{
              "name": "ipconfig1",
              "properties": {
                  "privateIPAllocationMethod": "Dynamic",
                  "subnet": {
                      "id": "[variables('subnet1Ref')]"
                  }
              }
          }]
       }
  }]
}
```

### Example

The following example returns the resource ID for a storage account in the resource group:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "sameRGOutput": {
            "value": "[resourceId('Microsoft.Storage/storageAccounts','examplestorage')]",
            "type" : "string"
        },
        "differentRGOutput": {
            "value": "[resourceId('otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]",
            "type" : "string"
        },
        "differentSubOutput": {
            "value": "[resourceId('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'otherResourceGroup', 'Microsoft.Storage/storageAccounts','examplestorage')]",
            "type" : "string"
        },
        "nestedResourceOutput": {
            "value": "[resourceId('Microsoft.SQL/servers/databases', 'serverName', 'databaseName')]",
            "type" : "string"
        }
    }
}
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| sameRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentRGOutput | String | /subscriptions/{current-sub-id}/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| differentSubOutput | String | /subscriptions/{different-sub-id}/resourceGroups/otherResourceGroup/providers/Microsoft.Storage/storageAccounts/examplestorage |
| nestedResourceOutput | String | /subscriptions/{current-sub-id}/resourceGroups/examplegroup/providers/Microsoft.SQL/servers/serverName/databases/databaseName |

<a id="subscription" />

## subscription
`subscription()`

Returns details about the subscription for the current deployment. 

### Return value

The function returns the following format:

```json
{
    "id": "/subscriptions/{subscription-id}",
    "subscriptionId": "{subscription-id}",
    "tenantId": "{tenant-id}",
    "displayName": "{name-of-subscription}"
}
```

### Example

The following example shows the subscription function called in the outputs section. 

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [],
    "outputs": {
        "subscriptionOutput": {
            "value": "[subscription()]",
            "type" : "object"
        }
    }
}
```

## Next Steps
* For a description of the sections in an Azure Resource Manager template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
* To merge multiple templates, see [Using linked templates with Azure Resource Manager](resource-group-linked-templates.md).
* To iterate a specified number of times when creating a type of resource, see [Create multiple instances of resources in Azure Resource Manager](resource-group-create-multiple.md).
* To see how to deploy the template you have created, see [Deploy an application with Azure Resource Manager template](resource-group-template-deploy.md).

