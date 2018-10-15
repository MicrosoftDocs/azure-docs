---
title: Granting access to Azure SQL Database and SQL Data Warehouse | Microsoft Docs
description: Learn about granting access to Microsoft Azure SQL Database and SQL Data Warehouse.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: sql-data-warehouse
ms.devlang: 
ms.topic: conceptual
author: VanMSFT
ms.author: vanto
ms.reviewer: carlrab
manager: craigg
ms.date: 10/05/2018
---
# Azure SQL Database and SQL Data Warehouse access control

To provide security, Azure [SQL Database](sql-database-technical-overview.md) and [SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) control access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data. 

> [!IMPORTANT]
> For an overview of the SQL Database security features, see [SQL security overview](sql-database-security-overview.md). For a tutorial, see [Secure your Azure SQL Database](sql-database-security-tutorial.md). For an overview of SQL Data Warehouse security features, see [SQL Data Warehouse security overview](../sql-data-warehouse/sql-data-warehouse-overview-manage-security.md)

## Firewall and firewall rules

Microsoft Azure SQL Database provides a relational database service for Azure and other Internet-based applications. To help protect your data, firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to databases based on the originating IP address of each request. For more information, see [Overview of Azure SQL Database firewall rules](sql-database-firewall-configure.md)

The Azure SQL Database service is only available through TCP port 1433. To access a SQL Database from your computer, ensure that your client computer firewall allows outgoing TCP communication on TCP port 1433. If not needed for other applications, block inbound connections on TCP port 1433. 

As part of the connection process, connections from Azure virtual machines are redirected to a different IP address and port, unique for each worker role. The port number is in the range from 11000 to 11999. For more information about TCP ports, see [Ports beyond 1433 for ADO.NET 4.5 and SQL Database2](sql-database-develop-direct-route-ports-adonet-v12.md).

## Authentication

SQL Database supports two types of authentication:

- **SQL Authentication**:

  This authentication method uses a username and password. When you created the logical server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner, or "dbo." 
- **Azure Active Directory Authentication**:

  THis authentication method uses identities managed by Azure Active Directory and is supported for managed and integrated domains. Use Active Directory authentication (integrated security) [whenever possible](https://docs.microsoft.com/sql/relational-databases/security/choose-an-authentication-mode). If you want to use Azure Active Directory Authentication, you must create another server admin called the "Azure AD admin," which is allowed to administer Azure AD users and groups. This admin can also perform all operations that a regular server admin can. See [Connecting to SQL Database By Using Azure Active Directory Authentication](sql-database-aad-authentication.md) for a walkthrough of how to create an Azure AD admin to enable Azure Active Directory Authentication.

The Database Engine closes connections that remain idle for more than 30 minutes. The connection must login again before it can be used. Continuously active connections to SQL Database require reauthorization (performed by the database engine) at least every 10 hours. The database engine attempts reauthorization using the originally submitted password and no user input is required. For performance reasons, when a password is reset in SQL Database, the connection is not reauthenticated, even if the connection is reset due to connection pooling. This is different from the behavior of on-premises SQL Server. If the password has been changed since the connection was initially authorized, the connection must be terminated and a new connection made using the new password. A user with the `KILL DATABASE CONNECTION` permission can explicitly terminate a connection to SQL Database by using the [KILL](https://docs.microsoft.com/sql/t-sql/language-elements/kill-transact-sql) command.

User accounts can be created in the master database and can be granted permissions in all databases on the server, or they can be created in the database itself (called contained users). For information on creating and managing logins, see [Manage logins](sql-database-manage-logins.md). Use contained databases to enhance portability and scalability. For more information on contained users, see [Contained Database Users - Making Your Database Portable](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable), [CREATE USER (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-user-transact-sql), and [Contained Databases](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases).

As a best practice your application should use a dedicated account to authenticate -- this way you can limit the permissions granted to the application and reduce the risks of malicious activity in case your application code is vulnerable to a SQL injection attack. The recommended approach is to create a [contained database user](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable), which allows your app to authenticate directly to the database. 

## Authorization

Authorization refers to what a user can do within an Azure SQL Database, and this is controlled by your user account's database [role memberships](https://docs.microsoft.com/sql/relational-databases/security/authentication-access/database-level-roles) and [object-level permissions](https://docs.microsoft.com/sql/relational-databases/security/permissions-database-engine). As a best practice, you should grant users the least privileges necessary. The server admin account you are connecting with is a member of db_owner, which has authority to do anything within the database. Save this account for deploying schema upgrades and other management operations. Use the "ApplicationUser" account with more limited permissions to connect from your application to the database with the least privileges needed by your application. For more information, see [Manage logins](sql-database-manage-logins.md).

Typically, only administrators need access to the `master` database. Routine access to each user database should be through non-administrator contained database users created in each database. When you use contained database users, you do not need to create logins in the `master` database. For more information, see [Contained Database Users - Making Your Database Portable](https://docs.microsoft.com/sql/relational-databases/security/contained-database-users-making-your-database-portable).

You should familiarize yourself with the following features that can be used to limit or elevate permissions:

- [Impersonation](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/customizing-permissions-with-impersonation-in-sql-server) and [module-signing](https://docs.microsoft.com/dotnet/framework/data/adonet/sql/signing-stored-procedures-in-sql-server) can be used to securely elevate permissions temporarily.
- [Row-Level Security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security) can be used limit which rows a user can access.
- [Data Masking](sql-database-dynamic-data-masking-get-started.md) can be used to limit exposure of sensitive data.
- [Stored procedures](https://docs.microsoft.com/sql/relational-databases/stored-procedures/stored-procedures-database-engine) can be used to limit the actions that can be taken on the database.

## Next steps

- For an overview of the SQL Database security features, see [SQL security overview](sql-database-security-overview.md).
- To learn more about firewall rules, see [Firewall rules](sql-database-firewall-configure.md).
- To learn about users and logins, see [Manage logins](sql-database-manage-logins.md). 
- For a discussion of proactive monitoring, see [Database Auditing](sql-database-auditing.md) and [SQL Database Threat Detection](sql-database-threat-detection.md).
- For a tutorial, see [Secure your Azure SQL Database](sql-database-security-tutorial.md).
