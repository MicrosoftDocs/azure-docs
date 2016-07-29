<properties
	pageTitle="How to manage security after restoring a database to a new server or failing over a database to a secondary database copy | Microsoft Azure"
	description="This topic explains security considerations for managing security after a database restore or a failover."
	services="sql-database"
	documentationCenter="na"
	authors="carlrabeler"
	manager="jhubbard"
	editor="monicar" />


<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="07/16/2016"
	ms.author="carlrab" />

# How to manage Azure SQL Database security after disaster recovery

>[AZURE.NOTE] [Active Geo-Replication](sql-database-geo-replication-overview.md) is now available for all databases in all service tiers.

## Overview of authentication requirements for disaster recovery

This topic describes the authentication requirements to configure and control [Active Geo-Replication](sql-database-geo-replication-overview.md) and the steps required to set up user access to the secondary database. It also describes how enable access to the recovered database after using [geo-restore](sql-database-recovery-using-backups.md#geo-restore). For more information on recovery options, see [Business Continuity Overview](sql-database-business-continuity.md).

## Disaster recovery with contained users

Unlike traditional users, which must be mapped to logins in the master database, a contained user is managed completely by the database itself. This has two benefits. In the disaster recovery scenario, the users can continue to connect to the new primary database or the database recovered using geo-restore without any additional configuration, because the database manages the users. There are also potential scalability and performance benefits from this configuration from a login perspective. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx). 

The main trade-off is that managing the disaster recovery process at scale is more challenging. When you have multiple databases that use the same login, maintaining the credentials using contained users in multiple database may negate the benefits of contained users. For example, the password rotation policy requires that changes be made consistently in multiple databases rather than changing the password for the login once in the master database. For this reason, if you have multiple databases that use the same user name and password, using contained users is not recommended. 

## How to configure logins and users

If you are using logins and users (rather than contained users), you must make take extra steps to insure that the same logins exist in the master database. The following sections outline the steps involved and additional considerations.

### Set up user access to a secondary or recovered database

In order for the secondary database to be usable as a read-only secondary database, and to ensure proper access to the new primary database or the database recovered using geo-restore, the master database of the target server must have the appropriate security configuration in place before the recovery.

The specific permissions for each step are described later in this topic.

Preparing user access to a Geo-Replication secondary should be performed as part configuring Geo-Replication. Preparing user access to the geo-restored databases should be performed at any time when the original server is online (e.g. as part of the DR drill).

>[AZURE.NOTE] If you failover or geo-restore to a server that does not have properly configured logins access to it will be limited to the server admin account.

Setting up logins on the target server involves three steps outlined below:

#### 1. Determine logins with access to the primary database:
The first step of the process is to determine which logins must be duplicated on the target server. This is accomplished with a pair of SELECT statements, one in the logical master database on the source server and one in the primary database itself.

Only the server admin or a member of the **LoginManager** server role can determine the logins on the source server with the following SELECT statement. 

	SELECT [name], [sid] 
	FROM [sys].[sql_logins] 
	WHERE [type_desc] = 'SQL_Login'

Only a member of the db_owner database role, the dbo user, or server admin, can determine all of the database user principals in the primary database.

	SELECT [name], [sid]
	FROM [sys].[database_principals]
	WHERE [type_desc] = 'SQL_USER'

#### 2. Find the SID for the logins identified in step 1:
By comparing the output of the queries from the previous section and matching the SIDs, you can map the server login to database user. Logins that have a database user with a matching SID have user access to that database as that database user principal. 

The following query can be used to see all of the user principals and their SIDs in a database. Only a member of the db_owner database role or server admin can run this query.

	SELECT [name], [sid]
	FROM [sys].[database_principals]
	WHERE [type_desc] = 'SQL_USER'

>[AZURE.NOTE] The **INFORMATION_SCHEMA** and **sys** users have *NULL* SIDs, and the **guest** SID is **0x00**. The **dbo** SID may start with *0x01060000000001648000000000048454*, if the database creator was the server admin instead of a member of **DbManager**.

#### 3. Create the logins on the target server:
The last step is to go to the target server, or servers, and generate the logins with the appropriate SIDs. The basic syntax is as follows.

	CREATE LOGIN [<login name>]
	WITH PASSWORD = <login password>,
	SID = <desired login SID>

>[AZURE.NOTE] If you want to grant user access to the secondary, but not to the primary, you can do that by altering the user login on the primary server by using the following syntax.
>
>ALTER LOGIN <login name> DISABLE
>
>DISABLE doesn’t change the password, so you can always enable it if needed.

## Next steps

- For more information on managing database access and logins, see [SQL Database security: Manage database access and login security](sql-database-manage-logins.md).
- For more information on contained database users, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).
- For information about using and configuring Active Geo-Replication, see [Active Geo-Replication](sql-database-geo-replication-overview.md)
- For informatin about using Geo-Restore, see [Geo-Restore](sql-database-recovery-using-backups.md#geo-restore)

## Additional resources

