---
title: Configure security for disaster recovery
description: Learn the security considerations for configuring and managing security after a database restore or a failover to a secondary server.
services: sql-database
ms.service: sql-database
ms.subservice: high-availability
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: mathoma, carlrab
ms.date: 12/18/2018
---
# Configure and manage Azure SQL Database security for geo-restore or failover
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article describes the authentication requirements to configure and control [active geo-replication](active-geo-replication-overview.md) and [auto-failover groups](auto-failover-group-overview.md). It also provides the steps required to set up user access to the secondary database. Finally, it also describes how to enable access to the recovered database after using [geo-restore](recovery-using-backups.md#geo-restore). For more information on recovery options, see [Business Continuity Overview](business-continuity-high-availability-disaster-recover-hadr-overview.md).

## Disaster recovery with contained users

Unlike traditional users, which must be mapped to logins in the master database, a contained user is managed completely by the database itself. This has two benefits. In the disaster recovery scenario, the users can continue to connect to the new primary database or the database recovered using geo-restore without any additional configuration, because the database manages the users. There are also potential scalability and performance benefits from this configuration from a login perspective. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).

The main trade-off is that managing the disaster recovery process at scale is more challenging. When you have multiple databases that use the same login, maintaining the credentials using contained users in multiple databases may negate the benefits of contained users. For example, the password rotation policy requires that changes be made consistently in multiple databases rather than changing the password for the login once in the master database. For this reason, if you have multiple databases that use the same user name and password, using contained users is not recommended.

## How to configure logins and users

If you are using logins and users (rather than contained users), you must take extra steps to ensure that the same logins exist in the master database. The following sections outline the steps involved and additional considerations.

  >[!NOTE]
  > It is also possible to use Azure Active Directory (AAD) logins to manage your databases. For more information, see [Azure SQL logins and users](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins).

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

    SELECT [name], [sid]
    FROM [sys].[sql_logins]
    WHERE [type_desc] = 'SQL_Login'

Only a member of the db_owner database role, the dbo user, or server admin, can determine all of the database user principals in the primary database.

    SELECT [name], [sid]
    FROM [sys].[database_principals]
    WHERE [type_desc] = 'SQL_USER'

#### 2. Find the SID for the logins identified in step 1

By comparing the output of the queries from the previous section and matching the SIDs, you can map the server login to database user. Logins that have a database user with a matching SID have user access to that database as that database user principal.

The following query can be used to see all of the user principals and their SIDs in a database. Only a member of the db_owner database role or server admin can run this query.

    SELECT [name], [sid]
    FROM [sys].[database_principals]
    WHERE [type_desc] = 'SQL_USER'

> [!NOTE]
> The **INFORMATION_SCHEMA** and **sys** users have *NULL* SIDs, and the **guest** SID is **0x00**. The **dbo** SID may start with *0x01060000000001648000000000048454*, if the database creator was the server admin instead of a member of **DbManager**.

#### 3. Create the logins on the target server

The last step is to go to the target server, or servers, and generate the logins with the appropriate SIDs. The basic syntax is as follows.

    CREATE LOGIN [<login name>]
    WITH PASSWORD = <login password>,
    SID = <desired login SID>

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
* For more information on contained database users, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).
* To learn about active geo-replication, see [Active geo-replication](active-geo-replication-overview.md).
* To learn about auto-failover groups, see [Auto-failover groups](auto-failover-group-overview.md).
* For information about using geo-restore, see [geo-restore](recovery-using-backups.md#geo-restore)
