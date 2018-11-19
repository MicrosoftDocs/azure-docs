---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your cluster to meet application demands in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 11/28/2018
ms.author: iainfou
---

# Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)

As you run applications in Azure Kubernetes Service (AKS), the cluster autoscaler component can automatically adjust the number of nodes needed to run those workloads. The cluster autoscaler watches for pending pods on your nodes that can't be scheduled due to resource constraints, and increases the number of nodes required to support the application demand. The cluster is also checked for nodes that don't have pods scheduled on them, and decreases the number of nodes as need. This ability to automatically scale up or down the number of nodes in your AKS cluster lets you run an efficient, cost-effective cluster that only runs the number of nodes required.

This article shows you how to enable and manage the cluster autoscaler in an AKS cluster.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

If you don't have an AKS cluster, the first step in this article shows you how to create one. If you have an existing AKS cluster, it must meet the following requirements:

* AKS cluster created after *INSERT DATE OF DEFAULT VMSS CLUSTER CREATION*. AKS clusters created after this date automatically use virtual machine scale sets for the node resources.
  * Your AKS cluster must run Kubernetes version 1.10.7 or later. If your cluster runs an older Kubernetes version, see [Upgrade an AKS cluster][aks-upgrade].

This article requires that you are running the Azure CLI version 2.0.49 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

The *aks-preview* Azure CLI extension must also be installed using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add -n aks-preview
```

## About the cluster autoscaler

Applications in AKS clusters can scale in one of two ways:

* The **cluster autoscaler** watches for pods that cannot be scheduled on nodes due to resource constraints, and automatically increases the number of nodes.
* The **horizontal pod autoscaler** uses the Metrics Server in a Kubernetes cluster to monitor the resource demand of pods. If a service needs more resources, the number of pods is automatically increased to meet the demand.

![The cluster autoscaler and horizontal pod autoscaler often work together to support the required application demands](media/autoscaler/cluster-autoscaler.png)

Both the horizontal pod autoscaler and cluster autoscaler also then decrease the number of pods and nodes as needed. The two autoscalers can work together, and are often both deployed in a cluster.

## Create or update an AKS cluster

If you need to create an AKS cluster, use the [az aks create][az-aks-create] command. Specify a **--kubernetes-version** that meets or exceeds the minimum version number required as outlined in the preceding [Before you begin](#before-you-begin) section. To configure the cluster autoscaler when the AKS cluster is created, use the *--enable-cluster-autoscaler* parameter, and specify a node *--min-count* and *--max-count*. The following example creates an AKS cluster with cluster autoscaler enabled that uses a minimum of *1* and maximum of *5* nodes:

```azurecli-interactive
az aks create --resource-group myResourceGroup \
  --name myAKSCluster \
  --kubernetes-version 1.11.4 \
  --node-count 1 \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

It takes a few minutes to create the cluster and configure the cluster autoscaler settings.

### Enable cluster autoscale on an existing AKS cluster

You can enable cluster autoscale on an existing AKS cluster that meets the requirements as outlined in the preceding [Before you begin](#before-you-begin) section. Use the [az aks update][az-aks-update] command and choose to *--enable-cluster-autoscaler*, then specify a node *--min-count* and *--max-count*. The following example enables cluster autoscaler on an existing cluster that uses a minimum of *1* and maximum of *5* nodes:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

## Change cluster autoscaler settings

In the previous step to create or update an existing AKS cluster, the cluster autoscaler minimum node count was set to *1*, and the maximum node count was set to *5*. As your application demands change, you may need to adjust the cluster autoscaler node counts.

To change the node count, use the [az aks update][az-aks-update] command and specify a minimum and maximum value. The following example sets the *--min-count* to *3* and the *--max-count* to *10*:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --update-cluster-autoscaler \
  --min-count 3 \
  --max-count 10
```

## Disable cluster autoscaler

If you no longer wish to use the cluster autoscaler, you can disable it using the [az aks update][az-aks-update] command. Nodes are not removed when the cluster autoscaler is disabled.

To remove the cluster autoscaler, specify the *--disable-cluster-autoscaler* parameter, as shown in the following example:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --disable-cluster-autoscaler
```

## Next steps

This article showed you how to automatically scale the number of AKS nodes. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][aks-scale-apps].

<!-- LINKS - internal -->
[aks-upgrade]: upgrade-cluster.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[aks-scale-apps]: tutorial-kubernetes-scale.md

<!-- LINKS - external -->
[az-aks-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
