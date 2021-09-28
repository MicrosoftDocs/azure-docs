---
title: Best practices for scheduler features
titleSuffix: Azure Kubernetes Service
description: Learn the cluster operator best practices for using advanced scheduler features such as taints and tolerations, node selectors and affinity, or inter-pod affinity and anti-affinity in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: conceptual
ms.date: 03/09/2021
 
---

# Best practices for advanced scheduler features in Azure Kubernetes Service (AKS)

As you manage clusters in Azure Kubernetes Service (AKS), you often need to isolate teams and workloads. Advanced features provided by the Kubernetes scheduler let you control:
* Which pods can be scheduled on certain nodes.
* How multi-pod applications can be appropriately distributed across the cluster. 

This best practices article focuses on advanced Kubernetes scheduling features for cluster operators. In this article, you learn how to:

> [!div class="checklist"]
> * Use taints and tolerations to limit what pods can be scheduled on nodes.
> * Give preference to pods to run on certain nodes with node selectors or node affinity.
> * Split apart or group together pods with inter-pod affinity or anti-affinity.

## Provide dedicated nodes using taints and tolerations

> **Best practice guidance:** 
>
> Limit access for resource-intensive applications, such as ingress controllers, to specific nodes. Keep node resources available for workloads that require them, and don't allow scheduling of other workloads on the nodes.

When you create your AKS cluster, you can deploy nodes with GPU support or a large number of powerful CPUs. You can use these nodes for large data processing workloads such as machine learning (ML) or artificial intelligence (AI). 

Since this node resource hardware is typically expensive to deploy, limit the workloads that can be scheduled on these nodes. Instead, you'd dedicate some nodes in the cluster to run ingress services and prevent other workloads.

This support for different nodes is provided by using multiple node pools. An AKS cluster provides one or more node pools.

The Kubernetes scheduler uses taints and tolerations to restrict what workloads can run on nodes.

* Apply a **taint** to a node to indicate only specific pods can be scheduled on them.
* Then apply a **toleration** to a pod, allowing them to *tolerate* a node's taint.

When you deploy a pod to an AKS cluster, Kubernetes only schedules pods on nodes whose taint aligns with the toleration. For example, assume you added a node pool in your AKS cluster for nodes with GPU support. You define name, such as *gpu*, then a value for scheduling. Setting this value to *NoSchedule* restricts the Kubernetes scheduler from scheduling pods with undefined toleration on the node.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name taintnp \
    --node-taints sku=gpu:NoSchedule \
    --no-wait
```

With a taint applied to nodes in the node pool, you'll define a toleration in the pod specification that allows scheduling on the nodes. The following example defines the `sku: gpu` and `effect: NoSchedule` to tolerate the taint applied to the node pool in the previous step:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: mcr.microsoft.com/azuredocs/samples-tf-mnist-demo:gpu
    resources:
      requests:
        cpu: 0.5
        memory: 2Gi
      limits:
        cpu: 4.0
        memory: 16Gi
  tolerations:
  - key: "sku"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```

When this pod is deployed using `kubectl apply -f gpu-toleration.yaml`, Kubernetes can successfully schedule the pod on the nodes with the taint applied. This logical isolation lets you control access to resources within a cluster.

When you apply taints, work with your application developers and owners to allow them to define the required tolerations in their deployments.

For more information about how to use multiple node pools in AKS, see [Create and manage multiple node pools for a cluster in AKS][use-multiple-node-pools].

### Behavior of taints and tolerations in AKS

When you upgrade a node pool in AKS, taints and tolerations follow a set pattern as they're applied to new nodes:

#### Default clusters that use VM scale sets
You can [taint a node pool][taint-node-pool] from the AKS API to have newly scaled out nodes receive API specified node taints.

Let's assume:
1. You begin with a two-node cluster: *node1* and *node2*. 
1. You upgrade the node pool.
1. Two additional nodes are created: *node3* and *node4*. 
1. The taints are passed on respectively.
1. The original *node1* and *node2* are deleted.

#### Clusters without VM scale set support

Again, let's assume:
1. You have a two-node cluster: *node1* and *node2*. 
1. You upgrade then node pool.
1. An additional node is created: *node3*.
1. The taints from *node1* are applied to *node3*.
1. *node1* is deleted.
1. A new *node1* is created to replace to original *node1*.
1. The *node2* taints are applied to the new *node1*. 
1. *node2* is deleted.

In essence *node1* becomes *node3*, and *node2* becomes the new *node1*.

When you scale a node pool in AKS, taints and tolerations do not carry over by design.

## Control pod scheduling using node selectors and affinity

> **Best practice guidance** 
> 
> Control the scheduling of pods on nodes using node selectors, node affinity, or inter-pod affinity. These settings allow the Kubernetes scheduler to logically isolate workloads, such as by hardware in the node.

Taints and tolerations logically isolate resources with a hard cut-off. If the pod doesn't tolerate a node's taint, it isn't scheduled on the node.

