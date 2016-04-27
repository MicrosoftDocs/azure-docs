<properties
	pageTitle="Security Configuration for Active Geo-Replication"
	description="This topic explains security considerations for managing Active Geo-Replication scenarios for SQL Database."
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
	ms.date="04/23/2016"
	ms.author="carlrab" />

# Security Configuration for Geo-Replication

>[AZURE.NOTE] [Active Geo-Replication](sql-database-geo-replication-overview.md) is now available for all databases in all service tiers.

## Overview of authentication requirements for Active Geo-Replication
This topic describes the authentication requirements to configure and control [Active Geo-Replication](sql-database-geo-replication-overview.md) and the steps required to set up user access to the secondary database. For more information on using Geo-Replication, see [Recover an Azure SQL Database from an outage](sql-database-disaster-recovery.md).

## Using Active Geo-Replication with contained users
With the [V12 version of Azure SQL Database](sql-database-v12-whats-new.md), SQL Database now supports contained users. Unlike traditional users, which must be mapped to logins in the master database, a contained user is managed completely by the database itself. This has two benefits. In the geo-replication scenario, the users can continue to connect to the secondary database without any additional configuration, because the database manages the users. There are also potential scalability and performance benefits from this configuration from a login perspective. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx). 

When you have multiple databases that use the same login, maintaining the credentials using contained users in multiple database may negate the benefits of contained users. For examnple, when the passsword changes, the change will have to be made separately for the contained user in each database, rather than changing the password for the login once at the server level. For this reason, if you have multiple databases that use the same user name and password, using the contained users is not recommended. 

## Using logins and users with Active Geo-Replication
If you are using logins and users (rather than contained users), you must make take extra steps to insure that the same logins exist on the secondary database server. The following sections outline the steps involved and additional considerations.

### Set up user access to a secondary database
In order for the secondary database to be usable as a read-only secondary database or a viable primary database after a failover, the secondary database must have the appropriate security configuration in place.

The server admin or users with appropriate permissions can complete the configuration steps described in the topic. The specific permissions for each step are described later in this topic.

Preparing user access to an Active Geo-Replication Online secondary can be performed at any time. It involves three steps outlined below:

1. Determine logins with access to the primary database.
2. Find the SID for these logins on the source server.
3. Create the logins on the target server with the matching SID from the source server.

>[AZURE.NOTE] If the logins on the target server are not properly mapped to the users in the secondary database, access to it as a read-only database or access to the new primary after failover is limited to only the server admin. 

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
For more information on Active Geo-Replication, see [Active Geo-Replication](sql-database-geo-replication-overview.md).


## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [Point-in-Time Restore](sql-database-point-in-time-restore.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)
- [SQL Database BCDR FAQ](sql-database-bcdr-faq.md)