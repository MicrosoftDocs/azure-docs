---
title: Server concepts in Azure Database for PostgreSQL
description: This article provides considerations and guidelines for configuring and managing Azure Database for PostgreSQL servers.
services: postgresql
author: rachel-msft
ms.author: raagyema
editor: jasonwhowell
ms.service: postgresql
ms.topic: article
ms.date: 09/27/2018
---
# Azure Database for PostgreSQL servers
This article provides considerations and guidelines for working with Azure Database for PostgreSQL servers.

## What is an Azure Database for PostgreSQL server?
An Azure Database for PostgreSQL server is a central administrative point for multiple databases. It is the same PostgreSQL server construct that you may be familiar with in the on-premises world. Specifically, the PostgreSQL service is managed, provides performance guarantees, exposes access and features at the server-level.

An Azure Database for PostgreSQL server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Provides a connection endpoint for server and database access (.postgresql.database.azure.com).
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is available in multiple versions. For more information, see [supported PostgreSQL database versions](concepts-supported-versions.md).
- Is extensible by users. For more information, see [PostgreSQL extensions](concepts-extensions.md).

Within an Azure Database for PostgreSQL server, you can create one or multiple databases. You can opt to create a single database per server to utilize all the resources, or create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of pricing tier, vCores, and storage (GB). For more information, see [Pricing tiers](./concepts-pricing-tiers.md).

## How do I connect and authenticate to an Azure Database for PostgreSQL server?
The following elements help ensure safe access to your database:

|||
|:--|:--|
| **Authentication and authorization** | Azure Database for PostgreSQL server supports native PostgreSQL authentication. You can connect and authenticate to server with the server's admin login. |
| **Protocol** | The service supports a message-based protocol used by PostgreSQL. |
| **TCP/IP** | The protocol is supported over TCP/IP, and over Unix-domain sockets. |
| **Firewall** | To help protect your data, a firewall rule prevents all access to your server and to its databases, until you specify which computers have permission. See [Azure Database for PostgreSQL Server firewall rules](concepts-firewall-rules.md). |

## Managing your server
You can manage Azure Database for PostgreSQL servers by using the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/postgres).

While creating a server, you set up the credentials for your admin user. The admin user is the highest privilege user you have on the server. It belongs to the role azure_pg_admin. This role does not have full superuser permissions. 

The PostgreSQL superuser attribute is assigned to the azure_superuser, which belongs to the managed service. You do not have access to this role.

An Azure Database for PostgreSQL server has two default databases: 
- **postgres** - A default database you can connect to once your server is created.
- **azure_maintenance** - This database is used to separate the processes that provide the managed service from user actions. You do not have access to this database.
- **azure_sys** - A database for the Query Store. This database does not accumulate data when Query Store is off; this is the default setting. For more information, see the [Query Store overview](concepts-query-store.md).


## Server parameters
The PostgreSQL server parameters determine the configuration of the server. In Azure Database for PostgreSQL, the list of parameters can be viewed and edited using the Azure portal or the Azure CLI. 

As a managed service for Postgres, the configurable parameters in Azure Database for PostgreSQL are a subset of the parameters in a local Postgres instance (For more information on Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/9.6/static/runtime-config.html)). Your Azure Database for PostgreSQL server is enabled with default values for each parameter on creation. Some parameters that would require a server restart or superuser access for changes to take effect cannot be configured by the user.


## Next steps
- For an overview of the service, see [Azure Database for PostgreSQL Overview](overview.md).
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](concepts-pricing-tiers.md).
- For information on connecting to the service, see [Connection libraries for Azure Database for PostgreSQL](concepts-connection-libraries.md).
- View and edit server parameters through [Azure portal](howto-configure-server-parameters-using-portal.md) or [Azure CLI](howto-configure-server-parameters-using-cli.md).
