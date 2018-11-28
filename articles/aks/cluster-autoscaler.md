---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your cluster to meet application demands in an Azure Kubernetes Service (AKS) cluster.
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 12/03/2018
ms.author: iainfou
---

# Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)

To keep up with application demands in Azure Kubernetes Service (AKS), you may need to adjust the number of nodes that run your workloads. The cluster autoscaler component can watch for pods in your cluster that can't be scheduled due to resource constraints. When issues are detected, the number of nodes is increased to meet the application demand. Nodes are also regularly checked for a lack of running pods, with the number of nodes then decreased as needed. This ability to automatically scale up or down the number of nodes in your AKS cluster lets you run an efficient, cost-effective cluster.

This article shows you how to enable and manage the cluster autoscaler in an AKS cluster.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## Before you begin

This article requires that you are running the Azure CLI version 2.0.49 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

AKS clusters that support the cluster autoscaler must use virtual machine scale sets and run Kubernetes version *1.12.x* or later. This scale set support is in preview. To opt-in and create clusters that use scale sets, install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, as shown in the following example:

```azurecli-interactive
az extension add --name aks-preview
```

When you install the *aks-preview* extension, every AKS cluster you create uses the scale set preview deployment model. To opt-out and create regular, fully-supported clusters, remove the extension using `az extension remove --name aks-preview`.

## About the cluster autoscaler

To adjust to changing application demands, such as between the workday and evening or on a weekend, clusters often need a way to automatically scale. AKS clusters can scale in one of two ways:

* The **cluster autoscaler** watches for pods that cannot be scheduled on nodes due to resource constraints, and automatically increases the number of nodes.
* The **horizontal pod autoscaler** uses the Metrics Server in a Kubernetes cluster to monitor the resource demand of pods. If a service needs more resources, the number of pods is automatically increased to meet the demand.

![The cluster autoscaler and horizontal pod autoscaler often work together to support the required application demands](media/autoscaler/cluster-autoscaler.png)

Both the horizontal pod autoscaler and cluster autoscaler can also then decrease the number of pods and nodes as needed. The two autoscalers can work together, and are often both deployed in a cluster. When combined, the horizontal pod autoscaler is focused on running the number of pods required to meet application demand, and the cluster autoscaler is focused on running the number of nodes required to support the scheduled pods.

> [!NOTE]
> Manual scaling is disabled when you use the cluster autoscaler. Let the cluster autoscaler determine the required number of nodes. If you want to manually scale your cluster, [disable the cluster autoscaler](#disable-the-cluster-autoscaler).

## Create an AKS cluster and enable the cluster autoscaler

If you need to create an AKS cluster, use the [az aks create][az-aks-create] command. Specify a *--kubernetes-version* that meets or exceeds the minimum version number required as outlined in the preceding [Before you begin](#before-you-begin) section. To enabled and configure the cluster autoscaler, use the *--enable-cluster-autoscaler* parameter, and specify a node *--min-count* and *--max-count*.

The following example creates an AKS cluster with cluster autoscaler enabled that uses a minimum of *1* and maximum of *5* nodes:

```azurecli-interactive
# First create a resource group
az group create --name myResourceGroup --location eastus

# Now create the AKS cluster and enable the cluster autoscaler
az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --kubernetes-version 1.12 \
  --node-count 1 \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

It takes a few minutes to create the cluster and configure the cluster autoscaler settings.

### Enable the cluster autoscaler on an existing AKS cluster

You can enable the cluster autoscaler on an existing AKS cluster that meets the requirements as outlined in the preceding [Before you begin](#before-you-begin) section. Use the [az aks update][az-aks-update] command and choose to *--enable-cluster-autoscaler*, then specify a node *--min-count* and *--max-count*. The following example enables cluster autoscaler on an existing cluster that uses a minimum of *1* and maximum of *5* nodes:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --enable-cluster-autoscaler \
  --min-count 1 \
  --max-count 5
```

If the minimum node count is greater than the existing number of nodes in the cluster, it takes a few minutes to create the additional nodes.

## Change the cluster autoscaler settings

In the previous step to create or update an existing AKS cluster, the cluster autoscaler minimum node count was set to *1*, and the maximum node count was set to *5*. As your application demands change, you may need to adjust the cluster autoscaler node count.

To change the node count, use the [az aks update][az-aks-update] command and specify a minimum and maximum value. The following example sets the *--min-count* to *1* and the *--max-count* to *10*:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --update-cluster-autoscaler \
  --min-count 1 \
  --max-count 10
```

> [!NOTE]
> During preview, you cannot set a higher minimum node count than is currently set for the cluster. For example, if you currently have min count set to *1*, you cannot update the min count to *3*.

Monitor the performance of your applications and services, and adjust the cluster autoscaler node counts to match the required performance.

## Disable the cluster autoscaler

If you no longer wish to use the cluster autoscaler, you can disable it using the [az aks update][az-aks-update] command. Nodes are not removed when the cluster autoscaler is disabled.

To remove the cluster autoscaler, specify the *--disable-cluster-autoscaler* parameter, as shown in the following example:

```azurecli-interactive
az aks update \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --disable-cluster-autoscaler
```

You can manually scale your cluster using the [az aks scale][az-aks-scale] command. If you use the horizontal pod autoscaler, that feature continues to run with the cluster autoscaler disabled, but pods may end up unable to be scheduled if the node resources are all in use.

## Next steps

This article showed you how to automatically scale the number of AKS nodes. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][aks-scale-apps].

<!-- LINKS - internal -->
[aks-upgrade]: upgrade-cluster.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[aks-scale-apps]: tutorial-kubernetes-scale.md
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-scale]: /cli/azure/aks#az-aks-scale

<!-- LINKS - external -->
[az-aks-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/
