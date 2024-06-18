---
title: Concepts - AKS Legacy Container Networking Interfaces (CNI)
description: Learn about legacy CNI networking options in Azure Kubernetes Service (AKS)
ms.topic: conceptual
ms.date: 05/29/2024
author: schaffererin
ms.author: schaffererin

ms.custom: fasttrack-edit
---

# AKS Legacy Container Networking Interfaces (CNI)

In Azure Kubernetes Service (AKS), while [Azure CNI Overlay][azure-cni-overlay] and [Azure CNI Pod Subnet][azure-cni-pod-subnet] are recommended for most scenarios, legacy networking models such as Azure CNI Node Subnet and kubenet are still available and supported. These legacy models offer different approaches to pod IP address management and networking, each with its own set of capabilities and considerations. This article provides an overview of these legacy networking options, detailing their prerequisites, deployment parameters, and key characteristics to help you understand their roles and how they can be used effectively within your AKS clusters.

## Prerequisites

The following prerequisites are required for Azure CNI Node Subnet and kubenet:

* The virtual network for the AKS cluster must allow outbound internet connectivity.
* AKS clusters can't use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.
* The cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within the virtual network. If you want to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:

  - `Microsoft.Network/virtualNetworks/subnets/join/action`
  - `Microsoft.Network/virtualNetworks/subnets/read`
  - `Microsoft.Authorization/roleAssignments/write`

* The subnet assigned to the AKS node pool can't be a [delegated subnet](../virtual-network/subnet-delegation-overview.md).
- AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, make sure the security rules in the NSGs allow traffic within the node CIDR range. For more information, see [Network security groups][aks-network-nsg].

> [!NOTE]
> Kubenet isn't available for Windows Server containers. To use Windows Server node pools, you need to use Azure CNI. 

## Azure CNI Node Subnet

With [Azure Container Networking Interface (CNI)][cni-networking], every pod gets an IP address from the subnet and can be accessed directly. Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod. These IP addresses must be unique across your network space and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and often leads to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow.

With Azure CNI Node Subnet, each pod receives an IP address in the IP subnet and can communicate directly with other pods and services. Your clusters can be as large as the IP address range you specify. However, you must plan the IP address range in advance, and all the IP addresses are consumed by the AKS nodes based on the maximum number of pods they can support. Advanced network features and scenarios such as [virtual nodes][virtual-nodes] or Network Policies (either Azure or Calico) are supported with Azure CNI.  

### Deployment parameters

When you create an AKS cluster, the following parameters are configurable for Azure CNI networking:

**Virtual network**: The virtual network into which you want to deploy the Kubernetes cluster.  You can create a new virtual network or use an existing one. If you want to use an existing virtual network, make sure it's in the same location and Azure subscription as your Kubernetes cluster. For information about the limits and quotas for an Azure virtual network, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).

**Subnet**: The subnet within the virtual network where you want to deploy the cluster. You can add new subnets into the virtual network during the cluster creation process. For hybrid connectivity, the address range shouldn't overlap with any other virtual networks in your environment.

**Azure Network Plugin**: When Azure network plugin is used, the internal LoadBalancer service with "externalTrafficPolicy=Local" can't be accessed from VMs with an IP in clusterCIDR that doesn't belong to AKS cluster.

**Kubernetes service address range**: This parameter is the set of virtual IPs that Kubernetes assigns to internal [services][services] in your cluster. This range can't be updated after you create your cluster. You can use any private address range that satisfies the following requirements:

- Must not be within the virtual network IP address range of your cluster.
- Must not overlap with any other virtual networks with which the cluster virtual network peers.
- Must not overlap with any on-premises IPs.
- Must not be within the ranges `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24`.

