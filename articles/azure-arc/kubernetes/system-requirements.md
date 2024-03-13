---
title: "Azure Arc-enabled Kubernetes system requirements"
ms.date: 08/28/2023
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
description: Learn about the system requirements to connect Kubernetes clusters to Azure Arc.
---

# Azure Arc-enabled Kubernetes system requirements

This article describes the basic requirements for [connecting a Kubernetes cluster to Azure Arc](quickstart-connect-cluster.md), along with system requirement information related to various Arc-enabled Kubernetes scenarios.

## Cluster requirements

Azure Arc-enabled Kubernetes works with any Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters. This includes clusters running on other public cloud providers (such as GCP or AWS) and clusters running on your on-premises data center (such as VMware vSphere or Azure Stack HCI).

You must also have a [kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) and context pointing to your cluster.

The cluster must have at least one node with operating system and architecture type `linux/amd64` and/or `linux/arm64`.

> [!IMPORTANT]
> Many Arc-enabled Kubernetes features and scenarios are supported on ARM64 nodes, such as [cluster connect](cluster-connect.md) and [viewing Kubernetes resources in the Azure portal](kubernetes-resource-view.md). However, if using Azure CLI to enable these scenarios, [Azure CLI must be installed](/cli/azure/install-azure-cli) and run from an AMD64 machine.
>
> Currently, Azure Arc-enabled Kubernetes [cluster extensions](conceptual-extensions.md) aren't supported on ARM64-based clusters, except for [Flux (GitOps)](conceptual-gitops-flux2.md). To [install and use other cluster extensions](extensions.md), the cluster must have at least one node of operating system and architecture type `linux/amd64`.

## Compute and memory requirements

The Arc agents deployed on the cluster require:

- At least 850 MB of free memory
- Capacity to use approximately 7% of a single CPU

For a multi-node Kubernetes cluster environment, pods can get scheduled on different nodes.

## Management tool requirements

To connect a cluster to Azure Arc, you'll need to use either Azure CLI or Azure PowerShell.

For Azure CLI:

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to the latest version.
- Install the latest version of **connectedk8s** Azure CLI extension:

  ```azurecli
  az extension add --name connectedk8s
  ```

For Azure PowerShell:

- Install [Azure PowerShell version 6.6.0 or later](/powershell/azure/install-azure-powershell).
- Install the **Az.ConnectedKubernetes** PowerShell module:

    ```azurepowershell-interactive
    Install-Module -Name Az.ConnectedKubernetes
    ```

> [!NOTE]
> When you deploy the Azure Arc agents to a cluster,  Helm v. 3.6.3 will be installed in the `.azure` folder of the deployment machine. This [Helm 3](https://helm.sh/docs/) installation is only used for Azure Arc, and it doesn't remove or change any previously installed versions of Helm on the machine.

<a name='azure-ad-identity-requirements'></a>

## Microsoft Entra identity requirements

To connect your cluster to Azure Arc, you must have a Microsoft Entra identity (user or service principal) which can be used to log in to [Azure CLI](/cli/azure/authenticate-azure-cli) or [Azure PowerShell](/powershell/azure/authenticate-azureps) and connect your cluster to Azure Arc.

This identity must have 'Read' and 'Write' permissions on the Azure Arc-enabled Kubernetes resource type (`Microsoft.Kubernetes/connectedClusters`). If connecting the cluster to an existing resource group (rather than a new one created by this identity), the identity must have 'Read' permission for that resource group.

The [Kubernetes Cluster - Azure Arc Onboarding built-in role](../../role-based-access-control/built-in-roles.md#kubernetes-cluster---azure-arc-onboarding) can be used for this identity. This role is useful for at-scale onboarding, as it has only the granular permissions required to connect clusters to Azure Arc, and doesn't have permission to update, delete, or modify any other clusters or other Azure resources.

## Azure resource provider requirements

To use Azure Arc-enabled Kubernetes, the following [Azure resource providers](../../azure-resource-manager/management/resource-providers-and-types.md) must be registered in your subscription:

- **Microsoft.Kubernetes**
- **Microsoft.KubernetesConfiguration**
- **Microsoft.ExtendedLocation**

You can register the resource providers using the following commands:

Azure PowerShell:

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.Kubernetes
Register-AzResourceProvider -ProviderNamespace Microsoft.KubernetesConfiguration
Register-AzResourceProvider -ProviderNamespace Microsoft.ExtendedLocation
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace Microsoft.Kubernetes
az provider register --namespace Microsoft.KubernetesConfiguration
az provider register --namespace Microsoft.ExtendedLocation
```

You can also register the resource providers in the [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Network requirements

Be sure that you have connectivity to the [required endpoints for Azure Arc-enabled Kubernetes](network-requirements.md).

## Next steps

- Review the [network requirements for using Arc-enabled Kubernetes](system-requirements.md).
- Use our [quickstart](quickstart-connect-cluster.md) to connect your cluster.
