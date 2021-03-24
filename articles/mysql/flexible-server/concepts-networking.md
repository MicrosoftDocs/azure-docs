---
title: Networking overview - Azure Database for MySQL Flexible Server
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for MySQL
author: ambhatna
ms.author: ambhatna
ms.service: mysql
ms.topic: conceptual
ms.date: 9/23/2020
---

# Connectivity and networking concepts for Azure Database for MySQL - Flexible Server (Preview)

This article describes public and private connectivity options for your server. You will learn in detail the networking concepts for Azure Database for MySQL Flexible server to create a server securely in Azure.

> [!IMPORTANT]
> Azure Database for MySQL - Flexible Server is in preview.

## Choosing a networking option
You have two networking options for your Azure Database for MySQL Flexible Server. The options are **private access (VNet integration)** and **public access (allowed IP addresses)**. At server creation, you must pick one option. 

> [!NOTE]
> Your networking option cannot be changed after the server is created. 

* **Private access (VNet Integration)** – You can deploy your flexible server into your [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses.

   Choose the VNet Integration option if you want the following capabilities:
   * Connect from Azure resources in the same virtual network or [peered virtual network](../../virtual-network/virtual-network-peering-overview.md) to your flexible server
   * Use VPN or ExpressRoute to connect from non-Azure resources to your flexible server
   * No public endpoint

* **Public access (allowed IP addresses)** – Your flexible server is accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address. The phrase “allowed IP addresses” refers to a range of IPs you choose to give permission to access your server. These permissions are called **firewall rules**. 

   Choose the public access method if you want the following capabilities:
   * Connect from Azure resources that do not support virtual networks
   * Connect from resources outside of an Azure that are not connected by VPN or ExpressRoute 
   * The flexible server has a public endpoint

The following characteristics apply whether you choose to use the private access or the public access option:
* Connections from allowed IP addresses need to authenticate to the MySQL server with valid credentials
* [Connection encryption](#tls-and-ssl) is available for your network traffic
* The server has a fully qualified domain name (fqdn). For the hostname property in connection strings, we recommend using the fqdn instead of an IP address.
* Both options control access at the server-level, not at the database- or table-level. You would use MySQL’s roles properties to control database, table, and other object access.


## Private access (VNet Integration)
Private access with virtual network (vnet) integration provides private and secure communication for your MySQL flexible server.

### Virtual network concepts
Here are some concepts to be familiar with when using virtual networks with MySQL flexible servers.

* **Virtual network** - 
   An Azure Virtual Network (VNet) contains a private IP address space that is configured for your use. Visit the [Azure Virtual Network overview](../../virtual-network/virtual-networks-overview.md) to learn more about Azure virtual networking.

    Your virtual network must be in the same Azure region as your flexible server.

* **Delegated subnet** - 
   A virtual network contains subnets (sub-networks). Subnets enable you to segment your virtual network into smaller address spaces. Azure resources are deployed into specific subnets within a virtual network. 

   Your MySQL flexible server must be in a subnet that is **delegated** for MySQL flexible server use only. This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet. You delegate a subnet by assigning its delegation property as Microsoft.DBforMySQL/flexibleServers.

* **Network security groups (NSG)**
   Security rules in network security groups enable you to filter the type of network traffic that can flow in and out of virtual network subnets and network interfaces. Review the [network security group overview](../../virtual-network/network-security-groups-overview.md) for more information.

* **Virtual network peering**
   Virtual network peering enables you to seamlessly connect two or more Virtual Networks in Azure. The peered virtual networks appear as one for connectivity purposes. The traffic between virtual machines in peered virtual networks uses the Microsoft backbone infrastructure. The traffic between client application and flexible server in peered VNets is routed through Microsoft's private network only and is isolated to that network only.

Flexible server supports virtual network peering within the same Azure region. Peering VNets across regions **is not supported**. Review the [virtual network peering concepts](../../virtual-network/virtual-network-peering-overview.md) for more information.

### Connecting from peered VNets in same Azure region
If the client application trying to connect to flexible server is in the peered virtual network, it may not be able to connect using the flexible server servername as it cannot resolve DNS name for the flexible server from peered VNet. There are two options to resolve this:
* Use Private IP address (Recommended for dev/test scenario) - This option can be used for development or testing purposes. You can use nslookup to reverse lookup the private IP address for your flexible servername (fully qualified domain name) and use Private IP address to connect from the client application. Using the private IP address for connection to flexible server is not recommended for production use as it can change during planned or unplanned event.
* Use Private DNS zone (Recommended for production) - This option is suited for production purposes. You provision a [private DNS zone](../../dns/private-dns-getstarted-portal.md) and link it to your client virtual network. In the private DNS zone, you add a [A-record](../../dns/dns-zones-records.md#record-types) for your flexible server using its private IP address. You can then use the A-record to connect from the client application in peered virtual network to flexible server.

### Connecting from on-premises to flexible server in Virtual Network using ExpressRoute or VPN
For workloads requiring access to flexible server in virtual network from on-premises network, you will require [ExpressRoute](../../architecture/reference-architectures/hybrid-networking/expressroute.md) or [VPN](../../architecture/reference-architectures/hybrid-networking/vpn.md) and virtual network [connected to on-premises](../../architecture/reference-architectures/hybrid-networking.md). With this setup in place, you will require a DNS forwarder to resolve the flexible servername if you would like to connect from client application (like MySQL Workbench) running on on-premises virtual network. This DNS forwarder is responsible for resolving all the DNS queries via a server-level forwarder to the Azure-provided DNS service [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md).

To configure properly, you need the following resources:

- On-premises network
- MySQL Flexible Server provisioned with private access (VNet integration)
- Virtual network [connected to on-premises](../../architecture/reference-architectures/hybrid-networking/)
- Use DNS forwarder [168.63.129.16](../../virtual-network/what-is-ip-address-168-63-129-16.md) deployed in Azure

You can then use the flexible servername (FQDN) to connect from the client application in peered virtual network or on-premises network to flexible server.

### Unsupported virtual network scenarios
* Public endpoint (or public IP or DNS) - A flexible server deployed to a virtual network cannot have a public endpoint
* After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move the virtual network into another resource group or subscription.
* Subnet size (address spaces) cannot be increased once resources exist in the subnet
* Peering VNets across regions is not supported

Learn how to enable private access (vnet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md).

> [!NOTE]
> If you are using the custom DNS server then you must use a DNS forwarder to resolve the FQDN of Azure Database for MySQL - Flexible Server. Refer to [name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to learn more.

## Public access (allowed IP addresses)
Characteristics of the public access method include:
* Only the IP addresses you allow have permission to access your MySQL flexible server. By default no IP addresses are allowed. You can add IP addresses during server creation or afterwards.
* Your MySQL server has a publicly resolvable DNS name
* Your flexible server is not in one of your Azure virtual networks
* Network traffic to and from your server does not go over a private network. The traffic uses the general internet pathways.

### Firewall rules
Granting permission to an IP address is called a firewall rule. If a connection attempt comes from an IP address you have not allowed, the originating client will see an error.


### Allowing all Azure IP addresses
If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all Azure datacenter IP addresses.

> [!IMPORTANT]
> The **Allow public access from Azure services and resources within Azure** option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.

Learn how to enable and manage public access (allowed IP addresses) using the [Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md).


### Troubleshooting public access issues
Consider the following points when access to the Microsoft Azure Database for MySQL Server service does not behave as you expect:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for MySQL Server firewall configuration to take effect.

* **Authentication failed:** If a user does not have permissions on the Azure Database for MySQL server or the password used is incorrect, the connection to the Azure Database for MySQL server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server. Each client must still provide the necessary security credentials.

* **Dynamic client IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

   * Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for MySQL Server, and then add the IP address range as a firewall rule.
   * Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.
  
* **Firewall rule is not available for IPv6 format:** The firewall rules must be in IPv4 format. If you specify firewall rules in IPv6 format, it will show the validation error.


## Hostname
Regardless of the networking option you choose, we recommend you always use a fully qualified domain name (FQDN) as hostname when connecting to your flexible server. The server’s IP address is not guaranteed to remain static. Using the FQDN will help you avoid making changes to your connection string. 

Example
* Recommended `hostname = servername.mysql.database.azure.com`
* Where possible, avoid using `hostname = 10.0.0.4` (a private address) or `hostname = 40.2.45.67` (a public IP)


## TLS and SSL
Azure Database for MySQL Flexible Server supports connecting your client applications to the MySQL service using Transport Layer Security (TLS). TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications. TLS is an updated protocol of Secure Sockets Layer (SSL).

Azure Database for MySQL Flexible Server only supports encrypted connections using Transport Layer Security (TLS 1.2). All incoming connections with TLS 1.0 and TLS 1.1 will be denied. You cannot disable or change the TLS version for connecting to Azure Database for MySQL Flexible Server. Review how to [connect using SSL/TLS](how-to-connect-tls-ssl.md) to learn more. 


## Next steps
* Learn how to enable private access (vnet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md)
* Learn how to enable public access (allowed IP addresses) using the [Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md)
* Learn how to [use TLS](how-to-connect-tls-ssl.md)
