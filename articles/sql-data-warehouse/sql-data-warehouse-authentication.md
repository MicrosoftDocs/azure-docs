<properties
   pageTitle="Authentication to Azure SQL Data Warehouse | Microsoft Azure"
   description="Azure Active Directory (AAD) and SQL Server authentication to Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter=""
   authors="byham"
   manager="barbkess"
   editor=""
   tags=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="07/23/2016"
   ms.author="rickbyh;barbkess;sonyama"/>

# Authentication to Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-connect-overview.md)
- [Authentication](sql-data-warehouse-authentication.md)
- [Drivers](sql-data-warehouse-connection-strings.md)

To connect to SQL Data Warehouse you will need to pass in security credentials for authentication purposes. Upon establishing a connection you will also find that certain connection settings are configured as part of establishing your query session.  

For more information on security and how to enable connections to your data warehouse, see [Secure a database in SQL Data Warehouse][].

## SQL authentication
To connect to SQL Data Warehouse you will need to provide the following information:

- Fully qualified servername
- Specify SQL authentication
- Username
- Password
- Default database (optional)

It is important to note that users must authenticate using SQL authentication. Trusted authentication is not supported at this time.

By default your connection will connect to the master database and not your user database. To connect to your user database you can choose to do one of two things:

1. Specify the default database when registering your server with the SQL Server Object Explorer in SSDT or in your application connection string. For example by including the InitialCatalog parameter for an ODBC connection.
2. First highlight the user database prior to creating a session in SSDT.

> [AZURE.NOTE] For guidance connecting to SQL Data Warehouse with SSDT please refer back to the [Query with Visual Studio][] article.

It is again important to note that the Transact-SQL statement **USE <your DB>** is not supported for changing the database for a connection


## Azure Active Directory (AAD) authentication

[Azure Active Directory][What is Azure Active Directory] authentication is a mechanism of connecting to Microsoft Azure SQL Data Warehouse by using identities in Azure Active Directory (Azure AD). With Azure Active Directory authentication you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage SQL Data Warehouse users and simplifies permission management. 

### Benefits

Benefits include the following:

- It provides an alternative to SQL Server authentication.
- Helps stop the proliferation of user identities across database servers.
- Allows password rotation in a single place
- Customers can manage database permissions using external (AAD) groups.
- It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
- Azure Active Directory authentication uses contained database users to authenticate identities at the database level.
- Azure Active Directory supports token-based authentication for applications connecting to SQL Data Warehouse.

> [AZURE.IMPORTANT] Azure Active Directory authentication is a preview feature and is subject to the preview terms in the license agreement (e.g., the Enterprise Agreement, Microsoft Azure Agreement, or Microsoft Online Subscription Agreement), as well as any applicable [Supplemental Terms of Use for Microsoft Azure Preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

### Configuration steps

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

1. Create and populate an Azure Active Directory
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription
3. Create an Azure Active Directory administrator for Azure SQL Data Warehouse.
4. Configure your client computers
5. Create contained database users in your database mapped to Azure AD identities
6. Connect to your data warehouse by using Azure AD identities

The principal differences between using Azure Active Directory authentication with Azure SQL Database and Azure SQL Data Warehouse is that you must you use SQL Server Data Tools instead of SQL Server Management Studio to connect to SQL Data Warehouse. SQL Data Warehouse requires at least the April 2016 (version 14.0.60311.1) of the SQL Server Data Tools for Visual Studio 2015. Currently Azure Active Directory users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).
  
### Find the details
- Complete the detailed steps. The detailed steps to configure and use Azure Active Directory authentication are nearly identical for Azure SQL Database and Azure SQL Data Warehouse. Follow the detailed steps in the topic [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](../sql-database/sql-database-aad-authentication.md).
- Create custom database roles and add users to the roles. Then grant granular permissions to the roles. For more information, see [Getting Started with Database Engine Permissions](https://msdn.microsoft.com/library/mt667986.aspx).

## Next steps

To start querying your data warehouse with Visual Studio and other applications, see [Query with Visual Studio][].

<!-- Article references -->
[Secure a database in SQL Data Warehouse]: ./sql-data-warehouse-overview-manage-security.md
[Query with Visual Studio]: ./sql-data-warehouse-query-visual-studio.md
[What is Azure Active Directory]: ../active-directory-whatis.md
