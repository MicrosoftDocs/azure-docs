<properties
   pageTitle="SQL Database Authentication and Authorization: Granting Accessing | Microsoft Azure"
   description="Learn about SQL Database security management, specifically how to manage database access and login security through the server-level principal account."
   keywords="sql database security,database security management,login security,database security,database access"
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
   ms.date="06/06/2016"
   ms.author="rickbyh"/>

# SQL Database Authentication and Authorization: Granting Access 


> [AZURE.SELECTOR]
- [Get started tutorial](sql-database-get-started-security.md)
- [Grant access](sql-database-manage-logins.md)


Start here for an overview of SQL Database access concepts for administrators, non-administrators, and roles.

## Unrestricted administrative accounts

There are two possible administrative accounts with unrestricted permissions for access to the virtual master database and all user databases. These accounts are called server-level principal accounts.

### Azure SQL Database subscriber account 

A single login account is created when a logical SQL instance is created, called the SQL Database Subscriber Account. This account connects using SQL Server authentication (user name and password). This account is an administrator on the logical server instance and on all user databases attached to that instance. The permissions of the Subscriber Account cannot be restricted. Only one of these accounts can exist.

### Azure Active Directory administrator
One Azure Active Directory account can also be configured as an administrator. This account can be an individual Azure AD User, or can be an Azure AD Group containing several Azure AD Users. It is optional to configure an Azure AD administrator, but an Azure AD administrator must be configured if you want to use Windows Authentication for Azure AD accounts to connect to SQL Database. For more information about configuring Azure Active Directory access, see [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](sql-database-aad-authentication.md).

