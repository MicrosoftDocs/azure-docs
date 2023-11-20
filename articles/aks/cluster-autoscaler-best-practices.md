---
title: Cluster autoscaler best practices for Azure Kubernetes Service (AKS)
titleSuffix: Azure Kubernetes Service
description: Learn the AKS cluster autoscaler best practices and special considerations.
ms.topic: conceptual
ms.date: 11/20/2023
---

# Cluster autoscaler best practices for Azure Kubernetes Service (AKS)

The cluster autoscaler is a Kubernetes component that automatically adjusts the size of a Kubernetes cluster so that all pods have a place to run and there are no unneeded nodes. The cluster autoscaler is enabled by default in AKS clusters. This article provides best practices and special considerations for using the cluster autoscaler with AKS.

In this article, you learn about:

> [!div class="checklist"]
>
> * Optimizing the cluster autoscaler profile to meet your workload needs.
> * Common issues and mitigation recommendations.
> * Using availability zones with the cluster autoscaler.
> * Cluster autoscaler limitations.

## General best practices and considerations

* When implementing **availability zones with the cluster autoscaler**, we recommend using a single node pool for each zone. You can set the `--balance-similar-node-groups` parameter to `True` to maintain a balanced distribution of nodes across zones for your workloads during scale up operations. When this approach isn't implemented, scale down operations can disrupt the balance of nodes across zones.
* For **clusters with more than 400 nodes**, we recommend using Azure CNI or Azure CNI Overlay.
* To **effectively run workloads concurrently on both Spot and Fixed node pools**, consider using [*priority expanders*](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders). This approach allows you to schedule pods based on the priority of the node pool.
* For **clusters concurrently hosting both long-running workloads, like web apps, and short/bursty job workloads**, we recommend separating them into distinct node pools with [Affinity Rules/expanders](./operator-best-practices-advanced-scheduler.md#node-affinity) or using [PriorityClass](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) to help prevent unnecessary node drain or scale down operations.
* We **don't recommend making direct changes to nodes in autoscaled node pools**. All nodes in the same node group should have uniform capacity, labels, and system pods running on them.
* **Nodes don't scale up if pods have a PriorityClass value below -10. Priority -10 is reserved for [overprovisioning pods](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-can-i-configure-overprovisioning-with-cluster-autoscaler). For more information, see [Using the cluster autoscaler with Pod Priority and Preemption](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-cluster-autoscaler-work-with-pod-priority-and-preemption).
* **Don't combine other node autoscaling mechanisms**, such as Virtual Machine Scale Set autoscalers, with the cluster autoscaler.
* The cluster autoscaler **might be unable to scale down if pods can't move, such as in the following situations**:
  * A directly-created pod not backed by a controller object, such as a Deployment or ReplicaSet.
  * A pod disruption budget (PDB) that's too restrictive and doesn't allow the number of pods to fall below a certain threshold.
  * A pod uses node selectors or anti-affinity that can't be honored if scheduled on a different node.
    For more information, see [What types of pods can prevent the cluster autoscaler from removing a node?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-types-of-pods-can-prevent-ca-from-removing-a-node).

> [!NOTE]
> Cluster autoscaler performance is directly tied to certain factors, such as the number of nodes, node pools, the cluster autoscaler profile, affinity rules, and PDBs. The effects on performance becomes more pronounced at higher scales.

## Optimizing the cluster autoscaler profile

You should fine-tune the cluster autoscaler profile settings according to your specific workload scenarios while also considering tradeoffs between performance and cost. This section provides examples that demonstrate those tradeoffs.

It's important to note that the cluster autoscaler profile settings are cluster-wide and applied to all autoscale-enabled node pools. Any scaling actions that take place in one node pool can affect the autoscaling behavior of other node pools, which can lead to unexpected results. Make sure you apply consistent and synchronized profile configurations across all relevant node pools to ensure you get your desired results.

### Example 1: Optimizing for performance

For clusters that handle substantial and bursty workloads with a primary focus on performance, we recommend increasing the scan interval and decreasing the utilization threshold. These settings help batch multiple scaling operations into a single call, optimizing scaling time and the utilization of compute read/write quotas. It also helps mitigate the risk of swift scale down operations on underutilized nodes, enhancing the pod scheduling efficiency.

For clusters with daemonset pods, we recommend setting `ignore-daemonset-utilization` to `true`, which effectively ignores node utilization by daemonset pods and minimizes unnecessary scale down operations.

### Example 2: Optimizing for cost

If you want a cost-optimized profile, we recommend setting the following parameter configurations:

* Reduce `scale-down-unneeded-time`, which is the amount of time a node should be unneeded before it's eligible for scale down.
* Reduce `scale-down-delay-after-add`, which is the amount of time to wait after a node is added before considering it for scale down.
* Increase `scale-down-utilization-threshold`, which is the utilization threshold for removing nodes.
* Increase `max-empty-bulk-delete`, which is the maximum number of nodes that can be deleted in a single call.

## Flags that impact scaling behavior

### Flags impacting scale up

The following flags can impact cluster autoscaler scale up behavior:

| Flag | Description | Default value |
|--------------|--------------|---------------------|
| `scan-interval` | The amount of time between scans for pending pods. | 10 seconds |
| `balance-similar-node-groups` | When set to `true`, the cluster autoscaler attempts to maintain a balanced distribution of nodes across zones for your workloads during scale up operations. When this approach isn't implemented, scale down operations can disrupt the balance of nodes across zones. |  |
| `expander` | The expander is responsible for selecting the most optimal node for a pod. | `priority` |
| `new-pod-scale-up-delay` | The amount of time to wait before considering a pod for scale up. | 10 seconds |
| `max-node-provision-time` | The maximum amount of time to wait for a node to be created. | 15 minutes |
| `ok-total-unready-count` | The maximum number of pods that can be unready before a node is considered for scale up. | 10 |
| `max-total-unready-percentage` | The maximum percentage of pods that can be unready before a node is considered for scale up. | 10 |

For more information, see [How does scale up work?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-up-work)

### Flags impacting scale down

The following flags can impact cluster autoscaler scale down behavior:

| Flag | Description | Default value |
|--------------|--------------|---------------------|
| `scan-interval` | The amount of time between scans for pending pods. | 10 seconds |
| `scale-down-delay-after-add` | The amount of time to wait after a node is added before considering it for scale down. | 10 minutes |
| `scale-down-delay-after-delete` | The amount of time to wait after a node is deleted before considering it for scale down. | 10 seconds |
| `scale-down-delay-after-failure` | The amount of time to wait after a node fails to be deleted before considering it for scale down. | 3 minutes |
| `scale-down-unneeded-time` | The amount of time a node should be unneeded before it's eligible for scale down. | 10 minutes |
| `scale-down-unready-time` | The amount of time a node should be unready before it's eligible for scale down. | 20 minutes |
| `max-graceful-termination-sec` | The maximum amount of time to wait for a pod to terminate gracefully. | 600 seconds |
| `skip-nodes-with-local-storage` | When set to `true`, the cluster autoscaler skips nodes with local storage when scaling down. | `false` |
| `skip-nodes-with-system-pods` | When set to `true`, the cluster autoscaler skips nodes with system pods when scaling down. | `false` |
| `max-empty-bulk-delete` | The maximum number of nodes that can be deleted in a single call. | 10 |
| `max-total-unready-percentage` | The maximum percentage of pods that can be unready before a node is considered for scale down. | 10 |
| `ok-total-unready-count` | The maximum number of pods that can be unready before a node is considered for scale down. | 10 |
| `scale-down-utlization-threshold` | The utilization threshold for removing nodes. | 50 |

For more information, see [How does scale down work?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-down-work)

## Common issues and mitigation recommendations

### Not triggering scale up operations

| Common causes | Mitigation recommendations |
|--------------|--------------|
| **PersistentVolume node affinity conflicts**, which can arise when using the cluster autoscaler with multiple availability zones or when a pod's or persistent volume's zone differs from the node's zone. | Use one node pool per availability zone and enabling `--balance-similar-node-groups`. You can also [set the `volumeBindingMode` field to `WaitForFirstConsumer` in the pod specification to prevent the volume from being bound to a node until a pod using the volume is created](./azure-disk-csi.md#create-a-custom-storage-class). |
| **Taints and Tolerations node affinity conflicts** | Assess the taints assigned to your nodes and review the tolerations defined in your pods. If necessary, [make adjustments to the taints and tolerations to ensure that your pods can be efficiently scheduled on your nodes](./operator-best-practices-advanced-scheduler.md#provide-dedicated-nodes-using-taints-and-tolerations). |

### Scale up operation failures

| Common causes | Mitigation recommendations |
|--------------|--------------|
| **IP address exhaustion in the subnet** | Add another subnet in the same virtual network and add another node pool into the new subnet. |
| **Core quota exhaustion** | [Request a quota increase][LINK]. |
| **Max size of node pool** | Increase the max nodes on the node pool or create a new node pool. |
| **Image unavailable in the region** | TBD |
| **Concurrent request conflicts** | TBD |
| **Requests/Calls exceeding the rate limit** | See [429 Too Many Requests errors](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors). |
| **Virtual machine extension/provisioning failures/ScaleUpTimedOut** | TBD |

### Scale down operation failures

| Common causes | Mitigation recommendations |
|--------------|--------------|
| **Pod preventing node drain/Unable to evict pod** | For pods using local storage, such as hostPath and emptyDir, set the cluster autoscaler profile flag `skip-nodes-with-local-storage` to `true`. In the pod specification, set the `cluster-autoscaler.kubernetes.io/safe-to-evict` annotation to `false`. You can also check the PDBs. |
| **Min size of node pool** | Reduce the minimum size of the node pool. |
| **Requests/Calls exceeding the rate limit** | See [429 Too Many Requests errors](/troubleshoot/azure/azure-kubernetes/429-too-many-requests-errors). |
| **Write operations locked** | Don't make any changes to the [fully-managed AKS resource group](./cluster-configuration.md#fully-managed-resource-group-preview). Remove or reset any resource locks you previously applied to the resource group. |

### Other issues

| Common causes | Mitigation recommendations |
|--------------|--------------|
| **PriorityConfigMapNotMatchedGroup** | Make sure that you [add all the node groups requiring autoscaling to the expander configuration file](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/expander/priority/readme.md#configuration). |
| **Node pool in backoff**, which was first implemented in version 0.6.2 and causes the cluster autoscaler to back off from scaling up a node group after a failure. Depending on how long the scale up operations have been experiencing failures, it may take wait up to 30 minutes before making another attempt. | Reset the node pool's backoff state by disabling and then re-enabling autoscaling. |
