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
ms.date: 7/27/2021
---
# Configure isolated access to a Hyperscale named replica
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes the procedure to grant access to an Azure SQL Hyperscale [named replica](service-tier-hyperscale-replicas.md) without granting access to the primary replica or other named replicas. This scenario allows resource and security isolation of a named replica - as the named replica will be running using its own compute node - and it is useful whenever isolated read-only access to an Azure SQL Hyperscale database is needed. Isolated, in this context, means that CPU and memory are not shared between the primary and the named replica, queries running on the named replica do not use compute resources of the primary or of any other replicas, and principals accessing the named replica cannot access other replicas, including the primary.

## Create a login in the master database on the primary server

In the `master` database on the logical server hosting the *primary* database, execute the following to create a new login. Use your own strong and unique password.

```sql
create login [third-party-login] with password = 'Just4STRONG_PAZzW0rd!';
```

Retrieve the SID hexadecimal value for the created login from the `sys.sql_logins` system view:

```sql
select sid from sys.sql_logins where name = 'third-party-login';
```

Disable the login. This will prevent this login from accessing any database on the server hosting the primary replica.

```sql
alter login [third-party-login] disable;
```

## Create a user in the primary read-write database

Once the login has been created, connect to the primary read-write replica of your database, for example WideWorldImporters (you can find a sample script to restore it here: [Restore Database in Azure SQL](https://github.com/yorek/azure-sql-db-samples/tree/master/samples/01-restore-database)) and create a database user for that login:

```sql
create user [third-party-user] from login [third-party-login];
```

As an optional step, once the database user has been created, you can drop the server login created in the previous step if there are concerns about the login getting re-enabled in any way. Connect to the master database on the logical server hosting the primary database, and execute the following:

```sql
drop login [third-party-login];
```

## Create a named replica on a different logical server

Create a new Azure SQL logical server that will be used to isolate access to the named replica. Follow the instructions available at [Create and manage servers and single databases in Azure SQL Database](single-database-manage.md). To create a named replica, this server must be in the same Azure region as the server hosting the primary replica.

Using, for example, AZ CLI:

```azurecli
az sql server create -g MyResourceGroup -n MyNamedReplicaServer -l MyLocation --admin-user MyAdminUser --admin-password MyStrongADM1NPassw0rd!
```

Then, create a named replica for the primary database on this server. For example, using AZ CLI:

```azurecli
az sql db replica create -g MyResourceGroup -n WideWorldImporters -s MyPrimaryServer --secondary-type Named --partner-database WideWorldImporters_NR --partner-server MyNamedReplicaServer
```

## Create a login in the master database on the named replica server

Connect to the `master` database on the logical server hosting the named replica, created in the previous step. Add the login using the SID retrieved from the primary replica:

```sql
create login [third-party-login] with password = 'Just4STRONG_PAZzW0rd!', sid = 0x0...1234;
```

At this point, users and applications using `third-party-login` can connect to the named replica, but not to the primary replica.

## Grant object-level permissions within the database

Once you have set up login authentication as described, you can use regular `GRANT`, `DENY` and `REVOKE` statements to manage authorization, or object-level permissions within the database. In these statements, reference the name of the user you created in the database, or a database role that includes this user as a member. Remember to execute these commands on the primary replica. The changes will propagate to all secondary replicas, however they will only be effective on the named replica where the server-level login was created.

Remember that by default a newly created user has a minimal set of permissions granted (for example, it cannot access any user tables). If you want to allow `third-party-user` to read data in a table, you need to explicitly grant the `SELECT` permission:

```sql
grant select on [Application].[Cities] to [third-party-user];
```

As an alternative to granting permissions individually on every table, you can add the user to the `db_datareaders` [database role](/sql/relational-databases/security/authentication-access/database-level-roles) to allow read access to all tables, or you can use [schemas](/sql/relational-databases/security/authentication-access/create-a-database-schema) to [allow access](/sql/t-sql/statements/grant-schema-permissions-transact-sql) to all existing and new tables in a schema.

## Test access

You can test this configuration by using any client tool and attempt to connect to the primary and the named replica. For example, using `sqlcmd`, you can try to connect to the primary replica using the `third-party-login` user:

```
sqlcmd -S MyPrimaryServer.database.windows.net -U third-party-login -P Just4STRONG_PAZzW0rd! -d WideWorldImporters
```

This will result in an error as the user is not allowed to connect to the server:

```
Sqlcmd: Error: Microsoft ODBC Driver 13 for SQL Server : Login failed for user 'third-party-login'. Reason: The account is disabled.
```

The attempt to connect to the named replica succeeds:

```
sqlcmd -S MyNamedReplicaServer.database.windows.net -U third-party-login -P Just4STRONG_PAZzW0rd! -d WideWorldImporters_NR
```

No errors are returned, and queries can be executed on the named replica as allowed by granted object-level permissions.

For more information:

* Azure SQL logical Servers, see [What is a server in Azure SQL Database](logical-servers.md)
* Managing database access and logins, see [SQL Database security: Manage database access and login security](logins-create-manage.md)
* Database engine permissions, see [Permissions](/sql/relational-databases/security/permissions-database-engine) 
* Granting object permissions, see [GRANT Object Permissions](/sql/t-sql/statements/grant-object-permissions-transact-sql)



