---
title: Networking overview - Azure Database for MySQL Flexible Server
description: Learn about connectivity and networking options in the Flexible Server deployment option for Azure Database for MySQL
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 9/23/2020
---

# Connectivity and networking concepts for Azure Database for MySQL - Flexible Server (Preview)

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article introduces the concepts to control connectivity to your Azure MySQL Flexible Server. You will learn in detail the networking concepts for Azure Database for MySQL Flexible server to create and access a server securely in Azure.

> [!IMPORTANT]
> Azure Database for MySQL - Flexible server is in preview.

Azure Database for MySQL - Flexible server supports two ways to configure connectivity to your servers:
> [!NOTE]
> Your networking option cannot be changed after the server is created.

   * **Private access (VNet Integration)** [Private access](./concepts-networking-vnet.md) You can deploy your flexible server into your [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses.
   
   * **Public access (allowed IP addresses)** [Public access](./concepts-networking-public.md) Your flexible server is accessed through a public endpoint. The public endpoint is a publicly resolvable DNS address. The phrase “allowed IP addresses” refers to a range of IPs you choose to give permission to access your server. These permissions are called **firewall rules**

## Choosing a networking option

Choose **private access (VNet integration)** if you want the following capabilities:
   * Connect from Azure resources in the same virtual network or [peered virtual network](../../virtual-network/virtual-network-peering-overview.md) to your flexible server
   * Use VPN or ExpressRoute to connect from non-Azure resources to your flexible server
   * No public endpoint

Choose **public access (allowed IP addresses)** method if you want the following capabilities:
   * Connect from Azure resources that do not support virtual networks
   * Connect from resources outside of an Azure that are not connected by VPN or ExpressRoute 
   * The flexible server has a public endpoint

The following characteristics apply whether you choose to use the private access or the public access option:
* Connections from allowed IP addresses need to authenticate to the MySQL server with valid credentials
* [Connection encryption](#tls-and-ssl) is available for your network traffic
* The server has a fully qualified domain name (fqdn). For the hostname property in connection strings, we recommend using the fqdn instead of an IP address.
* Both options control access at the server-level, not at the database- or table-level. You would use MySQL’s roles properties to control database, table, and other object access.


### Unsupported virtual network scenarios

* Public endpoint (or public IP or DNS) - A flexible server deployed to a virtual network cannot have a public endpoint
* After the flexible server is deployed to a virtual network and subnet, you cannot move it to another virtual network or subnet. You cannot move the virtual network into another resource group or subscription.
* Subnet size (address spaces) cannot be increased once resources exist in the subnet
* Change from Public to Private acess is not allowed after the server is created. Recommended way is to use Point In Time Restore

Learn how to enable private access (vnet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md).

> [!NOTE]
> If you are using the custom DNS server then you must use a DNS forwarder to resolve the FQDN of Azure Database for MySQL - Flexible Server. Refer to [name resolution that uses your own DNS server](../../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) to learn more.

## Hostname
Regardless of the networking option you choose, we recommend you to use fully qualified domain name (FQDN) `<servername>.mysql.database.azure.com` in connection strings when connecting to your flexible server. 

## TLS and SSL
Azure Database for MySQL Flexible Server supports connecting your client applications to the MySQL server using Secure Sockets Layer (SSL) with Transport layer security(TLS) encryption. TLS is an industry standard protocol that ensures encrypted network connections between your database server and client applications, allowing you to adhere to compliance requirements.

Azure Database for MySQL Flexible Server supports encrypted connections using Transport Layer Security (TLS 1.2) by default and all incoming connections with TLS 1.0 and TLS 1.1 will be denied by default. The encrypted connection enforcement or TLS version configuration on your flexible server can be configured and changed. 

Following are the different configurations of SSL and TLS settings you can have for your flexible server:

| Scenario   | Server parameter settings      | Description                                    |
|------------|--------------------------------|------------------------------------------------|
|Disable SSL (encrypted connections) | require_secure_transport = OFF |If your legacy application doesn't support encrypted connections to MySQL server, you can disable enforcement of encrypted connections to your flexible server by setting require_secure_transport=OFF.|
|Enforce SSL with TLS version < 1.2 | require_secure_transport = ON and tls_version = TLSV1 or TLSV1.1| If your legacy application supports encrypted connections but requires TLS version < 1.2, you can enable encrypted connections but configure your flexible server to allow connections with the tls version (v1.0 or v1.1) supported by your application|
|Enforce SSL with TLS version = 1.2(Default configuration)|require_secure_transport = ON and tls_version = TLSV1.2| This is the recommended and default configuration for flexible server.|
|Enforce SSL with TLS version = 1.3(Supported with MySQL v8.0 and above)| require_secure_transport = ON and tls_version = TLSV1.3| This is useful and recommended for new applications development|

> [!Note]
> Changes to SSL Cipher on flexible server is not supported. FIPS cipher suites is enforced by default when tls_version is set to TLS version 1.2 . For TLS versions other than version 1.2, SSL Cipher is set to default settings which comes with MySQL community installation.

Review how to [connect using SSL/TLS](how-to-connect-tls-ssl.md) to learn more. 


## Next steps
* Learn how to enable private access (vnet integration) using the [Azure portal](how-to-manage-virtual-network-portal.md) or [Azure CLI](how-to-manage-virtual-network-cli.md)
* Learn how to enable public access (allowed IP addresses) using the [Azure portal](how-to-manage-firewall-portal.md) or [Azure CLI](how-to-manage-firewall-cli.md)
* Learn how to [use TLS](how-to-connect-tls-ssl.md)
