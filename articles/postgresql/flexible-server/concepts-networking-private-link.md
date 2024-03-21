---
title: Networking overview with Private Link connectivity
description: Learn about connectivity and networking options for Azure Database for PostgreSQL - Flexible Server with Private Link.
author: GennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 01/22/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.custom:
  - ignite-2023
ms.topic: conceptual
---

# Azure Database for PostgreSQL - Flexible Server networking with Private Link 

**Azure Private Link** allows you to create private endpoints for Azure Database for PostgreSQL flexible server to bring it inside your Virtual Network (virtual network). That functionality is introduced **in addition** to already [existing networking capabilities provided by VNET Integration](./concepts-networking-private.md), which is currently in general availability with Azure Database for PostgreSQL flexible server. With **Private Link**, traffic between your virtual network and the service travels the Microsoft backbone network. Exposing your service to the public internet is no longer necessary. You can create your own private link service in your virtual network and deliver it to your customers. Setup and consumption using Azure Private Link is consistent across Azure PaaS, customer-owned, and shared partner services.





Private Link is exposed to users through two  Azure resource types:

- Private Endpoints (Microsoft.Network/PrivateEndpoints)
- Private Link Services (Microsoft.Network/PrivateLinkServices)

## Private Endpoints

A **Private Endpoint** adds a network interface to a resource, providing it with a private IP address assigned from your VNET (Virtual Network). Once applied, you can communicate with this resource exclusively via the virtual network (VNET).
For a list to PaaS services that support Private Link functionality, review the Private Link [documentation](../../private-link/private-link-overview.md). A **private endpoint** is a private IP address within a specific [VNet](../../virtual-network/virtual-networks-overview.md) and Subnet.

The same public service instance can be referenced by multiple private endpoints in different VNets/subnets, even if they belong to different users/subscriptions (including within differing Microsoft Entra ID tenants) or if they have overlapping address spaces.


## Key Benefits of Azure Private Link

**Azure Private Link** provides the following benefits:

- **Privately access services on the Azure platform:** Connect your virtual network using private endpoints to all services that can be used as application components in Azure. Service providers can render their services in their own virtual network and consumers can access those services in their local virtual network. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network.

- **On-premises and peered networks:** Access services running in Azure from on-premises over ExpressRoute private peering, VPN tunnels, and peered virtual networks using private endpoints. There's no need to configure ExpressRoute Microsoft peering or traverse the internet to reach the service. Private Link provides a secure way to migrate workloads to Azure.

- **Protection against data leakage:** A private endpoint is mapped to an instance of a PaaS resource instead of the entire service. Consumers can only connect to the specific resource. Access to any other resource in the service is blocked. This mechanism provides protection against data leakage risks.

- **Global reach: Connect privately to services running in other regions.** The consumer's virtual network could be in region A and it can connect to services behind Private Link in region B.

## Use Cases for Private Link with Azure Database for PostgreSQL flexible server in  Preview

Clients can connect to the private endpoint from the same VNet, peered VNet in same region or across regions, or via [VNet-to-VNet connection](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) across regions. Additionally, clients can connect from on-premises using ExpressRoute, private peering, or VPN tunneling. Below is a simplified diagram showing the common use cases.

:::image type="content" source="./media/concepts-networking/show-private-link-overview.png" alt-text="Diagram that shows how Azure Private Link works with Private Endpoints."  lightbox="./media/concepts-networking/show-private-link-overview.png":::

### Limitations and Supported Features for Private Link  with Azure Database for PostgreSQL flexible server


Cross Feature Availability Matrix for Private Endpoint in Azure Database for PostgreSQL flexible server.

| **Feature** | **Availability** | **Notes** |
| --- | --- | --- |
| High Availability (HA) | Yes |Works as designed |
| Read Replica | Yes | Works as designed|
| Read Replica with Virtual Endpoints|Yes|**Important limitation: Supported with single read replica** |
| Point in Time Restore (PITR) | Yes |Works as designed |
| Allowing also public/internet access with firewall rules | Yes | Works as designed|
| Major Version Upgrade (MVU) | Yes | Works as designed |
| Microsoft Entra Authentication (Entra Auth) | Yes | Works as designed |
| Connection pooling with PGBouncer | Yes | Works as designed |
| Private Endpoint DNS | Yes | Works as designed and [documented](../../private-link/private-endpoint-dns.md) |
| Encryption with Customer Managed Keys (CMK)| Yes| Works as designed|


### Connect from an Azure VM in Peered Virtual Network 

Configure [virtual network peering](../../virtual-network/tutorial-connect-virtual-networks-powershell.md) to establish connectivity to Azure Database for PostgreSQL flexible server from an Azure VM in a peered virtual network.

### Connect from an Azure VM in VNet-to-VNet environment

Configure [VNet-to-VNet VPN gateway](../../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) connection to establish connectivity to an Azure Database for PostgreSQL flexible server instance from an Azure VM in a different region or subscription.

### Connect from an on-premises environment over VPN

To establish connectivity from an on-premises environment to the Azure Database for PostgreSQL flexible server instance, choose and implement one of the options:
- [Point-to-Site Connection](../../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)
- [Site-to-Site VPN Connection](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)
- [ExpressRoute Circuit](../../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)

## Network Security and Private Link

When you use private endpoints, traffic is secured to a **private-link resource**. The platform validates network connections, allowing only those connections that reach the specified private-link resource. To access more subresources within the same Azure service, more private endpoints with corresponding targets are required. In the case of Azure Storage, for instance, you would need separate private endpoints to access the file and blob subresources.

