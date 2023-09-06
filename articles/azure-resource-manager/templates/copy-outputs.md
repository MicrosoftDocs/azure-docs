---
title: Define multiple instances of an output value
description: Use copy operation in an Azure Resource Manager template (ARM template) to iterate multiple times when returning a value from a deployment.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/22/2023
---

# Output iteration in ARM templates

This article shows you how to create more than one value for an output in your Azure Resource Manager template (ARM template). By adding copy loop to the outputs section of your template, you can dynamically return a number of items during deployment.

You can also use copy loop with [resources](copy-resources.md), [properties in a resource](copy-properties.md), and [variables](copy-variables.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [loops](../bicep/loops.md).

## Syntax

Add the `copy` element to the output section of your template to return a number of items. The copy element has the following general format:

```json
"copy": {
  "count": <number-of-iterations>,
  "input": <values-for-the-output>
}
```

The `count` property specifies the number of iterations you want for the output value.

The `input` property specifies the properties that you want to repeat. You create an array of elements constructed from the value in the `input` property. It can be a single property (like a string), or an object with several properties.

## Copy limits

The count can't exceed 800.

The count can't be a negative number. It can be zero if you deploy the template with a recent version of Azure CLI, PowerShell, or REST API. Specifically, you must use:

- Azure PowerShell **2.6** or later
- Azure CLI **2.0.74** or later
- REST API version **2019-05-10** or later
- [Linked deployments](linked-templates.md) must use API version **2019-05-10** or later for the deployment resource type

Earlier versions of PowerShell, CLI, and the REST API don't support zero for count.

## Outputs iteration

The following example creates a variable number of storage accounts and returns an endpoint for each storage account:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "baseName": "[format('storage{0}', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "copy": {
        "name": "storagecopy",
        "count": "[parameters('storageCount')]"
      },
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[format('{0}{1}', copyIndex(), variables('baseName'))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  ],
  "outputs": {
    "storageEndpoints": {
      "type": "array",
      "copy": {
        "count": "[parameters('storageCount')]",
        "input": "[reference(format('{0}{1}', copyIndex(), variables('baseName'))).primaryEndpoints.blob]"
      }
    }
  }
}
```

The preceding template returns an array with the following values:

```json
[
  "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
  "https://1storagecfrbqnnmpeudi.blob.core.windows.net/"
]
```

The next example returns three properties from the new storage accounts.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "baseName": "[format('storage{0}', uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "copy": {
        "name": "storagecopy",
        "count": "[length(range(0, parameters('storageCount')))]"
      },
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[format('{0}{1}', range(0, parameters('storageCount'))[copyIndex()], variables('baseName'))]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  ],
  "outputs": {
    "storageInfo": {
      "type": "array",
      "copy": {
        "count": "[length(range(0, parameters('storageCount')))]",
        "input": {
          "id": "[resourceId('Microsoft.Storage/storageAccounts', format('{0}{1}', copyIndex(), variables('baseName')))]",
          "blobEndpoint": "[reference(format('{0}{1}', copyIndex(), variables('baseName'))).primaryEndpoints.blob]",
          "status": "[reference(format('{0}{1}', copyIndex(), variables('baseName'))).statusOfPrimary]"
        }
      }
    }
  }
}
```

The preceding example returns an array with the following values:

```json
[
  {
    "id": "/subscriptions/00000000/resourceGroups/demoGroup/providers/Microsoft.Storage/storageAccounts/0storagecfrbqnnmpeudi",
    "blobEndpoint": "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  },
  {
    "id": "/subscriptions/00000000/resourceGroups/demoGroup/providers/Microsoft.Storage/storageAccounts/1storagecfrbqnnmpeudi",
    "blobEndpoint": "https://1storagecfrbqnnmpeudi.blob.core.windows.net/",
    "status": "available"
  }
]
```

## Next steps

- To go through a tutorial, see [Tutorial: Create multiple resource instances with ARM templates](template-tutorial-create-multiple-instances.md).
- For other uses of the copy loop, see:
  - [Resource iteration in ARM templates](copy-resources.md)
  - [Property iteration in ARM templates](copy-properties.md)
  - [Variable iteration in ARM templates](copy-variables.md)
- If you want to learn about the sections of a template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- To learn how to deploy your template, see [Deploy resources with ARM templates and Azure PowerShell](deploy-powershell.md).
