---
title: Server concepts in Azure Database for PostgreSQL | Microsoft Docs
description: This topic provides considerations and guidelines for working with Azure Database for PostgreSQL servers.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.topic: article
ms.date: 05/10/2017
---
# Azure Database for PostgreSQL Servers

This topic provides considerations and guidelines for working with Azure Database for PostgreSQL servers.

## What is an Azure Database for PostgreSQL server?

An Azure Database for PostgreSQL server is a central administrative point for multiple databases. It is the same PostgreSQL server construct that you may be familiar with in the on-premises world. Specifically, the PostgreSQL service is managed, provides performance guarantees, exposes access and features at server-level.

An Azure Database for PostgreSQL server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Provides a connection endpoint for server and database access (.postgresql.database.azure.com).
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is available in multiple versions. For more information, see [Supported PostgreSQL database versions](concepts-supported-versions.md).
- Is extensible by users. For more information, see [PostgreSQL extensions](concepts-extensions.md).

## How do I connect and authenticate to an Azure Database for PostgreSQL server?

The following elements help ensure safe access to your database.

|||
| :-- | :-- |
| **Authentication and authorization** | Azure Database for PostgreSQL server supports native PostgreSQL authentication. You can connect and authenticate to server with the server's admin login. |
| **Protocol** | The service supports a message-based protocol used by PostgreSQL. |
| **TCP/IP** | The protocol is supported over TCP/IP, and over Unix-domain sockets. |
| **Firewall** | To help protect your data, a firewall rule prevents all access to your database server, or to its databases, until you specify which computers have permission. See [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md). |
|||

## How do I manage a server?

You can manage Azure Database for PostgreSQL servers by using the Azure portal or the [Azure CLI](/cli/azure/postgres).

## Next steps

- For an overview of the service, see [Azure Database for PostgreSQL Overview](overview.md)
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](concepts-service-tiers.md)
- For information on connecting to the service, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).
