---
title: Bicep spread operator
description: Describes Bicep spread operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 05/21/2024
---

# Bicep spread operator

The spread operator is used to expand an iterable array or object into individual elements. The spread operator allows you to easily manipulate arrays or objects by spreading their elements or properties into new arrays or objects.

## Spread

`...`

The spread operator is used to copy properties from one object to another or to merge arrays and objects in a concise and readable way.

### Examples

The following example shows the spread operator used in an object: 

```bicep
var objA = { bar: 'bar' }
output objB object = { foo: 'foo', ...objA } 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `objB` | object | { foo: 'foo', bar: 'bar' } |

The following example shows the spread operator used in an array: 

```bicep
var arrA = [ 2, 3 ]
output arrB array = [ 1, ...arrA, 4 ] 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `arrB` | array | [ 1, 2, 3, 4 ] |

The following example shows spread used multiple times in a single operation:

```bicep
var arrA = [ 2, 3 ]
output arrC array = [ 1, ...arrA, 4, ...arrA ] 
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `arrC` | array | [ 1, 2, 3, 4, 2, 3 ] |

The following example shows spread used in a multi-line operation:

```bicep
var objA = { foo: 'foo' }
var objB = { bar: 'bar' }
output combined object = { 
  ...objA
  ...objB
} 
```

In this usage, comma isn't used between the two lines.  Output from the example:

| Name | Type | Value |
|------|------|-------|
| `combined` | object | { foo: 'foo', bar: 'bar' } |

The spread operation can be used to avoid setting an optional property. For example:

```bicep
param vmImageResourceId string = ''

var bar = vmImageResourceId != '' ? {
  id: vmImageResourceId
} : {}

output foo object = {
  ...bar
  alwaysSet: 'value'
}
```

Output from the example:

| Name | Type | Value |
|------|------|-------|
| `foo` | object | {"alwaysSet":"value"} |

The preceding example can also be written as:

```bicep
param vmImageResourceId string = ''

output foo object = {
  ...(vmImageResourceId != '' ? {
    id: vmImageResourceId
  } : {})
  alwaysSet: 'value'
}
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
