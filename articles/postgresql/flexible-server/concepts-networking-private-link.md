---
title: Networking overview - Azure Database for PostgreSQL - Flexible Server with Private Link connectivity
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for PostgreSQL with Private Link
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: gennadyk
author: GennadNY
ms.reviewer: 
ms.date: 11/30/2021
---

# Azure Database for PostgreSQL Flexible Server Networking with Private Link - Preview

*Azure Private Link** allows you to create private endpoints for Azure Database for PostgreSQL - Flexible server to bring it inside your Virtual Network (VNet), in addition to already [existing networking capabilities provided by VNET injection](./concepts-networking-private.md) currently in general availability with Azure Database for PostgreSQL - Flexible Server. With Private Link,traffic between your virtual network and the service travels the Microsoft backbone network. Exposing your service to the public internet is no longer necessary. You can create your own private link service in your virtual network and deliver it to your customers. Setup and consumption using Azure Private Link is consistent across Azure PaaS, customer-owned, and shared partner services.

Private Link is exposed to users through two  Azure resource types:

- Private Endpoints (Microsoft.Network/PrivateEndpoints)
- Private Link Services (Microsoft.Network/PrivateLinkServices)

## Private Endpoints

A **Private Endpoint** adds a network interface to a resource, providing it with a private IP address assigned from your VNET (Virtual Network). Once applied, you can communicate with this resource exclusively via the virtual network (VNET).
For a list to PaaS services that support Private Link functionality, review the Private Link [documentation](../../private-link/private-link-overview.md). A private endpoint is a private IP address within a specific [VNet](../../virtual-network/virtual-networks-overview.md) and Subnet.

The same public service instance can be referenced by multiple private endpoints in different VNets/subnets, even if they belong to different users/subscriptions (including within differing Azure Active Directory (AAD) tenants) or if they have overlapping address spaces.

  :::image type="content""content" source="./media/concepts-networking/azure-private-link.png" alt-text="Diagram that shows how Azure Private Link works with Private Endpoints." :::



## Key Benefits of Azure Private Link

Azure Private Link provides the following benefits:

- **Privately access services on the Azure platform:** Connect your virtual network using private endpoints to all services that can be used as application components in Azure. Service providers can render their services in their own virtual network and consumers can access those services in their local virtual network. The Private Link platform will handle the connectivity between the consumer and services over the Azure backbone network.

- **On-premises and peered networks:** Access services running in Azure from on-premises over ExpressRoute private peering, VPN tunnels, and peered virtual networks using private endpoints. There's no need to configure ExpressRoute Microsoft peering or traverse the internet to reach the service. Private Link provides a secure way to migrate workloads to Azure.

- **Protection against data leakage:** A private endpoint is mapped to an instance of a PaaS resource instead of the entire service. Consumers can only connect to the specific resource. Access to any other resource in the service is blocked. This mechanism provides protection against data leakage risks.

- **Global reach: Connect privately to services running in other regions.** The consumer's virtual network could be in region A and it can connect to services behind Private Link in region B.

## Use Cases for Private Link with Azure Database for PostgreSQL - Flexible Server in Private Preview

