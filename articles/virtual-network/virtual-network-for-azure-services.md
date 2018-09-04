---
title: Virtual network for Azure services | Microsoft Docs
description: Learn about the benefits of deploying resources into a virtual network. Resources in virtual networks can communicate with each other, and on-premises resources, without traffic traversing the Internet.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: jdial

---

# Virtual network integration for Azure services

Integrating Azure services to an Azure virtual network allows private access from instances of a service deployed in the virtual network.

You can integrate Azure services with your virtual network with the following options:
- Directly deploying dedicated instances of the service into a virtual network. The dedicated instances of these services can be privately accessed within the virtual network and from on-premises networks.
- By extending a virtual network to the service, through service endpoints. Service endpoints allow individual service resources to be secured to the virtual network.
 
## Deploy Azure services into virtual networks

You can communicate with most Azure resources over the Internet through public IP addresses. When you deploy Azure services in a [virtual network](virtual-networks-overview.md), you can communicate with the service resources privately, through private IP addresses.

![Services deployed in a virtual network](./media/virtual-network-for-azure-services/deploy-service-into-vnet.png)

Deploying services within a virtual network provides the following capabilities:

- Resources within the virtual network can communicate with each other privately, through private IP addresses. Example, directly transferring data between HDInsight and SQL Server running on a virtual machine, in the virtual network.
- On-premises resources can access resources in a virtual network using private IP addresses over a [Site-to-Site VPN (VPN Gateway)](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#s2smulti) or [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Virtual networks can be [peered](virtual-network-peering-overview.md) to enable resources in the virtual networks to communicate with each other, using private IP addresses.
- Service instances in a virtual network are fully managed by the Azure service, to monitor health of the instances, and provide required scale, based on load.
- Service instances are deployed into a dedicated subnet in a virtual network. Inbound and outbound network access must be opened through [network security groups](security-overview.md#network-security-groups) for the subnet, per guidance provided by the services.

### Services that can be deployed into a virtual network

Each service directly deployed into virtual network has specific requirements for routing and the types of traffic that must be allowed into and out of subnets. For more information, see: 
 
- Virtual machines: [Linux](../virtual-machines/linux/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/windows/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Service fabric](../service-fabric/service-fabric-patterns-networking.md?toc=%2fazure%2fvirtual-network%2ftoc.json#existingvnet)
- [Virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-mvss-existing-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [HDInsight](../hdinsight/hdinsight-extend-hadoop-virtual-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [App Service Environment](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [RedisCache](../redis-cache/cache-how-to-premium-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [API Management](../api-management/api-management-using-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Application Gateway (internal)](../application-gateway/application-gateway-ilb-arm.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Azure Kubernetes Service (AKS)](../aks/concepts-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Azure Container Service Engine](https://github.com/Azure/acs-engine) with the Azure Virtual Network CNI [plug-in](https://github.com/Azure/acs-engine/tree/master/examples/vnet)
- [Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Azure Batch](../batch/batch-api-basics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-network-vnet-and-firewall-configuration)
- [Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-vnet-configuration.md?toc=%2fazure%2fvirtual-network%2ftoc.json)
- [Cloud services](https://msdn.microsoft.com/library/azure/jj156091): Virtual network (classic) only

You can deploy an [internal Azure load balancer](../load-balancer/load-balancer-internal-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) to load balance many of the resources in the previous list. In some cases, the service automatically creates and deploys a load balancer, when you create a resource.

## Service endpoints for Azure services

Some Azure services can't be deployed in virtual networks. You can restrict access to some of the service resources to only specific virtual network subnets, if you choose, by enabling a virtual network service endpoint. Learn more about [virtual network service endpoints](virtual-network-service-endpoints-overview.md), and the services that endpoints can be enabled for.

## Virtual network integration across multiple Azure services

You can deploy an Azure service into a subnet in a virtual network and secure critical service resources to that subnet. For example, you can deploy HDInsight into your virtual network and secure a storage account to the HDInsight subnet.





