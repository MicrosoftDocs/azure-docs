---
title: Template functions - logical
description: Describes the functions to use in an Azure Resource Manager template (ARM template) to determine logical values.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 06/23/2023
---

# Logical functions for ARM templates

Resource Manager provides several functions for making comparisons in your Azure Resource Manager template (ARM template):

* [and](#and)
* [bool](#bool)
* [false](#false)
* [if](#if)
* [not](#not)
* [or](#or)
* [true](#true)

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see the [bool](../bicep/bicep-functions-logical.md) logical function and [logical](../bicep/operators-logical.md) operators.

## and

`and(arg1, arg2, ...)`

Checks whether all parameter values are true.

The `and` function isn't supported in Bicep. Use the [&& operator](../bicep/operators-logical.md#and-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |boolean |The first value to check whether is true. |
| arg2 |Yes |boolean |The second value to check whether is true. |
| more arguments |No |boolean |More arguments to check whether are true. |

### Return value

Returns **True** if all values are true; otherwise, **False**.

### Examples

The following example shows how to use logical functions.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/andornot.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| andExampleOutput | Bool | False |
| orExampleOutput | Bool | True |
| notExampleOutput | Bool | False |

## bool

`bool(arg1)`

Converts the parameter to a boolean.

In Bicep, use the [bool](../bicep/bicep-functions-logical.md#bool) logical function.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or int |The value to convert to a boolean. |

### Return value

A boolean of the converted value.

### Remarks

You can also use [true()](#true) and [false()](#false) to get boolean values.

### Examples

The following example shows how to use bool with a string or integer.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/bool.json":::

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| trueString | Bool | True |
| falseString | Bool | False |
| trueInt | Bool | True |
| falseInt | Bool | False |

## false

`false()`

Returns false.

The `false` function isn't available in Bicep. Use the `false` keyword instead.

### Parameters

The false function doesn't accept any parameters.

### Return value

A boolean that is always false.

### Example

The following example returns a false output value.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/false.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| falseOutput | Bool | False |

## if

`if(condition, trueValue, falseValue)`

Returns a value based on whether a condition is true or false.

The `if` function isn't supported in Bicep. Use the [?: operator](../bicep/operators-logical.md#conditional-expression--) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| condition |Yes |boolean |The value to check whether it's true or false. |
| trueValue |Yes | string, int, object, or array |The value to return when the condition is true. |
| falseValue |Yes | string, int, object, or array |The value to return when the condition is false. |

### Return value

Returns second parameter when first parameter is **True**; otherwise, returns third parameter.

### Remarks

When the condition is **True**, only the true value is evaluated. When the condition is **False**, only the false value is evaluated. With the `if` function, you can include expressions that are only conditionally valid. For example, you can reference a resource that exists under one condition but not under the other condition. An example of conditionally evaluating expressions is shown in the following section.

### Examples

The following example shows how to use the `if` function.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/if.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| yesOutput | String | yes |
| noOutput | String | no |
| objectOutput | Object | { "test": "value1" } |

The following [example template](https://github.com/krnese/AzureDeploy/blob/master/ARM/deployments/conditionWithReference.json) shows how to use this function with expressions that are only conditionally valid.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "logAnalytics": {
      "type": "string",
      "defaultValue": ""
    }
  },
  "resources": [
   {
      "condition": "[not(empty(parameters('logAnalytics')))]",
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "apiVersion": "2022-11-01",
      "name": "[format('{0}/omsOnboarding', parameters('vmName'))]",
      "location": "[parameters('location')]",
      "properties": {
        "publisher": "Microsoft.EnterpriseCloud.Monitoring",
        "type": "MicrosoftMonitoringAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true,
        "settings": {
          "workspaceId": "[if(not(empty(parameters('logAnalytics'))), reference(parameters('logAnalytics'), '2015-11-01-preview').customerId, null())]"
        },
        "protectedSettings": {
          "workspaceKey": "[if(not(empty(parameters('logAnalytics'))), listKeys(parameters('logAnalytics'), '2015-11-01-preview').primarySharedKey, null())]"
        }
      }
    }
  ],
  "outputs": {
    "mgmtStatus": {
      "type": "string",
      "value": "[if(not(empty(parameters('logAnalytics'))), 'Enabled monitoring for VM!', 'Nothing to enable')]"
    }
  }
}
```

## not

`not(arg1)`

Converts boolean value to its opposite value.

The `not` function isn't supported in Bicep. Use the [! operator](../bicep/operators-logical.md#not-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |boolean |The value to convert. |

### Return value

Returns **True** when parameter is **False**. Returns **False** when parameter is **True**.

### Examples

The following example shows how to use logical functions.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/andornot.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| andExampleOutput | Bool | False |
| orExampleOutput | Bool | True |
| notExampleOutput | Bool | False |

The following example uses `not` with [equals](template-functions-comparison.md#equals).

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/not-equals.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| checkNotEquals | Bool | True |

## or

`or(arg1, arg2, ...)`

Checks whether any parameter value is true.

The `or` function isn't supported in Bicep. Use the [|| operator](../bicep/operators-logical.md#or-) instead.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |boolean |The first value to check whether is true. |
| arg2 |Yes |boolean |The second value to check whether is true. |
| more arguments |No |boolean |More arguments to check whether are true. |

### Return value

Returns **True** if any value is true; otherwise, **False**.

### Examples

The following example shows how to use logical functions.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/andornot.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| andExampleOutput | Bool | False |
| orExampleOutput | Bool | True |
| notExampleOutput | Bool | False |

## true

`true()`

Returns true.

The `true` function isn't available in Bicep. Use the `true` keyword instead.

### Parameters

The true function doesn't accept any parameters.

### Return value

A boolean that is always true.

### Example

The following example returns a true output value.

:::code language="json" source="~/resourcemanager-templates/azure-resource-manager/functions/logical/true.json":::

The output from the preceding example is:

| Name | Type | Value |
| ---- | ---- | ----- |
| trueOutput | Bool | True |

## Next steps

* For a description of the sections in an ARM template, see [Understand the structure and syntax of ARM templates](./syntax.md).
