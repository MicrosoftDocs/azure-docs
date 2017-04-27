---
title: Azure SQL Database Logical Server Overview | Microsoft Docs
description: This page provides considerations and guidelines for working with Azure SQL logical servers.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: DBs and servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 02/01/2017
ms.author: carlrab

---
# Azure SQL Database logical servers

This topic provides considerations and guidelines for working with Azure SQL logical servers. For information about Azure SQL databases, see [SQL databases](sql-database-overview.md).

## What is an Azure SQL Database logical server?
An Azure SQL Database logical server acts as a central administrative point for multiple databases. In SQL Database, a server is a logical construct that is distinct from a SQL Server instance that you may be familiar with in the on-premises world. Specifically, the SQL Database service makes no guarantees regarding location of the databases in relation to their logical servers, and exposes no instance-level access or features.  

An Azure Database logical server:

- Is created within an Azure subscription, but can be moved with its contained resources to another subscription
- Is the parent resource for databases, elastic pools, and data warehouses
- Provides a namespace for databases, elastic pools, data warehouses
- Is a logical container with strong lifetime semantics - delete a server and it deletes the contained databases, elastic pools, data warehouses
- Participates in Azure role-based access control (RBAC); databases, elastic pools within a server inherit access rights from the server
- Is a high-order element of the identity of databases and elastic pools for Azure resource management purposes (see the URL scheme for databases and pools)
- Collocates resources in a region
- Provides a connection endpoint for database access (<serverName>.database.windows.net)
- Provides access to metadata regarding contained resources via DMVs by connecting to a master database 
- Provides the scope for management policies that apply to its databases: logins, firewall, audit, threat detection, etc. 
- Is restricted by a quota within the parent subscription (six servers per subscription - [see Subscription limits here](../azure-subscription-service-limits.md))
- Provides the scope for database quota and DTU quota for the resources it contains (such as 45000 DTU)
- Is the versioning scope for capabilities enabled on contained resources 
- Server-level principal logins can manage all databases on a server
- Can contain logins similar to those in instances of SQL Server on your premises that are granted access to one or more databases on the server, and can be granted limited administrative rights. For more information, see [Logins](sql-database-manage-logins.md).

## How do I connect and authenticate to an Azure SQL Database logical server?

- **Authentication and authorization**: Azure SQL Database supports SQL authentication and Azure Active Directory Authentication (with certain limitations - see [Connect to SQL Database with Azure Active Directory Authentication](sql-database-aad-authentication.md) for authentication. You can connect and authenticate to Azure SQL databases through the server's master database or directly to a user database. 
For more information, see [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md). Windows Authentication is not supported. 
- **TDS**: Microsoft Azure SQL Database supports tabular data stream (TDS) protocol client version 7.3 or later.
- **TCP/IP**: Only TCP/IP connections are allowed.
- **SQL Database firewall**: To help protect your data, a SQL Database firewall prevents all access to your database server or its databases until you specify which computers have permission. See [Firewalls](sql-database-firewall-configure.md)

## What collations are supported?

The default database collation used by Microsoft Azure SQL Database (including the master database) is **SQL_LATIN1_GENERAL_CP1_CI_AS**, where **LATIN1_GENERAL** is English (United States), **CP1** is code page 1252, **CI** is case-insensitive, and **AS** is accent-sensitive. It is not recommended to alter the collation after databases are created. For more information about collations, see [COLLATE (Transact-SQL)](https://msdn.microsoft.com/library/ms184391.aspx).

## What are the naming requirements for database objects?

Names for all new objects must comply with the SQL Server rules for identifiers. For more information, see [Identifiers](https://msdn.microsoft.com/library/ms175874.aspx).

## What features are supported?

For information about supported features, see [Features](sql-database-features.md). See also [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md) for more background on the reasons for lack of support for certain types of features.

## How do I manage a logical server?

You can manage Azure SQL Database logical servers using several methods:
- [Azure portal](sql-database-manage-overview.md)
- [PowerShell](sql-database-manage-overview.md)
- [REST](/rest/api/sql/)

## Next steps

- For information about the Azure SQL Database service, see [What is SQL Database?](sql-database-technical-overview.md)
- For information about supported features, see [Features](sql-database-features.md)
- For an overview of Azure SQL databases, see [SQL database overview](sql-database-overview.md)
- For information about Transact-SQL support and differences, see [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md).
- For information about specific resource quotas and limitations based on your **service tier**. For an overview of service tiers, see [SQL Database service tiers](sql-database-service-tiers.md).
- For an overview of security, see [Azure SQL Database Security Overview](sql-database-security-overview.md).
- For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).

