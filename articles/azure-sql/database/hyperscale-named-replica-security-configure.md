---
title: Configure named replicas security to allow isolated access
description: Learn the security considerations for configuring and managing named replica so that a user can access the named replica but not the primary replica.
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

This article describes the authentication requirements to configure an Azure SQL Hyperscale [named replica](service-tier-hyperscale-replicas.md) so that a user will be allowed to access the named replica but not the primary replica. This scenario allows complete isolation of named replica from the primary - as the named replica will be running using its own compute node - and it is useful whenever an isolated read only access to an Azure SQL Hyperscale database is needed. Isolated, in this context, means that CPU and memory are not shared between the primary and the named replica, and queries running on the named replica will not take any lock or use any compute resource of the primary or of any other replica.

## Create a new login on the master database

In the primary database that you want to share with another user, create a new login that will be used to manage access to the primary and the named replica (make sure you run the scripts in the `master` database):

```sql
create login [third-party-login] with password = 'Just4STRONG_PAZzW0rd!';
```

Now get the SID from the `sys.sql_logins` system view:

```sql
select [sid] from sys.sql_logins where name = 'third-party-login'
```

And as last action disable the login. This will prevent this login to access the any database in the server

```sql
alter login [third-party-login] disable
```

## Create database user in the primary replica

Once the login has been created, connect to the database to be shared, for example WideWorldImporters (you can find a sample script to restore it here: [Restore Database in Azure SQL](https://github.com/yorek/azure-sql-db-samples/tree/master/samples/01-restore-database)) and create the database user for that login:

```sql
create user [third-party-user] from login [third-party-login]
```


## How to configure logins and users

If you are using logins and users (rather than contained users), you must take extra steps to ensure that the same logins exist in the master database. The following sections outline the steps involved and additional considerations.

  >[!NOTE]
  > It is also possible to use Azure Active Directory (AAD) logins to manage your databases. For more information, see [Azure SQL logins and users](./logins-create-manage.md).

### Set up user access to a secondary or recovered database

In order for the secondary database to be usable as a read-only secondary database, and to ensure proper access to the new primary database or the database recovered using geo-restore, the master database of the target server must have the appropriate security configuration in place before the recovery.

The specific permissions for each step are described later in this topic.

Preparing user access to a geo-replication secondary should be performed as part configuring geo-replication. Preparing user access to the geo-restored databases should be performed at any time when the original server is online (e.g. as part of the DR drill).

> [!NOTE]
> If you fail over or geo-restore to a server that does not have properly configured logins, access to it will be limited to the server admin account.

Setting up logins on the target server involves three steps outlined below:

#### 1. Determine logins with access to the primary database

The first step of the process is to determine which logins must be duplicated on the target server. This is accomplished with a pair of SELECT statements, one in the logical master database on the source server and one in the primary database itself.

Only the server admin or a member of the **LoginManager** server role can determine the logins on the source server with the following SELECT statement.

```sql
SELECT [name], [sid]
FROM [sys].[sql_logins]
WHERE [type_desc] = 'SQL_Login'
```

Only a member of the db_owner database role, the dbo user, or server admin, can determine all of the database user principals in the primary database.

```sql
SELECT [name], [sid]
FROM [sys].[database_principals]
WHERE [type_desc] = 'SQL_USER'
```

#### 2. Find the SID for the logins identified in step 1

By comparing the output of the queries from the previous section and matching the SIDs, you can map the server login to database user. Logins that have a database user with a matching SID have user access to that database as that database user principal.

The following query can be used to see all of the user principals and their SIDs in a database. Only a member of the db_owner database role or server admin can run this query.

```sql
SELECT [name], [sid]
FROM [sys].[database_principals]
WHERE [type_desc] = 'SQL_USER'
```

> [!NOTE]
> The **INFORMATION_SCHEMA** and **sys** users have *NULL* SIDs, and the **guest** SID is **0x00**. The **dbo** SID may start with *0x01060000000001648000000000048454*, if the database creator was the server admin instead of a member of **DbManager**.

#### 3. Create the logins on the target server

The last step is to go to the target server, or servers, and generate the logins with the appropriate SIDs. The basic syntax is as follows.

```sql
CREATE LOGIN [<login name>]
WITH PASSWORD = <login password>,
SID = <desired login SID>
```

> [!NOTE]
> If you want to grant user access to the secondary, but not to the primary, you can do that by altering the user login on the primary server by using the following syntax.
>
> ```sql
> ALTER LOGIN <login name> DISABLE
> ```
>
> DISABLE doesn’t change the password, so you can always enable it if needed.

## Next steps

* For more information on managing database access and logins, see [SQL Database security: Manage database access and login security](logins-create-manage.md).
* For more information on contained database users, see [Contained Database Users - Making Your Database Portable](/sql/relational-databases/security/contained-database-users-making-your-database-portable).
* To learn about active geo-replication, see [Active geo-replication](active-geo-replication-overview.md).
* To learn about auto-failover groups, see [Auto-failover groups](auto-failover-group-overview.md).
* For information about using geo-restore, see [geo-restore](recovery-using-backups.md#geo-restore)