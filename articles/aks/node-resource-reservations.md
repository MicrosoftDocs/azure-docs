---
title: Node resource reservations in Azure Kubernetes Service (AKS)
description: Learn about node resource reservations in Azure Kubernetes Service (AKS).
ms.topic: how-to
ms.service: azure-kubernetes-service
ms.date: 04/16/2024
ms.author: schaffererin
author: schaffererin
---

# Node resource reservations in Azure Kubernetes Service (AKS)

In this article, you learn about node resource reservations in Azure Kubernetes Service (AKS).

## Resource reservations

AKS uses node resources to help the nodes function as part of the cluster. This usage can cause a discrepancy between the node's total resources and the allocatable resources in AKS.

AKS reserves two types of resources, **CPU** and **memory**, on each node to maintain node performance and functionality. As a node grows larger in resources, the resource reservations also grow due to a higher need for management of user-deployed pods. Keep in mind that you can't change resource reservations on a node.

### CPU reservations

Reserved CPU is dependent on node type and cluster configuration, which might result in less allocatable CPU due to running extra features. The following table shows CPU reservations in millicores:

| CPU cores on host | 1 core | 2 cores | 4 cores | 8 cores | 16 cores | 32 cores | 64 cores |
| ----------------- | ------ | ------- | ------- | ------- | -------- | -------- | -------- |
| Kube-reserved CPU (millicores) | 60 | 100 | 140 | 180 | 260 | 420 | 740 |

### Memory reservations

In AKS, reserved memory consists of the sum of two values:

**AKS 1.29 and later**

* **`kubelet` daemon** has the *memory.available < 100 Mi* eviction rule by default. This rule ensures that a node has at least 100 Mi allocatable at all times. When a host is below that available memory threshold, the `kubelet` triggers the termination of one of the running pods and frees up memory on the host machine.
* **A rate of memory reservations** set according to the lesser value of: *20 MB * Max Pods supported on the Node + 50 MB* or *25% of the total system memory resources*.

    **Examples**:
    * If the virtual machine (VM) provides 8 GB of memory and the node supports up to 30 pods, AKS reserves *20 MB * 30 Max Pods + 50 MB = 650 MB* for kube-reserved. `Allocatable space = 8 GB - 0.65 GB (kube-reserved) - 0.1 GB (eviction threshold) = 7.25 GB or 90.625% allocatable.`
    * If the VM provides 4 GB of memory and the node supports up to 70 pods, AKS reserves *25% * 4 GB = 1000 MB* for kube-reserved, as this is less than *20 MB * 70 Max Pods + 50 MB = 1450 MB*.

    For more information, see [Configure maximum pods per node in an AKS cluster][maximum-pods].

**AKS versions prior to 1.29**

* **`kubelet` daemon** has the *memory.available < 750 Mi* eviction rule by default. This rule ensures that a node has at least 750 Mi allocatable at all times. When a host is below that available memory threshold, the `kubelet` triggers the termination of one of the running pods and free up memory on the host machine.
* **A regressive rate of memory reservations** for the kubelet daemon to properly function (*kube-reserved*).
    * 25% of the first 4 GB of memory
    * 20% of the next 4 GB of memory (up to 8 GB)
    * 10% of the next 8 GB of memory (up to 16 GB)
    * 6% of the next 112 GB of memory (up to 128 GB)
    * 2% of any memory more than 128 GB

> [!NOTE]
> AKS reserves an extra 2 GB for system processes in Windows nodes that isn't part of the calculated memory.

Memory and CPU allocation rules are designed to:

* Keep agent nodes healthy, including some hosting system pods critical to cluster health.
* Cause the node to report less allocatable memory and CPU than it would report if it weren't part of a Kubernetes cluster.

For example, if a node offers 7 GB, it reports 34% of memory not allocatable including the 750 Mi hard eviction threshold.

`0.75 + (0.25*4) + (0.20*3) = 0.75 GB + 1 GB + 0.6 GB = 2.35 GB / 7 GB = 33.57% reserved`

In addition to reservations for Kubernetes itself, the underlying node OS also reserves an amount of CPU and memory resources to maintain OS functions.

For associated best practices, see [Best practices for basic scheduler features in AKS][operator-best-practices-scheduler].

## Next steps

<!---LINKS--->
[operator-best-practices-scheduler]: operator-best-practices-scheduler.md
[maximum-pods]: concepts-network-ip-address-planning.md#maximum-pods-per-node
