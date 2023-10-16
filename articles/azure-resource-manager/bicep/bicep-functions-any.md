---
title: Bicep functions - any
description: Describes the any function that is available in Bicep to convert types.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 06/23/2023
---

# Any function for Bicep

Bicep supports a function called `any()` to resolve type errors in the Bicep type system. You use this function when the format of the value you provide doesn't match what the type system expects. For example, if the property requires a number but you need to provide it as a string, like `'0.5'`. Use the `any()` function to suppress the error reported by the type system.

This function doesn't exist in the Azure Resource Manager template runtime. It's only used by Bicep and isn't emitted in the JSON for the built template.

> [!NOTE]
> To help resolve type errors, let us know when missing or incorrect types required you to use the `any()` function. Add your details to the [missing type validation/inaccuracies](https://github.com/Azure/bicep/issues/784) GitHub issue.

## any

`any(value)`

Returns a value that is compatible with any data type.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| value | Yes | all types | The value to convert to a compatible type. |

### Return value

The value in a form that is compatible with any data type.

### Examples

The following example shows how to use the `any()` function to provide numeric values as strings.

```bicep
resource wpAci 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
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

* [Child resources that require a specific names](https://github.com/Azure/bicep/blob/62eb8109ae51d4ee4a509d8697ef9c0848f36fe4/docs/examples/201/api-management-create-all-resources/main.bicep#L247)
* [A resource property not defined in the resource's type, even though it exists](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.insights/log-analytics-with-solutions-and-diagnostics/main.bicep#L26)
