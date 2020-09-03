---
title: Networking overview - Azure Database for MySQL Flexible Server
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for MySQL
author: rachel-msft
ms.author: raagyema
ms.service: mysql
ms.topic: conceptual
ms.date: 9/21/2020
---

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview.

# Networking overview
This article describes connectivity and networking concepts in Azure Database for MySQL Flexible server.

## Virtual network or Public access
You have two networking options for your Azure Database for MySQL Flexible Server. At server creation, you must pick one option. This selection cannot be changed after the server is created.

* Virtual network (VNet) – You can deploy your flexible server into your own [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses.

   Choose virtual network if you want the following capabilities:
   * Connect from Azure resources in the same virtual network to your flexible server using private IP addresses
   * Use VPN or ExpressRoute to connect from non-Azure resources to your flexible server

* Public access (allowed IP addresses) – Your flexible server is accessed through its public endpoint only. The public endpoint is a publicly resolvable DNS address. The phrase “allowed IP addresses” refers to a range of IPs you choose to give permission to access your server. These permissions are called **firewall rules**. 

   Choose the public access method if you want the following capabilities:
   * Connect from resources outside of an Azure virtual network

## Hostname
Regardless of the networking option you choose, we recommend you always use a fully qualified domain name (FQDN) as hostname when connecting to your flexible server. The server’s IP address is not guaranteed to remain static. Using the FQDN will help you avoid making changes to your connection string. 

One scenario where the IP changes is if you are using zone-redundant HA and a failover happens between primary and secondary. Using the FQDN means you can seamlessly retry connections with the same connection string.

Example
* Recommended `hostname = servername.mysql.database.azure.com`
* Avoid using `hostname = 10.0.0.4` (private address) or `hostname = 40.2.45.67` (public IP)

## TLS and SSL
Azure Database for MySQL Flexible Server supports connecting your client applications to the MySQL service using Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL). TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements. Enforcing TLS connections between your database server and your client applications helps protect against "man-in-the-middle" attacks by encrypting the data stream between the server and your application.

Azure Database for MySQL Flexible Server only supports encrypted connections using Transport Layer Security (TLS 1.2) and all incoming connections with TLS 1.0 and TLS 1.1 will be denied. Note that you cannot disable or change the TLS version for connecting to Azure Database for MySQL Flexible Server.

## Public access
Characteristics of the public access method include:
* Only the IP addresses you allow have permission to access your MySQL flexible server. By default no IP addresses are allowed. You can add IP addresses during server creation or afterwards.
* Your MySQL server has a publicly resolvable DNS name
* Your flexible server is not in one of your Azure virtual networks
* Network traffic to and from your server does not go over a private network. The traffic uses the general internet pathways.

The following characteristics apply regardless of whether you choose to use a virtual network or the public access method:
* Connections from allowed IP addresses additionally need to authenticate with their sign-in credentials
* Server-side SSL and TLS are applicable to your network traffic. You can additionally enforce client-side SSL by appropriately configuring your client connection settings.
* The server has a fully qualified domain name (fqdn). For the hostname property in connection strings, we recommend using the fqdn instead of an IP address.
* Both options control access at the server-level, not at the database- or table-level. You would use MySQL’s roles properties to control database, table, and other object access.

### Firewall rules
Granting permission to an IP address is called a firewall rule. If a connection attempt comes from an IP address you have not allowed, the originating client will see an error.

It is recommended that you find the outgoing IP address of any application or service and explicitly allow access to those individual IP addresses or ranges to your flexible server.

### Allowing all Azure IP addresses
If a fixed outgoing IP address isn't available for your Azure service, you can consider enabling connections from all Azure datacenter IP addresses.
> [!IMPORTANT]
> The **Allow access to Azure services** option configures the firewall to allow all connections from Azure, including connections from the subscriptions of other customers. When selecting this option, make sure your login and user permissions limit access to only authorized users.


### Troubleshooting public access issues
Consider the following points when access to the Microsoft Azure Database for MySQL Server service does not behave as you expect:

* **Changes to the allow list have not taken effect yet:** There may be as much as a five-minute delay for changes to the Azure Database for MySQL Server firewall configuration to take effect.

* **The login is not authorized or an incorrect password was used:** If a login does not have permissions on the Azure Database for MySQL server or the password used is incorrect, the connection to the Azure Database for MySQL server is denied. Creating a firewall setting only provides clients with an opportunity to attempt connecting to your server; each client must still provide the necessary security credentials.

* **Dynamic IP address:** If you have an Internet connection with dynamic IP addressing and you are having trouble getting through the firewall, you could try one of the following solutions:

   * Ask your Internet Service Provider (ISP) for the IP address range assigned to your client computers that access the Azure Database for MySQL Server, and then add the IP address range as a firewall rule.
   * Get static IP addressing instead for your client computers, and then add the static IP address as a firewall rule.

* **Cannot connect from Azure resource with allowed IP:** Check whether the **Microsoft.Sql** service endpoint is enabled for the subnet you are connecting from. If **Microsoft.Sql** is enabled, it indicates that you only want to use VNet service endpoint rules on that subnet.

   For example, you may see the following error if you are connecting from an Azure VM in a subnet that has **Microsoft.Sql** enabled but has no corresponding VNet rule:
   `FATAL: Client from Azure Virtual Networks is not allowed to access the server`

## Virtual networking
You can deploy Azure Database for MySQL Flexible server into your own [Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview). Azure virtual networks provide private and secure communication for resources within the virtual network.


### Virtual network concepts
Here are some concepts to be familiar with when using virtual networks with MySQL flexible servers.

* **Virtual network**
   An Azure Virtual Network (VNet) contains a private IP address space that is configured for your use. Visit [What is Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) for a deep dive on Azure virtual networking.


* **Delegated subnet**
   A virtual network contains subnets (sub-networks). Subnets enable you to segment your virtual network into smaller address spaces. Azure resources are deployed into specific subnets within a virtual network. 

Your MySQL flexible server must be in a subnet that is **delegated** for MySQL flexible server use only. This delegation means that only Azure Database for MySQL Flexible Servers can use that subnet. No other Azure resource types can be in the delegated subnet. You delegate a subnet by assigning its delegation property as Microsoft.DBforMySQL/flexibleServers.


## Unsupported virtual network scenarios
* Public endpoint, IP, or DNS - A flexible server deployed to a virtual network cannot have a public endpoint
* After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move that virtual network into another resource group or subscription.
* Subnet size (address spaces) cannot be increased once resources exist in the subnet




## Next steps
* Learn about using your own virtual network for your MySQL flexible server
* Learn about the public access network option