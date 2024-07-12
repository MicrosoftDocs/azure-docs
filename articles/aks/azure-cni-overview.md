---
title: Azure CNI networking in Azure Kubernetes Service (AKS) overview
description: Learn about the requirements and limitations of Azure CNI networking in Azure Kubernetes Service (AKS).
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: concept-article
ms.date: 02/29/2024

#CustomerIntent: As a network administrator, I want learn about Azure CNI networking so that I can deploy Azure CNI networking in an AKS cluster.
---

# Azure CNI networking in Azure Kubernetes Service (AKS) overview

By default, AKS clusters use [kubenet][kubenet] and create a virtual network and subnet. With _kubenet_, nodes get an IP address from a virtual network subnet. Network address translation (NAT) is then configured on the nodes, and pods receive an IP address "hidden" behind the node IP. This approach reduces the number of IP addresses that you need to reserve in your network space for pods to use.

With [Azure Container Networking Interface (CNI)][cni-networking], every pod gets an IP address from the subnet and can be accessed directly. Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod. These IP addresses must be unique across your network space and must be planned in advance. Each node has a configuration parameter for the maximum number of pods that it supports. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and often leads to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow.  

> [!NOTE]
> 
> This article is only introducing traditional Azure CNI. For [Azure CNI Overlay][azure-cni-overlay], [Azure CNI VNet for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], and [Azure CNI VNet - Static Block Allocation (Preview)][configure-azure-cni-static-block-allocation]. Please refer to their documentation instead.  

## Prerequisites

- The virtual network for the AKS cluster must allow outbound internet connectivity.

- AKS clusters can't use `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24` for the Kubernetes service address range, pod address range, or cluster virtual network address range.

