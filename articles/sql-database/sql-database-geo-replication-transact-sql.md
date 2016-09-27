<properties
    pageTitle="Configure Geo-Replication for Azure SQL Database with Transact-SQL | Microsoft Azure"
    description="Configure Geo-Replication for Azure SQL Database using Transact-SQL"
    services="sql-database"
    documentationCenter=""
    authors="CarlRabeler"
    manager="jhubbard"
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="NA"
    ms.date="07/18/2016"
    ms.author="carlrab"/>

# Configure Geo-Replication for Azure SQL Database with Transact-SQL

> [AZURE.SELECTOR]
- [Overview](sql-database-geo-replication-overview.md)
- [Azure Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [T-SQL](sql-database-geo-replication-transact-sql.md)

This article shows you how to configure Active Geo-Replication for an Azure SQL Database with Transact-SQL.

To initiate failover using Transact-SQL, see [Initiate a planned or unplanned failover for Azure SQL Database with Transact-SQL](sql-database-geo-replication-failover-transact-sql.md).

>[AZURE.NOTE] Active Geo-Replication (readable secondaries) is now available for all databases in all service tiers. In April 2017 the non-readable secondary type will be retired and existing non-readable databases will automatically be upgraded to readable secondaries.

To configure Active Geo-Replication using Transact-SQL, you need the following:

- An Azure subscription.
- A logical Azure SQL Database server <MyLocalServer> and a SQL database <MyDB> - The primary database that you want to replicate.
- One or more logical Azure SQL Database servers <MySecondaryServer(n)> - The logical servers that will be the partner servers in which you will create secondary databases.
- A login that is DBManager on the primary, have db_ownership of the local database that you will geo-replicate, and be DBManager on the partner server(s) to which you will configure Geo-Replication.
- SQL Server Management Studio (SSMS)

> [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


## Add secondary database

You can use the **ALTER DATABASE** statement to create a geo-replicated secondary database on a partner server. You execute this statement on the master database of the server containing the database to be replicated. The geo-replicated database (the "primary database") will have the same name as the database being replicated and will, by default, have the same service level as the primary database. The secondary database can be readable or non-readable, and can be a single database or an elastic databbase. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).
After the secondary database is created and seeded, data will begin replicating asynchronously from the primary database. The steps below describe how to configure Geo-Replication using Management Studio. Steps to create non-readable and readable secondaries, either with a single database or an elastic database, are provided.

> [AZURE.NOTE] If a database exists on the specified partner server with the same name as the primary database the command will fail.


### Add non-readable secondary (single database)

Use the following steps to create a non-readable secondary as a single database.

1. Using version 13.0.600.65 or later of SQL Server Management Studio.

 	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio to remain in sync with updates to the Azure portal.


2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a Geo-Replication primary with a non-readable secondary database on MySecondaryServer1 where MySecondaryServer1 is your friendly server name.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer1> WITH (ALLOW_CONNECTIONS = NO);

4. Click **Execute** to run the query.


### Add readable secondary (single database)
Use the following steps to create a readable secondary as a single database.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a Geo-Replication primary with a readable secondary database on a secondary server.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer2> WITH (ALLOW_CONNECTIONS = ALL);

4. Click **Execute** to run the query.



### Add non-readable secondary (elastic database)

Use the following steps to create a non-readable secondary as an elastic database.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a Geo-Replication primary with a non-readable secondary database on a secondary server in an elastic pool.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer3> WITH (ALLOW_CONNECTIONS = NO
           , SERVICE_OBJECTIVE = ELASTIC_POOL (name = MyElasticPool1));

4. Click **Execute** to run the query.



### Add readable secondary (elastic database)
Use the following steps to create a readable secondary as an elastic database.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a Geo-Replication primary with a readable secondary database on a secondary server in an elastic pool.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer4> WITH (ALLOW_CONNECTIONS = ALL
           , SERVICE_OBJECTIVE = ELASTIC_POOL (name = MyElasticPool2));

4. Click **Execute** to run the query.



## Remove secondary database

You can use the **ALTER DATABASE** statement to permanently terminate the replication partnership between a secondary database and its primary. This statement is executed on the master database on which the primary database resides. After the relationship termination, the secondary database becomes a regular read-write database. If the connectivity to secondary database is broken the command succeeds but the secondary will become read-write after connectivity is restored. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).

