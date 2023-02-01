---
title: Import schemas in Bicep
description: Describes how to imoprt schemas in Bicep.
ms.topic: conceptual
ms.date: 02/01/2023
---

# Import schemas in Bicep

This article describes the syntax you use to import schemas in Bicep file.

## Declaration

Add a resource declaration by using the `resource` keyword. You set a symbolic name for the resource. The symbolic name isn't the same as the resource name. You use the symbolic name to reference the resource in other parts of your Bicep file.

```bicep
import '<schema-name>@<schema-version>' with {
  <schema-properties>
}
```

## Import the Kubernetes provider schema

The following sample imports the Kubernetes provider schema.

```bicep
resource aks 'Microsoft.ContainerService/managedClusters@2022-05-02-preview' existing = {
  name: 'demoAKSCluster'
}

import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
}
```

- **namespace**: Specify the namespace of the provider.
- **KubeConfig**: Specify the [Kubernetes cluster admin credentials](/rest/api/aks/managed-clusters/list-cluster-admin-credentials).

For more information, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).

## Next steps

- To learn about how use the Kubernetes provider, see [Bicep extensibility Kubernetes provider](./bicep-extensibility-kubernetes-provider.md).
- To go through a Kubernetes provider tutorial, see [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep Kubernetes provider.](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md).
