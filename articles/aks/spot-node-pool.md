---
title: Add an Azure Spot node pool to an Azure Kubernetes Service (AKS) cluster
description: Learn how to add an Azure Spot node pool to an Azure Kubernetes Service (AKS) cluster.
ms.topic: article
ms.date: 03/29/2023

#Customer intent: As a cluster operator or developer, I want to learn how to add an Azure Spot node pool to an AKS Cluster.
---

# Add an Azure Spot node pool to an Azure Kubernetes Service (AKS) cluster

A Spot node pool is a node pool backed by an [Azure Spot Virtual machine scale set][vmss-spot]. With Spot VMs in your AKS cluster, you can take advantage of unutilized Azure capacity with significant cost savings. The amount of available unutilized capacity varies based on many factors, such as node size, region, and time of day.

When you deploy a Spot node pool, Azure allocates the Spot nodes if there's capacity available and deploys a Spot scale set that backs the Spot node pool in a single default domain. There's no SLA for the Spot nodes. There are no high availability guarantees. If Azure needs capacity back, the Azure infrastructure will evict the Spot nodes.

Spot nodes are great for workloads that can handle interruptions, early terminations, or evictions. For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates to schedule on a Spot node pool.

In this article, you add a secondary Spot node pool to an existing Azure Kubernetes Service (AKS) cluster.

## Before you begin

* This article assumes a basic understanding of Kubernetes and Azure Load Balancer concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* When you create a cluster to use a Spot node pool, the cluster must use Virtual Machine Scale Sets for node pools and the *Standard* SKU load balancer. You must also add another node pool after you create your cluster, which is covered in this tutorial.
* This article requires that you're running the Azure CLI version 2.14 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### Limitations

The following limitations apply when you create and manage AKS clusters with a Spot node pool:

* A Spot node pool can't be a default node pool, it can only be used as a secondary pool.
* The control plane and node pools can't be upgraded at the same time. You must upgrade them separately or remove the Spot node pool to upgrade the control plane and remaining node pools at the same time.
* A Spot node pool must use Virtual Machine Scale Sets.
* You can't change `ScaleSetPriority` or `SpotMaxPrice` after creation.
* When setting `SpotMaxPrice`, the value must be *-1* or a *positive value with up to five decimal places*.
* A Spot node pool will have the `kubernetes.azure.com/scalesetpriority:spot` label, the taint `kubernetes.azure.com/scalesetpriority=spot:NoSchedule`, and the system pods will have anti-affinity.
* You must add a [corresponding toleration][spot-toleration] and affinity to schedule workloads on a Spot node pool.

## Add a Spot node pool to an AKS cluster

When adding a Spot node pool to an existing cluster, it must be a cluster with multiple node pools enabled. When you create an AKS cluster with multiple node pools enabled, you create a node pool with a `priority` of `Regular` by default. To add a Spot node pool, you must specify `Spot` as the value for `priority`. For more details on creating an AKS cluster with multiple node pools, see [use multiple node pools][use-multiple-node-pools].

* Create a node pool with a `priority` of `Spot` using the [az aks nodepool add][az-aks-nodepool-add] command.

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

In the previous command, the `priority` of `Spot` makes the node pool a Spot node pool. The `eviction-policy` parameter is set to `Delete`, which is the default value. When you set the [eviction policy][eviction-policy] to `Delete`, nodes in the underlying scale set of the node pool are deleted when they're evicted.

You can also set the eviction policy to `Deallocate`, which means that the nodes in the underlying scale set are set to the *stopped-deallocated* state upon eviction. Nodes in the *stopped-deallocated* state count against your compute quota and can cause issues with cluster scaling or upgrading. The `priority` and `eviction-policy` values can only be set during node pool creation. Those values can't be updated later.

The previous command also enables the [cluster autoscaler][cluster-autoscaler], which we recommend using with Spot node pools. Based on the workloads running in your cluster, the cluster autoscaler scales the number of nodes up and down. For Spot node pools, the cluster autoscaler will scale up the number of nodes after an eviction if more nodes are still needed. If you change the maximum number of nodes a node pool can have, you also need to adjust the `maxCount` value associated with the cluster autoscaler. If you don't use a cluster autoscaler, upon eviction, the Spot pool will eventually decrease to *0* and require manual operation to receive any additional Spot nodes.

> [!IMPORTANT]
> Only schedule workloads on Spot node pools that can handle interruptions, such as batch processing jobs and testing environments. We recommend you set up [taints and tolerations][taints-tolerations] on your Spot node pool to ensure that only workloads that can handle node evictions are scheduled on a Spot node pool. For example, the above command adds a taint of `kubernetes.azure.com/scalesetpriority=spot:NoSchedule`, so only pods with a corresponding toleration are scheduled on this node.

### Verify the Spot node pool

* Verify your node pool has been added using the [`az aks nodepool show`][az-aks-nodepool-show] command and confirming the `scaleSetPriority` is `Spot`.

    ```azurecli
    az aks nodepool show --resource-group myResourceGroup --cluster-name myAKSCluster --name spotnodepool
    ```

### Schedule a pod to run on the Spot node

To schedule a pod to run on a Spot node, you can add a toleration and node affinity that corresponds to the taint applied to your Spot node.

The following example shows a portion of a YAML file that defines a toleration corresponding to the `kubernetes.azure.com/scalesetpriority=spot:NoSchedule` taint and a node affinity corresponding to the `kubernetes.azure.com/scalesetpriority=spot` label used in the previous step.

```yaml
spec:
  containers:
  - name: spot-example
  tolerations:
  - key: "kubernetes.azure.com/scalesetpriority"
    operator: "Equal"
    value: "spot"
    effect: "NoSchedule"
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: "kubernetes.azure.com/scalesetpriority"
            operator: In
            values:
            - "spot"
   ...
```

When you deploy a pod with this toleration and node affinity, Kubernetes will successfully schedule the pod on the nodes with the taint and label applied.

## Upgrade a Spot node pool

When you upgrade a Spot node pool, AKS internally issues a cordon and an eviction notice, but no drain is applied. There are no surge nodes available for Spot node pool upgrades. Outside of these changes, the behavior when upgrading Spot node pools is consistent with that of other node pool types.

For more information on upgrading, see [Upgrade an AKS cluster][upgrade-cluster].

## Max price for a Spot pool

[Pricing for Spot instances is variable][pricing-spot], based on region and SKU. For more information, see pricing information for [Linux][pricing-linux] and [Windows][pricing-windows].

With variable pricing, you have the option to set a max price, in US dollars (USD) using up to five decimal places. For example, the value *0.98765* would be a max price of *$0.98765 USD per hour*. If you set the max price to *-1*, the instance won't be evicted based on price. As long as there's capacity and quota available, the price for the instance will be the lower price of either the current price for a Spot instance or for a standard instance.

## Next steps

In this article, you learned how to add a Spot node pool to an AKS cluster. For more information about how to control pods across node pools, see [Best practices for advanced scheduler features in AKS][operator-best-practices-advanced-scheduler].

<!-- LINKS - Internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az_aks_nodepool_show
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
[upgrade-cluster]: upgrade-cluster.md
