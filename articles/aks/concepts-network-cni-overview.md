---
title: Concepts - CNI Networking in AKS
description: Learn about CNI networking in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 04/10/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# AKS CNI Networking Overview

Kubernetes uses Container Networking Interface (CNI) plugins to manage networking in Kubernetes clusters. CNIs are responsible for assigning IP addresses to pods, network routing between pods, implementing network policies, and more.

AKS provides multiple CNI plugins you can use in your clusters depending on your networking requirements.

## Networking models in AKS

There are two main networking models used in AKS; both have multiple supported CNI plugin options. The main difference between these models is how pod IP addresses are assigned and how traffic leaves the cluster.

### Overlay Networks topology

Overlay networking is the most common networking model used in Kubernetes. In overlay networks, pods are given an IP address from a private, logically separate CIDR from the Azure VNet subnet where AKS nodes are deployed. This allows for simpler and often better scalability than the flat network model.

In overlay networks, pods can communicate with each other directly, and traffic leaving the cluster is Source Network Address Translated (SNAT'd) to the node's IP address. This means that the pod IP address is "hidden" behind the node's IP address, but this approach reduces the number of VNet IP addresses required for your clusters.

:::image type="content" source="media/azure-cni-Overlay/azure-cni-overlay.png" alt-text="A diagram showing two nodes with three pods each running in an Overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Azure Kubernetes Service provides the following CNI plugins for overlay networking:

- [Azure CNI Overlay][azure-cni-overlay], the recommended CNI plugin for most scenarios.
- [kubenet][kubenet], the legacy overlay model CNI.

### Flat network topology

Unlike an overlay network, a flat network model assigns IP addresses to pods from the same subnet as the AKS nodes. This means that traffic leaving you clusters is not SNAT'd, and the pod IP address is directly exposed to the destination. This can be useful for some scenarios, such as when you need to expose pod IP addresses to external services.

:::image type="content" source="media/networking-overview/advanced-networking-diagram-01.png" alt-text="{A diagram showing two nodes with three pods each running in a flat network model}":::

> [!NOTE]
> This article is only introduces the CNI plugin options. For [Azure CNI Overlay][azure-cni-overlay], [Azure CNI VNet for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], and [Azure CNI VNet - Static Block Allocation (Preview)][configure-azure-cni-static-block-allocation]. Please refer to their documentation instead. 

## Prerequisites

- The virtual network for the AKS cluster must allow outbound internet connectivity.
- AKS clusters can't use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.
- The cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:
  - `Microsoft.Network/virtualNetworks/subnets/join/action`
  - `Microsoft.Network/virtualNetworks/subnets/read`
  - `Microsoft.Authorization/roleAssignments/write`
- The subnet assigned to the AKS node pool can't be a [delegated subnet](../virtual-network/subnet-delegation-overview.md).
- AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic within the node CIDR range. For more information, see [Network security groups][aks-network-nsg].


<!-- LINKS - External -->


<!-- LINKS - Internal -->
[azure-cni-overlay]: azure-cni-overlay.md
[configure-azure-cni-dynamic-ip-allocation]: configure-azure-cni-dynamic-ip-allocation.md
[configure-azure-cni-static-block-allocation]: configure-azure-cni-static-block-allocation.md
[kubenet]: concepts-legacy-cni.md#kubenet
