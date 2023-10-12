---
title: Import Bicep namespaces
description: Describes how to import Bicep namespaces.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 09/21/2023
---

# Import Bicep namespaces

This article describes the syntax you use to import user-defined data types and the Bicep namespaces including the Bicep extensibility providers.

## Import user-defined data types (Preview)

[Bicep version 0.21.1 or newer](./install.md) is required to use this feature. The experimental flag `compileTimeImports` must be enabled from the [Bicep config file](./bicep-config.md#enable-experimental-features).


The syntax for importing [user-defined data type](./user-defined-data-types.md) is:

```bicep
import {<user-defined-data-type-name>, <user-defined-data-type-name>, ...} from '<bicep-file-name>'
```

or with wildcard syntax:

```bicep
import * as <namespace> from '<bicep-file-name>'
```

You can mix and match the two preceding syntaxes.

Only user-defined data types that bear the [@export() decorator](./user-defined-data-types.md#import-types-between-bicep-files-preview) can be imported. Currently, this decorator can only be used on [`type`](./user-defined-data-types.md) statements.

Imported types can be used anywhere a user-defined type might be, for example, within the type clauses of type, param, and output statements.

### Example

myTypes.bicep

```bicep
@export()
type myString = string

@export()
type myInt = int
```

main.bicep

```bicep
import * as myImports from 'myTypes.bicep'
import {myInt} from 'myTypes.bicep'

param exampleString myImports.myString = 'Bicep'
param exampleInt myInt = 3

output outString myImports.myString = exampleString
output outInt myInt = exampleInt
```

## Import namespaces and extensibility providers

The syntax for importing the namespaces is:

```bicep
import 'az@1.0.0'
import 'sys@1.0.0'
```

Both `az` and `sys` are Bicep built-in namespaces. They are imported by default. For more information about the data types and the functions defined in `az` and `sys`, see [Data types](./data-types.md) and  [Bicep functions](./bicep-functions.md).

The syntax for importing Bicep extensibility providers is:

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
