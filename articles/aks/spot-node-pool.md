---
title: Add a spot node pool to an Azure Kubernetes Service (AKS) cluster
description: Learn how to add a spot node pool to an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.service: container-service
ms.topic: article
ms.date: 10/19/2020

#Customer intent: As a cluster operator or developer, I want to learn how to add a spot node pool to an AKS Cluster.
---

# Add a spot node pool to an Azure Kubernetes Service (AKS) cluster

A spot node pool is a node pool backed by a [spot virtual machine scale set][vmss-spot]. Using spot VMs for nodes with your AKS cluster allows you to take advantage of unutilized capacity in Azure at a significant cost savings. The amount of available unutilized capacity will vary based on many factors, including node size, region, and time of day.

When deploying a spot node pool, Azure will allocate the spot nodes if there's capacity available. But there's no SLA for the spot nodes. A spot scale set that backs the spot node pool is deployed in a single fault domain and offers no high availability guarantees. At any time when Azure needs the capacity back, the Azure infrastructure will evict spot nodes.

Spot nodes are great for workloads that can handle interruptions, early terminations, or evictions. For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates to be scheduled on a spot node pool.

In this article, you add a secondary spot node pool to an existing Azure Kubernetes Service (AKS) cluster.

This article assumes a basic understanding of Kubernetes and Azure Load Balancer concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Before you begin

When you create a cluster to use a spot node pool, that cluster must also use Virtual Machine Scale Sets for node pools and the *Standard* SKU load balancer. You must also add an additional node pool after you create your cluster to use a spot node pool. Adding an additional node pool is covered in a later step.

This article requires that you are running the Azure CLI version 2.14 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Limitations

The following limitations apply when you create and manage AKS clusters with a spot node pool:

* A spot node pool can't be the cluster's default node pool. A spot node pool can only be used for a secondary pool.
* You can't upgrade a spot node pool since spot node pools can't guarantee cordon and drain. You must replace your existing spot node pool with a new one to do operations such as upgrading the Kubernetes version. To replace a spot node pool, create a new spot node pool with a different version of Kubernetes, wait until its status is *Ready*, then remove the old node pool.
* The control plane and node pools cannot be upgraded at the same time. You must upgrade them separately or remove the spot node pool to upgrade the control plane and remaining node pools at the same time.
* A spot node pool must use Virtual Machine Scale Sets.
* You cannot change ScaleSetPriority or SpotMaxPrice after creation.
* When setting SpotMaxPrice, the value must be -1 or a positive value with up to five decimal places.
* A spot node pool will have the label *kubernetes.azure.com/scalesetpriority:spot*, the taint *kubernetes.azure.com/scalesetpriority=spot:NoSchedule*, and system pods will have anti-affinity.
* You must add a [corresponding toleration][spot-toleration] to schedule workloads on a spot node pool.

## Add a spot node pool to an AKS cluster

You must add a spot node pool to an existing cluster that has multiple node pools enabled. More details on creating an AKS cluster with multiple node pools are available [here][use-multiple-node-pools].

Create a node pool using the [az aks nodepool add][az-aks-nodepool-add].
```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name spotnodepool \
    --priority Spot \
    --eviction-policy Delete \
    --spot-max-price -1 \
    --enable-cluster-autoscaler \
    --min-count 1 \
    --max-count 3 \
    --no-wait
```

By default, you create a node pool with a *priority* of *Regular* in your AKS cluster when you create a cluster with multiple node pools. The above command adds an auxiliary node pool to an existing AKS cluster with a *priority* of *Spot*. The *priority* of *Spot* makes the node pool a spot node pool. The *eviction-policy* parameter is set to *Delete* in the above example, which is the default value. When you set the [eviction policy][eviction-policy] to *Delete*, nodes in the underlying scale set of the node pool are deleted when they're evicted. You can also set the eviction policy to *Deallocate*. When you set the eviction policy to *Deallocate*, nodes in the underlying scale set are set to the stopped-deallocated state upon eviction. Nodes in the stopped-deallocated state count against your compute quota and can cause issues with cluster scaling or upgrading. The *priority* and *eviction-policy* values can only be set during node pool creation. Those values can't be updated later.

The command also enables the [cluster autoscaler][cluster-autoscaler], which is recommended to use with spot node pools. Based on the workloads running in your cluster, the cluster autoscaler scales up and scales down the number of nodes in the node pool. For spot node pools, the cluster autoscaler will scale up the number of nodes after an eviction if additional nodes are still needed. If you change the maximum number of nodes a node pool can have, you also need to adjust the `maxCount` value associated with the cluster autoscaler. If you do not use a cluster autoscaler, upon eviction, the spot pool will eventually decrease to zero and require a manual operation to receive any additional spot nodes.

> [!Important]
> Only schedule workloads on spot node pools that can handle interruptions, such as batch processing jobs and testing environments. It is recommended that you set up [taints and tolerations][taints-tolerations] on your spot node pool to ensure that only workloads that can handle node evictions are scheduled on a spot node pool. For example, the above command ny default adds a taint of *kubernetes.azure.com/scalesetpriority=spot:NoSchedule* so only pods with a corresponding toleration are scheduled on this node.

## Verify the spot node pool

To verify your node pool has been added as a spot node pool:

```azurecli
az aks nodepool show --resource-group myResourceGroup --cluster-name myAKSCluster --name spotnodepool
```

Confirm *scaleSetPriority* is *Spot*.

To schedule a pod to run on a spot node, add a toleration that corresponds to the taint applied to your spot node. The following example shows a portion of a yaml file that defines a toleration that corresponds to a *kubernetes.azure.com/scalesetpriority=spot:NoSchedule* taint used in the previous step.

```yaml
spec:
  containers:
  - name: spot-example
  tolerations:
  - key: "kubernetes.azure.com/scalesetpriority"
    operator: "Equal"
    value: "spot"
    effect: "NoSchedule"
   ...
```

When a pod with this toleration is deployed, Kubernetes can successfully schedule the pod on the nodes with the taint applied.

## Max price for a spot pool
[Pricing for spot instances is variable][pricing-spot], based on region and SKU. For more information, see pricing for [Linux][pricing-linux] and [Windows][pricing-windows].

With variable pricing, you have option to set a max price, in US dollars (USD), using up to 5 decimal places. For example, the value *0.98765* would be a max price of $0.98765 USD per hour. If you set the max price to *-1*, the instance won't be evicted based on price. The price for the instance will be the current price for Spot or the price for a standard instance, whichever is less, as long as there is capacity and quota available.

## Next steps

In this article, you learned how to add a spot node pool to an AKS cluster. For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

<!-- LINKS - External -->
[kubernetes-services]: https://kubernetes.io/docs/concepts/services-networking/service/

<!-- LINKS - Internal -->
[aks-support-policies]: support-policies.md
[aks-faq]: faq.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[cluster-autoscaler]: cluster-autoscaler.md
[eviction-policy]: ../virtual-machine-scale-sets/use-spot.md#eviction-policy
[kubernetes-concepts]: concepts-clusters-workloads.md
[operator-best-practices-advanced-scheduler]: operator-best-practices-advanced-scheduler.md
[pricing-linux]: https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/linux/
[pricing-spot]: ../virtual-machine-scale-sets/use-spot.md#pricing
[pricing-windows]: https://azure.microsoft.com/pricing/details/virtual-machine-scale-sets/windows/
[spot-toleration]: #verify-the-spot-node-pool
[taints-tolerations]: operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations
[use-multiple-node-pools]: use-multiple-node-pools.md
[vmss-spot]: ../virtual-machine-scale-sets/use-spot.md