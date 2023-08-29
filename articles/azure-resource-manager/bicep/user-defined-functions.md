---
title: User-defined functions in Bicep
description: Describes how to define and use user-defined functions in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 08/29/2023
---

# User-defined functions in Bicep (Preview)

Within your Bicep file, you can create your own functions. These functions are available for use in your Bicep files. User-defined functions are separate from the [standard Bicep functions](./bicep-functions.md) that are automatically available within your Bicep files. Create your own functions when you have complicated expressions that are used repeatedly in your Bicep files.

## Enable the preview feature

To enable this preview, modify your project's [bicepconfig.json](./bicep-config.md) file to include the following JSON:

```json
{
  "experimentalFeaturesEnabled": {
    "userDefinedFunctions": true
  }
}
```

## Define the function

You can use the `func` statement to define user-defined functions.

```bicep
func <user-defined-function-name> (<argument> <data-type>, <argument> <date-type>, ...) <function-data-type> => <expression>
```

Your functions require a namespace value to avoid naming conflicts with template functions. The following example shows a function that returns a unique name:

```bicep
func buildUrl(https bool, hostname string, path string) string => '${https ? 'https' : 'http'}://${hostname}${empty(path) ? '' : '/${path}'}'

func sayHello(name string) string => 'Hi ${name}!'

func objReturnType(name string) object => {
  hello: 'Hi ${name}!'
}

func arrayReturnType(name string) array => [
  name
]

func asdf(name string) array => [
  'asdf'
  name
]

@minValue(0)
type positiveInt = int

func typedArg(input string[]) positiveInt => length(input)
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
          "value": "[concat(toLower(parameters('namePrefix')), uniqueString(resourceGroup().id))]"
        }
      }
    }
  }
],
 "resources": [
   {
     "type": "Microsoft.Storage/storageAccounts",
     "apiVersion": "2022-09-01",
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
