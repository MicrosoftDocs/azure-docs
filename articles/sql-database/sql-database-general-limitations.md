---
title: Azure SQL Database General Considerations and Guidelines
description: This page describes some general considerations and guidelines for Azure SQL Database servers and databases as well as a matrix of supported features.
services: sql-database
documentationcenter: na
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: d1a46fa4-53d2-4d25-a0a7-92e8f9d70828
ms.service: sql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 11/21/2016
ms.author: carlrab

---
# Azure SQL Database considerations, guidelines and features
This topic provides considerations and guidelines for using Azure SQL Database, and provides a feature support matrix with links each listed feature. 

## Azure SQL Database logical server
Each database in Azure SQL Database is associated with a logical server. The server acts as a central administrative point for multiple databases. In SQL Database, a server is a logical construct that is distinct from a SQL Server instance that you may be familiar with in the on-premises world. Specifically, the SQL Database service makes no guarantees regarding location of the databases with respect to SQL Server instance(s) on which they are hosted, and exposes no instance-level access or features. 

An Azure Database logical server:

- Is created within an Azure subscription, but can be moved with its contained resources to another subscription
- Is the parent resource for databases, elastic pools and data warehouses in Azure Resource Management (ARM)
- Provides a namespace for databases, elastic pools, data warehouses
- Is a logical container with strong lifetime semantics - delete a server and it deletes the contained databases, elastic pools, data warehouses
- Participates in Azure role based access control (RBAC); databases, elastic pools within a server inherit access rights from the server
- Is a high-order element of the identity of databases and elastic pools for Azure resource management purposes (see the URL scheme for databases and pools)
- Collocates resources in a region
- Provides a connection endpoint for database access (<serverName>.database.windows.net)
- Provides access to metadata regarding contained resources via DMVs by connecting to a master database 
- Provides the scope for management policies that apply to its databases: logins, firewall, audit, threat detection, etc. 
- Is restricted by a quota within the parent subscription (6 servers per subscription - [see Subscription limits here](../azure-subscription-service-limits.md))
- Provides the scope for database quota and DTU quota for the resources it contains (e.g. 45000 DTU in V12)
- Is the versioning scope for capabilities enabled on contained resources (latest version is V12)
- Server-level principal logins can manage all databases on a server
- Can contain logins similar to those in instances of SQL Server on your premises that are granted access to one or more databases on the server, and can be granted limited administrative rights. For more information, see [Logins](sql-database-manage-logins.md).

## Connectivity and authentication
- **Authentication and authorization**: Azure SQL Database supports SQL authentication and Azure Active Directory Authentication (with certain limitations - see [Connect to SQL Database with Azure Active Directory Authentication](sql-database-aad-authentication.md)) for authentication. See [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md). Windows Authentication is not supported. 
- **TDS**: Microsoft Azure SQL Database supports tabular data stream (TDS) protocol client version 7.3 or later.
- **TCP/IP**: Only TCP/IP connections are allowed.
- **SQL Database firewall**: To help protect your data, a SQL Database firewall prevents all access to your database server or its databases until you specify which computers have permission. See [Firewalls](sql-database-firewall-configure.md)

## Database collation support
The default database collation used by Microsoft Azure SQL Database is **SQL_LATIN1_GENERAL_CP1_CI_AS**, where **LATIN1_GENERAL** is English (United States), **CP1** is code page 1252, **CI** is case-insensitive, and **AS** is accent-sensitive. It is not possible to alter the collation for V12 databases. For more information about how to set the collation, see [COLLATE (Transact-SQL)](https://msdn.microsoft.com/library/ms184391.aspx).

## Naming Requirements
Certain user names are not allowed for security reasons. You cannot use the following names:

* **admin**
* **administrator**
* **guest**
* **root**
* **sa**

Names for all new objects must comply with the SQL Server rules for identifiers. For more information, see [Identifiers](https://msdn.microsoft.com/library/ms175874.aspx).

Additionally, login and user names cannot contain the \ character (Windows Authentication is not supported).

## Supported features matrix



## Additional Guidelines
* In addition to the general limitations outlined in this article, SQL Database has specific resource quotas and limitations based on your **service tier**. For an overview of service tiers, see [SQL Database service tiers](sql-database-service-tiers.md).
* For other SQL Database limits, see [Azure SQL Database Resource Limits](sql-database-resource-limits.md).
* For security related guidelines, see [Azure SQL Database Security Guidelines and Limitations](sql-database-security-guidelines.md).
* Another related area surrounds the compatibility that Azure SQL Database has with on-premises versions of SQL Server, such as SQL Server 2014 and SQL Server 2016. The latest V12 version of Azure SQL Database has made many improvements in this area. For more details, see [What's new in SQL Database V12](sql-database-v12-whats-new.md).
* For information on driver availability and support for SQL Database, see [Connection Libraries for SQL Database and SQL Server](sql-database-libraries.md).

