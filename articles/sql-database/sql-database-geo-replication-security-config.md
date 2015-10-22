<properties
	pageTitle="Security Configuration for Standard or Active Geo-Replication"
	description="This topic explains security considerations for managing Standard or Active Geo-Replication scenarios for SQL Database."
	services="sql-database"
	documentationCenter="na"
	authors="rothja"
	manager="jeffreyg"
	editor="monicar" />


<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="10/22/2015"
	ms.author="jroth" />

# Security Configuration for Standard or Active Geo-Replication

## Overview
This topic describes the authentication requirements to configure and control [Standard and Active Geo-Replication](sql-database-geo-replication-overview.md) and the steps required to set up user access to the secondary database. For more information on using Geo-Replication, see [Recover an Azure SQL Database from an outage](sql-database-disaster-recovery.md).

## Using Contained Users
With the [V12 version of Azure SQL Database](sql-database-v12-whats-new.md), SQL Database now supports contained users. Unlike traditional users, which must be mapped to logins in the master database, a contained user is managed completely by the database itself. This has two benefits. In the geo-replication scenario, the users can continue to connect to the secondary database without any additional configuration, because the database manages the users. There are also potential scalability and performance benefits from this configuration from a login perspective. For more information, see [Contained Database Users - Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx). 

With contained users, if you have multiple databases that use the same login, you must manage that user separately for each database (for example for a password change), rather than managing the login at the server level.

>[AZURE.NOTE] If you want to change the read access of the primary and secondary independently, then you must use traditional logins and users. Contained users  cannot be managed on the secondary independently from the primary.

## Using Traditional Logins and Users
If you are using traditional logins and users (rather than contained users), you must make take extra steps to insure that the same logins exist on the secondary database server. The following sections outline the steps involved and additional considerations.

### Set Up User Access for the Online Secondary
In order for the secondary database to be usable as a read-only database (online secondary) or a viable database copy in a failover situation, the secondary database must have the appropriate security configuration in place.

Only the server admin can successfully complete all of the steps described later in the topic. The specific permissions for each step are described later in this topic.

Preparing user access to an Active Geo-Replication Online secondary can be performed at any time. It involves three steps outlined below:

1. Determine logins with access to the primary database.
2. Find the SID for these logins on the source server.
3. Generate the logins on the target server with the matching SID from the source server.

#### 1. Determine Logins with access to the primary database:
The first step of the process is to determine which logins must be duplicated on the target server. This is accomplished with a pair of SELECT statements, one in the logical master database on the source server and one in the primary database itself.

Only the server admin or a member of the **LoginManager** server role can determine the logins on the source server with the following SELECT statement. 

	SELECT [name], [sid] 
	FROM [sys].[sql_logins] 
	WHERE [type_desc] = 'SQL_Login'

Only a member of the db_owner database role, the dbo user, or server admin, can determine all of the database user principals in the primary database.

	SELECT [name], [sid]
	FROM [sys].[database_principals]
	WHERE [type_desc] = 'SQL_USER'

#### 2. Find the SID For the Logins Identified in Step 1:
By comparing the output of the queries from the previous section and matching the SIDs, you can map the server login to database user. Logins that have a database user with a matching SID have user access to that database as that database user principal. 

The following query can be used to see all of the user principals and their SIDs in a database. Only a member of the db_owner database role or server admin can run this query.

	SELECT [name], [sid]
	FROM [sys].[database_principals]
	WHERE [type_desc] = 'SQL_USER'

>[AZURE.NOTE] The **INFORMATION_SCHEMA** and **sys** users have *NULL* SIDs, and the **guest** SID is **0x00**. The **dbo** SID may start with *0x01060000000001648000000000048454*, if the database creator was the server admin instead of a member of **DbManager**.

#### 3. Generate the logins on the target server:
The last step is to go to the target server, or servers, and generate the logins with the appropriate SIDs. The basic syntax is as follows.

	CREATE LOGIN [<login name>]
	WITH PASSWORD = <login password>,
	SID = <desired login SID>

>[AZURE.NOTE] If you want to grant user access to the secondary, but not to the primary, you can do that by altering the user login on the primary server by using the following syntax.
>
>ALTER LOGIN <login name> DISABLE
>
>DISABLE doesn’t change the password, so you can always enable it if needed.

## Set Up User Access Upon Termination of a Continuous Copy Relationship
In the event of failover, the continuous copy relationship must be stopped between the primary and the secondaries. For information on this process, see [Recover an Azure SQL Database from an outage](sql-database-disaster-recovery.md).

In the case of Standard Geo-Replication the user cannot access the offline secondary, so the changes to the user accounts must be made upon termination of the continuous copy relationship.

If the login SIDs is not duplicated on the target server, access to the secondary database after termination is limited to only the server admin. If the user that initiates replication is a DbManager, they will not have access to the secondary unless their login SID is duplicated from the source server. This remains true for the life of the replication process.

When replication is terminated, as part of the termination process the [dbo] user principal will be changed to match the login SID for the user that initiated the replication and that user will have access restored. This is not the case for other database users.

The user account and the associated login that was used to initiate the termination operation should be present on the target server and database to make sure that the user account is able to access the secondary after the termination is complete.

For more information on the steps needed after failover, see [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md).

## Next Steps
For more information on Geo-Replication and additional business continuity features of SQL Database, see [Business Continuity Overview](sql-database-business-continuity.md).