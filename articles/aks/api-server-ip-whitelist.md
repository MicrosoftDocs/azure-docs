---
title: API server whitelisting in Azure Kubernetes Service (AKS)
description: Learn how to secure your cluster using an IP address whitelist for access to the API server in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 02/20/2019
ms.author: iainfou
---

# Secure access to the API server using an IP address whitelist in Azure Kubernetes Service (AKS)

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

This article shows you how to use the API server IP address whitelist to limit requests to control plane.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

### Azure CLI requirements

You need the Azure CLI version 2.0.56 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

To use the API server IP address whitelist, you need the *aks-preview* Azure CLI extension. Install this extension using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add --name aks-preview
```

### Register feature flag for your subscription

To use the API server IP address whitelist, first enable a feature flag on your subscription. To register the *EnableSingleIPPerCCP* feature flag, use the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --name EnableSingleIPPerCCP --namespace Microsoft.ContainerService
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableSingleIPPerCCP')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Overview of API server IP address whitelisting

The Kubernetes API server is how the underlying Kubernetes APIs are exposed. This component provides the interaction for management tools, such as `kubectl` or the Kubernetes dashboard. AKS provides a single-tenant cluster master, with a dedicated API server. By default, the API server is assigned a public IP address, and you should control access using role-based access controls (RBAC).

To run a more secure AKS cluster, you can enable and use an IP address whitelist. This whitelist only allows defined IP address ranges to communicate with the API server. A request made to the API server from an IP address that is not part of this whitelist is blocked. You should continue to use RBAC to then authorize users and the actions they request.

For more information about the API server and other cluster components, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

## Enable IP address whitelisting

To enable the API server IP address whitelist, you use [az aks update][az-aks-update] command and specify the *--api-server-authorized-ip-ranges* to allow. These IP address ranges are usually address ranges used by your on-premises networks.

The following example enables the API server IP address whitelist on the cluster named *myAKSCluster* in the resource group named *myResourceGroup*. The IP address ranges to add to the whitelist are *172.0.0.10/16* and *168.10.0.10/18*:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges 172.0.0.10/16,168.10.0.10/18
```

## Disable IP address whitelisting

To disable the API server IP address whitelist, you again use [az aks update][az-aks-update] command and specify an empty *--api-server-authorized-ip-ranges* as shown in the following example:

```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --api-server-authorized-ip-ranges ""
```

## Next steps

In this article, you enabled the API server IP address whitelist. This approach is one part of how you can run a secure AKS cluster.

For more information, see [Security concepts for applications and clusters in AKS][concepts-security] and [Best practices for cluster security and upgrades in AKS][operator-best-practices-cluster-security].

<!-- LINKS - external -->
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-list]: /cli/azure/feature#az-feature-list
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-update]: /cli/azure/ext/aks-preview/aks#ext-aks-preview-az-aks-update
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[concepts-security]: concepts-security.md
[operator-best-practices-cluster-security]: operator-best-practices-cluster-security.md