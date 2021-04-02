---
title: Template functions - any
description: Describes the any function that is available in Bicep to convert types.
ms.topic: conceptual
author: tfitzmac
ms.author: tomfitz
ms.service: azure-resource-manager
ms.subservice: templates
ms.date: 03/02/2021
---
# Any function for Bicep

Bicep supports a function called `any()` to resolve type errors in the Bicep type system. You use this function when the format of the value you provide doesn't match what the type system expects. For example, if the property requires a number but you need to provide it as a string, like `'0.5'`. Use the `any()` function to suppress the error reported by the type system.

This function doesn't exist in the Azure Resource Manager template runtime. It's only used by Bicep and isn't emitted in the JSON for the built template.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## any

`any(value)`

Returns a value that is compatible with any data type.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| value | Yes | all types | The value to convert to a compatible type. |

### Return value

The value in a form that is compatible with any data type.

### Examples

The following example template shows how to use the `any()` function to provide numeric values as strings.

```bicep
resource wpAci 'microsoft.containerInstance/containerGroups@2019-12-01' = {
  name: 'wordpress-containerinstance'
  location: location
  properties: {
    containers: [
      {
        name: 'wordpress'
        properties: {
          ...
          resources: {
            requests: {
              cpu: any('0.5')
              memoryInGB: any('0.7')
            }
          }
        }
      }
    ]
  }
}
```

The function works on any assigned value in Bicep. The following example uses `any()` with a ternary expression as an argument.  

```bicep
publicIPAddress: any((pipId == '') ? null : {
  id: pipId
})
```

## Next steps

For more complex uses of the `any()` function, see the following examples:

* [Child resources that require a specific names](https://github.com/Azure/bicep/blob/main/docs/examples/201/api-management-create-all-resources/main.bicep#L246)
* [A resource property not defined in the resource's type, even though it exists](https://github.com/Azure/bicep/blob/main/docs/examples/201/log-analytics-with-solutions-and-diagnostics/main.bicep#L26)

