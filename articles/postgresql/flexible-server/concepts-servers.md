---
title: Server concepts for Azure Database for PostgreSQL - Flexible Server
description: This article provides considerations and guidelines for configuring and managing Azure Database for PostgreSQL - Flexible Server.
author: kabharati
ms.author: kabharati
ms.reviewer: maghan
ms.date: 04/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Server concepts for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides considerations and guidelines for working with Azure Database for PostgreSQL flexible server.

## What is an Azure Database for PostgreSQL server?

A server in the Azure Database for PostgreSQL flexible server deployment option is a central administrative point for multiple databases. It's the same PostgreSQL server construct that you might be familiar with in the on-premises world. Specifically, Azure Database for PostgreSQL flexible server is managed, provides performance guarantees, and exposes access and features at the server level.

An Azure Database for PostgreSQL flexible server instance:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics. Deleting a server deletes the contained databases.
- Collocates resources in a region.
- Provides a connection endpoint for server and database access.
- Provides the scope for management policies that apply to its databases, such as login, firewall, users, roles, and configurations.
- Is available in multiple versions. For more information, see the [supported PostgreSQL database versions](concepts-supported-versions.md).
- Is extensible by users. For more information, see [PostgreSQL extensions](concepts-extensions.md).

Within an Azure Database for PostgreSQL flexible server instance, you can create one or multiple databases. You can opt to create a single database per server to utilize all the resources, or create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of pricing tier, vCores, and storage (GB). For more information, see [Compute options](concepts-compute.md).

## How do I connect and authenticate to the database server?

The following elements help ensure safe access to your database:

| Security concept | Description |
| :-- | :-- |
| Authentication and authorization | Azure Database for PostgreSQL flexible server supports native PostgreSQL authentication. You can connect and authenticate to a server by using the server's admin login. |
| Protocol | The service supports a message-based protocol that PostgreSQL uses. |
| TCP/IP | The protocol is supported over TCP/IP and over Unix-domain sockets. |
| Firewall | To help protect your data, a firewall rule prevents all access to your server and to its databases until you specify which computers have permission. See [Azure Database for PostgreSQL flexible server firewall rules](how-to-manage-firewall-portal.md). |

## Managing your server

You can manage Azure Database for PostgreSQL flexible server instances by using the [Azure portal](https://portal.azure.com) or the [Azure CLI](/cli/azure/postgres).

When you create a server, you set up the credentials for your admin user. The admin user is the highest-privilege user on the server. It belongs to the role **azure_pg_admin**. This role does not have full superuser permissions.

The PostgreSQL superuser attribute is assigned to **azure_superuser**, which belongs to the managed service. You don't have access to this role.

An Azure Database for PostgreSQL flexible server instance has default databases:

- **postgres**: A default database that you can connect to after you create your server.
- **azure_maintenance**: A database that's used to separate the processes that provide the managed service from user actions. You don't have access to this database.

## Server parameters

The Azure Database for PostgreSQL flexible server parameters determine the configuration of the server. In Azure Database for PostgreSQL flexible server, you can view and edit the list of parameters by using the Azure portal or the Azure CLI.

As a managed service for Postgres, Azure Database for PostgreSQL has configurable parameters that are a subset of the parameters in a local Postgres instance. For more information on Postgres parameters, see the [PostgreSQL documentation](https://www.postgresql.org/docs/current/static/runtime-config.html).

Your Azure Database for PostgreSQL flexible server instance is enabled with default values for each parameter on creation. The user can't configure some parameters that would require a server restart or superuser access for changes to take effect.

## Related content

- For an overview of the service, see [Azure Database for PostgreSQL flexible server overview](overview.md).
- For information about specific resource quotas and limitations based on your **configuration**, see [Compute options](concepts-compute.md).
- View and edit server parameters through [Azure portal](how-to-configure-server-parameters-using-portal.md) or [Azure CLI](how-to-configure-server-parameters-using-cli.md).