**Private endpoints** provide a privately accessible IP address for the Azure service, but don't necessarily restrict public network access to it. All other Azure services require another [access controls](../../event-hubs/event-hubs-ip-filtering.md), however. These controls provide an extra network security layer to your resources, providing protection that helps prevent access to the Azure service associated with the private-link resource.

Private endpoints support network policies. Network policies enable support for Network Security Groups (NSG), User Defined Routes (UDR), and Application Security Groups (ASG). For more information about enabling network policies for a private endpoint, see [Manage network policies for private endpoints](../../private-link/disable-private-endpoint-network-policy.md). To use an ASG with a private endpoint, see [Configure an application security group (ASG) with a private endpoint](../../private-link/configure-asg-private-endpoint.md).

## Private Link and DNS

When using a private endpoint, you need to connect to the same Azure service but use the private endpoint IP address. The intimate endpoint connection requires separate DNS settings to resolve the private IP address to the resource name.
Private DNS zones provide domain name resolution within a virtual network without a custom DNS solution. You link the private DNS zones to each virtual network to provide DNS services to that network.

Private DNS zones provide separate DNS zone names for each Azure service. For example, if you configured a private DNS zone for the storage account blob service in the previous image, the DNS zones name is **privatelink.blob.core.windows.net**. Check out the Microsoft documentation here to see more of the private DNS zone names for all Azure services.
> [!NOTE]  
> Private endpoint private DNS zone configurations will only automatically generate if you use the recommended naming scheme: **privatelink.postgres.database.azure.com**
> On newly provisioned public access (non VNET injected) servers there is a temporary DNS layout change. The server's FQDN will now be a CName, resolving to A record, in format **servername.privatelink.postgres.database.azure.com**. In the near future, this format will apply  only when private endpoints are created on the server.


## Private Link and Network Security Groups

By default, network policies are disabled for a subnet in a virtual network. To utilize network policies like User-Defined Routes and Network Security Groups support, network policy support must be enabled for the subnet. This setting is only applicable to private endpoints within the subnet. This setting affects all private endpoints within the subnet. For other resources in the subnet, access is controlled based on security rules in the network security group.

Network policies can be enabled either for Network Security Groups only, for User-Defined Routes only, or for both. For more you can see [Azure docs](../../private-link/disable-private-endpoint-network-policy.md?tabs=network-policy-portal)

Limitations to Network Security Groups (NSG) and Private Endpoints are listed [here](../../private-link/private-endpoint-overview.md)

 > [!IMPORTANT]
 > Protection against data leakage: A private endpoint is mapped to an instance of a PaaS resource instead of the entire service. Consumers can only connect to the specific resource. Access to any other resource in the service is blocked. This mechanism provides basic protection against data leakage risks.

## Private Link combined with firewall rules

The following situations and outcomes are possible when you use Private Link in combination with firewall rules:

- If you don't configure any firewall rules, then by default, no traffic is able to access the Azure Database for PostgreSQL flexible server instance.

- If you configure public traffic or a service endpoint and you create private endpoints, then different types of incoming traffic are authorized by the corresponding type of firewall rule.

- If you don't configure any public traffic or service endpoint and you create private endpoints, then the Azure Database for PostgreSQL flexible server instance is accessible only through the private endpoints. If you don't configure public traffic or a service endpoint, after all approved private endpoints are rejected or deleted, no traffic will be able to access the Azure Database for PostgreSQL flexible server instance.

## Troubleshooting connectivity issues with Private Endpoint based networking

Following are basic areas to check if you're having connectivity issues using Private Endpoint based networking:

1. **Verify IP Address Assignments:** Check that the private endpoint has the correct IP address assigned and that there are no conflicts with other resources. For more information on private endpoint and IP see this [doc](../../private-link/manage-private-endpoint.md)
2. **Check Network Security Groups (NSGs):** Review the NSG rules for the private endpoint's subnet to ensure the necessary traffic is allowed and doesn't have conflicting rules.  For more information on NSG see this [doc](../../virtual-network/network-security-groups-overview.md)
3. **Validate Route Table Configuration:** Ensure the route tables associated with the private endpoint's subnet and the connected resources are correctly configured with the appropriate routes.
4. **Use Network Monitoring and Diagnostics:** Leverage Azure Network Watcher to monitor and diagnose network traffic using tools like Connection Monitor or Packet Capture. For more information on network diagnostics see this [doc](../../network-watcher/network-watcher-overview.md)

Further details on troubleshooting private are also available in this [guide](../../private-link/troubleshoot-private-endpoint-connectivity.md)

## Troubleshooting DNS resolution with Private Endpoint based networking

Following are basic areas to check if you are having DNS resolution issues using Private Endpoint based networking:

1. **Validate DNS Resolution:** Check if the DNS server or service used by the private endpoint and the connected resources is functioning correctly. Ensure the private endpoint's DNS settings are accurate. For more information on private endpoints and DNS zone settings see this [doc](../../private-link/private-endpoint-dns.md)
2. **Clear DNS Cache:** Clear the DNS cache on the private endpoint or client machine to ensure the latest DNS information is retrieved and avoid inconsistent errors.
3. **Analyze DNS Logs:** Review DNS logs for error messages or unusual patterns, such as DNS query failures, server errors, or timeouts. For more on DNS metrics see this [doc](../../dns/dns-alerts-metrics.md)


## Next steps

- Learn how to create an Azure Database for PostgreSQL flexible server instance by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
