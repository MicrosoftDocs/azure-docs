---
title: Bicep extensibility Kubernetes provider
description: Learn how to Bicep Kubernetes provider  to deploy .NET applications to Azure Kubernetes Service clusters.
ms.topic: conceptual
ms.custom: devx-track-bicep, devx-track-dotnet
ms.date: 03/20/2024
---

# Bicep extensibility Kubernetes provider (Preview)

The Kubernetes provider allows you to create Kubernetes resources directly with Bicep. Bicep can deploy anything that can be deployed with the [Kubernetes command-line client (kubectl)](https://kubernetes.io/docs/reference/kubectl/kubectl/) and a [Kubernetes manifest file](../../aks/concepts-clusters-workloads.md#deployments-and-yaml-manifests).

> [!NOTE]
> Kubernetes provider is not currently supported for private clusters:
> 
> ```bicep
> resource AKS 'Microsoft.ContainerService/managedClusters@2023-01-02-preview' = {
>  ...
>  properties: {
>   apiServerAccessProfile: {
>     enablePrivateCluster: true
>   }
>  }
> }
> 
> ```
> 

## Enable the preview feature

This preview feature can be enabled by configuring the [bicepconfig.json](./bicep-config.md):

```json
{
  "experimentalFeaturesEnabled": {
    "extensibility": true
  }
}
```

## Import Kubernetes provider

To safely pass secrets for the Kubernetes deployment, you must invoke the Kubernetes code with a Bicep module and pass the parameter as a secret.
To import the Kubernetes provider, use the [import statement](./bicep-import-providers.md). After importing the provider, you can refactor the Bicep module file as usual, such as by using variables, parameters, and output. By contract, the Kubernetes manifest in YML doesn't include any programmability support.

The following sample imports the Kubernetes provider:

```bicep
@secure()
param kubeConfig string

import 'kubernetes@1.0.0' with {
  namespace: 'default'
  kubeConfig: kubeConfig
} as k8s
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

The AKS cluster can be a new resource or an existing resource. The `Import Kubernetes manifest` command from Visual Studio Code can automatically add the import snippet. For the details, see [Import Kubernetes manifest command](./visual-studio-code.md#bicep-commands).

## Visual Studio Code import

From Visual Studio Code, you can import Kubernetes manifest files to create Bicep module files. For more information, see [Visual Studio Code](./visual-studio-code.md#bicep-commands).

## Next steps

- [Quickstart - Deploy Azure applications to Azure Kubernetes Services by using Bicep extensibility Kubernetes provider](../../aks/learn/quick-kubernetes-deploy-bicep-extensibility-kubernetes-provider.md)
