---
title: Virtual network integration of Azure services for network isolation
titlesuffix: Azure Virtual Network
description: This article describes different methods of integrating an Azure service to a virtual network that enables you to securely access the Azure service.
author: asudbring
ms.service: virtual-network
ms.topic: conceptual
ms.custom: ignite-2022
ms.date: 05/08/2023
ms.author: allensu
---

# Integrate Azure services with virtual networks for network isolation

Virtual Network integration for an Azure service enables you to lock down access to the service to only your virtual network infrastructure. The virtual network infrastructure also includes peered virtual networks and on-premises networks.

Virtual network integration provides Azure services the benefits of network isolation with one or more of the following methods:

- [Deploying dedicated instances of the service into a virtual network](virtual-network-for-azure-services.md). The services can then be privately accessed within the virtual network and from on-premises networks.

- Using [Private Endpoint](../private-link/private-endpoint-overview.md) that connects you privately and securely to a service powered by [Azure Private Link](../private-link/private-link-overview.md). Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network.

- Accessing the service using public endpoints by extending a virtual network to the service, through [service endpoints](virtual-network-service-endpoints-overview.md). Service endpoints allow service resources to be secured to the virtual network.

- Using [service tags](service-tags-overview.md) to allow or deny traffic to your Azure resources to and from public IP endpoints.

## Deploy dedicated Azure services into virtual networks

When you deploy dedicated Azure services in a virtual network, you can communicate with the service resources privately, through private IP addresses.

:::image type="content" source="./media/virtual-network-for-azure-services/deploy-service-into-vnet.png" alt-text="Diagram of deploy dedicated Azure services into virtual networks.":::

Deploying a dedicated Azure service into your virtual network provides the following capabilities:

- Resources within the virtual network can communicate with each other privately, through private IP addresses. Example, directly transferring data between HDInsight and SQL Server running on a virtual machine, in the virtual network.

- On-premises resources can access resources in a virtual network using private IP addresses over a Site-to-Site VPN (VPN Gateway) or ExpressRoute.

- Virtual networks can be peered to enable resources in the virtual networks to communicate with each other, using private IP addresses.

- The Azure service fully manages service instances in a virtual network. This management includes monitoring the health of the resources and scaling with load.

- Service instances are deployed into a subnet in a virtual network. Inbound and outbound network access for the subnet must be opened through network security groups, per guidance provided by the service.

- Certain services impose restrictions on the subnet they're deployed in. These restrictions limit the application of policies, routes, or combining VMs and service resources within the same subnet. Check with each service on the specific restrictions as they may change over time. Examples of such services are Azure NetApp Files, Dedicated HSM, Azure Container Instances, App Service.

- Optionally, services might require a delegated subnet as an explicit identifier that a subnet can host a particular service. Azure services have explicit permission to create service-specific resources in the delegated subnet with delegation.

- See an example of a REST API response on a virtual network with a delegated subnet. A comprehensive list of services that are using the delegated subnet model can be obtained via the Available Delegations API.

For a list of services that can be deployed into a virtual network, see [Deploy dedicated Azure services into virtual networks](virtual-network-for-azure-services.md).

## Private Link and Private Endpoints

Private endpoints allow ingress of traffic from your virtual network to an Azure resource securely. This private link is established without the need of public IP addresses. A private endpoint is a special network interface for an Azure service in your virtual network. When you create a private endpoint for your resource, it provides secure connectivity between clients on your virtual network and your Azure resource. The private endpoint is assigned an IP address from the IP address range of your virtual network. The connection between the private endpoint and the Azure service is a private link.

In the diagram, the right shows an Azure SQL Database as the target PaaS service. The target can be [any service that supports private endpoints](../private-link/availability.md). There are multiple instances of the logical SQL Server for multiple customers, which are all reachable over public IP addresses.

In this case, one instance of a logical SQL Server is exposed with a private endpoint. The endpoint makes the SQL Server reachable through a private IP address in the client's virtual network. Because of the change in DNS configuration, the client application now sends its traffic directly to that private endpoint. The target service sees traffic originating from a private IP address of the virtual network. 

