---
title: Bicep spread operator
description: Describes Bicep spread operator.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 05/07/2024
---

# Bicep spread operator

The spread operator is used to expand an iterable array or object into individual elements. The spread operator allows you to easily manipulate arrays or objects by spreading their elements or properties into new arrays or objects.

## Spread

`...<variableName or parameterName>`

The object *objB* in the following example is equivalent to { foo: 'foo', bar: 'bar' }:

```bicep
var objA = { bar: 'bar' }
var objB = { foo: 'foo', ...objA } 
```

The array *arrB* in the following example is equivalent to [ 1, 2, 3, 4 ]:

```bicep
var arrA = [ 2, 3 ]
var arrB = [ 1, ...arrA, 4 ] 
```

## Next steps

- To run the examples, use Azure CLI or Azure PowerShell to [deploy a Bicep file](./quickstart-create-bicep-use-visual-studio-code.md#deploy-the-bicep-file).
- To create a Bicep file, see [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).
- For information about how to resolve Bicep type errors, see [Any function for Bicep](./bicep-functions-any.md).
