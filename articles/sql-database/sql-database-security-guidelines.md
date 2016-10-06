<properties
   pageTitle="Azure SQL Database Security Guidelines and Limitations | Microsoft Azure"
   description="Learn about Microsoft Azure SQL Database guidelines and limitations related to security."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/02/2016"
   ms.author="rickbyh"/>

# Azure SQL Database security guidelines and limitations

This topic describes the Microsoft Azure SQL Database guidelines and limitations related to security. Consider the following points when managing the security of your Azure SQL Databases.

## Access to the virtual master database

Typically, only administrators need access to the master database. Routine access to each user database should be through non-administrator contained database users created in each database. When you use contained database users you do not need to create logins in the master database. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).


## Firewall

The SQL Server firewall which is scoped for the entire Azure SQL Server is usually configured through the portal and should only admit the IP addresses used by administrators. Connect to a user database and then use the [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) Transact-SQL statement to create a database-scoped firewall rule that will open the necessary range of IP addresses for each database.

The Azure SQL Database service is only available through TCP port 1433. To access a SQL Database from your computer, ensure that your client computer firewall allows outgoing TCP communication on TCP port 1433. If not needed for other applications, block inbound connections on TCP port 1433. 

As part of the connection process, connections from Azure virtual machines are redirected to a different IP address and port, unique for each worker role. The port number will be in the range from 11000 to 11999. For more information about TCP ports, see [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).


## Authentication

Use Active Directory authentication (integrated security) whenever possible. For information on configuring AD authentication, see [Connecting to SQL Database By Using Azure Active Directory Authentication](sql-database-aad-authentication.md), and [Choosing an Authentication Mode](https://msdn.microsoft.com/library/ms144284.aspx) in SQL Server Books Online. 

Use contained database users to enhance scalability. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx), [CREATE USER (Transact-SQL)](https://technet.microsoft.com/library/ms173463.aspx), and [Contained Databases](https://technet.microsoft.com/library/ff929071.aspx).

The Database Engine closes connections that remain idle for more than 30 minutes. The connection must login again before it can be used.

Continuously active connections to SQL Database require reauthorization (performed by the Database Engine) at least every 10 hours. The Database Engine attempts reauthorization using the originally submitted password and no user input is required. For performance reasons, when a password is reset in SQL Database, the connection will not be re-authenticated, even if the connection is reset due to connection pooling. This is different from the behavior of on-premises SQL Server. If the password has been changed since the connection was initially authorized, the connection must be terminated and a new connection made using the new password. A user with the KILL DATABASE CONNECTION permission can explicitly terminate a connection to SQL Database by using the [KILL](https://msdn.microsoft.com/library/ms173730.aspx) command.

## Logins and users

When managing logins and users in SQL Database, there are restrictions.


- You must be connected to the **master** database when executing the ``CREATE/ALTER/DROP DATABASE`` statements. - The database user in the master database corresponding to the server-level principal login cannot be altered or dropped. 
- US-English is the default language of the server-level principal login.
- To access the **master** database, every login must be mapped to a user account in the **master** database. The **master** database does not support contained database users.
- Only the server-level principal login and the members of the **dbmanager** database role in the **master** database have permission to execute the ``CREATE DATABASE`` and ``DROP DATABASE`` statements.
- You must be connected to the master database when executing the ``CREATE/ALTER/DROP LOGIN`` statements. However using logins is discouraged. Use contained database users instead.
- To connect to a user database you must provide the name of the database in the connection string.
- Only the server-level principal login and the members of the **loginmanager** database role in the **master** database have permission to execute the ``CREATE LOGIN``, ``ALTER LOGIN``, and ``DROP LOGIN`` statements.
- When executing the ``CREATE/ALTER/DROP LOGIN`` and ``CREATE/ALTER/DROP DATABASE`` statements in an ADO.NET application, using parameterized commands is not allowed. For more information, see [Commands and Parameters](https://msdn.microsoft.com/library/ms254953.aspx).
- When executing the ``CREATE/ALTER/DROP DATABASE`` and ``CREATE/ALTER/DROP LOGIN`` statements, each of these statements must be the only statement in a Transact-SQL batch. Otherwise, an error occurs. For example, the following Transact-SQL checks whether the database exists. If it exists, a ``DROP DATABASE`` statement is called to remove the database. Because the ``DROP DATABASE`` statement is not the only statement in the batch, executing the following Transact-SQL statement will result in an error.

```
IF EXISTS (SELECT [name]
           FROM   [sys].[databases]
           WHERE  [name] = N'database_name')
     DROP DATABASE [database_name];
GO
```

- When executing the ``CREATE USER`` statement with the ``FOR/FROM LOGIN`` option, it must be the only statement in a Transact-SQL batch.
- When executing the ``ALTER USER`` statement with the ``WITH LOGIN`` option, it must be the only statement in a Transact-SQL batch.
- To ``CREATE/ALTER/DROP`` a user requires the ``ALTER ANY USER`` permission on the database.
- When the owner of a database role tries to add or remove another database user to or from that database role, the following error may occur: **User or role 'Name' does not exist in this database.** This error occurs because the user is not visible to the owner. To resolve this issue, grant the role owner the ``VIEW DEFINITION`` permission on the user. 

For more information about logins and users, see [Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md).


## See also

[Azure SQL Database Firewall](sql-database-firewall-configure.md)

[How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md)

[Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md)

[Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589)
