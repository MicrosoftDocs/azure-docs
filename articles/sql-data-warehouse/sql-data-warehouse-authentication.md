---
title: Authentication to Azure SQL Data Warehouse | Microsoft Docs
description: Azure Active Directory (AAD) and SQL Server authentication to Azure SQL Data Warehouse.
services: sql-data-warehouse
documentationcenter: ''
author: byham
manager: jhubbard
editor: ''
tags: ''

ms.assetid: fefaaa75-2d0c-4e5d-aadb-410342d1ad73
ms.service: sql-data-warehouse
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.custom: security
ms.date: 03/21/2017
ms.author: rickbyh;barbkess

---
# Authentication to Azure SQL Data Warehouse
> [!div class="op_single_selector"]
> * [Security Overview](sql-data-warehouse-overview-manage-security.md)
> * [Authentication](sql-data-warehouse-authentication.md)
> * [Encryption (Portal)](sql-data-warehouse-encryption-tde.md)
> * [Encryption (T-SQL)](sql-data-warehouse-encryption-tde-tsql.md)
> 
> 

To connect to SQL Data Warehouse, you must pass in security credentials for authentication purposes. Upon establishing a connection, certain connection settings are configured as part of establishing your query session.  

For more information on security and how to enable connections to your data warehouse, see [Secure a database in SQL Data Warehouse][Secure a database in SQL Data Warehouse].

## SQL authentication
To connect to SQL Data Warehouse, you must provide the following information:

* Fully qualified servername
* Specify SQL authentication
* Username
* Password
* Default database (optional)

By default your connection connects to the *master* database and not your user database. To connect to your user database, you can choose to do one of two things:

* Specify the default database when registering your server with the SQL Server Object Explorer in SSDT, SSMS, or in your application connection string. For example, include the InitialCatalog parameter for an ODBC connection.
* Highlight the user database before creating a session in SSDT.

> [!NOTE]
> The Transact-SQL statement **USE MyDatabase;** is not supported for changing the database for a connection. For guidance connecting to SQL Data Warehouse with SSDT, refer to the [Query with Visual Studio][Query with Visual Studio] article.
> 
> 

## Azure Active Directory (AAD) authentication
[Azure Active Directory][What is Azure Active Directory] authentication is a mechanism of connecting to Microsoft Azure SQL Data Warehouse by using identities in Azure Active Directory (Azure AD). With Azure Active Directory authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage SQL Data Warehouse users and simplifies permission management. 

### Benefits
Azure Active Directory benefits include:

* Provides an alternative to SQL Server authentication.
* Helps stop the proliferation of user identities across database servers.
* Allows password rotation in a single place
* Manage database permissions using external (AAD) groups.
* Eliminates storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
* Uses contained database users to authenticate identities at the database level.
* Supports token-based authentication for applications connecting to SQL Data Warehouse.
* Supports Multi-Factor authentication through Active Directory Universal Authentication for SQL Server Management Studio. For a description of Multi-Factor Authentication, see [SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse](../sql-database/sql-database-ssms-mfa-authentication.md).

> [!NOTE]
> Azure Active Directory is still relatively new and has some limitations. To ensure that Azure Active Directory is a good fit for your environment, see [Azure AD features and limitations][Azure AD features and limitations], specifically the Additional considerations.
> 
> 

### Configuration steps
Follow these steps to configure Azure Active Directory authentication.

1. Create and populate an Azure Active Directory
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription
3. Create an Azure Active Directory administrator for Azure SQL Data Warehouse.
4. Configure your client computers
5. Create contained database users in your database mapped to Azure AD identities
6. Connect to your data warehouse by using Azure AD identities

Currently Azure Active Directory users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).

### Find the details
* Complete the detailed steps. The detailed steps to configure and use Azure Active Directory authentication are nearly identical for Azure SQL Database and Azure SQL Data Warehouse. Follow the detailed steps in the topic [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](../sql-database/sql-database-aad-authentication.md).
* Create custom database roles and add users to the roles. Then grant granular permissions to the roles. For more information, see [Getting Started with Database Engine Permissions](https://msdn.microsoft.com/library/mt667986.aspx).

## Next steps
To start querying your data warehouse with Visual Studio and other applications, see [Query with Visual Studio][Query with Visual Studio].

<!-- Article references -->
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md
[Query with Visual Studio]: ./sql-data-warehouse-query-visual-studio.md
[What is Azure Active Directory]: ../active-directory/active-directory-whatis.md
[Azure AD features and limitations]: ../sql-database/sql-database-aad-authentication.md#azure-ad-features-and-limitations
