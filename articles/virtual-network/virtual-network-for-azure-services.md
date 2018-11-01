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

Integrating Azure services to an Azure virtual network enables private access to the service from virtual machines or compute resources in the virtual network.
You can integrate Azure services in your virtual network with the following options:
	Directly deploying dedicated instances of the service into a virtual network. The services can then be privately accessed within the virtual network and from on-premises networks.
	By extending a virtual network to the service, through service endpoints. Service endpoints allow individual service resources to be secured to the virtual network.

To integrate multiple Azure services to your virtual network, you can combine one or more of the above patterns. For example, you can deploy HDInsight into your virtual network and secure a storage account to the HDInsight subnet through Service endpoints.
 
## Deploy Azure services into virtual networks

When you deploy dedicated Azure services in a [virtual network](virtual-networks-overview.md), you can communicate with the service resources privately, through private IP addresses.

![Services deployed in a virtual network](./media/virtual-network-for-azure-services/deploy-service-into-vnet.png)

Deploying services within a virtual network provides the following capabilities:

- Resources within the virtual network can communicate with each other privately, through private IP addresses. Example, directly transferring data between HDInsight and SQL Server running on a virtual machine, in the virtual network.
- On-premises resources can access resources in a virtual network using private IP addresses over a [Site-to-Site VPN (VPN Gateway)](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#s2smulti) or [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Virtual networks can be [peered](virtual-network-peering-overview.md) to enable resources in the virtual networks to communicate with each other, using private IP addresses.
- Service instances in a virtual network are fully managed by the Azure service, to monitor health of the instances, and provide required scale, based on load.
- Service instances are deployed into a subnet in a virtual network. Inbound and outbound network access must be opened through [network security groups](security-overview.md#network-security-groups) for the subnet, per guidance provided by the services.
- Optionally, services might require a [delegated subnet](virtual-network-manage-subnet.md#add-a-subnet) as an explicit identifier that a subnet can host a particular service. Subnet delegation gives explicit permissions to the service to create service-specific resources in the subnet.

### Services that can be deployed into a virtual network

|Category|Service|
|-|-|
| Compute | Virtual machines: [Linux](../virtual-machines/linux/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/windows/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-mvss-existing-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Cloud Service](https://msdn.microsoft.com/library/azure/jj156091): Virtual network (classic) only<br/> [Azure Batch](../batch/batch-api-basics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-network-vnet-and-firewall-configuration)  |
| Network | [Application Gateway - WAF](../application-gateway/application-gateway-ilb-arm.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) <br/>[Network Virtual Applicances](/windowsserverdocs/WindowsServerDocs/networking/sdn/manage/Use-Network-Virtual-Appliances-on-a-VN.md) 
|Data|[RedisCache](../redis-cache/cache-how-to-premium-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-vnet-configuration.md?toc=%2fazure%2fvirtual-network%2ftoc.json)|
Analytics | [Azure HDInsight](../hdinsight/hdinsight-extend-hadoop-virtual-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Databricks](../azure-databricks/what-is-azure-databricks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) |
| Identity | [Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json) |
| Containers | [Azure Kubernetes Service (AKS)](../aks/networking-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Container Instance (ACI)](http://www.aka.ms/acivnet)<br/>[Azure Container Service Engine](https://github.com/Azure/acs-engine) with Azure Virtual Network CNI [plug-in](https://github.com/Azure/acs-engine/tree/master/examples/vnet)||
| Web | [API Management](../api-management/api-management-using-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[App Service Environment](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>
<br/>


## Service endpoints for Azure services

Some Azure services can't be deployed in virtual networks. You can restrict access to some of the service resources to only specific virtual network subnets, if you choose, by enabling a virtual network service endpoint.  Learn more about [virtual network service endpoints](virtual-network-service-endpoints-overview.md), and the services that endpoints can be enabled for.
