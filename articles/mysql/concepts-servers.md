---
title: Server concepts in Azure Database for MySQL | Microsoft Docs
description: This topic provides considerations and guidelines for working with Azure Database for MySQL servers.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 05/10/2017
---
# Server concepts in Azure Database for MySQL

This topic provides considerations and guidelines for working with Azure Database for MySQL servers.

## What is an Azure Database for MySQL server?

An Azure Database for MySQL server is a central administrative point for multiple databases. It is the same MySQL server construct that you may be familiar with in the on-premises world. Specifically, the Azure Database for MySQL service is managed, provides performance guarantees, exposes access and features at server-level.

An Azure Database for MySQL server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Provides a connection endpoint for server and database access.
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is available in multiple versions. For more information, see [Supported Azure Database for MySQL database versions](./concepts-supported-versions.md).

## How do I connect and authenticate to an Azure Database for MySQL server?

The following elements help ensure safe access to your database.

|||
| :-- | :-- |
| **Authentication and authorization** | Azure Database for MySQL server supports native MySQL authentication. You can connect and authenticate to server with the server's admin login. |
| **Protocol** | The service supports a message-based protocol used by MySQL. |
| **TCP/IP** | The protocol is supported over TCP/IP, and over Unix-domain sockets. |
| **Firewall** | To help protect your data, a firewall rule prevents all access to your database server, or to its databases, until you specify which computers have permission. See [Azure Database for MySQL Server firewall rules](./concepts-firewall-rules.md). |
| **SSL** | The service supports enforcing SSL connections between your applications and your database server.  See [Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](./howto-configure-ssl.md). |
|||

## How do I manage a server?
You can manage Azure Database for MySQL servers by using the Azure portal or the Azure CLI.

## Next steps
- For an overview of the service, see [Azure Database for MySQL Overview](./overview.md)
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](./concepts-service-tiers.md)
- For information about connecting to the service, see [Connection libraries for Azure Database for MySQL](./concepts-connection-libraries.md).
