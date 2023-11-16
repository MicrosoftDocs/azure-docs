---
title: Imports in Bicep
description: Describes how to import shared functionality and namespaces in Bicep.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 11/03/2023
---

# Imports in Bicep

This article describes the syntax you use to export and import shared functionality, as well as namespaces for Bicep extensibility providers.

## Exporting types, variables and functions (Preview)

> [!NOTE]
> [Bicep CLI version 0.23.X or higher](./install.md) is required to use this feature. The experimental feature `compileTimeImports` must be enabled from the [Bicep config file](./bicep-config.md#enable-experimental-features). For user-defined functions, the experimental feature `userDefinedFunctions` must also be enabled.

The `@export()` decorator is used to indicate that a given statement can be imported by another file. This decorator is only valid on type, variable and function statements. Variable statements marked with `@export()` must be compile-time constants.

The syntax for exporting functionality for use in other Bicep files is:

```bicep
@export()
<statement_to_export>
```

## Import types, variables and functions (Preview)

> [!NOTE]
> [Bicep CLI version 0.23.X or higher](./install.md) is required to use this feature. The experimental feature `compileTimeImports` must be enabled from the [Bicep config file](./bicep-config.md#enable-experimental-features). For user-defined functions, the experimental feature `userDefinedFunctions` must also be enabled.

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

You can mix and match the preceding syntaxes. To access imported symbols using the wildcard syntax, you must use the `.` operator: `<alias_name>.<exported_symbol>`.

Only statements that have been [exported](#exporting-types-variables-and-functions-preview) in the file being referenced are available to be imported.

Functionality that has been imported from another file can be used without restrictions. For example, imported variables can be used anywhere a variable declared in-file would normally be valid.

### Example

module.bicep

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

main.bicep

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

## Import namespaces and extensibility providers (Preview)

> [!NOTE]
> The experimental feature `extensibility` must be enabled from the [Bicep config file](./bicep-config.md#enable-experimental-features) to use this feature.

The syntax for importing namespaces is:

```bicep
import 'az@1.0.0'
import 'sys@1.0.0'
```

Both `az` and `sys` are Bicep built-in namespaces. They are imported by default. For more information about the data types and the functions defined in `az` and `sys`, see [Data types](./data-types.md) and  [Bicep functions](./bicep-functions.md).

The syntax for importing Bicep extensibility providers is:

```bicep
import '<provider-name>@<provider-version>'
```

The syntax for importing Bicep extensibility providers which require configuration is:

```bicep
import '<provider-name>@<provider-version>' with {
  <provider-properties>
}
```

For an example, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).

## Next steps

- To learn about the Bicep data types, see [Data types](./data-types.md).
- To learn about the Bicep functions, see [Bicep functions](./bicep-functions.md).
- To learn about how to use the Kubernetes provider, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).
- To go through a Kubernetes provider tutorial, see [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep Kubernetes provider.](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md).
