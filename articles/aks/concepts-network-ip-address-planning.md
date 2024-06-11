---
title: Concepts - IP address planning in Azure Kubernetes Service (AKS)
description: Learn about IP address planning in Azure Kubernetes Service (AKS).
ms.topic: conceptual
ms.date: 05/28/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# IP address planning for your Azure Kubernetes Service (AKS) clusters

This article provides guidance on IP address planning for Azure Kubernetes Service (AKS) clusters.

For specific guidance on IP address planning for individual CNI options, see the [next steps](#next-steps) section for links to plugin documentation.

## Subnet sizing

Your Azure VNet subnet must be large enough to accommodate your cluster, which depends on whether you're using an [overlay network](#overlay-networks) or a [flat network](#flat-networks).

### Overlay networks

With overlay networks, like [Azure CNI Overlay][azure-cni-overlay], your subnet needs to be large enough to assign IPs to your nodes. Pods are assigned IPs from a separate, private CIDR range and won't require VNet IPs. The VNet subnet you use for your cluster can be smaller than with flat networks.

It's important to ensure you allocate enough space in your private CIDR range for your pods to account for scaling. When planning your IP address range sizes, you should calculate your maximum pod count. Each node in your cluster is assigned a /24 (256 IP addresses) subnet for pods. You should plan your overlay network subnet to accommodate the maximum number of nodes you expect to run.

### Flat networks

Flat networks, like [Azure CNI Pod Subnet][azure-cni-pod-subnet], require a large enough subnet to accommodate both nodes _and_ pods. Since nodes and pods receive IPs from your VNet, you need to plan for the maximum number of nodes and pods you expect to run. Azure CNI Pod Subnet uses a subnet for your nodes and a separate subnet for your pods, so you need to plan for both.

## IP address sizing

### Upgrading and scaling considerations

When IP address planning for your AKS cluster, you should **consider the number of IP addresses required for upgrade and scaling operations**. If you set the IP address range to only support a fixed number of nodes, you won't be able to upgrade or scale your cluster.

When you **upgrade** your AKS cluster, a new node is deployed in the cluster. Services and workloads begin to run on the new node, and an older node is removed from the cluster. This rolling upgrade process requires a minimum of one additional block of IP addresses to be available. Your node count is then `n + 1` where `n` is the number of nodes in your cluster.

When you **scale** an AKS cluster, a new node is deployed in the cluster. Services and workloads begin to run on the new node. Your IP address range needs to take into considerations how you want to scale up the number of nodes and pods your cluster can support. One additional node for upgrade operations should also be included. Your node count is then `n + number-of-additional-scaled-nodes-you-anticipate + max surge`.

If you're using [Azure CNI Pod Subnet][azure-cni-pod-subnet] and you expect your nodes to run the maximum number of pods and you regularly destroy and deploy pods, you should also factor in extra IP addresses per node. There can be few seconds latency required to delete a service and release its IP address for a new service to be deployed and acquire the address. The extra IP addresses account for this possibility.

The IP address plan for an AKS cluster consists of a virtual network, at least one subnet for nodes and pods, and a Kubernetes service address range.

| Azure Resource | Address Range | Limits and Sizing |
| -------------- | -------------- | ----------------- |
| Azure Virtual Network | Max size /8. 65,536 configured IP address limit. See [Azure CNI Pod Subnet Static Block Allocation][pod-subnet-static-block-allocation] for exception| Overlapping address spaces within your network can cause issues. |
| Subnet | Must be large enough to accommodate nodes, pods, and all Kubernetes and Azure resources in your cluster. For instance, if you deploy an internal Azure Load Balancer, its front-end IPs are allocated from the cluster subnet, not public IPs. | Subnet size should also account for upgrade operations and future scaling needs. <p/> Use the following equation to calculate the minimum subnet size, including an extra node for upgrade operations: `(number of nodes + 1) + ((number of nodes + 1) * maximum pods per node that you configure)` <p/> Example for a 50-node cluster: `(51) + (51 * 30 (default)) = 1,581` (/21 or larger) <p/> Example for a 50-node cluster, preparing to scale up an extra 10 nodes: `(61) + (61 * 30 (default)) = 1,891` (/21 or larger) <p/> If you don't specify a maximum number of pods per node when you create your cluster, the maximum number of pods per node is set to 30. The minimum number of IP addresses required is based on that value. If you calculate your minimum IP address requirements on a different maximum value, see [Maximum pods per node](#maximum-pods-per-node) to set this value when you deploy your cluster. |
| Kubernetes Service Address Range | Any network element on or connected to this virtual network must not use this range. | The service address CIDR must be smaller than /12. You can reuse this range across different AKS clusters. |
| Kubernetes DNS Service IP Address | IP address within the Kubernetes service address range used by cluster service discovery. | Don't use the first IP address in your address range. The first address in your subnet range is used for the _kubernetes.default.svc.cluster.local_ address. |

## Maximum pods per node

The maximum number of pods per node in an AKS cluster is 250. The _default_ maximum number of pods per node varies between _kubenet_ and _Azure CNI_ networking, and the method of cluster deployment.

| CNI                 | Default max pods | Configurable at deployment |
|---------------------|------------------|----------------------------|
| Azure CNI Overlay   | 250              | Yes (up to 250)            |
| Azure CNI Pod subnet | 110              | Yes (up to 250)            |
| Azure CNI (Legacy)  | 30               | Yes (up to 250)            |
| Kubenet             | 110              | Yes (up to 250)            |

## Configuring maximum pods per node for your clusters

You can configure the maximum number of pods per node either at cluster deployment time or as you add new node pools. You can set the maximum pods per node value as high as 250.

A minimum value for maximum pods per node is enforced to guarantee space for system pods critical to cluster health. The minimum value that can be set for maximum pods per node is 10 if and only if the configuration of each node pool has space for a minimum of 30 pods. For example, setting the maximum pods per node to the minimum of 10 requires each individual node pool to have a minimum of three nodes. This requirement applies for each new node pool created as well, so if 10 is defined as maximum pods per node each subsequent node pool added must have at least three nodes.

| Networking | Minimum | Maximum |
|------------|---------|---------|
| Azure CNI  | 10      | 250     |
| Kubenet    | 10      | 250     |

> [!NOTE]
> The minimum value in the previous table is strictly enforced by the AKS service. You cannot set a value for _maxPods_ that is lower than the minimum shown, as doing so can prevent the cluster from starting.

### New clusters

You can define maximum pods per node when you create a new cluster using one of the following methods:

- **Azure CLI**: Specify the `--max-pods` argument when you deploy a cluster with the [`az aks create`][az-aks-create] command.
- **Azure Resource Manager template**: Specify the `maxPods` property in the [ManagedClusterAgentPoolProfile] object when you deploy a cluster with an Azure Resource Manager template.
- **Azure portal**: Change the `Max pods per node` field in the node pool settings when creating a cluster or adding a new node pool.

### Existing clusters

You can define maximum pods per node when you create a new node pool. If you need to increase the _maxPods_ setting on an existing cluster, add a new node pool with the new desired _maxPods_ count. After migrating your pods to the new pool, delete the node older pool.

## Next Steps

- [Azure CNI Overlay][azure-cni-overlay]
- [Azure CNI PodSubnet][azure-cni-pod-subnet]

<!-- LINKS - Internal -->
[azure-cni-overlay]: concepts-network-azure-cni-overlay.md
[azure-cni-pod-subnet]: concepts-network-azure-cni-pod-subnet.md
[az-aks-create]: /cli/azure/aks#az_aks_create
[pod-subnet-static-block-allocation]: concepts-network-azure-cni-pod-subnet.md#static-block-allocation-mode-preview