While it's possible to specify a service address range within the same virtual network as your cluster, we don't recommend it. Overlapping IP ranges can result in unpredictable behavior. For more information, see the [FAQ](#azure-cni-pod-subnet-frequently-asked-questions). For more information on Kubernetes services, see [Services][services] in the Kubernetes documentation.

**Kubernetes DNS service IP address**:  The IP address for the cluster's DNS service. This address must be within the *Kubernetes service address range*. Don't use the first IP address in your address range. The first address in your subnet range is used for the *kubernetes.default.svc.cluster.local* address.

## Kubenet

AKS clusters use kubenet and create an Azure virtual network and subnet for you by default. With kubenet, nodes get an IP address from the Azure virtual network subnet. Pods receive an IP address from a logically different address space to the Azure virtual network subnet of the nodes. Network address translation (NAT) is then configured so the pods can reach resources on the Azure virtual network. The source IP address of the traffic is NAT'd to the node's primary IP address. This approach greatly reduces the number of IP addresses you need to reserve in your network space for pods to use.

You can configure the maximum pods deployable to a node at cluster creation time or when creating new node pools. If you don't specify `maxPods` when creating new node pools, you receive a default value of _110_ for kubenet.

## Overview of kubenet networking with your own subnet

In many environments, you have defined virtual networks and subnets with allocated IP address ranges, and you use these resources to support multiple services and applications. To provide network connectivity, AKS clusters can use _kubenet_ (basic networking) or Azure CNI (_advanced networking_).

With _kubenet_, only the nodes receive an IP address in the virtual network subnet. Pods can't communicate directly with each other. Instead, User Defined Routing (UDR) and IP forwarding handle connectivity between pods across nodes. UDRs and IP forwarding configuration is created and maintained by the AKS service by default, but you can bring your own route table for custom route management if you want. You can also deploy pods behind a service that receives an assigned IP address and load balances traffic for the application. The following diagram shows how the AKS nodes receive an IP address in the virtual network subnet, but not the pods:

:::image type="content" source="media/use-kubenet/kubenet-overview.png" alt-text="A diagram showing two nodes with three pods each running in an Overlay network. Pod traffic to endpoints outside the cluster is routed via NAT.":::

Azure supports a maximum of _400_ routes in a UDR, so you can't have an AKS cluster larger than 400 nodes. AKS [virtual nodes][virtual-nodes] and Azure Network Policies aren't supported with _kubenet_. [Calico Network Policies][calico-network-policies] are supported.

### Limitations & considerations for kubenet

- An additional hop is required in the design of kubenet, which adds minor latency to pod communication.
- Route tables and user-defined routes are required for using kubenet, which adds complexity to operations.
  - For more information, see [Customize cluster egress with a user-defined routing table in AKS](./egress-udr.md) and [Customize cluster egress with outbound types in AKS](./egress-outboundtype.md).
- Direct pod addressing isn't supported for kubenet due to kubenet design.
- Unlike Azure CNI clusters, multiple kubenet clusters can't share a subnet.
- AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic between the node and pod CIDR. For more details, see [Network security groups][aks-network-nsg].
- Features **not supported on kubenet** include:
  - [Azure network policies](use-network-policies.md#create-an-aks-cluster-and-enable-network-policy)
  - [Windows node pools](./windows-faq.md)
  - [Virtual nodes add-on](virtual-nodes.md#network-requirements)

> [!NOTE]
> Some of the system pods such as **konnectivity** within the cluster use the host node IP address rather than an IP from the overlay address space. The system pods will only use the node IP and not an IP address from the virtual network.

## IP address availability and exhaustion

A common issue with _Azure CNI_ is that the assigned IP address range is too small to then add more nodes when you scale or upgrade a cluster. The network team also might not be able to issue a large enough IP address range to support your expected application demands. As a compromise, you can create an AKS cluster that uses _kubenet_ and connect to an existing virtual network subnet. This approach lets the nodes receive defined IP addresses without the need to reserve a large number of IP addresses up front for any potential pods that could run in the cluster.

With kubenet, you can use a much smaller IP address range and support large clusters and application demands. For example, with a */27* IP address range on your subnet, you can run a 20-25 node cluster with enough room to scale or upgrade. This cluster size can support up to *2,200-2,750* pods (with a default maximum of 110 pods per node). The maximum number of pods per node that you can configure with kubenet in AKS is 250.

The following basic calculations compare the difference in network models:

- **kubenet**: A simple _/24_ IP address range can support up to _251_ nodes in the cluster. Each Azure virtual network subnet reserves the first three IP addresses for management operations. This node count can support up to _27,610_ pods, with a default maximum of 110 pods per node.
- **Azure CNI**: That same basic _/24_ subnet range can only support a maximum of _8_ nodes in the cluster. This node count can only support up to _240_ pods, with a default maximum of 30 pods per node.

> [!NOTE]
> These maximums don't take into account upgrade or scale operations. In practice, you can't run the maximum number of nodes the subnet IP address range supports. You must leave some IP addresses available for scaling or upgrading operations.

## Virtual network peering and ExpressRoute connections

You can use [Azure virtual network peering][vnet-peering] or [ExpressRoute connections][express-route] with _Azure CNI_ and _kubenet_ to provide on-premises connectivity. Make sure you plan your IP addresses carefully to prevent overlap and incorrect traffic routing. For example, many on-premises networks use a *10.0.0.0/8* address range that's advertised over the ExpressRoute connection. We recommend creating your AKS clusters in Azure virtual network subnets outside of this address range, such as *172.16.0.0/16*.

For more information, see [Compare network models and their support scopes][network-comparisons].

## Azure CNI Pod Subnet frequently asked questions

- **Can I deploy VMs in my cluster subnet?**

  Yes for Azure CNI Node Subnet, the VMs can be deployed in the same subnet as the AKS cluster. 

- **What source IP do external systems see for traffic that originates in an Azure CNI-enabled pod?**

  Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod.
  But for [Azure CNI dynamic IP allocation][azure-cni-dynamic-ip-allocation], no matter the connection is inside the same virtual network or cross virtual networks, the pod IP is always the source address for any traffic from the pod. This is because the [Azure CNI for dynamic IP allocation][azure-cni-dynamic-ip-allocation] implements [Microsoft Azure Container Networking][github-azure-container-networking] infrastructure, which gives end-to-end experience. Hence, it eliminates the use of [`ip-masq-agent`][ip-masq-agent], which is still used by traditional Azure CNI.  

- **Can I configure per-pod network policies?**

  Yes, Kubernetes network policy is available in AKS. To get started, see [Secure traffic between pods by using network policies in AKS][network-policy].

- **Is the maximum number of pods deployable to a node configurable?**

    By default, AKS clusters use [kubenet][kubenet] and create a virtual network and subnet. With _kubenet_, nodes get an IP address from a virtual network subnet. Network address translation (NAT) is then configured on the nodes, and pods receive an IP address "hidden" behind the node IP. This approach reduces the number of IP addresses that you need to reserve in your network space for pods to use.

  With [Azure Container Networking Interface (CNI)][cni-networking], every pod gets an IP address from the subnet and can be accessed directly. Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod. These IP addresses must be unique across your network space and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and often leads to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow.  

- **Can I deploy VMs in my cluster subnet?**

  Yes. But for [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], the VMs cannot be deployed in pod's subnet. 

- **What source IP do external systems see for traffic that originates in an Azure CNI-enabled pod?**

  Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod.
  
  But for [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], no matter the connection is inside the same virtual network or cross virtual networks, the pod IP is always the source address for any traffic from the pod. This is because the [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation] implements [Microsoft Azure Container Networking][github-azure-container-networking] infrastructure, which gives end-to-end experience. Hence, it eliminates the use of [`ip-masq-agent`][ip-masq-agent], which is still used by traditional Azure CNI.  

- **Can I use a different subnet within my cluster virtual network for the *Kubernetes service address range*?**

  It's not recommended, but this configuration is possible. The service address range is a set of virtual IPs (VIPs) that Kubernetes assigns to internal services in your cluster. Azure Networking has no visibility into the service IP range of the Kubernetes cluster. The lack of visibility into the cluster's service address range can lead to issues. It's possible to later create a new subnet in the cluster virtual network that overlaps with the service address range. If such an overlap occurs, Kubernetes could assign a service an IP that's already in use by another resource in the subnet, causing unpredictable behavior or failures. By ensuring you use an address range outside the cluster's virtual network, you can avoid this overlap risk.
  Yes, when you deploy a cluster with the Azure CLI or a Resource Manager template. See [Maximum pods per node][max-pods].

- **Can I use a different subnet within my cluster virtual network for the *Kubernetes service address range*?**

  It's not recommended, but this configuration is possible. The service address range is a set of virtual IPs (VIPs) that Kubernetes assigns to internal services in your cluster. Azure Networking has no visibility into the service IP range of the Kubernetes cluster. The lack of visibility into the cluster's service address range can lead to issues. It's possible to later create a new subnet in the cluster virtual network that overlaps with the service address range. If such an overlap occurs, Kubernetes could assign a service an IP that's already in use by another resource in the subnet, causing unpredictable behavior or failures. By ensuring you use an address range outside the cluster's virtual network, you can avoid this overlap risk.

<!-- LINKS - External -->
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[kubenet]: https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#kubenet
[Calico-network-policies]: https://docs.projectcalico.org/v3.9/security/calico-network-policy
[github-azure-container-networking]: https://github.com/Azure/azure-container-networking
[ip-masq-agent]: https://kubernetes.io/docs/tasks/administer-cluster/ip-masq-agent/

<!-- LINKS - Internal -->

[aks-network-nsg]: concepts-network.md#network-security-groups
[azure-cni-dynamic-ip-allocation]: concepts-network-azure-cni-pod-subnet.md#dynamic-ip-allocation-mode
[azure-cni-overlay]: concepts-network-azure-cni-overlay.md
[azure-cni-pod-subnet]: concepts-network-azure-cni-pod-subnet.md
[virtual-nodes]: virtual-nodes-cli.md
[vnet-peering]: ../virtual-network/virtual-network-peering-overview.md
[express-route]: ../expressroute/expressroute-introduction.md
[network-comparisons]: concepts-network-cni-overview.md
[network-policy]: use-network-policies.md
[services]: concepts-network-services.md
[max-pods]: concepts-network-ip-address-planning.md#maximum-pods-per-node
[configure-azure-cni-dynamic-ip-allocation]: configure-azure-cni-dynamic-ip-allocation.md
