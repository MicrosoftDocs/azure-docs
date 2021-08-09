---
title: Networking overview - Azure Database for PostgreSQL - Flexible Server
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for PostgreSQL.
author: niklarin
ms.author: nlarin
ms.service: postgresql
ms.topic: conceptual
ms.date: 07/08/2021
---

# Networking overview for Azure Database for PostgreSQL - Flexible Server (preview)

This article describes connectivity and networking concepts for Azure Database for PostgreSQL - Flexible Server. The Flexible Server deployment option is in preview.

When you create an Azure Database for PostgreSQL - Flexible Server instance (a *flexible server*), you must choose one of the following networking options: **Private access (VNet integration)** or **Public access (allowed IP addresses)**. 

> [!NOTE]
> You can't change your networking option after the server is created. 

The following characteristics apply whether you choose to use the private access or the public access option:

* Connections from allowed IP addresses need to authenticate to the PostgreSQL server with valid credentials.
* [Connection encryption](#tls-and-ssl) is enforced for your network traffic.
* The server has a fully qualified domain name (FQDN). For the `hostname` property in connection strings, we recommend using the FQDN instead of an IP address.
* Both options control access at the server level, not at the database  or table level. You would use PostgreSQL's roles properties to control database, table, and other object access.

> [!NOTE]
> Because Azure Database for PostgreSQL is a managed database service, users are not provided host or OS access to view or modify configuration files such as `pg_hba.conf`. The content of the files is automatically updated based on the network settings.

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

  > [!IMPORTANT]
  > The names `AzureFirewallSubnet`, `AzureFirewallManagementSubnet`, `AzureBastionSubnet`, and `GatewaySubnet` are reserved within Azure. Don't use any of these as your subnet name.

* **Network security group (NSG)**. Security rules in NSGs enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. For more information, see the [NSG overview](../../virtual-network/network-security-groups-overview.md).

  Application security groups (ASGs) make it easy to control Layer-4 security by using NSGs for flat networks. You can quickly:
  
  - Join virtual machines to an ASG, or remove virtual machines from an ASG.
  - Dynamically apply rules to those virtual machines, or remove rules from those virtual machines. 
  
  For more information, see the [ASG overview](../../virtual-network/application-security-groups.md). 
  
  At this time, we don't support NSGs where an ASG is part of the rule with Azure Database for PostgreSQL - Flexible Server. We currently advise using [IP-based source or destination filtering](../../virtual-network/network-security-groups-overview.md#security-rules) in an NSG. 

  > [!IMPORTANT]
  > Features of Azure Database for PostgreSQL - Flexible Server require ability to send outbound traffic to destination ports 5432, 6432. If you create Network Security Groups (NSG) to deny outbound traffic from your Azure Database for PostgreSQL - Flexible Server, please make sure to allow traffic to these destination ports. 

* **Private DNS zone integration**. Azure private DNS zone integration allows you to resolve the private DNS within the current virtual network or any in-region peered virtual network where the private DNS zone is linked. 

### Using a private DNS zone

If you use the Azure portal or the Azure CLI to create flexible servers with a virtual network, a new private DNS zone is automatically provisioned for each server in your subscription by using the server name that you provided. 

If you use an Azure API, an Azure Resource Manager template (ARM template), or Terraform, create private DNS zones that end with `postgres.database.azure.com`. Use those zones while configuring flexible servers with private access. For more information, see the [private DNS zones overview](../../dns/private-dns-overview.md).


### Integration with a custom DNS server

If you're using a custom DNS server, you must use a DNS forwarder to resolve the FQDN of Azure Database for PostgreSQL - Flexible Server. The forwarder IP address should be [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md). 

The custom DNS server should be inside the virtual network or reachable via the virtual network's DNS server setting. To learn more, see [Name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server).

### Private DNS zone and virtual network peering

Private DNS zone settings and virtual network peering are independent of each other. If you want to connect to the flexible server from a client that's provisioned in another virtual network from the same region or a different region, you have to link the private DNS zone with the virtual network. For more information, see [Link the virtual network](../../dns/private-dns-getstarted-portal.md#link-the-virtual-network).

> [!NOTE]
> Only private DNS zone names that end with `postgres.database.azure.com` can be linked.

### Unsupported virtual network scenarios

Here are some limitations for working with virtual networks:

* A flexible server deployed to a virtual network can't have a public endpoint (or public IP or DNS).
* After a flexible server is deployed to a virtual network and subnet, you can't move it to another virtual network or subnet. You can't move the virtual network into another resource group or subscription.
* Subnet size (address spaces) can't be increased after resources exist in the subnet.
* A flexible server doesn't support Azure Private Link. Instead, it uses virtual network injection to make the flexible server available within a virtual network. 


## Public access (allowed IP addresses)

When you choose the public access method, your flexible server is accessed through a public endpoint over the internet. The public endpoint is a publicly resolvable DNS address. The phrase *allowed IP addresses* refers to a range of IP addresses that you choose to give permission to access your server. These permissions are called *firewall rules*. 

Choose this networking option if you want the following capabilities:

* Connect from Azure resources that don't support virtual networks.
* Connect from resources outside Azure that are not connected by VPN or ExpressRoute.
* Ensure that the flexible server has a public endpoint that's accessible through the internet.

Characteristics of the public access method include:

* Only the IP addresses that you allow have permission to access your PostgreSQL flexible server. By default, no IP addresses are allowed. You can add IP addresses during server creation or afterward.
* Your PostgreSQL server has a publicly resolvable DNS name.
* Your flexible server is not in one of your Azure virtual networks.
* Network traffic to and from your server does not go over a private network. The traffic uses the general internet pathways.

### Firewall rules

If a connection attempt comes from an IP address that you haven't allowed through a firewall rule, the originating client will get an error.

### Allowing all Azure IP addresses

If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all IP addresses for Azure datacenters.

> [!IMPORTANT]
> The **Allow public access from Azure services and resources within Azure** option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When you select this option, make sure that your sign-in and user permissions limit access to only authorized users.

### Troubleshooting public access issues
Consider the following points when access to the Azure Database for PostgreSQL service doesn't behave as you expect:

* **Changes to the allowlist have not taken effect yet**. There might be as much as a five-minute delay for changes to the firewall configuration of the Azure Database for PostgreSQL server to take effect.

* **Authentication failed**. If a user doesn't have permissions on the Azure Database for PostgreSQL server or the password is incorrect, the connection to the Azure Database for PostgreSQL server is denied. Creating a firewall setting only provides clients with an opportunity to try connecting to your server. Each client must still provide the necessary security credentials.

* **Dynamic client IP address is preventing access**. If you have an internet connection with dynamic IP addressing and you're having trouble getting through the firewall, try one of the following solutions:

   * Ask your internet service provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for PostgreSQL server. Then add the IP address range as a firewall rule.
   * Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.

* **Firewall rule is not available for IPv6 format**. The firewall rules must be in IPv4 format. If you specify firewall rules in IPv6 format, you'll get a validation error.

## Host name

Regardless of the networking option that you choose, we recommend that you always use an FQDN as host name when connecting to your flexible server. The server's IP address is not guaranteed to remain static. Using the FQDN will help you avoid making changes to your connection string. 

An example that uses an FQDN as a host name is `hostname = servername.postgres.database.azure.com`. Where possible, avoid using `hostname = 10.0.0.4` (a private address) or `hostname = 40.2.45.67` (a public address).


## TLS and SSL

Azure Database for PostgreSQL - Flexible Server enforces connecting your client applications to the PostgreSQL service by using Transport Layer Security (TLS). TLS is an industry-standard protocol that ensures encrypted network connections between your database server and client applications. TLS is an updated protocol of Secure Sockets Layer (SSL). 

Azure Database for PostgreSQL supports TLS 1.2 and later. In [RFC 8996](https://datatracker.ietf.org/doc/rfc8996/), the Internet Engineering Task Force (IETF) explicitly states that TLS 1.0 and TLS 1.1 must not be used. Both protocols were deprecated by the end of 2019.

All incoming connections that use earlier versions of the TLS protocol, such as TLS 1.0 and TLS 1.1, will be denied.

## Next steps

* Learn how to create a flexible server by using the **Private access (VNet integration)** option in [the Azure portal](how-to-manage-virtual-network-portal.md) or [the Azure CLI](how-to-manage-virtual-network-cli.md).
* Learn how to create a flexible server by using the **Public access (allowed IP addresses)** option in [the Azure portal](how-to-manage-firewall-portal.md) or [the Azure CLI](how-to-manage-firewall-cli.md).
