---
title: Use symbolic names in ARM templates
description: Describes how to use symbolic names in ARM templates.
ms.topic: conceptual
ms.date: 10/26/2021

---
# Use symbolic name in ARM templates

*** Merge into or cross-reference:
*** ./syntax.md#template-format
*** ./syntax.md#resources

> [!NOTE]
> Use "1.9-experimental" instead of "2.0" for `languageVersion` until the feature is officially announced.

In [Bicep](../overview.md), each resource definition has a symbolic name. The symbolic name is used to reference the resource from the other parts of your Bicep file. To support symbolic name in ARM JSON templates, add `languageVersion` with the version 2.0 or newer, and change the resource definition from an array to an object:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      ...
    }
  ]
}
```

vs.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "2.0",
  "contentVersion": "1.0.0.0",
  "resources": {
    "aks": {
      "type": "Microsoft.ContainerService/managedClusters",
      ...
    }
  }
}
```

When `languageVersion` is specified for a template, symbolic name must be specified for root level resources.

If [Deployments resource](/azure/templates/microsoft.resources/deployments?tabs=json) is used in a symbolic-name deployment, use apiVersion 2020-09-01 or later. *** 2020-09-01 can't be found in the template reference, and the rest API.

## Symbolic name

***Merge into or cross-reference:
*** ./syntax.md#resources

Symbolic names are case-sensitive. The allowed characters for symbolic names are letters, numbers, and _. Symbolic names must be unique in a template, but can overlap with variables, parameters, and outputs. (*** Can it be written as "symbolic names must be unique among the resources in a template"?) In the following example, the sybmolic name of the storage account resource has the same name as the output.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.9-experimental",
  "contentVersion": "1.0.0.0",
  "resources": {
    "myStorage": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[concat('storage', uniqueString(resourceGroup().id))]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "properties": {}
    }
  },
  "outputs": {
    "myStorage":{
      "type": "object",
      "value": "[resourceinfo('myStorage')]"
    }
  }
}
```

## Nested and linked templates

*** Merge into or cross-reference:
*** ./linked-templates.md?tabs=azure-powershell
*** ./linked-templates.md?tabs=azure-powershell#linked-template

[Nested resources](./child-resource-name-type.md#within-parent-resource) can't use symbolic name. In the following template, the nested storage account resource cannot use symbolic name:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.9-experimental",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourcegroup().location]"
    }
  },
  "resources": {
    "mainStorage": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    },
    "nestedResource": {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "nestedTemplate1",
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.Storage/storageAccounts",
              "apiVersion": "2021-04-01",
              "name": "[concat(parameters('storageAccountName'),'nested')]",
              "location": "[parameters('location')]",
              "sku": {
                "name": "Standard_LRS"
              },
              "kind": "StorageV2"
            }
          ]
        }
      }
    }
  },
  "outputs": {}
}
```

For the linked templates, you can nest a non-symoblic-name deployment inside a symoblic-name template, or nest a symbolic-name deployment inside a non-symbolic template.

## Loop

*** Merge into or cross-reference:
*** ./copy-resources.md

Symbolic name can be assigned to resource copy loops. The loop index is zero-based. In the following example, **myStorages[1]** references the second resource in the resource loop.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.9-experimental",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": {
    "myStorages": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
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
  },
  "outputs": {
    "storageEndpoint":{
      "type": "object",
      "value": "[reference('myStorages[1]').primaryEndpoints]"
    }
  }
}
```

If the index is a runtime value, format the reference yourself.  For example

```json
"[format('myStorages[{0}]', variables('runtimeIndex'))]"
```

Symbolic names can be used in dependsOn arrays. If a symbolic name is for a copy loop, all resources in the loop are added as dependencies. For example:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "languageVersion": "1.9-experimental",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageCount": {
      "type": "int",
      "defaultValue": 2
    }
  },
  "resources": {
    "myStorages": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[concat(copyIndex(),'storage', uniqueString(resourceGroup().id))]",
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
    },
    "dependStorage": {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "name": "[concat('9storage', uniqueString(resourceGroup().id))]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "Storage",
      "dependsOn": [
        "myStorages"
      ],
      "properties": {}
    }
  },
  "outputs": {
    "storageEndpoint":{
      "type": "object",
      "value": "[reference('myStorages[1]').primaryEndpoints]"
    }
  }
}
```

In the preceding example, **dependStorage** depends on all of the storage accounts in the **myStorages** loop.

## Template function

### Reference() function

***Merge into or cross reference
***./template-functions-resource.md#reference.

In the templates with symbolic names, [reference()](./template-functions-resource.md#reference) function can only take symbolic name or resource ID as argument, resource name can no longer be used.

Symbolic name can be used with [reference()](./template-functions-resource.md#reference) template function. For example:

```json
"[reference('myStorage').primaryEndpoints]"
```

Or

```json
"[reference('myStorage', '2019-04-01', 'Full').location]"
```

### resourceinfo()

***Merge into or cross reference
***./template-functions-resource.md

Template function `resourceInfo()` can be used to access a few basic resource properties as they are evaluated in a template. These properties are name, type, apiVersion, id. Copy loop symbolic name can't be used with resourceInfo(), but it is valid to use "[resourceInfo('myStorages[1]').id]".

The following JSON is a sample resourceInfo output of a storage account.

```json
    "outputs": {
      "resourceInfo": {
        "type": "Object",
        "value": {
          "apiVersion": "2019-04-01",
          "id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f3abcdefgh/resourceGroups/myStore1025rg/providers/Microsoft.Storage/storageAccounts/storageseb22p35lzlk2",
          "name": "storageseb22p35lzlk2",
          "resourceGroup": "myStore1025rg",
          "type": "Microsoft.Storage/storageAccounts"
        }
      }
    },
```

## Next steps
