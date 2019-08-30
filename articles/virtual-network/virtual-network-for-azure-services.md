---
title: Virtual network for Azure services
titlesuffix: Azure Virtual Network
description: Learn about the benefits of deploying resources into a virtual network. Resources in virtual networks can communicate with each other, and on-premises resources, without traffic traversing the Internet.
services: virtual-network
documentationcenter: na
author: malopMSFT
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2017
ms.author: malop
ms.reviewer: kumud

---

# Virtual network integration for Azure services

Integrating Azure services to an Azure virtual network enables private access to the service from virtual machines or compute resources in the virtual network.
You can integrate Azure services in your virtual network with the following options:
- Deploying dedicated instances of the service into a virtual network. The services can then be privately accessed within the virtual network and from on-premises networks.
- Extending a virtual network to the service, through service endpoints. Service endpoints allow individual service resources to be secured to the virtual network.

To integrate multiple Azure services to your virtual network, you can combine one or more of the above patterns. For example, you can deploy HDInsight into your virtual network and secure a storage account to the HDInsight subnet through Service endpoints.
 
## Deploy Azure services into virtual networks

When you deploy dedicated Azure services in a [virtual network](virtual-networks-overview.md), you can communicate with the service resources privately, through private IP addresses.

![Services deployed in a virtual network](./media/virtual-network-for-azure-services/deploy-service-into-vnet.png)

Deploying services within a virtual network provides the following capabilities:

- Resources within the virtual network can communicate with each other privately, through private IP addresses. Example, directly transferring data between HDInsight and SQL Server running on a virtual machine, in the virtual network.
- On-premises resources can access resources in a virtual network using private IP addresses over a [Site-to-Site VPN (VPN Gateway)](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json#s2smulti) or [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).
- Virtual networks can be [peered](virtual-network-peering-overview.md) to enable resources in the virtual networks to communicate with each other, using private IP addresses.
- Service instances in a virtual network are typically fully managed by the Azure service. This includes monitoring the health of the resources  and scaling with load.
- Service instances are deployed into a subnet in a virtual network. Inbound and outbound network access for the subnet must be opened through [network security groups](security-overview.md#network-security-groups), per guidance provided by the service.
- Certain services also impose restrictions on the subnet they are deployed in, limiting the application of policies, routes or combining VMs and service resources within the same subnet. Check with each service on the specific restrictions as they may change over time. Examples of such services are Azure NetApp Files, Dedicated HSM, Azure Container Instances, App Service. 
- Optionally, services might require a [delegated subnet](virtual-network-manage-subnet.md#add-a-subnet) as an explicit identifier that a subnet can host a particular service. By delegating, services get explicit permissions to create service-specific resources in the delegated subnet.
- See an example of a REST API response on a [virtual network with a delegated subnet](https://docs.microsoft.com/rest/api/virtualnetwork/virtualnetworks/get#get-virtual-network-with-a-delegated-subnet). A comprehensive list of services that are using the delegated subnet model can be obtained via the [Available Delegations](https://docs.microsoft.com/rest/api/virtualnetwork/availabledelegations/list) API.

### Services that can be deployed into a virtual network

|Category|Service| Dedicated¹ Subnet
|-|-|-|
| Compute | Virtual machines: [Linux](../virtual-machines/linux/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](../virtual-machines/windows/infrastructure-networking-guidelines.md?toc=%2fazure%2fvirtual-network%2ftoc.json) <br/>[Virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-mvss-existing-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Cloud Service](https://msdn.microsoft.com/library/azure/jj156091): Virtual network (classic) only<br/> [Azure Batch](../batch/batch-api-basics.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-network-vnet-and-firewall-configuration)| No <br/> No <br/> No <br/> No²
| Network | [Application Gateway - WAF](../application-gateway/application-gateway-ilb-arm.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json) <br/>[Network Virtual Appliances](/windows-server/networking/sdn/manage/use-network-virtual-appliances-on-a-vn) | Yes <br/> Yes <br/> Yes <br/> No
|Data|[RedisCache](../azure-cache-for-redis/cache-how-to-premium-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure SQL Database Managed Instance](../sql-database/sql-database-managed-instance-connectivity-architecture.md?toc=%2fazure%2fvirtual-network%2ftoc.json)| Yes <br/> Yes <br/> 
|Analytics | [Azure HDInsight](../hdinsight/hdinsight-extend-hadoop-virtual-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Databricks](../azure-databricks/what-is-azure-databricks.md?toc=%2fazure%2fvirtual-network%2ftoc.json) |No² <br/> No² <br/> 
| Identity | [Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json) |No <br/>
| Containers | [Azure Kubernetes Service (AKS)](../aks/concepts-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Container Instance (ACI)](https://www.aka.ms/acivnet)<br/>[Azure Container Service Engine](https://github.com/Azure/acs-engine) with Azure Virtual Network CNI [plug-in](https://github.com/Azure/acs-engine/tree/master/examples/vnet)|No²<br/> Yes <br/><br/> No
| Web | [API Management](../api-management/api-management-using-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[App Service Environment](../app-service/web-sites-integrate-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>|Yes <br/> Yes <br/> Yes
| Hosted | [Azure Dedicated HSM](../dedicated-hsm/index.yml?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>|Yes <br/> Yes <br/>
| | |

¹ 'Dedicated' implies that only service specific resources can be deployed in this subnet and cannot be combined with customer VM/VMSSs <br/> 
² Recommended, but not a mandatory requirement imposed by the service.


## Service endpoints for Azure services

Some Azure services can't be deployed in virtual networks. You can restrict access to some of the service resources to only specific virtual network subnets, if you choose, by enabling a virtual network service endpoint.  Learn more about [virtual network service endpoints](virtual-network-service-endpoints-overview.md), and the services that endpoints can be enabled for.
