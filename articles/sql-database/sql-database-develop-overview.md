---
title: SQL Database Application Development Overview | Microsoft Docs
description: Learn about available connectivity libraries and best practices for applications connecting to SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang:
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: genemi
manager: craigg
ms.service: sql-database
ms.date: 02/07/2019
---
# SQL Database application development overview

This article walks through the basic considerations that a developer should be aware of when writing code to connect to Azure SQL Database. This article applies to all deployment models of Azure SQL Database (Single database, Elastic pools, Managed instance).

> [!TIP]
> Look at the getting started guides for [single databases](sql-database-single-database-quickstart-guide.md) and [managed instances](sql-database-managed-instance-quickstart-guide.md) if you need to setup your Azure SQL Database.
>

## Language and platform

You can use various [programming languages and platforms](sql-database-connect-query.md) to connect and query Azure SQL Database. You can find [sample applications](https://azure.microsoft.com/resources/samples/?service=sql-database&sort=0) that you can use to connect to the Azure SQL Database.

You can leverage open-source tools like [cheetah](https://github.com/wunderlist/cheetah), [sql-cli](https://www.npmjs.com/package/sql-cli), [VS Code](https://code.visualstudio.com/). Additionally, Azure SQL Database works with Microsoft tools like [Visual Studio](https://www.visualstudio.com/downloads/) and  [SQL Server Management Studio](https://msdn.microsoft.com/library/ms174173.aspx). You can also use the Azure portal, PowerShell, and REST APIs help you gain additional productivity.

## Authentication

Access to Azure SQL Database is protected with logins and firewalls. Azure SQL Database supports both SQL Server and [Azure Active Directory (AAD) authentication](sql-database-aad-authentication.md) users and logins. AAD logins are available only in Managed Instance. 

Learn more about [managing database access and login](sql-database-manage-logins.md).

## Connections

In your client connection logic, override the default timeout to be 30 seconds. The default of 15 seconds is too short for connections that depend on the internet.

If you are using a [connection pool](https://msdn.microsoft.com/library/8xx3tyca.aspx), be sure to close the connection the instant your program is not actively using it, and is not preparing to reuse it.

Avoid long-running transactions because any infrastructure or connection failure might roll back the transaction. If possible, split the transaction in the multiple smaller transactions and use [batching to improve performance](sql-database-use-batching-to-improve-performance.md).

## Resiliency

Azure SQL Database is a cloud service where you might expect transient errors that happen in the underlying infrastructure or in the communication between cloud entities. Although Azure SQL Database is resilient on the transitive infrastructure failures, these failures might affect your connectivity. When a transient error occurs while connecting to SQL Database, your code should [retry the call](sql-database-connectivity-issues.md). We recommend that retry logic use backoff logic, so that it does not overwhelm the SQL Database with multiple clients retrying simultaneously. Retry logic depends on the [error messages for SQL Database client programs](sql-database-develop-error-messages.md).

For more information about how to prepare for planned maintenance events on your Azure SQL database, see [planning for Azure maintenance events in Azure SQL Database](sql-database-planned-maintenance.md).

## Network considerations

- On the computer that hosts your client program, ensure the firewall allows outgoing TCP communication on port 1433.  More information: [Configure an Azure SQL Database firewall](sql-database-configure-firewall-settings.md).
- If your client program connects to SQL Database while your client runs on an Azure virtual machine (VM), you must open certain port ranges on the VM. More information: [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md).
- Client connections to Azure SQL Database sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important. For more information, [Azure SQL Database connectivity architecture](sql-database-connectivity-architecture.md) and [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md).
- For networking configuration for a managed instance, see [network configuration for managed instances](sql-database-howto-managed-instance.md#network-configuration).

## Next steps

Explore all the [capabilities of SQL Database](sql-database-technical-overview.md).
