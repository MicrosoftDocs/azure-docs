---
title: Bicep extensibility Kubernetes provider
description: Learn how to Bicep Kubernetes provider  to deploy .NET applications to Azure Kubernetes Service clusters.
ms.topic: conceptual
ms.date: 02/21/2023
---

# Bicep extensibility Kubernetes provider (Preview)

Learn how to Bicep extensibility Kubernetes provider to deploy .NET applications to [Azure Kubernetes Service clusters (AKS)](../../aks/intro-kubernetes.md).

## Enable the preview feature

This preview feature can be enabled by configuring the [bicepconfig.json](./bicep-config.md):

```json
{
  "experimentalFeaturesEnabled": {
    "extensibility": true,
  }
}
```

## Import Kubernetes provider

Kubernetes deployments must be contained within a [Bicep module file](./modules.md). To import the Kubernetes provider, use the [import statement](./bicep-import-providers.md). After importing the provider, you can refactor the Bicep module file as usual, such as by using variables, parameters, and output. By contract, the Kubernetes manifest in YML does not include any programmability support.

The following sample imports the Kubernetes provider:

```bicep
@secure()
param kubeConfig string

import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: kubeConfig
}
```

- **namespace**: Specify the namespace of the provider.
- **KubeConfig**: Specify a base64 encoded value of the [Kubernetes cluster admin credentials](/rest/api/aks/managed-clusters/list-cluster-admin-credentials).

The following sample shows how to pass `kubeConfig` value from a parent Bicep file:

```bicep
resource aks 'Microsoft.ContainerService/managedClusters@2022-05-02-preview' existing = {
  name: 'demoAKSCluster'
}

module kubernetes './kubernetes.bicep' = {
  name: 'buildbicep-deploy'
  params: {
    kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
  }
}
```

The AKS cluster can be a new resource or an existing resource. The [Import Kubernetes manifest command](./visual-studio-code.md#bicep-commands) from Visual Studio Code can automatically add the import snippet.

## Visual Studio Code import

From Visual Studio Code, you can import Kubernetes manifest files to create Bicep module files. For more information, see [Visual Studio Code](./visual-studio-code.md#bicep-commands).

## Next steps

- [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep extensibility Kubernetes provider](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md)

