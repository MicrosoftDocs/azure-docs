---
title: Virtual network for Azure services
titlesuffix: Azure Virtual Network
description: Learn how to deploy dedicated Azure services into a virtual network and learn about the capabilities those deployments provide.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 05/03/2023
ms.author: allensu
---

# Deploy dedicated Azure services into virtual networks

When you deploy dedicated Azure services in a [virtual network](virtual-networks-overview.md), you can communicate with the service resources privately, through private IP addresses.

:::image type="content" source="./media/virtual-network-for-azure-services/deploy-service-into-vnet.png" alt-text="Diagram of services deployed in a virtual network.":::

Deploying services within a virtual network provides the following capabilities:

- Resources within the virtual network can communicate with each other privately, through private IP addresses. Example, directly transferring data between HDInsight and SQL Server running on a virtual machine, in the virtual network.

- On-premises resources can access resources in a virtual network using private IP addresses over a [Site-to-Site VPN (VPN Gateway)](../vpn-gateway/design.md?toc=%2fazure%2fvirtual-network%2ftoc.json#s2smulti) or [ExpressRoute](../expressroute/expressroute-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

- Virtual networks can be [peered](virtual-network-peering-overview.md) to enable resources in the virtual networks to communicate with each other, using private IP addresses.

- Service instances are deployed into a subnet in a virtual network. Inbound and outbound network access for the subnet must be opened through [network security groups](./network-security-groups-overview.md#network-security-groups), per guidance provided by the service.

- Some services impose restrictions on the subnet they're deployed in to. This restriction limits the application of policies, routes or combining VMs and service resources within the same subnet. Check with each service on the specific restrictions as they may change over time. Examples of services are Azure NetApp Files, Dedicated HSM, Azure Container Instances, App Service. 

- Optionally, services might require a [delegated subnet](virtual-network-manage-subnet.md#add-a-subnet) as an explicit identifier that a subnet can host a particular service. With delegation, services receive explicit permissions to create service-specific resources in the delegated subnet.

- See an example of a REST API response on a [virtual network with a delegated subnet](/rest/api/virtualnetwork/virtualnetworks/get#get-virtual-network-with-a-delegated-subnet). A comprehensive list of services that are using the delegated subnet model can be obtained via the [Available Delegations](/rest/api/virtualnetwork/availabledelegations/list) API.

### Services that can be deployed into a virtual network

|Category|Service| Dedicated<sup>1</sup> Subnet
|-|-|-|
| Compute | Virtual machines: [Linux](/previous-versions/azure/virtual-machines/linux/infrastructure-example?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Windows](/previous-versions/azure/virtual-machines/windows/infrastructure-example?toc=%2fazure%2fvirtual-network%2ftoc.json) <br/>[Virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-mvss-existing-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Cloud Service](/previous-versions/azure/reference/jj156091(v=azure.100)): Virtual network (classic) only <br/> [Azure Batch](../batch/nodes-and-pools.md?toc=%2fazure%2fvirtual-network%2ftoc.json#virtual-network-vnet-and-firewall-configuration) <br/> [Azure Baremetal Infrastructure](../baremetal-infrastructure/concepts-baremetal-infrastructure-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)| No <br/> No <br/> No <br/> No<sup>2</sup> </br> No |
| Network | [Application Gateway - WAF](../application-gateway/application-gateway-ilb-arm.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Bastion](../bastion/bastion-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Firewall](../firewall/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)  <br/>[Azure Route Server](../route-server/overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[ExpressRoute Gateway](../expressroute/expressroute-about-virtual-network-gateways.md)<br/>[Network Virtual Appliances](/windows-server/networking/sdn/manage/use-network-virtual-appliances-on-a-vn)<br/>[VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md?toc=%2fazure%2fvirtual-network%2ftoc.json) <br/>[Azure DNS Private Resolver](../dns/dns-private-resolver-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)| Yes <br/> Yes <br/> Yes <br/> Yes <br/> Yes <br/> No <br/> Yes </br> No |
|Data|[RedisCache](../azure-cache-for-redis/cache-how-to-premium-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure SQL Managed Instance](/azure/azure-sql/managed-instance/connectivity-architecture-overview?toc=%2fazure%2fvirtual-network%2ftoc.json) </br> [Azure Database for MySQL - Flexible Server](../mysql/flexible-server/concepts-networking-vnet.md) </br> [Azure Database for PostgreSQL - Flexible Server](../postgresql/flexible-server/concepts-networking.md#private-access-vnet-integration)| Yes <br/> Yes <br/> Yes </br> Yes |
|Analytics | [Azure HDInsight](../hdinsight/hdinsight-plan-virtual-network-deployment.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks?toc=%2fazure%2fvirtual-network%2ftoc.json) |No<sup>2</sup> <br/> No<sup>2</sup> <br/> 
| Identity | [Microsoft Entra Domain Services](../active-directory-domain-services/tutorial-create-instance.md?toc=%2fazure%2fvirtual-network%2ftoc.json) |No <br/>
| Containers | [Azure Kubernetes Service (AKS)](../aks/concepts-network.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Container Instance (ACI)](https://www.aka.ms/acivnet)<br/>[Azure Container Service Engine](https://github.com/Azure/acs-engine) with Azure Virtual Network CNI [plug-in](https://github.com/Azure/acs-engine/tree/master/examples/vnet)<br/>[Azure Functions](../azure-functions/functions-networking-options.md#virtual-network-integration) |No<sup>2</sup><br/> Yes <br/> No <br/> Yes
| Web | [API Management](../api-management/api-management-using-with-vnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Web Apps](../app-service/overview-vnet-integration.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[App Service Environment](../app-service/overview-vnet-integration.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Logic Apps](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure Container Apps environments](../container-apps/networking.md)<br/>|Yes <br/> Yes <br/> Yes <br/> Yes <br/> Yes
| Hosted | [Azure Dedicated HSM](../dedicated-hsm/index.yml?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>[Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json)<br/>|Yes <br/> Yes <br/>
| Azure Spring Apps | [Deploy in Azure virtual network (VNet injection)](../spring-apps/how-to-deploy-in-azure-virtual-network.md)<br/>| Yes <br/>
| Virtual desktop infrastructure| [Azure Lab Services](../lab-services/how-to-connect-vnet-injection.md)<br/>| Yes <br/>
| DevOps | [Azure Load Testing](/azure/load-testing/concept-azure-load-testing-vnet-injection)<br/>| Yes <br/>

<sup>1</sup> 'Dedicated' implies that only service specific resources can be deployed in this subnet and can't be combined with customer VM/VMSSs <br/> 
<sup>2</sup> It's recommended as a best practice to have these services in a dedicated subnet, but not a mandatory requirement imposed by the service.
