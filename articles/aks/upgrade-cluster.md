---
title: Upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to upgrade an Azure Kubernetes Service (AKS) cluster
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 02/12/2019
ms.author: iainfou
---

# Upgrade an Azure Kubernetes Service (AKS) cluster

As part of the lifecycle of an AKS cluster, you often need to upgrade to the latest Kubernetes version. It is important you apply the latest Kubernetes security releases, or upgrade to get the latest features. This article shows you how to upgrade the master components or a single, default node pool in an AKS cluster.

For AKS clusters that use multiple node pools or Windows Server nodes (both currently in preview in AKS), see [Upgrade a node pool in AKS][nodepool-upgrade].

## Before you begin

This article requires that you are running the Azure CLI version 2.0.56 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Check for available AKS cluster upgrades

To check which Kubernetes releases are available for your cluster, use the [az aks get-upgrades][az-aks-get-upgrades] command. The following example checks for available upgrades to the cluster named *myAKSCluster* in the resource group named *myResourceGroup*:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
```

> [!NOTE]
> When you upgrade an AKS cluster, Kubernetes minor versions cannot be skipped. For example, upgrades between *1.10.x* -> *1.11.x* or *1.11.x* -> *1.12.x* are allowed, however *1.10.x* -> *1.12.x* is not.
>
> To upgrade, from *1.10.x* -> *1.12.x*, first upgrade from *1.10.x* -> *1.11.x*, then upgrade from *1.11.x* -> *1.12.x*.

The following example output shows that the cluster can be upgraded to version *1.11.5* or *1.11.6*:

```console
Name     ResourceGroup    MasterVersion    NodePoolVersion    Upgrades
-------  ---------------  ---------------  -----------------  --------------
default  myResourceGroup  1.10.12          1.10.12            1.11.5, 1.11.6
```

## Upgrade an AKS cluster

With a list of available versions for your AKS cluster, use the [az aks upgrade][az-aks-upgrade] command to upgrade. During the upgrade process, AKS adds a new node to the cluster, then carefully [cordon and drains][kubernetes-drain] one node at a time to minimize disruption to running applications. The following example upgrades a cluster to version *1.11.6*:

```azurecli-interactive
az aks upgrade --resource-group myResourceGroup --name myAKSCluster --kubernetes-version 1.11.6
```

It takes a few minutes to upgrade the cluster, depending on how many nodes you have.

To confirm that the upgrade was successful, use the [az aks show][az-aks-show] command:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --output table
```

The following example output shows that the cluster now runs *1.11.6*:

```json
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ---------------------------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.11.6               Succeeded            myaksclust-myresourcegroup-19da35-90efab95.hcp.eastus.azmk8s.io
```

## Next steps

This article showed you how to upgrade an existing AKS cluster. To learn more about deploying and managing AKS clusters, see the set of tutorials.

> [!div class="nextstepaction"]
> [AKS tutorials][aks-tutorial-prepare-app]

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-upgrades]: /cli/azure/aks#az-aks-get-upgrades
[az-aks-upgrade]: /cli/azure/aks#az-aks-upgrade
[az-aks-show]: /cli/azure/aks#az-aks-show
[nodepool-upgrade]: upgrade-cluster.md
