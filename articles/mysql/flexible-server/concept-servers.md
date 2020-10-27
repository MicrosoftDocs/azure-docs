---
title: Server concepts - Azure Database for MySQL Flexible Server
description: This topic provides considerations and guidelines for working with Azure Database for MySQL Flexible Server
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 09/21/2020
---

# Server concepts in Azure Database for MySQL Flexible Server (Preview)

> [!IMPORTANT] 
> Azure Database for MySQL - Flexible Server is currently in public preview.

This article provides considerations and guidelines for working with Azure Database for MySQL Flexible Servers.

## What is an Azure Database for MySQL Flexible Server?

Azure Database for MySQL Flexible Server is a fully managed database service running community version of MySQL. In general, the service is designed to provide flexibility and configuration customizations based on the user requirements. It is the same MySQL server construct that you may be familiar with in the on-premises world. Specifically, the flexible server is managed, provides out of the box performance, better server manageability and control, and exposes access and features at server-level.

An Azure Database for MySQL Flexible Server:

- Is created within an Azure subscription.
- Is the parent resource for databases.
- Allows MySQL configuration exposed through Server parameters (link to Server parameter concepts).
- Performs automated backups and supports point in time restores.
- Provides a namespace for databases.
- Is a container with strong lifetime semantics - delete a server and it deletes the contained databases.
- Collocates resources in a region.
- Support for customer provided server maintenance schedule
- Ability to deploy flexible servers in a zone redundant setup for improved high availability
- Provides a virtual network integration for the database server access
- Provides way to save costs by pausing the flexible server when not in use
- Provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations, etc.
- Is currently supported with version MySQL 5.7. For more information, see [Supported Azure Database for MySQL engine versions](./concepts-supported-versions.md).

Within an Azure Database for MySQL Flexible Server, you can create one or multiple databases. You can opt to create a single database per server to use all the resources or to create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of compute tier, vCores, and storage (GB). For more information, see [compute and storage](./concepts-compute-storage.md).

## Stop/Start an Azure Database for MySQL Flexible Server

Azure Database for MySQL Flexible Server gives you the ability to **Stop** the server when not in use and **Start** the server when you resume activity. This is essentially done to save costs on the database servers and only pay for the resource when in use. This becomes even more important for dev-test workloads and when you are only using the server for part of the day. When you stop the server, all active connections will be dropped. Later, when you want to bring the server back online, you can either use the [Azure portal](how-to-stop-start-server-portal.md) or CLI.

When the server is in the **Stopped** state, the server's compute is not billed. However, storage continues to to be billed as the server's storage remains to ensure that data files are available when the server is started again.

> [!IMPORTANT]
> When you **Stop** the server it remains in that state for the next 7 days in a stretch. If you do not manually **Start** it during this time, the server will automatically be started at the end of 7 days. You can chose to **Stop** it again if you are not using the server.

During the time server is stopped, no management operations can be performed on the server. In order to change any configuration settings on the server, you will need to [start the server](how-to-stop-start-server-portal.md). Refer to the [stop/start limitations](./concepts-limitations.md#stopstart-operation).

## How do I manage a server?

You can manage Azure Database for MySQL Flexible Server by using the [Azure portal](./quickstart-create-server-portal.md) or the [Azure CLI](./quickstart-create-server-cli.md).

## Next steps

-   Learn about [Create Server](./quickstart-create-server-portal.md)
-   Learn about [Monitoring and Alerts](./how-to-alert-on-metric.md)

