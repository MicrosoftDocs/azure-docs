---
title: Configure named replicas security to allow isolated access
description: Learn the security considerations for configuring and managing named replica so that a user can access the named replica but not other replicas.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.topic: how-to
author: yorek
ms.author: damauri
ms.reviewer: 
ms.date: 3/29/2021
---
# Configure Security to allow isolated access to Azure SQL Database Hyperscale Named Replicas
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes the authentication requirements to configure an Azure SQL Hyperscale [named replica](service-tier-hyperscale-replicas.md) so that a user will be allowed access to specific replicas only. This scenario allows complete isolation of named replica from the primary - as the named replica will be running using its own compute node - and it is useful whenever isolated read only access to an Azure SQL Hyperscale database is needed. Isolated, in this context, means that CPU and memory are not shared between the primary and the named replica, and queries running on the named replica will not use any compute resource of the primary or of any other replica.

## Create a new login on the master database

In the `master` database on the logical server hosting the primary database, execute the following to create a new login that will be used to manage access to the primary and the named replica:

```sql
create login [third-party-login] with password = 'Just4STRONG_PAZzW0rd!';
```

Now get the SID from the `sys.sql_logins` system view:

```sql
select [sid] from sys.sql_logins where name = 'third-party-login'
```

And as last action disable the login. This will prevent this login from accessing the any database in the server

```sql
alter login [third-party-login] disable
```

As an optional step, in case there are concerns about the login getting enabled in any way, you can drop the login from the server via:

```sql
drop login [third-party-login]
```

## Create database user in the primary replica

Once the login has been created, connect to the primary replica of the database, for example WideWorldImporters (you can find a sample script to restore it here: [Restore Database in Azure SQL](https://github.com/yorek/azure-sql-db-samples/tree/master/samples/01-restore-database)) and create the database user for that login:

```sql
create user [third-party-user] from login [third-party-login]
```

## Create a named replica

Create a new Azure SQL logical server that will be used to isolate access to the database to be shared. Follow the instruction available at [Create and manage servers and single databases in Azure SQL Database](single-database-manage.md) if you need help.

Using, for example, AZ CLI:

```azurecli
az sql server create -g MyResourceGroup -n MyPrimaryServer -l MyLocation --admin-user MyAdminUser --admin-password MyStrongADM1NPassw0rd!
```

Make sure the region you choose is the same where the primary server also is. Then create a named replica, for example with AZ CLI:

```azurecli
az sql db replica create -g MyResourceGroup -n WideWorldImporters -s MyPrimaryServer --secondary-type Named --partner-database WideWorldImporters_NR --partner-server MySecondaryServer
```

## Create login in the named replica

Connect to the `master` database on the logical server hosting the named replica. Add the login using the SID retrieved from the primary replica:

```sql
create login [third-party-login] with password = 'Just4STRONG_PAZzW0rd!', sid = 0x0...1234;
```

Done. Now the `third-party-login` can connect to the named replica database, but will be denied connecting to the primary replica.

## Test access

You can try the security configuration by using any client tool to connect to the primary and the named replica. For example using `sqlcmd`, you can try to connect to the primary replica using the `third-party-login` user:

```
sqlcmd -S MyPrimaryServer.database.windows.net -U third-party-login -P Just4STRONG_PAZzW0rd! -d WideWorldImporters
```

this will result in an error as the user is not allowed to connect to the server:

```
Sqlcmd: Error: Microsoft ODBC Driver 13 for SQL Server : Login failed for user 'third-party-login'. Reason: The account is disabled..
```

the same user can connect to the named replica instead:

```
sqlcmd -S MySecondaryServer.database.windows.net -U third-party-login -P Just4STRONG_PAZzW0rd! -d WideWorldImporters_NR
```

and connection will succeed without errors.


## Next steps

Once you have setup security in this way, you can use the regular `grant`, `deny` and `revoke` commands to manage access to resources. Remember to use these commands on the primary replica: their effect will be applied also to all named replicas, allowing you to decide who can access what, as it would happen normally. 

Remember that by default a newly created user has a very minimal set of permissions granted (for example they cannot access any user table), so if you want to allow `third-party-user` to access a table, you need to explicitly grant this permission:

```sql
grant select on [Application].[Cities] to [third-party-user]
```

Or you can add the user to the `db_datareaders` [database role](/sql/relational-databases/security/authentication-access/database-level-roles) to allow access to all tables, or you can use [schemas](/sql/relational-databases/security/authentication-access/create-a-database-schema) to [allow access](/sql/t-sql/statements/grant-schema-permissions-transact-sql) to all tables in a schema.

For more information:

* Azure SQL logical Servers, see [What is a server in Azure SQL Database](logical-servers.md)
* Managing database access and logins, see [SQL Database security: Manage database access and login security](logins-create-manage.md)
* Database engine permissions, see [Permissions](/sql/relational-databases/security/permissions-database-engine) 
* Granting object permissions, see [GRANT Object Permissions](/sql/t-sql/statements/grant-object-permissions-transact-sql)



