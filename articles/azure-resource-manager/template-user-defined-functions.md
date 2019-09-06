---
title: User-defined functions in Azure Resource Manager template
description: Describes how to define and use user-defined functions in an Azure Resource Manager template. 
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 09/05/2019
ms.author: tomfitz
---
# User-defined functions in Azure Resource Manager template

Within your template, you can create your own functions. These functions are available for use in your template. User-defined functions are separate from the [standard template functions](resource-group-template-functions.md) that are automatically available within your template. Create your own functions when you have complicated expressions that are used repeatedly in your template.

This article describes how to add user-defined functions in your Azure Resource Manager template.

## Define the function

Your functions require a namespace value to avoid naming conflicts with template functions. The following example shows a function that returns a storage account name:

```json
"functions": [
  {
    "namespace": "contoso",
    "members": {
      "uniqueName": {
        "parameters": [
          {
            "name": "namePrefix",
            "type": "string"
          }
        ],
        "output": {
          "type": "string",
          "value": "[concat(toLower(parameters('namePrefix')), uniqueString(resourceGroup().id))]"
        }
      }
    }
  }
],
```

## Use the function

The following example shows how to call your function.

```json
"resources": [
  {
    "name": "[contoso.uniqueName(parameters('storageNamePrefix'))]",
    "type": "Microsoft.Storage/storageAccounts",
    "apiVersion": "2016-01-01",
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "location": "South Central US",
    "tags": {},
    "properties": {}
  }
]
```

## Limitations

When defining a user function, there are some restrictions:

* The function can't access variables.
* The function can only use parameters that are defined in the function. When you use the [parameters](resource-group-template-functions-deployment.md#parameters) function within a user-defined function, you're restricted to the parameters for that function.
* The function can't call other user-defined functions.
* The function can't use the [reference](resource-group-template-functions-resource.md#reference) function or any of the [list](resource-group-template-functions-resource.md#list) functions.
* Parameters for the function can't have default values.


## Next steps

* To learn about the available properties for user-defined functions, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
* For a list of the available template functions, see [Azure Resource Manager template functions](resource-group-template-functions.md).