Clients can connect to the private endpoint from the same VNet, [peered VNet](../../virtual-network/) in same region or across regions, or via [VNet-to-VNet connection](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

:::image type="content" source="./media/concepts-networking/show-private-link-overview.png" alt-text="Diagram that shows how Azure Private Link works with Private Endpoints." :::

### Limitations and Supported Features for Private Link Private Preview with Azure Database for PostgreSQL - Flexible Server

In the private preview of Private Endpoint for PostgreSQL flexible server, **we only support single-instance, non-HA servers**. Most features will work, but anything that communicates to other servers/instances we've had to redesign because we've changed the backend architecture for even better security.

Some of the features that do not work yet may be made available during private preview with normal service updates. Most (if not all) will be available with public preview in a couple of months.

Cross Feature Availability Matrix

| **Feature**   | **Availability** | **Notes**  |
| --------- | ------------ | --------- |
| High Availability (HA)    | No   |    |
| Read Replica   | No   |    |
| Geo Read Replica   | No   |    |
| Point in Time Restore (PITR)   | No   |    |
| Allowing also public/internet access with firewall rules   | No   |    |
|Major Version Upgrade (MVU)   | Yes   |  Works as designed  |
| Azure Active Directory Authentocation (AAD Auth)   | Yes   | Works as designed   |
| Connection pooling with PGBouncer   | Yes   |  Works as designed  |
| Private Endpoint DNS  | Yes   |  Works as designed and [documented](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns) |

There are also **following edge case limitations** that are currently not supported in Private Preview, but will be resolved in next few feature releases:
- Restore from PITR backup is not supported with PE enabled servers.
- Private Endpoint Connection description property is not populated. The description field shown in the PG/Networking blade will be empty for the connections. Providing connection description isn't supported and if updated while connection is moved from rejected state to pending, the operation may be blocked
- Provisioned PE capable servers will not be publicly accessible outside of PE connections. 
- Currently we have an issue for private endpoint capable servers where there will be an A record cannot be reused when a server is dropped. This translates into a problem that will **prevent recreating the server with the same name**. This issue is expected to be fixed as soon as possible.

### Connecting from an Azure VM in Peered Virtual Network (VNet)

Configure [VNet peering](../../virtual-network/tutorial-connect-virtual-networks-powershell.md) to establish connectivity to the Azure Database for PostgreSQL - Flexible server from an Azure VM in a peered VNet.

### Connecting from an Azure VM in VNet-to-VNet environment

Configure [VNet-to-VNet VPN gateway](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) connection to establish connectivity to a Azure Database for PostgreSQL - Flexible server from an Azure VM in a different region or subscription.


### Connecting from an on-premises environment over VPN

To establish connectivity from an on-premises environment to the Azure Database for PostgreSQL - Flexible server, choose and implement one of the options:
 - [Point-to-Site Connection](../../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)
 - [Site-to-Site VPN Connection](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
 - [ExpressRoute Circuit](../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)


## Network Security and Private Link

When you use private endpoints, traffic is secured to a private-link resource. The platform validates network connections, allowing only those that reach the specified private-link resource. To access more subresources within the same Azure service, more private endpoints with corresponding targets are required. In the case of Azure Storage, for instance, you would need separate private endpoints to access the file and blob subresources.

Private endpoints provide a privately accessible IP address for the Azure service, but do not necessarily restrict public network access to it. All other Azure services require additional [access controls](../../event-hubs/event-hubs-ip-filtering.md), however. These controls provide an extra network security layer to your resources, providing protection that helps prevent access to the Azure service associated with the private-link resource.

Private endpoints support network policies. Network policies enable support for Network Security Groups (NSG), User Defined Routes (UDR), and Application Security Groups (ASG). For more information about enabling network policies for a private endpoint, see [Manage network policies for private endpoints](../../private-link/disable-private-endpoint-network-policy?tabs=network-policy-portal.md). To use an ASG with a private endpoint, see [Configure an application security group (ASG) with a private endpoint](../../private-link/configure-asg-private-endpoint.md?tabs=portal).
## Private Link and DNS

When using a private endpoint, you need to connect to the same Azure service but use the private endpoint IP address. The intimate endpoint connection requires separate DNS settings to resolve the private IP address to the resource name.
Private DNS zones provide domain name resolution within a virtual network without a custom DNS solution. You link the private DNS zones to each virtual network to provide DNS services to that network.

Private DNS zones provide separate DNS zone names for each Azure service. For example, if you configured a private DNS zone for the storage account blob service in the previous image, the DNS zones name is **privatelink.blob.core.windows.net**. Check out the Microsoft documentation here to see more of the private DNS zone names for all Azure services.
> [!NOTE]
>Private endpoint private DNS zone configurations will only automatically generate if you use the recommended naming scheme: **privatelink.postgres.database.azure.com**

## Private Link and Network Security Groups

By default, network policies are disabled for a subnet in a virtual network. To utilize network policies like User-Defined Routes and Network Security Groups support, network policy support must be enabled for the subnet. This setting is only applicable to private endpoints within the subnet. This setting affects all private endpoints within the subnet. For other resources in the subnet, access is controlled based on security rules in the network security group.

Network policies can be enabled either for Network Security Groups only, for User-Defined Routes only, or for both. For more you can see [Azure docs](../../private-link/disable-private-endpoint-network-policy.md?tabs=network-policy-portal)

Limitations to Network Security Groups (NSG) and Private Endpoints are listed [here](../../private-link/private-endpoint-overview#limitations.md)


## Private Link combined with firewall rules

The following situations and outcomes are possible when you use Private Link in combination with firewall rules:

* If you don't configure any firewall rules, then by default, no traffic will be able to access the Azure Database for PostgreSQL Flexible server.

* If you configure public traffic or a service endpoint and you create private endpoints, then different types of incoming traffic are authorized by the corresponding type of firewall rule.

* If you don't configure any public traffic or service endpoint and you create private endpoints, then the Azure Database for PostgreSQL Flexible server is accessible only through the private endpoints. If you don't configure public traffic or a service endpoint, after all approved private endpoints are rejected or deleted, no traffic will be able to access the Azure Database for PostgreSQL Flexible server. 

## Next steps

* Learn how to create a flexible server by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
