---
title: Servers - Azure Database for MariaDB
description: This topic provides considerations and guidelines for working with Azure Database for MariaDB servers.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: conceptual
ms.date: 3/18/2020
---
# Server concepts in Azure Database for MariaDB
This article provides considerations and guidelines for working with Azure Database for MariaDB servers.

## What is an Azure Database for MariaDB server?

An Azure Database for MariaDB server is a central administrative point for multiple databases. It is the same MariaDB server construct that you may be familiar with in the on-premises world. Specifically, the Azure Database for MariaDB service is managed, provides performance guarantees, and exposes access and features at server-level.

An Azure Database for MariaDB server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Provides a connection endpoint for server and database access.
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is available in MariaDB engine version 10.2. For more information, see [Supported Azure Database for MariaDB database versions](./concepts-supported-versions.md).

Within an Azure Database for MariaDB server, you can create one or multiple databases. You can opt to create a single database per server to use all the resources or to create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of pricing tier, vCores, and storage (GB). For more information, see [Pricing tiers](./concepts-pricing-tiers.md).

## How do I secure an Azure Database for MariaDB server?

The following elements help ensure safe access to your database.

|||
| :--| :--|
| **Authentication and authorization** | Azure Database for MariaDB server supports native MySQL authentication. You can connect and authenticate to a server with the server's admin login. |
| **Protocol** | The service supports a message-based protocol used by MySQL. |
| **TCP/IP** | The protocol is supported over TCP/IP and over Unix-domain sockets. |
| **Firewall** | To help protect your data, a firewall rule prevents all access to your database server, until you specify which computers have permission. See [Azure Database for MariaDB Server firewall rules](./concepts-firewall-rules.md). |
| **SSL** | The service supports enforcing SSL connections between your applications and your database server. See [Configure SSL connectivity in your application to securely connect to Azure Database for MariaDB](./howto-configure-ssl.md). |

## How do I manage a server?
You can manage Azure Database for MariaDB servers by using the Azure portal or the Azure CLI.

## Next steps
- For an overview of the service, see [Azure Database for MariaDB Overview](./overview.md)
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-pricing-tiers.md)

<!-- - For information about connecting to the service, see [Connection libraries for Azure Database for MariaDB](./concepts-connection-libraries.md). -->