- The cluster identity used by the AKS cluster must have at least [Network Contributor](../role-based-access-control/built-in-roles.md#network-contributor) permissions on the subnet within your virtual network. If you wish to define a [custom role](../role-based-access-control/custom-roles.md) instead of using the built-in Network Contributor role, the following permissions are required:

  - `Microsoft.Network/virtualNetworks/subnets/join/action`

  - `Microsoft.Network/virtualNetworks/subnets/read`

  - `Microsoft.Authorization/roleAssignments/write`

- The subnet assigned to the AKS node pool can't be a [delegated subnet](../virtual-network/subnet-delegation-overview.md).

- AKS doesn't apply Network Security Groups (NSGs) to its subnet and doesn't modify any of the NSGs associated with that subnet. If you provide your own subnet and add NSGs associated with that subnet, you must ensure the security rules in the NSGs allow traffic within the node CIDR range. For more information, see [Network security groups][aks-network-nsg].

## Deployment parameters

When you create an AKS cluster, the following parameters are configurable for Azure CNI networking:

**Virtual network**: The virtual network into which you want to deploy the Kubernetes cluster. If you want to create a new virtual network for your cluster, select _Create new_ and follow the steps in the _Create virtual network_ section. If you want to select an existing virtual network, make sure it's in the same location and Azure subscription as your Kubernetes cluster. For information about the limits and quotas for an Azure virtual network, see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits).

**Subnet**: The subnet within the virtual network where you want to deploy the cluster. If you want to create a new subnet in the virtual network for your cluster, select _Create new_ and follow the steps in the _Create subnet_ section. For hybrid connectivity, the address range shouldn't overlap with any other virtual networks in your environment.

**Azure Network Plugin**: When Azure network plugin is used, the internal LoadBalancer service with "externalTrafficPolicy=Local" can't be accessed from VMs with an IP in clusterCIDR that doesn't belong to AKS cluster.

**Kubernetes service address range**: This parameter is the set of virtual IPs that Kubernetes assigns to internal [services][services] in your cluster. This range can't be updated after you create your cluster. You can use any private address range that satisfies the following requirements:

- Must not be within the virtual network IP address range of your cluster
- Must not overlap with any other virtual networks with which the cluster virtual network peers
- Must not overlap with any on-premises IPs
- Must not be within the ranges `169.254.0.0/16`, `172.30.0.0/16`, `172.31.0.0/16`, or `192.0.2.0/24`

Although it's technically possible to specify a service address range within the same virtual network as your cluster, doing so isn't recommended. Unpredictable behavior can result if overlapping IP ranges are used. For more information, see the [FAQ](#frequently-asked-questions) section of this article. For more information on Kubernetes services, see [Services][services] in the Kubernetes documentation.

**Kubernetes DNS service IP address**:  The IP address for the cluster's DNS service. This address must be within the *Kubernetes service address range*. Don't use the first IP address in your address range. The first address in your subnet range is used for the *kubernetes.default.svc.cluster.local* address.

## Frequently asked questions

- **Can I deploy VMs in my cluster subnet?**

  Yes. But for [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], the VMs cannot be deployed in pod's subnet. 

- **What source IP do external systems see for traffic that originates in an Azure CNI-enabled pod?**

  Systems in the same virtual network as the AKS cluster see the pod IP as the source address for any traffic from the pod. Systems outside the AKS cluster virtual network see the node IP as the source address for any traffic from the pod.
  
  But for [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation], no matter the connection is inside the same virtual network or cross virtual networks, the pod IP is always the source address for any traffic from the pod. This is because the [Azure CNI for dynamic IP allocation][configure-azure-cni-dynamic-ip-allocation] implements [Microsoft Azure Container Networking][github-azure-container-networking] infrastructure, which gives end-to-end experience. Hence, it eliminates the use of [`ip-masq-agent`][ip-masq-agent], which is still used by traditional Azure CNI.  

- **Can I configure per-pod network policies?**

  Yes, Kubernetes network policy is available in AKS. To get started, see [Secure traffic between pods by using network policies in AKS][network-policy].

- **Is the maximum number of pods deployable to a node configurable?**

  Yes, when you deploy a cluster with the Azure CLI or a Resource Manager template. See [Maximum pods per node][max-pods].

  You can't change the maximum number of pods per node on an existing cluster.

- **How do I configure additional properties for the subnet that I created during AKS cluster creation? For example, service endpoints.**

  The complete list of properties for the virtual network and subnets that you create during AKS cluster creation can be configured in the standard virtual network configuration page in the Azure portal.

- **Can I use a different subnet within my cluster virtual network for the *Kubernetes service address range*?**

  It's not recommended, but this configuration is possible. The service address range is a set of virtual IPs (VIPs) that Kubernetes assigns to internal services in your cluster. Azure Networking has no visibility into the service IP range of the Kubernetes cluster. The lack of visibility into the cluster's service address range can lead to issues. It's possible to later create a new subnet in the cluster virtual network that overlaps with the service address range. If such an overlap occurs, Kubernetes could assign a service an IP that's already in use by another resource in the subnet, causing unpredictable behavior or failures. By ensuring you use an address range outside the cluster's virtual network, you can avoid this overlap risk.

## Next step

> [!div class="nextstepaction"]
> [Configure Azure CNI networking in Azure Kubernetes Service (AKS)](configure-azure-cni.md)

Learn more about networking in AKS in the following articles:

- [Use a static IP address with the Azure Kubernetes Service (AKS) load balancer](static-ip.md)

- [Use an internal load balancer with Azure Kubernetes Service (AKS)](internal-lb.md)

- [Use the application routing addon in Azure Kubernetes Service (AKS)](app-routing.md)

<!-- IMAGES -->
[advanced-networking-diagram-01]: ./media/networking-overview/advanced-networking-diagram-01.png
[portal-01-networking-advanced]: ./media/networking-overview/portal-01-networking-advanced.png

<!-- LINKS - External -->
[services]: https://kubernetes.io/docs/concepts/services-networking/service/
[cni-networking]: https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
[github]: https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml
[github-azure-container-networking]: https://github.com/Azure/azure-container-networking
[ip-masq-agent]: https://kubernetes.io/docs/tasks/administer-cluster/ip-masq-agent/

<!-- LINKS - Internal -->
[az-aks-create]: /cli/azure/aks#az_aks_create
[aks-ssh]: ssh.md
[ManagedClusterAgentPoolProfile]: /azure/templates/microsoft.containerservice/managedclusters#managedclusteragentpoolprofile-object
[aks-network-concepts]: concepts-network.md
[aks-network-nsg]: concepts-network.md#network-security-groups
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[kubenet]: concepts-network-legacy-cni.md#kubenet
[max-pods]: concepts-network-ip-address-planning.md#maximum-pods-per-node
[network-policy]: use-network-policies.md
[nodepool-upgrade]: manage-node-pools.md#upgrade-a-single-node-pool
[network-comparisons]: concepts-network.md#compare-network-models
[system-node-pools]: use-system-pools.md
[prerequisites]: configure-azure-cni.md#prerequisites
[azure-cni-overlay]: azure-cni-overlay.md
[configure-azure-cni-dynamic-ip-allocation]: configure-azure-cni-dynamic-ip-allocation.md
[configure-azure-cni-static-block-allocation]: configure-azure-cni-static-block-allocation.md

