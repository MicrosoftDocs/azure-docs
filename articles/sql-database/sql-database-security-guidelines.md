<properties
   pageTitle="Azure SQL Database Security Guidelines and Limitations | Microsoft Azure"
   description="Learn about Microsoft Azure SQL Database guidelines and limitations related to security."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jeffreyg"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/20/2015"
   ms.author="rickbyh"/>

# Azure SQL Database security guidelines and limitations

This topic describes the Microsoft Azure SQL Database guidelines and limitations related to security. Consider the following points when managing the security of your Azure SQL Databases.

## Firewall

The Azure SQL Database service is only available through TCP port 1433. To access a SQL Database from your computer, ensure that your firewall allows outgoing TCP communication on TCP port 1433. As part of the connection process, connections from Azure virtual machines are redirected to a different IP address and port, unique for each worker role. The port number will be in the range from 11000 to 11999.

Before you can connect to the Azure SQL Database server for the first time, you must use the [Azure Portal](https://portal.azure.com) or [Azure Platform Management Portal](https://manage.windowsazure.com/microsoft.onmicrosoft.com#Workspaces/All/dashboard) to configure the Azure SQL Database firewall. You will need to create a server-level firewall setting that enables connection attempts from your computer or Azure to Azure SQL Database server. Further, if you want to control access to certain databases in your Azure SQL Database server, create database-level firewall rules for the respective databases. For more information, see [Azure SQL Database firewall](sql-database-firewall-configure.md).

## Connection encryption and certificate validation

All communications between SQL Database and your application require encryption (SSL) at all times. If your client application does not validate certificates upon connection, your connection to SQL Database is susceptible to "man in the middle" attacks. 

To validate certificates with application code or tools, explicitly request an encrypted connection and do not trust the server certificates. If your application code or tools do not request an encrypted connection, they will still receive encrypted connections. However, they may not validate the server certificates and thus will be susceptible to "man in the middle" attacks.

To validate certificates with ADO.NET application code, set ``Encrypt=True`` and ``TrustServerCertificate=False`` in the database connection string. For more information, see [Code sample: Retry logic for connecting to Azure SQL Database with ADO.NET](https://msdn.microsoft.com/library/azure/ee336243.aspx).

SQL Server Management Studio also supports certificate validation. In the **Connect to Server** dialog box, click **Encrypt connection** on the **Connection Properties** tab. 

> [AZURE.NOTE] SQL Server Management Studio does not support connections to SQL Database in versions prior to SQL Server 2008 R2.

Although SQLCMD supported SQL Database starting with SQL Server 2008, it does not support certificate validation in versions prior to SQL Server 2008 R2. To validate certificates with SQLCMD starting in SQL Server 2008 R2, use the ``-N`` command-line option and do not use the ``-C`` option. By using the -N option, SQLCMD requests an encrypted connection. By not using the ``-C`` option, SQLCMD does not implicitly trust the server certificate and is forced to validate the certificate. 

For supplementary technical information, see [Azure SQL Database Connection Security](http://social.technet.microsoft.com/wiki/contents/articles/2951.windows-azure-sql-database-connection-security.aspx#comment-4847) article at the TechNet Wiki site.

## Authentication

SQL Database supports only SQL Server authentication. Windows authentication (integrated security) is not supported. Users must provide credentials (login and password) every time they connect to SQL Database. For more information about SQL Server Authentication, see [Choosing an Authentication Mode](https://msdn.microsoft.com/library/ms144284.aspx) in SQL Server Books Online. 

[SQL Database V12](sql-database-v12-whats-new.md) allows users to authenticate at the database by using contained database users. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx), [CREATE USER (Transact-SQL)](https://technet.microsoft.com/library/ms173463.aspx), and [Contained Databases](https://technet.microsoft.com/library/ff929071.aspx).

> [AZURE.NOTE] Microsoft recommends using contained database users to enhance scalability.

The Database Engine closes connections that remain idle for more than 30 minutes. The connection must login again before it can be used.

Continuously active connections to SQL Database require reauthorization (performed by the Database Engine) at least every 10 hours. The Database Engine attempts reauthorization using the originally submitted password and no user input is required. For performance reasons, when a password is reset in SQL Database, the connection will not be re-authenticated, even if the connection is reset due to connection pooling. This is different from the behavior of on-premises SQL Server. If the password has been changed since the connection was initially authorized, the connection must be terminated and a new connection made using the new password. A user with the KILL DATABASE CONNECTION permission can explicitly terminate a connection to SQL Database by using the [KILL](https://msdn.microsoft.com/library/ms173730.aspx) command.

## Logins and users

When managing logins and users in SQL Database, there are restrictions.

For the server-level principal login, the following restrictions apply:

- The database user in the master database corresponding to the server-level principal login cannot be altered or dropped. 
- Although the server-level principal login is not a member of the two database roles **dbmanager** and **loginmanager** in the **master** database, it has all permissions granted to these two roles.

> [AZURE.NOTE] This login is created during server provisioning and is similar to the **sa** login in an instance of SQL Server.

For all logins, the following restrictions apply:

- US-English is the default language.
- To access the **master** database, every login must be mapped to a user account in the **master** database. The **master** database does not support contained database users.
- If you do not specify a database in the connection string, you will be connected to the **master** database by default.
- You must be connected to the **master** database when executing the ``CREATE/ALTER/DROP LOGIN`` and ``CREATE/ALTER/DROP DATABASE`` statements. 
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
- Only the server-level principal login and the members of the **dbmanager** database role in the **master** database have permission to execute the ``CREATE DATABASE`` and ``DROP DATABASE`` statements.
- Only the server-level principal login and the members of the **loginmanager** database role in the **master** database have permission to execute the ``CREATE LOGIN``, ``ALTER LOGIN``, and ``DROP LOGIN`` statements.
- To ``CREATE/ALTER/DROP`` a user requires the ``ALTER ANY USER`` permission on the database.
- When the owner of a database role tries to add or remove another database user to or from that database role, the following error may occur: **User or role 'Name' does not exist in this database.** This error occurs because the user is not visible to the owner. To resolve this issue, grant the role owner the ``VIEW DEFINITION`` permission on the user. 

For more information about logins and users, see [Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md).

## Security best practices

Consider the following points to make your Azure SQL Database applications less vulnerable to security threats:

- Always use the latest updates: When connecting to your SQL Database, always use the most current version of tools and libraries to prevent security vulnerabilities. For more information about which tools and libraries are supported, see [Azure SQL Database General Guidelines and Limitations](https://msdn.microsoft.com/library/azure/ee336245.aspx).
- Block inbound connections on TCP port 1433: Only outbound connections on TCP port 1433 are needed for applications to communicate with SQL Database. If inbound communications are not needed by any other applications on that computer, ensure that your firewall continues to block inbound connections on TCP port 1433.
- Prevent injection vulnerabilities: To make sure that your applications do not have SQL injection vulnerabilities, use parameterized queries where possible. Also, be sure to review code thoroughly and run a penetration test before deploying your application.


## See also

[Azure SQL Database Firewall](sql-database-firewall-configure.md)

[How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md)

[Azure SQL Database General Guidelines and Limitations](https://msdn.microsoft.com/library/azure/ee336245.aspx)

[Managing databases and logins in Azure SQL Database](sql-database-manage-logins.md)