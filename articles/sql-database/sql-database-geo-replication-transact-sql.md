---
title: Configure geo-replication for Azure SQL Database with Transact-SQL | Microsoft Docs
description: Configure geo-replication for Azure SQL Database using Transact-SQL
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: d94d89a6-3234-46c5-8279-5eb8daad10ac
ms.service: sql-database
ms.custom: business continuity
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/14/2017
ms.author: carlrab

---
# Configure active geo-replication for Azure SQL Database with Transact-SQL

This article shows you how to configure active geo-replication for an Azure SQL Database with Transact-SQL.

To initiate failover using Transact-SQL, see [Initiate a planned or unplanned failover for Azure SQL Database with Transact-SQL](sql-database-geo-replication-failover-transact-sql.md).

> [!NOTE]
> When you use active geo-replication (readable secondaries) for disaster recovery you should configure a failover group for all databases within an application to enable automatic and transparent failover. This feature is in preview. For more information see [Auto-failover groups and geo-replication](sql-database-geo-replication-overview.md).
> 
> 

To configure active geo-replication using Transact-SQL, you need the following:

* An Azure subscription
* A logical Azure SQL Database server <MyLocalServer> and a SQL database <MyDB> - The primary database that you want to replicate
* One or more logical Azure SQL Database servers <MySecondaryServer(n)> - The logical servers that will be the partner servers in which you will create secondary databases
* A login that is DBManager on the primary
* Have db_ownership of the local database that you will geo-replicate
* Be DBManager on the partner server(s) to which you will configure geo-replication
* The newest version of SQL Server Management Studio (SSMS)

> [!IMPORTANT]
> It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
> 
> 

## Add secondary database
You can use the **ALTER DATABASE** statement to create a geo-replicated secondary database on a partner server. You execute this statement on the master database of the server containing the database to be replicated. The geo-replicated database (the "primary database") will have the same name as the database being replicated and will, by default, have the same service level as the primary database. The secondary database can be readable or non-readable, and can be a single database or in an elastic pool. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).
After the secondary database is created and seeded, data will begin replicating asynchronously from the primary database. The steps below describe how to configure geo-replication using Management Studio. Steps to create non-readable and readable secondaries, either as a single database or in an elastic pool, are provided.

> [!NOTE]
> If a database exists on the specified partner server with the same name as the primary database the command will fail.
> 

### Add readable secondary (single database)
Use the following steps to create a readable secondary as a single database.

1. In Management Studio, connect to your Azure SQL Database logical server.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following **ALTER DATABASE** statement to make a local database into a geo-replication primary with a readable secondary database on a secondary server.
   
        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer2> WITH (ALLOW_CONNECTIONS = ALL);
4. Click **Execute** to run the query.

### Add readable secondary (elastic pool)
Use the following steps to create a readable secondary in an elastic pool.

1. In Management Studio, connect to your Azure SQL Database logical server.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following **ALTER DATABASE** statement to make a local database into a geo-replication primary with a readable secondary database on a secondary server in an elastic pool.
   
        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer4> WITH (ALLOW_CONNECTIONS = ALL
           , SERVICE_OBJECTIVE = ELASTIC_POOL (name = MyElasticPool2));
4. Click **Execute** to run the query.

## Remove secondary database
You can use the **ALTER DATABASE** statement to permanently terminate the replication partnership between a secondary database and its primary. This statement is executed on the master database on which the primary database resides. After the relationship termination, the secondary database becomes a regular read-write database. If the connectivity to secondary database is broken the command succeeds but the secondary will become read-write after connectivity is restored. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).

Use the following steps to remove geo-replicated secondary from a geo-replication partnership.

1. In Management Studio, connect to your Azure SQL Database logical server.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following **ALTER DATABASE** statement to remove a geo-replicated secondary.
   
        ALTER DATABASE <MyDB>
           REMOVE SECONDARY ON SERVER <MySecondaryServer1>;
4. Click **Execute** to run the query.

## Monitor active geo-replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  You can use the **sys.dm_geo_replication_links** dynamic management view in the master database to return information about all exiting replication links for each database on the Azure SQL Database logical server. This view contains a row for each of the replication link between primary and secondary databases. You can use the **sys.dm_replication_link_status** dynamic management view to return a row for each Azure SQL Database that is currently engaged in a replication replication link. This includes both primary and secondary databases. If more than one continuous replication link exists for a given primary database, this table contains a row for each of the relationships. The view is created in all databases, including the logical master. However, querying this view in the logical master returns an empty set. You can use the **sys.dm_operation_status** dynamic management view to show the status for all database operations including the status of the replication links. For more information, see [sys.geo_replication_links (Azure SQL Database)](https://msdn.microsoft.com/library/mt575501.aspx), [sys.dm_geo_replication_link_status (Azure SQL Database)](https://msdn.microsoft.com/library/mt575504.aspx), and [sys.dm_operation_status (Azure SQL Database)](https://msdn.microsoft.com/library/dn270022.aspx).

Use the following steps to monitor an active geo-replication partnership.

1. In Management Studio, connect to your Azure SQL Database logical server.
2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.
3. Use the following statement to show all databases with geo-replication links.
   
        SELECT database_id, start_date, modify_date, partner_server, partner_database, replication_state_desc, role, secondary_allow_connections_desc FROM sys.geo_replication_links;
4. Click **Execute** to run the query.
5. Open the Databases folder, expand the **System Databases** folder, right-click on **MyDB**, and then click **New Query**.
6. Use the following statement to show the replication lags and last replication time of my secondary databases of MyDB.
   
        SELECT link_guid, partner_server, last_replication, replication_lag_sec FROM sys.dm_geo_replication_link_status
7. Click **Execute** to run the query.
8. Use the following statement to show the most recent geo-replication operations associated with database MyDB.
   
        SELECT * FROM sys.dm_operation_status where major_resource_id = 'MyDB'
        ORDER BY start_time DESC
9. Click **Execute** to run the query.

## Next steps
* To learn more about failover groups and active geo-replication, see - [Failover groups](sql-database-geo-replication-overview.md)
* For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)

