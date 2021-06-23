---
title: Declare resources in templates
description: Describes how to declare resources to deploy in an Azure Resource Manager template (ARM template).
ms.topic: conceptual
ms.date: 05/11/2021
---

# Resource declaration in ARM templates

To deploy a resource through an Azure Resource Manager template (ARM template), you add a resource declaration. Use the `resources` array in a JSON template.

## Set resource type and version

When adding a resource to your template, start by setting the resource type and API version. These values determine the other properties that are available for the resource.

The following example shows how to set the resource type and API version for a storage account. The example doesn't show the full resource declaration.

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    ...
  }
]
```

## Set resource name

Each resource has a name. When setting the resource name, pay attention to the [rules and restrictions for resource names](../management/resource-name-rules.md).

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  }
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "[parameters('storageAccountName')]",
    ...
  }
]
```

## Set location

Many resources require a location. You can determine if the resource needs a location either through intellisense or [template reference](/azure/templates/). The following example adds a location parameter that is used for the storage account.

```json
"parameters": {
  "storageAccountName": {
    "type": "string",
    "minLength": 3,
    "maxLength": 24
  },
  "location": {
    "type": "string",
    "defaultValue": "[resourceGroup().location]"
  }
},
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2019-06-01",
    "name": "[parameters('storageAccountName')]",
    "location": "[parameters('location')]",
    ...
  }
]
```

For more information, see [Set resource location in ARM template](resource-location.md).

## Set tags

You can apply tags to a resource during deployment. Tags help you logically organize your deployed resources. For examples of the different ways you can specify the tags, see [ARM template tags](../management/tag-resources.md#arm-templates).

## Set resource-specific properties

The preceding properties are generic to most resource types. After setting those values, you need to set the properties that are specific to the resource type you're deploying.

Use intellisense or [template reference](/azure/templates/) to determine which properties are available and which ones are required. The following example sets the remaining properties for a storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 24
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "functions": [],
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-06-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS",
        "tier": "Standard"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ]
}
```

## Next steps

* To conditionally deploy a resource, see [Conditional deployment in ARM templates](conditional-resource-deployment.md).
* To set resource dependencies, see [Define the order for deploying resources in ARM templates](./resource-dependency.md).