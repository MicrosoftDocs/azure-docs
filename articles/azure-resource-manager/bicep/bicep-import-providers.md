---
title: Import Bicep namespaces
description: Describes how to import Bicep namespaces.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 07/07/2023
---

# Import Bicep namespaces

This article describes the syntax you use to import the Bicep namespaces including the Bicep extensibility providers.

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
