---
title: postgresql-concepts-servers | Microsoft Docs
description: Provides considerations and guidelines for working with Azure Database for PostgreSQL servers.
keywords: azure cloud postgresql postgres
services: postgresql
author:
ms.author:
manager: jhubbard
editor: jasonh

ms.assetid:
ms.service: postgresql - database
ms.tgt_pltfrm: portal
ms.topic: hero - article
ms.date: 04/30/2017
---
# Servers
This topic provides considerations and guidelines for working with Azure Database for PostgreSQL servers.

## What is an Azure Database for PostgreSQL server?
An Azure Database for PostgreSQL server is a central administrative point for multiple databases. It is the same PostgreSQL server construct that you may be familiar with in the on-premises world. Specifically, the PostgreSQL service is managed, provides performance guarantees, exposes access and features at server-level.
An Azure Database for PostgreSQL server:
- Is created within an Azure subscription
- Is the parent resource for databases
- Provides a namespace for databases
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases
- Collocates resources in a region
- Provides a connection endpoint for server and database access (.postgresql.database.azure.com)
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is available in multiple versions. For more information, see [Supported Versions](versions/update.me).
- Is extensible by users. For more information, see [PostgreSQL Extensions](file:///C:/Users/salonis/AppData/Roaming/Microsoft/Word/postgresql-extensions/update.me).

## How do I connect and authenticate to an Azure Database for PostgreSQL server?
- **Authentication and authorization**: Azure Database for PostgreSQL server supports SQL authentication. You can connect and authenticate to server with the server's admin login. For more information, see [Managing Users and Roles in Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-manage-logins).
- **Protocol**: The service supports message-based protocol used by PostgreSQL.
- **TCP/IP**: The protocol is supported over TCP/IP and also over Unix-domain sockets.
- **Firewall**: To help protect your data, a firewall rule prevents all access to your database server or its databases until you specify which computers have permission. See [Firewalls](firewall/update.me).

## What collations are supported?
<update>
For more information, see [Collations Support](collations/update.me).

## How do I manage a server?
You can manage Azure Database for PostgreSQL servers using several methods:
- [Azure portal](servers-portal/update.me)
- [Azure CLI](server-cli/update.me)
- [REST](rest-api/update.me)

## Next steps
- For an overview of the service, see [Azure Database for PostgreSQL Overview](overview/update.me).
- For information about specific resource quotas and limitations based on your **service tier**, see [Service tiers](service-tiers/update.me).
- For information on connecting to the service, see [Connection Libraries for PostgreSQL](connect/update.me).
