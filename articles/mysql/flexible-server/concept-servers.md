---
title: Server concepts - Azure Database for MySQL - Flexible Server
description: This topic provides considerations and guidelines for working with Azure Database for MySQL - Flexible Server
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.custom: event-tier1-build-2022
ms.date: 05/24/2022
---

# Server concepts in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article provides considerations and guidelines for working with Azure Database for MySQL - Flexible Servers.

## What is an Azure Database for MySQL - Flexible Server?

Azure Database for MySQL - Flexible Server is a fully managed database service running community version of MySQL. In general, the service is designed to provide flexibility and configuration customizations based on the user requirements. It is the same MySQL server construct that you may be familiar with in the on-premises world. Specifically, the flexible server is managed, provides out of the box performance, better server manageability and control, and exposes access and features at server-level.

An Azure Database for MySQL - Flexible Server:

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
- Supports major version MySQL 5.7 and MySQL 8.0. For more information, see [Supported Azure Database for MySQL engine versions](./../concepts-supported-versions.md).

Within an Azure Database for MySQL - Flexible Server, you can create one or multiple databases. You can opt to create a single database per server to use all the resources or to create multiple databases to share the resources. The pricing is structured per-server, based on the configuration of compute tier, vCores, and storage (GB). For more information, see [compute and storage](./concepts-compute-storage.md).

## Stop/Start an Azure Database for MySQL flexible server

Azure Database for MySQL - Flexible Server gives you the ability to **Stop** the server when not in use and **Start** the server when you resume activity. This is essentially done to save costs on the database servers and only pay for the resource when in use. This becomes even more important for dev-test workloads and when you are only using the server for part of the day. When you stop the server, all active connections will be dropped. Later, when you want to bring the server back online, you can either use the [Azure portal](how-to-stop-start-server-portal.md) or CLI.

When the server is in the **Stopped** state, the server's compute is not billed. However, storage continues to be billed as the server's storage remains to ensure that data files are available when the server is started again.

> [!IMPORTANT]
> When you **Stop** the server it remains in that state for the next 30 days in a stretch. If you do not manually **Start** it during this time, the server will automatically be started at the end of 30 days. You can chose to **Stop** it again if you are not using the server.

During the time server is stopped, no management operations can be performed on the server. In order to change any configuration settings on the server, you will need to [start the server](how-to-stop-start-server-portal.md). Refer to the [stop/start limitations](./concepts-limitations.md#stopstart-operation).

> [!NOTE]
> Operations on servers that are in a [Stop](concept-servers.md#stopstart-an-azure-database-for-mysql-flexible-server) state are disabled and show as inactive in the Azure portal. Operations that are not supported on stopped servers include changing the pricing tier, number of vCores, storage size or IOPS, backup retention day, server tag, the server password, server parameters, storage auto-grow, GEO backup, HA, and user identity.

## How do I manage a server?

You can manage the creation, deletion, server parameter configuration (my.cnf), scaling, networking, security, high availability, backup & restore, monitoring of your Azure Database for MySQL - Flexible Server by using the [Azure portal](./quickstart-create-server-portal.md) or the [Azure CLI](./quickstart-create-server-cli.md). In addition, following stored procedures are available in Azure Database for MySQL to perform certain database administration tasks required as SUPER user privilege is not supported on the server.

|**Stored Procedure Name**|**Input Parameters**|**Output Parameters**|**Usage Note**|
|-----|-----|-----|-----|
|*mysql.az_kill*|processlist_id|N/A|Equivalent to [`KILL CONNECTION`](https://dev.mysql.com/doc/refman/8.0/en/kill.html) command. Will terminate the connection associated with the provided processlist_id after terminating any statement the connection is executing.|
|*mysql.az_kill_query*|processlist_id|N/A|Equivalent to [`KILL QUERY`](https://dev.mysql.com/doc/refman/8.0/en/kill.html) command. Will terminate the statement the connection is currently executing. Leaves the connection itself alive.|
|*mysql.az_load_timezone*|N/A|N/A|Loads [time zone tables](../single-server/how-to-server-parameters.md#working-with-the-time-zone-parameter) to allow the `time_zone` parameter to be set to named values (ex. "US/Pacific").|


## Next steps

-   Learn about [Create Server](./quickstart-create-server-portal.md)
-   Learn about [Monitoring and Alerts](./how-to-alert-on-metric.md)
