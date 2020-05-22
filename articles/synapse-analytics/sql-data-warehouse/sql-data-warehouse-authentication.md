---
title: Authentication
description: Learn how to authenticate to Azure Synapse Analytics by using Azure Active Directory (Azure AD) or SQL Server authentication.
services: synapse-analytics
author: julieMSFT
manager: craigg
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: 
ms.date: 04/02/2019
ms.author: jrasnick
ms.reviewer: igorstan
ms.custom: seo-lt-2019
tag: azure-synapse
---

# Authenticate to Azure Synapse Analytics

Learn how to authenticate to Synapse SQL in Azure Synapse by using Azure Active Directory (AAD) or SQL Server authentication.

To connect to a SQL pool, you must pass in security credentials for authentication purposes. Upon establishing a connection, certain connection settings are configured as part of establishing your query session.  

For more information on security and how to enable connections to your data warehouse, see [securing a database documentation](sql-data-warehouse-overview-manage-security.md).

## SQL authentication

To connect to SQL pool, you must provide the following information:

* Fully qualified servername
* Specify SQL authentication
* Username
* Password
* Default database (optional)

By default, your connection connects to the *master* database and not your user database. To connect to your user database, you can choose to do one of two things:

* Specify the default database when registering your server with the SQL Server Object Explorer in SSDT, SSMS, or in your application connection string. For example, include the InitialCatalog parameter for an ODBC connection.
* Highlight the user database before creating a session in SSDT.

> [!NOTE]
> The Transact-SQL statement **USE MyDatabase;** is not supported for changing the database for a connection. For guidance connecting to a SQL pool with SSDT, refer to the [Query with Visual Studio](sql-data-warehouse-query-visual-studio.md) article.

## Azure Active Directory (AAD) authentication

[Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) authentication is a mechanism of connecting to SQL pool by using identities in Azure Active Directory (Azure AD). With Azure Active Directory authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage Azure Synapse users and simplifies permission management.

### Benefits

Azure Active Directory benefits include:

* Provides an alternative to SQL Server authentication.
* Helps stop the proliferation of user identities across servers.
* Allows password rotation in a single place
* Manage database permissions using external (Azure AD) groups.
* Eliminates storing passwords by enabling integrated Windows authentication and o ther forms of authentication supported by Azure Active Directory.
* Uses contained database users to authenticate identities at the database level.
* Supports token-based authentication for applications connecting to SQL pool.
* Supports Multi-Factor authentication through Active Directory Universal Authentication for various tools including [SQL Server Management Studio](../../azure-sql/database/authentication-mfa-ssms-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) and [SQL Server Data Tools](/sql/ssdt/azure-active-directory?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

> [!NOTE]
> Azure Active Directory is still relatively new and has some limitations. To ensure that Azure Active Directory is a good fit for your environment, see [Azure AD features and limitations](../../azure-sql/database/authentication-aad-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json#azure-ad-features-and-limitations), specifically the Additional considerations.

### Configuration steps

Follow these steps to configure Azure Active Directory authentication.

1. Create and populate an Azure Active Directory
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription
3. Create an Azure Active Directory administrator for Azure Synapse
4. Configure your client computers
5. Create contained database users in your database mapped to Azure AD identities
6. Connect to your SQL pool by using Azure AD identities

Currently Azure Active Directory users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](/sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

### Find the details

* The steps to configure and use Azure Active Directory authentication are nearly identical for Azure SQL Database and Synapse SQL in Azure Synapse. Follow the detailed steps in the topic [Connecting to SQL Database or SQL Pool By Using Azure Active Directory Authentication](../../azure-sql/database/authentication-aad-overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).
* Create custom database roles and add users to the roles. Then grant granular permissions to the roles. For more information, see [Getting Started with Database Engine Permissions](/sql/relational-databases/security/authentication-access/getting-started-with-database-engine-permissions?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest).

## Next steps

To start querying with Visual Studio and other applications, see [Query with Visual Studio](sql-data-warehouse-query-visual-studio.md).
