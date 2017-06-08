---
title: Secure a database in SQL Data Warehouse | Microsoft Docs
description: Tips for securing a database in Azure SQL Data Warehouse for developing solutions.
services: sql-data-warehouse
documentationcenter: NA
author: ronortloff
manager: jhubbard
editor: ''

ms.assetid: 8fa2f5ca-4cf5-4418-99a2-4dc745799850
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: security
ms.date: 10/31/2016
ms.author: rortloff;barbkess

---
# Secure a database in SQL Data Warehouse
> [!div class="op_single_selector"]
> * [Security Overview](sql-data-warehouse-overview-manage-security.md)
> * [Authentication](sql-data-warehouse-authentication.md)
> * [Encryption (Portal)](sql-data-warehouse-encryption-tde.md)
> * [Encryption (T-SQL)](sql-data-warehouse-encryption-tde-tsql.md)
> 
> 

This article walks through the basics of securing your Azure SQL Data Warehouse database. In particular, this article will get you started with resources for limiting access, protecting data, and monitoring activities on a database.

## Connection security
Connection Security refers to how you restrict and secure connections to your database using firewall rules and connection encryption.

Firewall rules are used by both the server and the database to reject connection attempts from IP addresses that have not been explicitly whitelisted. To allow connections from your application or client machine's public IP address, you must first create a server-level firewall rule using the Azure Portal, REST API, or PowerShell. As a best practice, you should restrict the IP address ranges allowed through your server firewall as much as possible.  To access Azure SQL Data Warehouse from your local computer, ensure the firewall on your network and local computer allows outgoing communication on TCP port 1433.  For more information, see [Azure SQL Database firewall][Azure SQL Database firewall], [sp_set_firewall_rule][sp_set_firewall_rule], and [sp_set_database_firewall_rule][sp_set_database_firewall_rule].

Connections to your SQL Data Warehouse are encrypted by default.  Modifying connection settings to disable encryption are ignored.

## Authentication
Authentication refers to how you prove your identity when connecting to the database. SQL Data Warehouse currently supports SQL Server Authentication with a username and password as well as a Azure Active Directory. 

When you created the logical server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner, or "dbo" through SQL Server Authentication.

However, as a best practice, your organization’s users should use a different account to authenticate. This way you can limit the permissions granted to the application and reduce the risks of malicious activity in case your application code is vulnerable to a SQL injection attack. 

To create a SQL Server Authenticated user, connect to the **master** database on your server with your server admin login and create a new server login.  Additionally, it is a good idea to create a user in the master database for Azure SQL Data Warehouse users. Creating a user in master allows a user to login using tools like SSMS without specifying a database name.  It also allows them to use the object explorer to view all databases on a SQL server.

```sql
-- Connect to master database and create a login
CREATE LOGIN ApplicationLogin WITH PASSWORD = 'Str0ng_password';
CREATE USER ApplicationUser FOR LOGIN ApplicationLogin;
```

Then, connect to your **SQL Data Warehouse database** with your server admin login and create a database user based on the server login you just created.

```sql
-- Connect to SQL DW database and create a database user
CREATE USER ApplicationUser FOR LOGIN ApplicationLogin;
```

If a user will be doing additional operations such as creating logins or creating new databases, they will also need to be assigned to the `Loginmanager` and `dbmanager` roles in the master database. For more information on these additonal roles and authenticating to a SQL Database, see [Managing databases and logins in Azure SQL Database][Managing databases and logins in Azure SQL Database].  For more details on Azure AD for SQL Data Warehouse, see [Connecting to SQL Data Warehouse By Using Azure Active Directory Authentication][Connecting to SQL Data Warehouse By Using Azure Active Directory Authentication].

## Authorization
Authorization refers to what you can do within an Azure SQL Data Warehouse database, and this is controlled by your user account's role memberships and permissions. As a best practice, you should grant users the least privileges necessary. Azure SQL Data Warehouse makes this easy to manage with roles in T-SQL:

```sql
EXEC sp_addrolemember 'db_datareader', 'ApplicationUser'; -- allows ApplicationUser to read data
EXEC sp_addrolemember 'db_datawriter', 'ApplicationUser'; -- allows ApplicationUser to write data
```

The server admin account you are connecting with is a member of db_owner, which has authority to do anything within the database. Save this account for deploying schema upgrades and other management operations. Use the "ApplicationUser" account with more limited permissions to connect from your application to the database with the least privileges needed by your application.

There are ways to further limit what a user can do with Azure SQL Database:

* Granular [Permissions][Permissions] let you control which operations you can do on individual columns, tables, views, procedures, and other objects in the database. Use granular permissions to have the most control and grant the minimum permissions necessary. The granular permission system is somewhat complicated and will require some study to use effectively.
* [Database roles][Database roles] other than db_datareader and db_datawriter can be used to create more powerful application user accounts or less powerful management accounts. The built-in fixed database roles provide an easy way to grant permissions, but can result in granting more permissions than are necessary.
* [Stored procedures][Stored procedures] can be used to limit the actions that can be taken on the database.

Managing databases and logical servers from the Azure Classic Portal or using the Azure Resource Manager API is controlled by your portal user account's role assignments. For more information on this topic, see [Role-based access control in Azure Portal][Role-based access control in Azure Portal].

## Encryption
Azure SQL Data Warehouse Transparent Data Encryption (TDE) helps protect against the threat of malicious activity by performing real-time encryption and decryption of your data at rest.  When you encrypt your database, associated backups and transaction log files are encrypted without requiring any changes to your applications. TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. In SQL Database the database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each SQL Database server. Microsoft automatically rotates these certificates at least every 90 days. The encryption algorithm used by SQL Data Warehouse is AES-256. For a general description of TDE, see [Transparent Data Encryption][Transparent Data Encryption].

You can encrypt your database using the [Azure Portal][Encryption with Portal] or [T-SQL][Encryption with TSQL].

## Next steps
For details and examples on connecting to your SQL Data Warehouse with different protocols, see [Connect to SQL Data Warehouse][Connect to SQL Data Warehouse].

<!--Image references-->

<!--Article references-->
[Connect to SQL Data Warehouse]: ./sql-data-warehouse-connect-overview.md
[Encryption with Portal]: ./sql-data-warehouse-encryption-tde.md
[Encryption with TSQL]: ./sql-data-warehouse-encryption-tde-tsql.md
[Connecting to SQL Data Warehouse By Using Azure Active Directory Authentication]: ./sql-data-warehouse-authentication.md

<!--MSDN references-->
[Azure SQL Database firewall]: https://msdn.microsoft.com/library/ee621782.aspx
[sp_set_firewall_rule]: https://msdn.microsoft.com/library/dn270017.aspx
[sp_set_database_firewall_rule]: https://msdn.microsoft.com/library/dn270010.aspx
[Database roles]: https://msdn.microsoft.com/library/ms189121.aspx
[Managing databases and logins in Azure SQL Database]: https://msdn.microsoft.com/library/ee336235.aspx
[Permissions]: https://msdn.microsoft.com/library/ms191291.aspx
[Stored procedures]: https://msdn.microsoft.com/library/ms190782.aspx
[Transparent Data Encryption]: https://msdn.microsoft.com/library/bb934049.aspx
[Azure portal]: https://portal.azure.com/

<!--Other Web references-->
[Role-based access control in Azure Portal]: https://azure.microsoft.com/documentation/articles/role-based-access-control-configure
