---
title: Networking overview - Azure Database for PostgreSQL - Flexible Server with public access (allowed IP addresses)
description: Learn about connectivity and networking with public access in the Flexible Server deployment option for Azure Database for PostgreSQL.
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.author: gennadyk
author: GennadNY
ms.reviewer: 
ms.date: 11/30/2021
---

# Networking overview for Azure Database for PostgreSQL - Flexible Server with public access (allowed IP addresses)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article describes connectivity and networking concepts for Azure Database for PostgreSQL - Flexible Server. 

When you create an Azure Database for PostgreSQL - Flexible Server instance (a *flexible server*), you must choose one of the following networking options: **Private access (VNet integration)** or **Public access (allowed IP addresses)**. 
The following characteristics apply whether you choose to use the private access or the public access option:

* Connections from allowed IP addresses need to authenticate to the PostgreSQL server with valid credentials.
* [Connection encryption](#tls-and-ssl) is enforced for your network traffic.
* The server has a fully qualified domain name (FQDN). For the `hostname` property in connection strings, we recommend using the FQDN instead of an IP address.
* Both options control access at the server level, not at the database  or table level. You would use PostgreSQL's roles properties to control database, table, and other object access.

> [!NOTE]
> Because Azure Database for PostgreSQL is a managed database service, users are not provided host or OS access to view or modify configuration files such as `pg_hba.conf`. The content of the files is automatically updated based on the network settings.

## Using Public Access Networking with Flexible Server

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

## Next steps
* Learn how to create a flexible server by using the **Public access (allowed IP addresses)** option in [the Azure portal](how-to-manage-firewall-portal.md) or [the Azure CLI](how-to-manage-firewall-cli.md).