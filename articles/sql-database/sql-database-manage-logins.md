<properties
   pageTitle="Managing databases and logins in Azure SQL Database | Microsoft Azure"
   description="How you can use the server-level principal and other accounts to manage logins and databases in SQL Database"
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

# Managing databases and logins in Azure SQL Database

In Microsoft Azure SQL Database, when you sign up for the service, the provisioning process creates an Azure SQL Database server, a database named **master**, and a login that is the server-level principal of your Azure SQL Database server. That login is similar to the server-level principal, **sa**, for an instance of SQL Server on your premises. 

The Azure SQL Database server-level principal account always has permission to manage all server-level and database-level security. This topic describes how you can use the server-level principal and other accounts to manage logins and databases in SQL Database.

> [AZURE.IMPORTANT] SQL Database V12 allows users to authenticate at the database by using contained database users. Contained database users do not require logins. This makes databases more portable but reduces the ability of the server-level principal to control access to the database. Enabling contained database users has important security impacts. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx), [CREATE USER (Transact-SQL)](https://msdn.microsoft.com/library/ms173463.aspx), and [Contained Databases](https://msdn.microsoft.com/library/ff929071.aspx).

## Overview of SQL Database security administration

Security administration in SQL Database is similar to security administration for an on-premises instance of SQL Server. Managing security at the database-level is almost identical, with differences only in the parameters available. Because SQL Databases can scale to one or more physical computers, Azure SQL Database uses a different strategy for server-level administration. The following table summarizes how security administration for an on-premise SQL Server is different than in Azure SQL Database.

| Point of Difference | On-premises SQL Server | Azure SQL Database |
|------------------------------------------------|-----------------------------------------------------------------------------|--------------------------------------------------|
| Where you manage server-level security         | The Security folder in SQL Server Management Studio's Object Explorer       | The master database and through the Azure portal |
| Server-level security role for creating logins | securityadmin fixed server role For more information, see Server-Level Roles | loginmanager database role in the master         |
| Commands for managing logins                   | CREATE LOGIN, ALTER LOGIN, DROP LOGIN                                           | CREATE LOGIN, ALTER LOGIN, DROP LOGIN (There are some parameter limitations and you must be connected to the master database) |
| View that shows all logins                     | sys.server_principals                                                       | sys.sql_logins (You must be connected to the master database)|
| Server-level role for creating databases       | dbcreator fixed database role For more information, see Server-Level Roles   | dbmanager  database role in the master database |
| Command for creating a database                | CREATE DATABASE                                                             | CREATE DATABASE (There are some parameter limitations and you must be connected to the master database) |
| View that lists all databases                  | sys.databases                                                               | sys.databases  (You must be connected to the master database) |

### Server-level administration and the master database

Your Azure SQL Database server is an abstraction that defines a grouping of databases. Databases associated with your Azure SQL Database server may reside on separate physical computers at the Microsoft data center. Perform server-level administration for all of them by using a single database named master.

The master database keeps track of logins, and which logins have permission to create databases or other logins. You must be connected to the master database whenever you create, alter, or drop logins or databases. The **master** database also has the ``sys.sql_logins`` and ``sys.databases`` views that you can use to view logins and databases, respectively. 

> [AZURE.NOTE] The ``USE`` command is not supported for switching between databases. Establish a connection directly to the target database.

You can manage database-level security for users and objects in Microsoft Azure SQL Database the same way you do for an on-premises instance of SQL Server. There are differences only in the parameters available to the corresponding commands. For more information, see [Azure SQL Database security guidelines and limitations](https://msdn.microsoft.com/library/azure/ff394108.aspx).

### Managing logins

Manage logins with the server-level principal login by connecting to the master database. You can use the ``CREATE LOGIN``, ``ALTER LOGIN``, or ``DROP LOGIN`` statements. The following example creates a login named **login1**:

```
-- first, connect to the master database
CREATE LOGIN login1 WITH password='<ProvidePassword>';
```

> [AZURE.NOTE] You must use a strong password when creating a login. For more information, see [Strong Passwords](https://msdn.microsoft.com/library/ms161962.aspx).

#### Using new logins

In order to connect to Microsoft Azure SQL Database using the logins you create, you must first grant each login database-level permissions by using the ``CREATE USER`` command. For more information, see Granting Database-Level Permissions to a Login.

Because some tools implement tabular data stream (TDS) differently, you may need to append the Azure SQL Database server name to the login in the connection string using the ``<login>@<server>`` notation. In these cases, separate the login and Azure SQL Database server name with the ``@`` symbol. For example, if your login was named **login1** and the fully qualified name of your Azure SQL Database server is **servername.database.windows.net**, the username parameter of your connection string should be: **login1@servername**. This restriction places limitations on the text you can choose for the login name. For more information, see [CREATE LOGIN (Transact-SQL)](https://msdn.microsoft.com/library/ms189751.aspx).

## Granting server-level permissions to a login

In order for logins other than the server-level principal to manage server-level security, Microsoft Azure SQL Database offers two security roles: **loginmanager**, for creating logins and **dbmanager** for creating databases. Only users in the **master** database can be added to these database roles.

> [AZURE.NOTE] To create logins or databases, you must be connected to the **master** database (which is a logical representation of **master**).

### The loginmanager role

Like the **securityadmin** fixed server role for an on-premises instance of SQL Server, the **loginmanager** database role in Microsoft Azure SQL Database is has permission to create logins. Only the server-level principal login (created by the provisioning process) or members of the **loginmanager** database role can create new logins. 

### The dbmanager role

The Microsoft Azure SQL Database **dbmanager** database role is similar to the **dbcreator** fixed server role for an on-premises instance of SQL Server. Only the server-level principal login (created by the provisioning process) or members of the **dbmanager** database role can create databases. Once a user is a member of the **dbmanager** database role, it can create a database with the Azure SQL Database ``CREATE DATABASE`` command, but that command must be executed in the master database. For more information, see [CREATE DATABASE (SQL Server Transact-SQL)](https://msdn.microsoft.com/library/ms176061.aspx).

### How to assign SQL Database server-level roles

To create a login and associated user that can create databases or other logins, perform the following steps:

1. Connect to the **master** database using the credentials of the server-level principal login (created by the provisioning process) or the credentials of an existing member of the **loginmanager** database role.
2. Create a login using the ``CREATE LOGIN`` command. For more information, see [CREATE LOGIN (Transact-SQL)](https://msdn.microsoft.com/library/ms189751.aspx).
3. Create a new user for that login in the master database using the ``CREATE USER`` command. For more information, see [CREATE USER (Transact-SQL)](https://msdn.microsoft.com/library/ms173463.aspx).
4. Use the stored procedure ``sp_addrolememeber`` to add new user to the **dbmanager** database role, the loginmanager database role, or both.

The following code example shows how to create a login named **login1**, and a corresponding database user named **login1User** that is able to create databases or other logins while connected to the **master** database:

```
-- first, connect to the master database
CREATE LOGIN login1 WITH password='<ProvidePassword>';
CREATE USER login1User FROM LOGIN login1;
EXEC sp_addrolemember 'dbmanager', 'login1User';
EXEC sp_addrolemember 'loginmanager', 'login1User';
```

> [AZURE.NOTE] You must use a strong password when creating a login. For more information, see [Strong Passwords](https://msdn.microsoft.com/library/ms161962.aspx).

## Granting database access to a login

All logins must be created in the master database. After a login has been created, you can create a user account in another database for that login. Microsoft Azure SQL Database also supports database roles in the same way that an on-premises instance of SQL Server does.

To create a user account in another database, assuming you have not created a login or a database, perform the following steps:

1. Connect to the **master** database (with a login having the **loginmanager** and **dbmanager** roles).
2. Create a new login using the ``CREATE LOGIN`` command. For more information, see [CREATE LOGIN (Transact-SQL)](https://msdn.microsoft.com/library/ms189751.aspx). Windows Authentication is not supported.
3. Create a new database using the ``CREATE DATABASE`` command. For more information, see [CREATE DATABASE (SQL Server Transact-SQL)](https://msdn.microsoft.com/library/ms176061.aspx).
4. Establish a connection to the new database (with the login that created the database).
5. Create a new user on the new database using the ``CREATE USER`` command. For more information, see [CREATE USER (Transact-SQL)](https://msdn.microsoft.com/library/ms173463.aspx).

The following code example shows how to create a login named **login1** and a database named **database1**:

```
-- first, connect to the master database
CREATE LOGIN login1 WITH password='<ProvidePassword>';
CREATE DATABASE database1;
```

> [AZURE.NOTE] You must use a strong password when creating a login. For more information, see [Strong Passwords](https://msdn.microsoft.com/library/ms161962.aspx).

This next example shows how to create a database user named **login1User** in the database **database1** that corresponds to the login **login1**:

```
-- Establish a new connection to the database1 database
CREATE USER login1User FROM LOGIN login1;
```

This database-level permission model in Microsoft Azure SQL Database is same as an on-premise instance of SQL Server. For information, see the following topics in SQL Server Books Online references.

- [Managing Logins, Users, and Schemas How-to Topics](https://msdn.microsoft.com/library/aa337552.aspx) 
- [Lesson 2: Configuring Permissions on Database Objects](https://msdn.microsoft.com/library/ms365345.aspx) 

> [AZURE.NOTE] Security-related Transact-SQL statements in Microsoft Azure SQL Database may differ slightly in the parameters that are available. For more information, see [Azure SQL Database Transact-SQL Reference](sql-database-transact-sql-information.md). 

## Viewing logins and databases

To view logins and databases on your Azure SQL Database server, use the master database's ``sys.sql_logins`` and ``sys.databases`` views, respectively. The following example shows how to display a list of all the logins and databases on your Azure SQL Database server.

```
-- first, connect to the master database
SELECT * FROM sys.sql_logins;
SELECT * FROM sys.databases; 
```

## See also

[Azure SQL Database security guidelines and limitations](sql-database-security-guidelines.md)