Alternatively, you can use node selectors. For example, you label nodes to indicate locally attached SSD storage or a large amount of memory, and then define in the pod specification a node selector. Kubernetes schedules those pods on a matching node.

Unlike tolerations, pods without a matching node selector can still be scheduled on labeled nodes. This behavior allows unused resources on the nodes to consume, but prioritizes pods that define the matching node selector.

Let's look at an example of nodes with a high amount of memory. These nodes prioritize pods that request a high amount of memory. To ensure the resources don't sit idle, they also allow other pods to run. The follow example command adds a node pool with the label *hardware=highmem* to the *myAKSCluster* in the *myResourceGroup*. All nodes in that node pool will have this label.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name labelnp \
    --node-count 1 \
    --labels hardware=highmem \
    --no-wait
```

A pod specification then adds the `nodeSelector` property to define a node selector that matches the label set on a node:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: mcr.microsoft.com/azuredocs/samples-tf-mnist-demo:gpu
    resources:
      requests:
        cpu: 0.5
        memory: 2Gi
      limits:
        cpu: 4.0
        memory: 16Gi
  nodeSelector:
      hardware: highmem
```

When you use these scheduler options, work with your application developers and owners to allow them to correctly define their pod specifications.

For more information about using node selectors, see [Assigning Pods to Nodes][k8s-node-selector].

### Node affinity

A node selector is a basic solution for assigning pods to a given node. *Node affinity* provides more flexibility, allowing you to define what happens if the pod can't be matched with a node. You can: 
* *Require* that Kubernetes scheduler matches a pod with a labeled host. Or,
* *Prefer* a match but allow the pod to be scheduled on a different host if no match is available.

The following example sets the node affinity to *requiredDuringSchedulingIgnoredDuringExecution*. This affinity requires the Kubernetes schedule to use a node with a matching label. If no node is available, the pod has to wait for scheduling to continue. To allow the pod to be scheduled on a different node, you can instead set the value to ***preferred**DuringSchedulingIgnoreDuringExecution*:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: tf-mnist
spec:
  containers:
  - name: tf-mnist
    image: mcr.microsoft.com/azuredocs/samples-tf-mnist-demo:gpu
    resources:
      requests:
        cpu: 0.5
        memory: 2Gi
      limits:
        cpu: 4.0
        memory: 16Gi
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: hardware
            operator: In
            values: highmem
```

The *IgnoredDuringExecution* part of the setting indicates that the pod shouldn't be evicted from the node if the node labels change. The Kubernetes scheduler only uses the updated node labels for new pods being scheduled, not pods already scheduled on the nodes.

For more information, see [Affinity and anti-affinity][k8s-affinity].

### Inter-pod affinity and anti-affinity

One final approach for the Kubernetes scheduler to logically isolate workloads is using inter-pod affinity or anti-affinity. These settings define that pods either *shouldn't* or *should* be scheduled on a node that has an existing matching pod. By default, the Kubernetes scheduler tries to schedule multiple pods in a replica set across nodes. You can define more specific rules around this behavior.

For example, you have a web application that also uses an Azure Cache for Redis. 
1. You use pod anti-affinity rules to request that the Kubernetes scheduler distributes replicas across nodes. 
1. You use affinity rules to ensure each web app component is scheduled on the same host as a corresponding cache. 

The distribution of pods across nodes looks like the following example:

| **Node 1** | **Node 2** | **Node 3** |
|------------|------------|------------|
| webapp-1   | webapp-2   | webapp-3   |
| cache-1    | cache-2    | cache-3    |

Inter-pod affinity and anti-affinity provide a more complex deployment than node selectors or node affinity. With the deployment, you logically isolate resources and control how Kubernetes schedules pods on nodes. 

For a complete example of this web application with Azure Cache for Redis example, see [Co-locate pods on the same node][k8s-pod-affinity].

## Next steps

This article focused on advanced Kubernetes scheduler features. For more information about cluster operations in AKS, see the following best practices:

* [Multi-tenancy and cluster isolation][aks-best-practices-scheduler]
* [Basic Kubernetes scheduler features][aks-best-practices-scheduler]
* [Authentication and authorization][aks-best-practices-identity]

<!-- EXTERNAL LINKS -->
[k8s-taints-tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
[k8s-node-selector]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/
[k8s-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity
[k8s-pod-affinity]: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#always-co-located-in-the-same-node

<!-- INTERNAL LINKS -->
[aks-best-practices-scheduler]: operator-best-practices-scheduler.md
[aks-best-practices-cluster-isolation]: operator-best-practices-cluster-isolation.md
[aks-best-practices-identity]: operator-best-practices-identity.md
[use-multiple-node-pools]: use-multiple-node-pools.md
[taint-node-pool]: use-multiple-node-pools.md#specify-a-taint-label-or-tag-for-a-node-pool
