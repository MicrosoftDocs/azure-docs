---
title: What is an Azure SQL database? | Microsoft Docs
description: This article provides an overview of Azure SQL databases.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: ''
ms.assetid: 
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 11/28/2016
ms.author: carlrab

---
# Azure SQL database overview
This topic provides an overview of Azure SQL databases. For information about Azure SQL logical servers, see [Logical servers](sql-database-server-overview.md).

## What is Azure SQL database?
Each database in Azure SQL Database is associated with a logical server. The database can be:

- A single database with its [own set of resources](sql-database-what-is-a-dtu.md#what-are-database-transaction-units-dtus) (DTUs)
- Part of an [elastic pool](sql-database-elastic-pool.md) that [shares a set of resources](sql-database-what-is-a-dtu.md#what-are-elastic-database-transaction-units-edtus) (eDTUs)
- Part of a [scaled-out set of sharded databases](sql-database-elastic-scale-introduction.md#horizontal-and-vertical-scaling), which can be either single or pooled databases
- Part of a set of databases participating in a [multitenant SaaS design pattern](sql-database-design-patterns-multi-tenancy-saas-applications.md), and whose databases can either be single or pooled databases (or both) 

## How do I connect and authenticate to an Azure SQL database?

- **Authentication and authorization**: Azure SQL Database supports SQL authentication and Azure Active Directory Authentication (with certain limitations - see [Connect to SQL Database with Azure Active Directory Authentication](sql-database-aad-authentication.md) for authentication. You can connect and authenticate to Azure SQL databases through the server's master database or directly to a user database. 
For more information, see [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md). Windows Authentication is not supported. 
- **TDS**: Microsoft Azure SQL Database supports tabular data stream (TDS) protocol client version 7.3 or later.
- **TCP/IP**: Only TCP/IP connections are allowed.
- **SQL Database firewall**: To help protect your data, a SQL Database firewall prevents all access to your database server or its databases until you specify which computers have permission. See [Firewalls](sql-database-firewall-configure.md)

## What collations are supported?
The default database collation used by Microsoft Azure SQL Database is **SQL_LATIN1_GENERAL_CP1_CI_AS**, where **LATIN1_GENERAL** is English (United States), **CP1** is code page 1252, **CI** is case-insensitive, and **AS** is accent-sensitive. For more information about how to set the collation, see [COLLATE (Transact-SQL)](https://msdn.microsoft.com/library/ms184391.aspx).

## What are the naming requirements for database objects?

Names for all new objects must comply with the SQL Server rules for identifiers. For more information, see [Identifiers](https://msdn.microsoft.com/library/ms175874.aspx).

## What features are supported by Azure SQL databases?

For information about supported features, see [Features](sql-database-features.md). See also [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md) for more background on the reasons for lack of support for certain types of features.

## How do I manage an Azure SQL database?

You can manage Azure SQL Database logical servers using several methods:
- [Azure portal](sql-database-manage-overview.md)
- [PowerShell](sql-database-manage-overview.md)
- [Transact-SQL](sql-database-connect-query-ssms.md)
- [Visual Studio Code](sql-database-connect-query-vscode.md)
- [REST](/rest/api/sql/)

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about supported features, see [Features](sql-database-features.md)
- For an overview of Azure SQL logical servers, see [SQL Database logical server overview](sql-database-server-overview.md)
- For information about Transact-SQL support and differences, see [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md).
- For information about specific resource quotas and limitations based on your **service tier**. For an overview of service tiers, see [SQL Database service tiers](sql-database-service-tiers.md).
- For an overview of security, see [Azure SQL Database Security Overview](sql-database-security-overview.md).
- For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).