The green arrow represents private link. A public IP address can still _exist_ for the target resource alongside the private endpoint. The public IP is no longer used by the client application. The firewall can now disallow any access for that public IP address, making it accessible _only_ over private endpoints. Connections to a SQL server without a private endpoint from the virtual network originates from a public IP address. The blue arrow represents this flow.

:::image type="content" source="./media/network-isolation/architecture-private-endpoints.png" alt-text="Diagram of Private Endpoints.":::

The client application typically uses a DNS host name to reach the target service. No changes are needed to the application. [DNS resolution in the virtual network must be configured](../private-link/private-endpoint-dns.md) to resolve that same host name to the target resource's private IP address instead of the original public IP address. With a private path between the client and the target service, the client doesn't rely on the public IP address. The target service can turn off public access.

This exposure of individual instances allows you to [prevent data theft](../private-link/private-endpoint-overview.md#network-security-of-private-endpoints). A malicious actor is unable to gather information from the database and upload it to another public database or storage account. You can prevent access to the public IP addresses of _all_ PaaS services. You can still allow access to PaaS instances through their private endpoints.

For more information on Private link and the list of Azure services supported, see [What is Private Link?](../private-link/private-link-overview.md).

## Service endpoints

Service endpoints provide secure and direct connectivity to Azure services over the Azure backbone network. Endpoints allow you to secure your Azure resources to only your virtual networks. Service endpoints enable private IP addresses in the virtual network to reach an Azure service without the need of an outbound public IP.

Without service endpoints, restricting access to just your virtual network can be challenging. The source IP address could change or could be shared with other customers. For example, PaaS services with shared outbound IP addresses. With service endpoints, the source IP address that the target service sees becomes a private IP address from your virtual network. This ingress traffic change allows for easily identifying the origin and using it for configuring appropriate firewall rules. For example, allowing only traffic from a specific subnet within that virtual network.

With service endpoints, DNS entries for Azure services remain as-is and continue to resolve to public IP addresses assigned to the Azure service.

In the following diagram, the right side is the same target PaaS service. On the left, there's a customer virtual network with two subnets: Subnet A which has a Service Endpoint towards `Microsoft.Sql`, and Subnet B, which has no Service Endpoints defined. 

When a resource in Subnet B tries to reach any SQL Server, it uses a public IP address for outbound communication. The blue arrow represents this traffic. The SQL Server firewall must use that public IP address to allow or block the network traffic. 

When a resource in Subnet A tries to reach a database server, it's seen as a private IP address from within the virtual network. The green arrows represent this traffic. The SQL Server firewall can now specifically allow or block Subnet A. Knowledge of the public IP address of the source service is unneeded.

:::image type="content" source="./media/network-isolation/architecture-service-endpoints.png" alt-text="Diagram of Service Endpoints.":::

Service endpoints apply to **all** instances of the target service. For example, **all** SQL Server instances of Azure customers, not just the customer's instance.

For more information, see [Virtual network service endpoints](virtual-network-service-endpoints-overview.md)

## Service tags

A service tag represents a group of IP address prefixes from a given Azure service. With service tags, you can define network access controls on [network security groups](./network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). You can allow or deny the traffic for the service. To allow or deny the traffic, specify the service tag in the source or destination field of a rule. 

:::image type="content" source="./media/network-isolation/service-tags.png" alt-text="Diagram of Allow or deny traffic using Service Tags.":::

Achieve network isolation and protect your Azure resources from the Internet while accessing Azure services that have public endpoints. Create inbound/outbound network security group rules to deny traffic to and from **Internet** and allow traffic to/from **AzureCloud**. For more service tags, see [available service tags](service-tags-overview.md#available-service-tags) of specific Azure services.

For more information about Service Tags and Azure services that support them, see [Service Tags Overview](service-tags-overview.md)

## Compare Private Endpoints and Service Endpoints

>[!NOTE]
> Microsoft recommends using Azure Private Link. Private Link offers better capabilities in terms of privately accessing PaaS from on-premises, in built data-exfiltration protection and mapping service to Private IP in your own network. For more information, see [Azure Private Link](../private-link/private-link-overview.md)

Rather than looking only at their differences, it's worth pointing out that both service endpoints and private endpoints have characteristics in common.

Both features are used for more granular control over the firewall on the target service. For example, restricting access to SQL Server databases or storage accounts. The operation is different for both though, as discussed in more detail in the previous sections.

Both approaches overcome the problem of [Source Network Address Translation (SNAT) port exhaustion](../load-balancer/load-balancer-outbound-connections.md#scenarios). You may find exhaustion when you're tunneling traffic through a Network Virtual Appliance (NVA) or service with SNAT port limitations. When you use service endpoints or private endpoints, the traffic takes an optimized path directly to the target service. Both approaches can benefit bandwidth intensive applications since both latency and cost are reduced.

In both cases, you can still ensure that traffic into the target service passes through a network firewall or NVA. This procedure is different for both approaches. When using service endpoints, you should configure the service endpoint on the **firewall** subnet, rather than the subnet where the source service is deployed. When using private endpoints you put a User Defined Route (UDR) for the private endpoint's IP address on the **source** subnet. Not in the subnet of the private endpoint.

To compare and understand the differences, see the following table.

| Consideration                                                                                                                                    | Service Endpoints                                                                                                           | Private Endpoints                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Service scope at which level the configuration applies                                                                                                   | Entire service (for example, _all_ SQL Servers or Storage accounts of _all_ customers)                                      | Individual instance (for example, a specific SQL Server instance or Storage account _you_ own)                                                                    |
|In-Built Data Exfiltration Protection - ability to move/copy data from protected PaaS resource to other unprotected PaaS resource by malicious insider| No | Yes|
|Private Access to PaaS resource from on-premises| No| Yes|
|NSG configuration required for Service Access| Yes (using Service Tags)| No|
| Service can be reached without using any public IP address                                                                                       | No                                                                                                                          | Yes                                                                                                                                                               |
| Azure-to-Azure traffic stays on the Azure backbone network                                                                                       | Yes                                                                                                                         | Yes                                                                                                                                                               |
| Service can disable its public IP address                                                                                                        | No                                                                                                                          | Yes                                                                                                                                                               |
| You can easily restrict traffic coming from an Azure Virtual Network                                                                             | Yes (allow access from specific subnets and or use NSGs)                                                                   | Yes                                                                                                                                                               |
| You can easily restrict traffic coming from on-premises (VPN/ExpressRoute)                                                                           | N/A**                                                                                                                       | Yes                                                                                                                                                               |
| Requires DNS changes                                                                                                                             | No                                                                                                                          | Yes (see [DNS configuration](../private-link/private-endpoint-dns.md))                                                                 |
| Impacts the cost of your solution                                                                                                                | No                                                                                                                          | Yes (see [Private link pricing](https://azure.microsoft.com/pricing/details/private-link/))                                                                       |
| Impacts the [composite SLA](/azure/architecture/framework/resiliency/business-metrics#composite-slas) of your solution | No                                                                                                                          | Yes (Private link service itself has a [99.99% SLA](https://azure.microsoft.com/support/legal/sla/private-link/))                                                 |
| Setup and maintenance | Simple to set up with less management overhead | Extra effort is required |
| Limits | No limit on the total number of service endpoints in a virtual network. Azure services may enforce limits on the number of subnets used for securing the resource. (see [virtual network FAQ](virtual-networks-faq.md#are-there-any-limits-on-how-many-service-endpoints-i-can-set-up-from-my-virtual-network)) | Yes (see [Private Link limits](../azure-resource-manager/management/azure-subscription-service-limits.md#private-link-limits)) |

**Azure service resources secured to virtual networks aren't reachable from on-premises networks. If you want to allow traffic from on-premises, allow public (typically, NAT) IP addresses from your on-premises or ExpressRoute. These IP addresses can be added through the IP firewall configuration for the Azure service resources. For more information, see the [virtual network FAQ](virtual-networks-faq.md#can-an-on-premises-devices-ip-address-thats-connected-through-an-azure-virtual-network-gateway-vpn-or-expressroute-gateway-access-azure-paas-services-over-virtual-network-service-endpoints).

## Next steps

- Learn how to [integrate your app with an Azure network](../app-service/overview-vnet-integration.md).

- Learn how to [restrict access to resources using Service Tags](tutorial-restrict-network-access-to-resources.md).

- Learn how to [connect privately to an Azure Cosmos DB account via Azure Private Link](../private-link/tutorial-private-endpoint-cosmosdb-portal.md).