Use the following steps to remove geo-replicated secondary from a Geo-Replication partnership.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to remove a geo-replicated secondary.

        ALTER DATABASE <MyDB>
           REMOVE SECONDARY ON SERVER <MySecondaryServer1>;

4. Click **Execute** to run the query.

## Monitor Geo-Replication configuration and health

Monitoring tasks include monitoring of the Geo-Replication configuration and monitoring data replication health.  You can use the **sys.dm_geo_replication_links** dynamic management view in the master database to return information about all exiting replication links for each database on the Azure SQL Database logical server. This view contains a row for each of the replication link between primary and secondary databases. You can use the **sys.dm_replication_status** dynamic management view to return a row for each Azure SQL Database that is currently engaged in a replication replication link. This includes both primary and secondary databases. If more than one continuous replication link exists for a given primary database, this table contains a row for each of the relationships. The view is created in all databases, including the logical master. However, querying this view in the logical master returns an empty set. You can use the **sys.dm_operation_status** dynamic management view to show the status for all database operations including the status of the replication links. For more information, see [sys.geo_replication_links (Azure SQL Database)](https://msdn.microsoft.com/library/mt575501.aspx), [sys.dm_geo_replication_link_status (Azure SQL Database)](https://msdn.microsoft.com/library/mt575504.aspx), and [sys.dm_operation_status (Azure SQL Database)](https://msdn.microsoft.com/library/dn270022.aspx).

Use the following steps to monitor a Geo-Replication partnership.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following statement to show all databases with Geo-Replication links.

        SELECT database_id, start_date, modify_date, partner_server, partner_database, replication_state_desc, role, secondary_allow_connections_desc FROM [sys].geo_replication_links;

4. Click **Execute** to run the query.
5. Open the Databases folder, expand the **System Databases** folder, right-click on **MyDB**, and then click **New Query**.
6. Use the following statement to show the replication lags and last replication time of my secondary databases of MyDB.

        SELECT link_guid, partner_server, last_replication, replication_lag_sec FROM sys.dm_geo_replication_link_status

7. Click **Execute** to run the query.
8. Use the following statement to show the most recent geo-replication operations associated with database MyDB.

        SELECT * FROM sys.dm_operation_status where major_resource_id = 'MyDB'
        ORDER BY start_time DESC

9. Click **Execute** to run the query.

## Upgrade a non-readable secondary to readable

In April 2017 the non-readable secondary type will be retired and existing non-readable databases will automatically be upgraded to readable secondaries. If you are using non-readable secondaries today and want to upgrade them to be readable, you can use the following simple steps for each secondary.

> [AZURE.IMPORTANT] There is no self-service method of in-place upgrading of a non-readable secondary to readable. If you drop your only secondary, then the primary database will remain unprotected until the new secondary is fully synchronized. If your application’s SLA requires that the primary is always protected, you should consider creating a parallel secondary in a different server before applying the upgrade steps above. Note each primary can have up to 4 secondary databases.


1. First, connect to the *secondary* server and drop the non-readable secondary database:  
        
        DROP DATABASE <MyNonReadableSecondaryDB>;

2. Now connect to the *primary* server and add a new readable secondary

        ALTER DATABASE <MyDB>
            ADD SECONDARY ON SERVER <MySecondaryServer> WITH (ALLOW_CONNECTIONS = ALL);




## Next steps

- To learn more about Active Geo-Replication, see - [Active Geo-Replication](sql-database-geo-replication-overview.md)
- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
