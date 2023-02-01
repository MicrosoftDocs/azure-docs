---
title: Bicep extensibility Kubernetes provider
description: Learn how to Bicep Kubernetes provider  to deploy .NET applications to Azure Kubernetes Service clusters.
ms.topic: conceptual
ms.date: 02/01/2023
---

# Bicep extensibility Kubernetes provider (Preview)

Learn how to Bicep extensibility Kubernetes provider to deploy .NET applications to [Azure Kubernetes Service clusters (AKS)](../../aks/intro-kubernetes.md).

## Enable the preview feature

This preview feature can be enabled by configuring the [bicepconfig.json](./bicep-config.md):

```bicep
{
  "experimentalFeaturesEnabled": {
    "extensibility": true,
  }
}
```

## Import schema for Kubernetes provider

Use the following syntax to import schema for Kubernetes provider:

```bicep
resource aks 'Microsoft.ContainerService/managedClusters@2022-05-02-preview' existing = {
  name: clusterName
}

import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: aks.listClusterAdminCredential().kubeconfigs[0].value
}
```

The AKS cluster can be a new resource or an existing resource. The [Import Kubernetes manifest command](./visual-studio-code.md#bicep-commands) from Visual Studio Code can automatically add the code snippet automatically.

## How provider-specific resource types are exposed/accessed

```bicep
resource appsDeployment_azureVoteBack 'apps/Deployment@v1' = {}
```

- .apiVersion: Specifies the API group and API resource you want to use when creating the resource.
- .kind: Specifies the type of resource you want to create.

## Visual Studio Code import

From Visual Studio Code, you can import Kubernetes manifest files to create Bicep module files. For more information, see [Visual Studio Code](./visual-studio-code.md#bicep-commands)

## Next steps

- [Add module settings in Bicep config](bicep-config-modules.md)
- [Add linter settings to Bicep config](bicep-config-linter.md)
- Learn about the [Bicep linter](linter.md)
