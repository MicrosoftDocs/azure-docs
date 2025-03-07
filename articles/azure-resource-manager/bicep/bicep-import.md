---
title: Imports in Bicep
description: This article describes how to import shared functionality and namespaces in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 12/06/2024
---

# Imports in Bicep

This article describes the syntax you use to export and import shared functionality and namespaces. Using compile-time imports automatically enables [language version 2.0](../templates/syntax.md#languageversion-20) code generation.

## Export variables, types, and functions

The `@export()` decorator indicates that another file can import a specific statement. This decorator is only valid on [`type`](./user-defined-data-types.md), [`var`](./variables.md), and [`func`](./user-defined-functions.md) statements. Variable statements marked with `@export()` must be compile-time constants.

The syntax for exporting functionality for use in other Bicep files is:

```bicep
@export()
<statement_to_export>
```

## Import variables, types, and functions

The syntax for importing functionality from another Bicep file is:

```bicep
import {<symbol_name>, <symbol_name>, ...} from '<bicep_file_name>'
```

With optional aliasing to rename symbols:

```bicep
import {<symbol_name> as <alias_name>, ...} from '<bicep_file_name>'
```

Using the wildcard import syntax:

```bicep
import * as <alias_name> from '<bicep_file_name>'
```

You can mix and match the preceding syntaxes. To access imported symbols by using the wildcard syntax, you must use the `.` operator: `<alias_name>.<exported_symbol>`.

Only statements that were [exported](#export-variables-types-and-functions) in the file being referenced are available for import.

You can use functionality that was imported from another file without restrictions. For example, you can use imported variables anywhere that a variable declared in-file would normally be valid.

### Example

*exports.bicep*

```bicep
@export()
type myObjectType = {
  foo: string
  bar: int
}

@export()
var myConstant = 'This is a constant value'

@export()
func sayHello(name string) string => 'Hello ${name}!'
```

*main.bicep*

```bicep
import * as myImports from 'exports.bicep'
import {myObjectType, sayHello} from 'exports.bicep'

param exampleObject myObjectType = {
  foo: myImports.myConstant
  bar: 0
}

output greeting string = sayHello('Bicep user')
output exampleObject myImports.myObjectType = exampleObject
```

## Import namespaces

The syntax for importing namespaces is:

```bicep
import 'az@1.0.0'
import 'sys@1.0.0'
```

Both `az` and `sys` are Bicep built-in namespaces. They're imported by default. For more information about the data types and the functions defined in `az` and `sys`, see [Data types](./data-types.md) and  [Bicep functions](./bicep-functions.md).

## Related content

- To learn about the Bicep data types, see [Data types](./data-types.md).
- To learn about the Bicep functions, see [Bicep functions](./bicep-functions.md).
- To learn about how to use the Kubernetes extension, see [Bicep Kubernetes extension](./bicep-kubernetes-extension.md).
- To go through a Kubernetes extension tutorial, see [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep Kubernetes extension.](/azure/aks/learn/quick-kubernetes-deploy-bicep-kubernetes-extension).
- To learn about how to use the Microsoft Graph extension, see [Bicep templates for Microsoft Graph](https://aka.ms/graphbicep).
