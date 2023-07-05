---
title: Import Bicep extensibility providers
description: Describes how to import Bicep extensibility providers.
ms.topic: conceptual
ms.custom: devx-track-bicep
ms.date: 02/21/2023
---

# Import Bicep extensibility providers

This article describes the syntax you use to import Bicep extensibility providers.

## Import providers

The syntax for importing providers is:

```bicep
import '<provider-name>@<provider-version>' with {
  <provider-properties>
}
```

## Kubernetes provider

See [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).

## Next steps

- To learn about how to use the Kubernetes provider, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).
- To go through a Kubernetes provider tutorial, see [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep Kubernetes provider.](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md).
