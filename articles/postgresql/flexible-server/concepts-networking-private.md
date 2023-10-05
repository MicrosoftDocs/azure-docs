---
title: Networking overview - Azure Database for PostgreSQL - Flexible Server with private access (VNET)
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for PostgreSQL with private access (VNET)
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: gennadyk
author: GennadNY
ms.reviewer: 
ms.date: 11/30/2021
---

# Networking overview for Azure Database for PostgreSQL - Flexible Server with private access (VNET Integration)



[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article describes connectivity and networking concepts for Azure Database for PostgreSQL - Flexible Server. 

When you create an Azure Database for PostgreSQL - Flexible Server instance (a *flexible server*), you must choose one of the following networking options: **Private access (VNet integration)** or **Public access (allowed IP addresses)**. 

## Private access (VNet integration)

You can deploy a flexible server into your [Azure virtual network (VNet)](../../virtual-network/virtual-networks-overview.md). Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses that were assigned on this network.

Choose this networking option if you want the following capabilities:

* Connect from Azure resources in the same virtual network to your flexible server by using private IP addresses.
* Use VPN or Azure ExpressRoute to connect from non-Azure resources to your flexible server.
* Ensure that the flexible server has no public endpoint that's accessible through the internet.

:::image type="content" source="./media/how-to-manage-virtual-network-portal/flexible-pg-vnet-diagram.png" alt-text="Diagram that shows how peering works between virtual networks, one of which includes a flexible server.":::

In the preceding diagram:
- Flexible servers are injected into subnet 10.0.1.0/24 of the VNet-1 virtual network.
- Applications that are deployed on different subnets within the same virtual network can access flexible servers directly.
- Applications that are deployed on a different virtual network (VNet-2) don't have direct access to flexible servers. You have to perform [virtual network peering for a private DNS zone](#private-dns-zone-and-virtual-network-peering) before they can access the flexible server.

### Virtual network concepts

An Azure virtual network contains a private IP address space that's configured for your use. Your virtual network must be in the same Azure region as your flexible server. To learn more about virtual networks, see the [Azure Virtual Network overview](../../virtual-network/virtual-networks-overview.md).

Here are some concepts to be familiar with when you're using virtual networks with PostgreSQL flexible servers:

* **Delegated subnet**. A virtual network contains subnets (sub-networks). Subnets enable you to segment your virtual network into smaller address spaces. Azure resources are deployed into specific subnets within a virtual network. 

  Your flexible server must be in a subnet that's *delegated*. That is, only Azure Database for PostgreSQL - Flexible Server instances can use that subnet. No other Azure resource types can be in the delegated subnet. You delegate a subnet by assigning its delegation property as `Microsoft.DBforPostgreSQL/flexibleServers`.
 The smallest CIDR range you can specify for the subnet is /28, which provides sixteen IP addresses, however the first and last address in any network or subnet can't be assigned to any individual host. Azure reserves five IPs to be utilized internally by Azure networking, which include two IPs that cannot be assigned to host, mentioned above. This leaves you eleven available IP addresses for /28 CIDR range, whereas a single Flexible Server with High Availability features utilizes 4 addresses. 
 For Replication and Azure AD connections please make sure Route Tables do not affect traffic.A common pattern is route all outbound traffic via an Azure Firewall or a custom / on premise network filtering appliance.
 If the subnet has a Route Table associated with the rule to route all traffic to a virtual appliance:
    * Add a rule with Destination Service Tag “AzureActiveDirectory” and next hop “Internet”
    * Add a rule with Destination IP range same as PostgreSQL subnet range and next hop “Virtual Network”


  > [!IMPORTANT]
  > The names `AzureFirewallSubnet`, `AzureFirewallManagementSubnet`, `AzureBastionSubnet`, and `GatewaySubnet` are reserved within Azure. Don't use any of these as your subnet name.
  > For Azure Storage connection please make sure PostgreSQL delegated subnet has Service Endpoints for Azure Storage in the region of the VNet. The endpoints are created by default, but please take care not to remove these manually.

* **Network security group (NSG)**. Security rules in NSGs enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. For more information, see the [NSG overview](../../virtual-network/network-security-groups-overview.md).

  Application security groups (ASGs) make it easy to control Layer-4 security by using NSGs for flat networks. You can quickly:
  
  - Join virtual machines to an ASG, or remove virtual machines from an ASG.
  - Dynamically apply rules to those virtual machines, or remove rules from those virtual machines. 
  
  For more information, see the [ASG overview](../../virtual-network/application-security-groups.md). 
  
  At this time, we don't support NSGs where an ASG is part of the rule with Azure Database for PostgreSQL - Flexible Server. We currently advise using [IP-based source or destination filtering](../../virtual-network/network-security-groups-overview.md#security-rules) in an NSG. 

  > [!IMPORTANT]
  > High availability and other Features of Azure Database for PostgreSQL - Flexible Server require ability to send\receive traffic to **destination port 5432** within Azure virtual network subnet where Azure Database for PostgreSQL - Flexible Server is deployed , as well as to **Azure storage** for log archival. If you create **[Network Security Groups (NSG)](../../virtual-network/network-security-groups-overview.md)** to deny traffic flow to or from your Azure Database for PostgreSQL - Flexible Server within the subnet where its deployed, please **make sure to allow traffic to  destination port 5432** within the subnet, and also to Azure storage by using **[service tag](../../virtual-network/service-tags-overview.md) Azure Storage** as a destination. Also, if you elect to use [Azure Active Directory authentication](concepts-azure-ad-authentication.md) to authenticate logins to your Azure Database for PostgreSQL - Flexible Server please allow outbound traffic to Azure AD using Azure AD [service tag](../../virtual-network/service-tags-overview.md).
  > When setting up [Read Replicas across Azure regions](./concepts-read-replicas.md) , Azure Database for PostgreSQL - Flexible Server requires ability to send\receive traffic to **destination port 5432** for both primary and replica, as well as to **[Azure storage](../../virtual-network/service-tags-overview.md#available-service-tags)** in primary and replica regions from both primary and replica servers. 

* **Private DNS zone integration**. Azure private DNS zone integration allows you to resolve the private DNS within the current virtual network or any in-region peered virtual network where the private DNS zone is linked. 
### Using a private DNS zone

[Azure Private DNS](../../dns/private-dns-overview.md) provides a reliable and secure DNS service for your virtual network. Azure Private DNS manages and resolves domain names in the virtual network without the need to configure a custom DNS solution. 

When using private network access with Azure virtual network, providing the private DNS zone information is mandatory in order to be able to do DNS resolution. For new Azure Database for PostgreSQL Flexible Server creation using private network access, private DNS zones will need to be used while configuring flexible servers with private access. 
For new Azure Database for PostgreSQL Flexible Server creation using private network access with API, ARM, or Terraform, create private DNS zones and use them while configuring flexible servers with private access. See more information on [REST API specifications for Microsoft Azure](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json). If you use the [Azure portal](./how-to-manage-virtual-network-portal.md) or [Azure CLI](./how-to-manage-virtual-network-cli.md) for creating flexible servers, you can either provide a private DNS zone name that you had previously created in the same or a different subscription or a default private DNS zone is automatically created in your subscription.

If you use an Azure API, an Azure Resource Manager template (ARM template), or Terraform, create private DNS zones that end with `.postgres.database.azure.com`. Use those zones while configuring flexible servers with private access. For example, use the form `[name1].[name2].postgres.database.azure.com` or `[name].postgres.database.azure.com`. If you choose to use the form `[name].postgres.database.azure.com`, the name can't be the name you use for one of your flexible servers or an error message will be shown during provisioning. For more information, see the [private DNS zones overview](../../dns/private-dns-overview.md).


Using Azure Portal, CLI or ARM,  you can also change private DNS Zone from the one you provided when creating your Azure Database for PostgreSQL - Flexible Server to another private DNS zone that exists the same or different subscription. 

  > [!IMPORTANT]
  > Ability to change private DNS Zone from the one you provided when creating your Azure Database for PostgreSQL - Flexible Server to another private DNS zone is currently disabled for servers with High Availability feature enabled. 

After you create a private DNS zone in Azure, you'll need to [link](../../dns/private-dns-virtual-network-links.md) a virtual network to it. Once linked, resources hosted in that virtual network can access the private DNS zone. 
  > [!IMPORTANT]
  > We no longer validate virtual network link presence on server creation for Azure Database for PostgreSQL - Flexible Server with private networking. When creating server through the Portal we provide customer choice to create link on server creation via checkbox *"Link Private DNS Zone your virtual network"* in the Azure Portal. 

[DNS private zones are resilient](../../dns/private-dns-overview.md) to regional outages because zone data is globally available. Resource records in a private zone are automatically replicated across regions. Azure Private DNS is an availability zone foundational, zone-reduntant service. For more information, see [Azure services with availability zone support](../../reliability/availability-zones-service-support.md#azure-services-with-availability-zone-support).

### Integration with a custom DNS server

If you're using a custom DNS server, you must use a DNS forwarder to resolve the FQDN of Azure Database for PostgreSQL - Flexible Server. The forwarder IP address should be [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md). 

The custom DNS server should be inside the virtual network or reachable via the virtual network's DNS server setting. To learn more, see [Name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

### Private DNS zone and virtual network peering

Private DNS zone settings and virtual network peering are independent of each other. If you want to connect to the flexible server from a client that's provisioned in another virtual network from the same region or a different region, you have to link the private DNS zone with the virtual network. For more information, see [Link the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network).

> [!NOTE]
> Only private DNS zone names that end with **'postgres.database.azure.com'**  can be linked. Your DNS zone name cannot be the same as your flexible server(s) otherwise name resolution will fail. 

To map a Server name to the DNS record you can run *nslookup* command in [Azure Cloud Shell](../../cloud-shell/overview.md) using Azure PowerShell or Bash, substituting name of your server for <server_name> parameter in example below:

```bash
nslookup -debug <server_name>.postgres.database.azure.com | grep 'canonical name'

```


### Using Hub and Spoke private networking design 

Hub and spoke is a popular networking model for efficiently managing common communication or security requirements.

The hub is a virtual network that acts as a central location for managing external connectivity. It also hosts services used by multiple workloads. The hub coordinates all communications to and from the spokes. IT rules or processes like security can inspect, route, and centrally manage traffic. The spokes are virtual networks that host workloads, and connect to the central hub through virtual network peering. Shared services are hosted in their own subnets for sharing with the spokes. A perimeter subnet then acts as a security appliance.

The spokes are also virtual networks in Azure, used to isolate individual workloads. The traffic flow between the on-premises headquarters and Azure is connected through ExpressRoute or Site to Site VPN, connected to the hub virtual network. The virtual networks from the spokes to the hub are peered, and enable communication to on-premises resources. You can implement the hub and each spoke in separate subscriptions or resource groups.

There are three main patterns for connecting spoke virtual networks to each other:

* **Spokes directly connected to each other**. Virtual network peerings or VPN tunnels are created between the spoke virtual networks to provide direct connectivity without traversing the hub virtual network.
* **Spokes communicate over a network appliance**.  Each spoke virtual network has a peering to Virtual WAN or to a hub virtual network. An appliance routes traffic from spoke to spoke. The appliance can be managed by Microsoft (as with Virtual WAN) or by you.
* **Virtual Network Gateway attached to the hub network and make use of User Defined Routes (UDR)**, to enable communication between the spokes.

:::image type="content" source="./media/how-to-manage-virtual-network-portal/hub-spoke-architecture.png" alt-text="Diagram that shows basic hub and spoke architecture with hybrid connectivity via Express Hub.":::

Use [Azure Virtual Network Manager (AVNM)](../../virtual-network-manager/overview.md) to create new (and onboard existing) hub and spoke virtual network topologies for the central management of connectivity and security controls.

### Replication across Azure regions and virtual networks with private networking

Database replication is the process of copying data from a central or primary server to multiple servers known as replicas. The primary server accepts read and write operations whereas the replicas serve read-only transactions. The primary server and replicas collectively form a database cluster.The goal of database replication is to ensure redundancy, consistency, high availability, and accessibility of data, especially in high-traffic, mission-critical applications.

Azure Database for PostgreSQL - Flexible Server offers two methods for replications: physical (i.e. streaming) via [built -in Read Replica feature](./concepts-read-replicas.md) and [logical replication](./concepts-logical.md). Both are ideal for different use cases, and a user may choose one over the other depending on the end goal.

Replication across Azure regions, with separate [virtual networks (VNETs)](../../virtual-network/virtual-networks-overview.md) in each region, requires connectivity across regional virtual network boundaries that can be provided via [virtual network peering](../../virtual-network/virtual-network-peering-overview.md) or in [Hub and Spoke architectures](#using-hub-and-spoke-private-networking-design) via network appliance.

By default DNS name resolution is scoped to a virtual network. This means that any client in one virtual network (VNET1) is unable to resolve the Flexible Server FQDN in another virtual network (VNET2)

In order to resolve this issue, you must make sure clients in VNET1 can access the Flexible Server Private DNS Zone. This can be achieved by adding a [virtual network link](../../dns/private-dns-virtual-network-links.md) to the Private DNS Zone of your Flexible Server instance.


### Unsupported virtual network scenarios

Here are some limitations for working with virtual networks:

* A flexible server deployed to a virtual network can't have a public endpoint (or public IP or DNS).
* After a flexible server is deployed to a virtual network and subnet, you can't move it to another virtual network or subnet. You can't move the virtual network into another resource group or subscription.
* Subnet size (address spaces) can't be increased after resources exist in the subnet.
* A flexible server doesn't support Azure Private Link. Instead, it uses virtual network injection to make the flexible server available within a virtual network. 

> [!IMPORTANT]
> Azure Resource Manager supports  ability to lock resources, as a security control. Resource locks are applied to the resource, and are effective across all users and roles. There are two types of resource lock: CanNotDelete and ReadOnly. These lock types can be applied either to a Private DNS zone, or to an individual record set. Applying a lock of either type against Private DNS Zone or individual record set may interfere with ability of Azure Database for PostgreSQL - Flexible Server service to update DNS records and cause issues during important operations on DNS, such as High Availability failover from primary to secondary. For these reasons,  please make sure you are not utilizing DNS private zone or record locks when utilizing High Availability features with Azure Database for PostgreSQL - Flexible Server. 

## Host name

Regardless of the networking option that you choose, we recommend that you always use an FQDN as host name when connecting to your flexible server. The server's IP address is not guaranteed to remain static. Using the FQDN will help you avoid making changes to your connection string. 

An example that uses an FQDN as a host name is `hostname = servername.postgres.database.azure.com`. Where possible, avoid using `hostname = 10.0.0.4` (a private address) or `hostname = 40.2.45.67` (a public address).

## Next steps

* Learn how to create a flexible server by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
