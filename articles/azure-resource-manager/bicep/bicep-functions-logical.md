---
title: Bicep functions - logical
description: Describes the functions to use in a Bicep file to determine logical values.
author: mumian
ms.author: jgao
ms.topic: conceptual
ms.date: 07/29/2021
---

# Logical functions for Bicep

Resource Manager provides a `bool` function for Bicep. 

Most of the logical functions in Azure Resource Manager templates are replaced with [logical operators](./operators-logical.md) in Bicep.

## bool

`bool(arg1)`

Converts the parameter to a boolean.

### Parameters

| Parameter | Required | Type | Description |
|:--- |:--- |:--- |:--- |
| arg1 |Yes |string or int |The value to convert to a boolean. |

### Return value

A boolean of the converted value.

### Examples

The following [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/azure-resource-manager/functions/bool.json) shows how to use bool with a string or integer.

```bicep
output trueString bool = bool('true')
output falseString bool = bool('false')
output trueInt bool = bool(1)
output falseInt bool = bool(0)
```

The output from the preceding example with the default values is:

| Name | Type | Value |
| ---- | ---- | ----- |
| trueString | Bool | True |
| falseString | Bool | False |
| trueInt | Bool | True |
| falseInt | Bool | False |

## Next steps

* For most logical operations, see [Bicep logical operators](./operators-logical.md).
* For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
