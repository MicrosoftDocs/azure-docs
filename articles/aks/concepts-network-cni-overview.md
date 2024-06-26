---
title: Concepts - CNI networking in AKS
description: Learn about CNI networking options in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 05/28/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# Azure Kubernetes Service (AKS) CNI networking overview

Kubernetes uses Container Networking Interface (CNI) plugins to manage networking in Kubernetes clusters. CNIs are responsible for assigning IP addresses to pods, network routing between pods, Kubernetes Service routing, and more.

AKS provides multiple CNI plugins you can use in your clusters depending on your networking requirements.

## Networking models in AKS

Choosing a CNI plugin for your AKS cluster largely depends on which networking model fits your needs best. Each model has its own advantages and disadvantages you should consider when planning your AKS cluster.

AKS uses two main networking models: **overlay network** and **flat network**.

Both networking models have multiple supported CNI plugin options. The main differences between the models are how pod IP addresses are assigned and how traffic leaves the cluster.

### Overlay networks

Overlay networking is the most common networking model used in Kubernetes. In overlay networks, pods are given an IP address from a private, logically separate CIDR from the Azure VNet subnet where AKS nodes are deployed. This allows for simpler and often better scalability than the flat network model.

In overlay networks, pods can communicate with each other directly. Traffic leaving the cluster is Source Network Address Translated (SNAT'd) to the node's IP address, and inbound Pod IP traffic is routed through some service, such as a load balancer. This means that the pod IP address is "hidden" behind the node's IP address. This approach reduces the number of VNet IP addresses required for your clusters.

:::image type="content" source="media/azure-cni-Overlay/azure-cni-overlay.png" alt-text="A diagram showing two nodes with three pods each running in an Overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Azure Kubernetes Service provides the following CNI plugins for overlay networking:

- [Azure CNI Overlay][azure-cni-overlay], the recommended CNI plugin for most scenarios.
- [kubenet][kubenet], the legacy overlay model CNI.

### Flat networks

Unlike an overlay network, a flat network model in AKS assigns IP addresses to pods from a subnet from the same Azure VNet as the AKS nodes. This means that traffic leaving your clusters is not SNAT'd, and the pod IP address is directly exposed to the destination. This can be useful for some scenarios, such as when you need to expose pod IP addresses to external services.

:::image type="content" source="media/networking-overview/advanced-networking-diagram-01.png" alt-text="A diagram showing two nodes with three pods each running in a flat network model.":::

Azure Kubernetes Service provides two CNI plugins for flat networking. This article doesn't go into depth for each plugin option. For more information, see the linked documentation:

- [Azure CNI Pod Subnet][azure-cni-pod-subnet], the recommended CNI plugin for flat networking scenarios.
- [Azure CNI Node Subnet][azure-cni-node-subnet], a legacy flat network model CNI generally only recommends you use if you _**need**_ a managed VNet for your cluster. 

## Choosing a CNI

When choosing a CNI, there are several factors to consider. Each networking model has its own advantages and disadvantages, and the best choice for your cluster will depend on your specific requirements.

### Choosing a networking model

The two main networking models in AKS are overlay and flat networks.

* **Overlay networks**:
  * Conserve VNet IP address space by using logically separate CIDR ranges for pods.
  * Maximum cluster scale support.
  * Simple IP address management.
  
* **Flat networks**:
  * Pods get full VNet connectivity and can be directly reached via their private IP address from connected networks.
  * Require large, non-fragmented VNet IP address space.

### Use case comparison

When choosing a networking model, consider the use cases for each CNI plugin and the type of network model it uses:

| CNI plugin | Networking model | Use case highlights |
|-------------|----------------------|-----------------------|
| **Azure CNI Overlay** | Overlay | - Best for VNET IP conservation<br/>- Max node count supported by API Server + 250 pods per node<br/>- Simpler configuration<br/> -No direct external pod IP access |
| **Azure CNI Pod Subnet (Preview)** | Flat | - Direct external pod access<br/>- Modes for efficient VNet IP usage _or_ large cluster scale support |
| **Kubenet (Legacy)** | Overlay | - Prioritizes IP conservation<br/>- Limited scale<br/>- Manual route management |
| **Azure CNI Node Subnet (Legacy)** | Flat | - Direct external pod access<br/>- Simpler configuration <br/>- Limited scale <br/>- Inefficient use of VNet IPs |

### Feature comparison

You might also want to compare the features of each CNI plugin. The following table provides a high-level comparison of the features supported by each CNI plugin:

| Feature | Azure CNI Overlay | Azure CNI Pod Subnet | Azure CNI Node Subnet (Legacy) | Kubenet |
|---------|----------------------|--------------------------|--------------------------------------|----------|
| Deploy cluster in existing or new VNet | Supported | Supported | Supported | Supported - manual UDRs |
| Pod-VM connectivity with VM in same or peered VNet | Pod initiated | Both ways | Both ways | Pod initiated |
| On-premises access via VPN/Express Route | Pod initiated | Both ways | Both ways | Pod initiated |
| Access to service endpoints | Supported | Supported | Supported | Supported |
| Expose services using load balancer | Supported | Supported | Supported | Supported |
| Expose services using App Gateway | Currently not supported | Supported | Supported | Supported |
| Expose services using ingress controller | Supported | Supported | Supported | Supported |
| Windows node pools | Supported | Supported | Supported | Not supported |
| Default Azure DNS and Private Zones | Supported | Supported | Supported | Supported |
| VNet Subnet sharing across multiple clusters | Supported | Supported | Supported | Not supported |

### Support scope between network models

Depending on the CNI you use, your cluster virtual network resources can be deployed in one of the following ways:

- The Azure platform can automatically create and configure the virtual network resources when you create an AKS cluster. like in Azure CNI Overlay, Azure CNI Node subnet, and Kubenet.
- You can manually create and configure the virtual network resources and attach to those resources when you create your AKS cluster.

Although capabilities like service endpoints or UDRs are supported, the [support policies for AKS][support-policies] define what changes you can make. For example:

- If you manually create the virtual network resources for an AKS cluster, you're supported when configuring your own UDRs or service endpoints.
- If the Azure platform automatically creates the virtual network resources for your AKS cluster, you can't manually change those AKS-managed resources to configure your own UDRs or service endpoints.

## Prerequisites

There are several requirements and considerations to keep in mind when planning your network configuration for AKS:

- The virtual network for the AKS cluster must allow outbound internet connectivity.
- AKS clusters can't use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.
- In BYO CNI scenarios, the cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:
  - `Microsoft.Network/virtualNetworks/subnets/join/action`
  - `Microsoft.Network/virtualNetworks/subnets/read`
  - `Microsoft.Authorization/roleAssignments/write`
- The subnet assigned to the AKS node pool can't be a [delegated subnet][delegated-subnet].
- AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic within the node CIDR range. For more information, see [Network security groups][aks-network-nsg].

## Next Steps

- [Azure CNI Overlay][azure-cni-overlay]
- [Azure CNI Pod Subnet][azure-cni-pod-subnet]
- [Legacy CNI Options][legacy-cni-options]
- [IP Address Planning for your clusters][ip-address-planning]


<!-- LINKS - External -->


<!-- LINKS - Internal -->
[aks-network-nsg]: ../virtual-network/network-security-groups-overview.md
[azure-cni-node-subnet]: concepts-network-legacy-cni.md#azure-cni-node-subnet
[azure-cni-overlay]: concepts-network-azure-cni-overlay.md
[azure-cni-pod-subnet]: concepts-network-azure-cni-pod-subnet.md
[delegated-subnet]: ../virtual-network/subnet-delegation-overview.md
[ip-address-planning]: concepts-network-ip-address-planning.md
[kubenet]: concepts-network-legacy-cni.md#kubenet
[legacy-cni-options]: concepts-network-legacy-cni.md
[support-policies]: support-policies.md
