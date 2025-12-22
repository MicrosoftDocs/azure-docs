---
title: Bicep functions - any()
description: Describes the any() function that's available in Bicep to convert types.
ms.topic: article
ms.custom: devx-track-bicep
ms.date: 10/22/2025
---

# any() function (Bicep)

Bicep supports a function named `any()` that suppresses type check errors. Use the Bicep `any()` function to cast a value to a type that's compatible with any data type. For example, use the `any()` function when a property requires a number but you need to provide a string, like `'0.5'`.

This function doesn't exist in the Azure Resource Manager template runtime. The Bicep `any()` function only affects compile-time type checking. It doesn't convert values at runtime and isn't emitted into the JSON for an Azure Resource Manager template.

> [!NOTE]
> To help resolve type errors, let us know when missing or incorrect types required you to use the `any()` function. Add your details to the [missing type validation/inaccuracies](https://github.com/Azure/bicep/issues/784) GitHub issue.

## Syntax for the Bicep any() function

`any(value)`

Returns a value that's compatible with any Bicep data type.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| value | Yes | all types | The value to convert to a compatible type. |

### Return value

The value in a form that's compatible with any data type in Bicep.

### Examples

The following example shows how to use the Bicep `any()` function to provide numeric values as strings.

```bicep
resource wpAci 'Microsoft.ContainerInstance/containerGroups@2025-09-01' = {
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

The function works on any assigned value in Bicep. The following example uses the Bicep `any()` function with a ternary expression as an argument.

```bicep
publicIPAddress: any((pipId == '') ? null : {
  id: pipId
})
```

## Next steps

For more complex uses of the `any()` function, see the following examples:

* [Child resources that require a specific names](https://github.com/Azure/bicep/blob/62eb8109ae51d4ee4a509d8697ef9c0848f36fe4/docs/examples/201/api-management-create-all-resources/main.bicep#L247)
* [A resource property not defined in the resource's type, even though it exists](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.insights/log-analytics-with-solutions-and-diagnostics/main.bicep#L26)
