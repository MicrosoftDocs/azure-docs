---
title: User-defined functions in templates
description: Describes how to define and use user-defined functions in an Azure Resource Manager template (ARM template).
ms.topic: article
ms.custom: devx-track-arm-template
ms.date: 07/17/2025
---

# User-defined functions in ARM template

User-defined functions help simplify and reuse complex expressions in your ARM templates. By encapsulating logic in custom functions, you can improve template readability, maintainability, and scalability-especially when the same logic appears in multiple places. These functions are distinct from the [built-in template functions](template-functions.md) that are always available. To define user-defined functions in Bicep, see [User-defined functions in Bicep](../bicep/user-defined-functions.md).

## Define the function

Your functions require a namespace value to avoid naming conflicts with template functions. The following example shows a function that returns a unique name:

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

The following example shows a template that includes a user-defined function to get a unique name for a storage account. The template has a parameter named `storageNamePrefix` that is passed as a parameter to the function.

```json
{
 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
 "contentVersion": "1.0.0.0",
 "parameters": {
   "storageNamePrefix": {
     "type": "string",
     "maxLength": 11
   }
 },
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
          "value": "[format('{0}{1}', toLower(parameters('namePrefix')), uniqueString(resourceGroup().id))]"
        }
      }
    }
  }
],
 "resources": [
   {
     "type": "Microsoft.Storage/storageAccounts",
     "apiVersion": "2025-06-01",
     "name": "[contoso.uniqueName(parameters('storageNamePrefix'))]",
     "location": "South Central US",
     "sku": {
       "name": "Standard_LRS"
     },
     "kind": "StorageV2",
     "properties": {
       "supportsHttpsTrafficOnly": true
     }
   }
 ]
}
```

During deployment, the `storageNamePrefix` parameter is passed to the function:

* The template defines a parameter named `storageNamePrefix`.
* The function uses `namePrefix` because you can only use parameters defined in the function. For more information, see [Limitations](#limitations).
* In the template's `resources` section, the `name` element uses the function and passes the `storageNamePrefix` value to the function's `namePrefix`.

## Limitations

When defining a user function, there are some restrictions:

* The function can't access variables.
* The function can only use parameters that are defined in the function. When you use the [parameters](template-functions-deployment.md#parameters) function within a user-defined function, you're restricted to the parameters for that function.
* The function can't call other user-defined functions.
* The function can't use the [reference](template-functions-resource.md#reference) function or any of the [list](template-functions-resource.md#list) functions.
* Parameters for the function can't have default values.

## Next steps

* To learn about the available properties for user-defined functions, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For a list of the available template functions, see [ARM template functions](template-functions.md).

