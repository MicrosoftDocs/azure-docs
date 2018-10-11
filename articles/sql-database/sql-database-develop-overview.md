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
ms.date: 06/20/2018
---
# SQL Database application development overview
This article walks through the basic considerations that a developer should be aware of when writing code to connect to Azure SQL Database.

> [!TIP]
> For a tutorial showing you how to create a server, create a server-based firewall, view server properties, connect using SQL Server Management Studio, query the master database, create a sample database and a blank database, query database properties, connect using SQL Server Management Studio, and query the sample database, see [Get Started Tutorial](sql-database-get-started-portal.md).
>

## Language and platform
There are code samples available for various programming languages and platforms. You can find links to the code samples at: 

* More information: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).

## Tools 
You can leverage open-source tools like [cheetah](https://github.com/wunderlist/cheetah), [sql-cli](https://www.npmjs.com/package/sql-cli), [VS Code](https://code.visualstudio.com/). Additionally, Azure SQL Database works with Microsoft tools like [Visual Studio](https://www.visualstudio.com/downloads/) and  [SQL Server Management Studio](https://msdn.microsoft.com/library/ms174173.aspx).  You can also use the Azure Management Portal, PowerShell, and REST APIs help you gain additional productivity.

## Resource limitations
Azure SQL Database manages the resources available to a database using two different mechanisms: Resources governance and enforcement of limits. For more information, see:

- [DTU-based resource model limits - Single Database](sql-database-dtu-resource-limits-single-databases.md)
- [DTU-based resource model limits - Elastic pools](sql-database-dtu-resource-limits-elastic-pools.md)
- [vCore-based resource limits - Single Databases](sql-database-vcore-resource-limits-single-databases.md)
- [vCore-based resource limits - Elastic pools](sql-database-vcore-resource-limits-elastic-pools.md)

## Security
Azure SQL Database provides resources for limiting access, protecting data, and monitoring activities on a SQL Database.

* More information: [Securing your SQL Database](sql-database-security-overview.md).

## Authentication
* Azure SQL Database supports both SQL Server authentication users and logins, as well as [Azure Active Directory authentication](sql-database-aad-authentication.md) users and logins.
* You need to specify a particular database, instead of defaulting to the *master* database.
* You cannot use the Transact-SQL **USE myDatabaseName;** statement on SQL Database to switch to another database.
* More information: [SQL Database security: Manage database access and login security](sql-database-manage-logins.md).

## Resiliency
When a transient error occurs while connecting to SQL Database, your code should retry the call.  We recommend that retry logic use backoff logic, so that it does not overwhelm the SQL Database with multiple clients retrying simultaneously.

* Code samples:  For code samples that illustrate retry logic, see samples for the language of your choice at: [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md).
* More information: [Error messages for SQL Database client programs](sql-database-develop-error-messages.md).

## Managing connections
* In your client connection logic, override the default timeout to be 30 seconds.  The default of 15 seconds is too short for connections that depend on the internet.
* If you are using a [connection pool](http://msdn.microsoft.com/library/8xx3tyca.aspx), be sure to close the connection the instant your program is not actively using it, and is not preparing to reuse it.

## Network considerations
* On the computer that hosts your client program, ensure the firewall allows outgoing TCP communication on port 1433.  More information: [Configure an Azure SQL Database firewall](sql-database-configure-firewall-settings.md).
* If your client program connects to SQL Database while your client runs on an Azure virtual machine (VM), you must open certain port ranges on the VM. More information: [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md).
* Client connections to Azure SQL Database sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important. For more information, [Azure SQL Database connectivity architecture](sql-database-connectivity-architecture.md) and [Ports beyond 1433 for ADO.NET 4.5 and SQL Database](sql-database-develop-direct-route-ports-adonet-v12.md).

## Data sharding with elastic scale
Elastic scale simplifies the process of scaling out (and in). 

* [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).
* [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md).
* [Get Started with Azure SQL Database Elastic Scale Preview](sql-database-elastic-scale-get-started.md).

## Next steps
Explore all the [capabilities of SQL Database](sql-database-technical-overview.md).
