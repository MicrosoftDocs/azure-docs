---
title: Define multiple instances of an output value
description: Use copy operation in an Azure Resource Manager template to iterate multiple times when returning a value from a deployment.
ms.topic: conceptual
ms.date: 04/17/2020
---
# Output iteration in ARM templates

This article shows you how to create more than one value for an output in your Azure Resource Manager (ARM) template. By adding the **copy** element to the outputs section of your template, you can dynamically return a number of items during deployment.

You can also use copy with [resources](copy-resources.md), [properties in a resource](copy-properties.md), and [variables](copy-variables.md).

## Syntax

The copy element has the following general format:

```json
"copy": {
  "count": <number-of-iterations>,
  "input": <values-for-the-output>
}
```

The **count** property specifies the number of iterations you want for the output value.

The **input** property specifies the properties that you want to repeat. You create an array of elements constructed from the value in the **input** property. It can be a single property (like a string), or an object with several properties.

## Copy limits

The count can't exceed 800.

The count can't be a negative number. It can be zero if you deploy the template with a recent version of Azure CLI, PowerShell, or REST API. Specifically, you must use:

* Azure PowerShell **2.6** or later
* Azure CLI **2.0.74** or later
* REST API version **2019-05-10** or later
* [Linked deployments](linked-templates.md) must use API version **2019-05-10** or later for the deployment resource type

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
        }
    },
    "variables": {
        "baseName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-04-01",
            "name": "[concat(copyIndex(), variables('baseName'))]",
            "location": "[resourceGroup().location]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {},
            "copy": {
                "name": "storagecopy",
                "count": "[parameters('storageCount')]"
            }
        }
    ],
    "outputs": {
        "storageEndpoints": {
            "type": "array",
            "copy": {
                "count": "[parameters('storageCount')]",
                "input": "[reference(concat(copyIndex(), variables('baseName'))).primaryEndpoints.blob]"
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
        }
    },
    "variables": {
        "baseName": "[concat('storage', uniqueString(resourceGroup().id))]"
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "apiVersion": "2019-04-01",
            "name": "[concat(copyIndex(), variables('baseName'))]",
            "location": "[resourceGroup().location]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {},
            "copy": {
                "name": "storagecopy",
                "count": "[parameters('storageCount')]"
            }
        }
    ],
    "outputs": {
        "storageInfo": {
            "type": "array",
            "copy": {
                "count": "[parameters('storageCount')]",
                "input": {
                    "id": "[reference(concat(copyIndex(), variables('baseName')), '2019-04-01', 'Full').resourceId]",
                    "blobEndpoint": "[reference(concat(copyIndex(), variables('baseName'))).primaryEndpoints.blob]",
                    "status": "[reference(concat(copyIndex(), variables('baseName'))).statusOfPrimary]"
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
        "id": "Microsoft.Storage/storageAccounts/0storagecfrbqnnmpeudi",
        "blobEndpoint": "https://0storagecfrbqnnmpeudi.blob.core.windows.net/",
        "status": "available"
    },
    {
        "id": "Microsoft.Storage/storageAccounts/1storagecfrbqnnmpeudi",
        "blobEndpoint": "https://1storagecfrbqnnmpeudi.blob.core.windows.net/",
        "status": "available"
    }
]
```

## Next steps

* To go through a tutorial, see [Tutorial: create multiple resource instances using ARM templates](template-tutorial-create-multiple-instances.md).
* For other uses of the copy element, see:
  * [Resource iteration in ARM templates](copy-resources.md)
  * [Property iteration in ARM templates](copy-properties.md)
  * [Variable iteration in ARM templates](copy-variables.md)
* If you want to learn about the sections of a template, see [Authoring ARM templates](template-syntax.md).
* To learn how to deploy your template, see [Deploy an application with ARM template](deploy-powershell.md).

