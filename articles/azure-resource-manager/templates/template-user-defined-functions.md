---
title: User-defined functions in templates
description: Describes how to define and use user-defined functions in an Azure Resource Manager template.
ms.topic: conceptual
ms.date: 09/05/2019
---
# User-defined functions in Azure Resource Manager template

Within your template, you can create your own functions. These functions are available for use in your template. User-defined functions are separate from the [standard template functions](template-functions.md) that are automatically available within your template. Create your own functions when you have complicated expressions that are used repeatedly in your template.

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
    "apiVersion": "2016-01-01",
    "type": "Microsoft.Storage/storageAccounts",
    "location": "South Central US",
    "tags": {},
    "sku": {
      "name": "Standard_LRS"
    },
    "kind": "Storage",
    "properties": {}
  }
]
```

## Limitations

When defining a user function, there are some restrictions:

* The function can't access variables.
* The function can only use parameters that are defined in the function. When you use the [parameters](template-functions-deployment.md#parameters) function within a user-defined function, you're restricted to the parameters for that function.
* The function can't call other user-defined functions.
* The function can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions.
* Parameters for the function can't have default values.


## Next steps

* To learn about the available properties for user-defined functions, see [Understand the structure and syntax of Azure Resource Manager templates](template-syntax.md).
* For a list of the available template functions, see [Azure Resource Manager template functions](template-functions.md).