### Configuring the firewall
When a the server-level firewall is configured, the Azure SQL Database Subscriber Account and the Azure Active Directory account can connect to the virtual master database and all the user databases. The server-level firewall can be configured through the portal. Once a connection is made, additional server-level firewall rules can also be configured by using the [sp_set_firewall_rule](https://msdn.microsoft.com/library/dn270017.aspx) Transact-SQL statement. For more information about configuring the firewall see [How to: Configure an Azure SQL Database firewall using the Azure Portal](sql-database-configure-firewall-settings.md).

### Administrator access path

When the server-level firewall is properly configured, the SQL Database Subscriber Account and the Azure Active Directory SQL Server Administrators can connect using client tools such as SQL Server Management Studio or SQL Server Data Tools. Only the latest tools provide all the features and capabilities. The following diagram shows a typical configuration for the two administrator accounts.
	![Administrator access path](./media/sql-database-manage-logins/1sql-db-administrator-access.png)

When using an open port in the server-level firewall, administrators can connect to any SQL Database.

### Connecting to a database by using SQL Server Management Studio
For a walk-through of connecting by using SQL Server Management Studio, see [Connect to SQL Database with SQL Server Management Studio and execute a sample T-SQL query](sql-database-connect-query-ssms.md).


> [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


## Additional special accounts
SQL Database provide two restricted administrative roles in the virtual master database to which user accounts can be added.

### Database creators
The administrative accounts can create new databases. To create an additional account that can create databases you must create a user in master, and add the user to the special **dbmanager** database role. The user can be a contained database user, or a user based on a SQL Server login in the virtual master database.

1.	Using an administrator account, connect to the virtual master database.
2.	Optional step: Create a SQL Server authentication login, using the [CREATE LOGIN](https://msdn.microsoft.com/library/ms189751.aspx) statement. Sample statement:

     ```
     CREATE LOGIN Mary WITH PASSWORD = '<strong_password>';
     ```

     > [AZURE.NOTE] You must use a strong password when creating a login or contained database user. For more information, see [Strong Passwords](https://msdn.microsoft.com/library/ms161962.aspx).

3.	In the virtual master database, create a user by using the [CREATE USER](https://msdn.microsoft.com/library/ms173463.aspx) statement. The user can be an Azure Active Directory authentication contained database user (if you have configured your environment for Azure AD authentication), or a SQL Server authentication contained database user, or a SQL Server authentication user based on a SQL Server authentication login (created in the previous step.) Sample statements:

     ```
     CREATE USER [mike@contoso.com] FROM EXTERNAL PROVIDER;
     CREATE USER Tran WITH PASSWORD = '<strong_password>';
     CREATE USER Mary FROM LOGIN Mary; 
     ```

4.	Add the new user, to the **dbmanager** database role by using the [ALTER ROLE](https://msdn.microsoft.com/library/ms189775.aspx) statement. Sample statements:

     ```
     ALTER ROLE dbmanager ADD MEMBER Mary; 
     ALTER ROLE dbmanager ADD MEMBER [mike@contoso.com];
     ```

     > [AZURE.NOTE] The dbmanager is a database role in virtual master database so you can only add a user to the dbmanager role. You cannot add a server-level login to database-level role.

5.	If necessary, configure the server-level firewall to allow the new user to connect.

Now the user can connect to the virtual master database and can create new databases. The account creating the database becomes the owner of the database.

### Login managers

If you wish, you can complete the same steps (create a login and user, and add a user to the **loginmanager** role) to enable a user to create new logins in the virtual master. In most cases this is not necessary as Microsoft recommends using contained database users which authenticate at the database-level instead of using users based on logins. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).

## Non-administrator users

Generally, non-administrator accounts do not need access to the virtual master database. Create contained database users at the database level using the [CREATE USER (Transact-SQL)](https://msdn.microsoft.com/library/ms173463.aspx) statement. The user can be an Azure Active Directory authentication contained database user (if you have configured your environment for Azure AD authentication), or a SQL Server authentication contained database user, or a SQL Server authentication user based on a SQL Server authentication login (created in the previous step.) For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx). 

To create users, connect to the database, and execute statements similar to these:

```
CREATE USER Mary FROM LOGIN Mary; 
CREATE USER [mike@contoso.com] FROM EXTERNAL PROVIDER;
```

Initially, only one of the administrators or the owner of the database can create users. To authorize additional users to create new users, grant that selected user the `ALTER ANY USER` permission, by using a statement such as:

```
GRANT ALTER ANY USER TO Mary;
```

To give additional users full control of the database, make them a member of the **db_owner** fixed database role using the `ALTER ROLE` statement.

> [AZURE.NOTE] The principal reason to create database users based on logins, is when you have SQL Server authentication users which need access to multiple databases. Users based on logins are tied to the login, and only one password that is maintained for that login. Contained database users in individual databases are each individual entities and each maintains its own password. This can confuse contained database users if they do not maintain their passwords as identical.

### Configuring the database-level firewall

As a best practice, non-administrator users should only have access through the firewall to the databases that they use. Instead of authorizing their IP addresses through the server-level firewall and giving them access to all databases, use the [sp_set_database_firewall_rule](https://msdn.microsoft.com/library/dn270010.aspx) statement to configure the database-level firewall. The database-level firewall cannot be configured by using the portal.

### Non-administrator access path

When the database-level firewall is properly configured, the database users can connect using client tools such as SQL Server Management Studio or SQL Server Data Tools. Only the latest tools provide all the features and capabilities. The following diagram shows a typical non-administrator access path.
![Non-administrator access path](./media/sql-database-manage-logins/2sql-db-nonadmin-access.png)
 
## Groups and roles
Efficient access management uses permissions assigned to groups and roles instead of individual users. For example when using Azure Active Directory authentication:

- Put Azure Active Directory users into an Azure Active Directory group. Create a contained database user for the group. Place one or more database users into a database role. And then assign permissions to the database role.

When using SQL Server authentication:

- Create contained database users in the database. Place one or more database users into a database role. And then assign permissions to the database role.

The database roles can be the built-in roles such as **db_owner**, **db_ddladmin**, **db_datawriter**, **db_datareader**, **db_denydatawriter**, and **db_denydatareader**. **db_owner** is commonly used to grant full permission to only a few users. The other fixed database roles are useful for getting a simple databases in development quickly, but are not recommended for most production databases. For example, the **db_datareader** fixed database role grants read access to every table in the database, which is usually more than is strictly necessary. It is far better to use the [CREATE ROLE](https://msdn.microsoft.com/library/ms187936.aspx) statement to create your own user-defined database roles and carefully grant each role the least permissions necessary for the business need. When a user is a member of multiple roles, they will aggregate the permissions of them all.

## Permissions

There are over 100 permissions that can be individually granted or denied in SQL Database. Many of these permissions are nested. For example, the `UPDATE` permission on a schema includes the `UPDATE` permission on each table within that schema. As in most permission systems, the denial of a permission overrides a grant. Because of the nested nature and the number of permissions, it can take careful study to design an appropriate permission system to properly protect your database. Start with the list of permissions at [Permissions (Database Engine)](https://msdn.microsoft.com/library/ms191291.aspx) and review the [poster size graphic](http://go.microsoft.com/fwlink/?LinkId=229142) of the permissions.


## Next steps

[Securing your SQL Database](sql-database-security.md)

[Creating a Table \(Tutorial\)](https://msdn.microsoft.com/library/ms365315.aspx)

[Inserting and Updating Data in a Table \(Tutorial\)](https://msdn.microsoft.com/library/ms365309.aspx)

[Reading the Data in a Table \(Tutorial\)](https://msdn.microsoft.com/library/ms365310.aspx)

[Creating views and stored procedures](https://msdn.microsoft.com/library/ms365311.aspx)

[Granting Access to a Database Object](https://msdn.microsoft.com/library/ms365327.aspx)


## Additional resources

[Securing your SQL Database](sql-database-security.md)

[Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589.aspx) 

