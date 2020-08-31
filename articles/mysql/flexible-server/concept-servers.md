---
title: Server concepts - Azure Database for MySQL Flexible Server
description: This topic provides considerations and guidelines for working with Azure Database for MySQL Flexible Server
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 08/27/2020
---

# Server concepts in Azure Database for MySQL Flexible Server (Preview)

This article provides considerations and guidelines for working with Azure Database for MySQL Flexible Servers.

## What is an Azure Database for MySQL Flexible Server?

An Azure Database for MySQL Flexible Server is a central administrative point for multiple databases. It is the same MySQL server construct that you may be familiar with in the on-premises world. Specifically, the flexible server is managed, provides out of the box performance, better server manageability and control, and exposes access and features at server-level.

An Azure Database for MySQL Flexible Server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Support for customer provided server maintenance schedule
- Ability to deploy flexible servers in a zone redundant setup for improved high availability
- Provides a virtual network integration for the database server access
- Provides way to save costs by pausing the flexible server when not in use
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is currently supported with MySQL 5.7.29 versions. For more information, see [Supported Azure Database for MySQL database versions](./concepts-supported-versions.md).

Within an Azure Database for MySQL Flexible Server, you can create one or multiple databases. You can opt to create a single database per server to use all the resources or to create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of pricing tier, vCores, and storage (GB). For more information, see Pricing tiers.

## How do I manage a server?

You can manage Azure Database for MySQL Flexible Server by using the Azure portal or the Azure CLI.

