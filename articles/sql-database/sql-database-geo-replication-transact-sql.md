<properties
    pageTitle="Configure geo-replication for Azure SQL Database with Transact-SQL | Microsoft Azure"
    description="Configure geo-replication for Azure SQL Database using Transact-SQL"
    services="sql-database"
    documentationCenter=""
    authors="carlrabeler"
    manager="jhubbard"
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="data-management"
    ms.date="02/12/2016"
    ms.author="carlrab"/>

# Configure geo-replication for Azure SQL Database with Transact-SQL



> [AZURE.SELECTOR]
- [Azure Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [Transact-SQL](sql-database-geo-replication-transact-sql.md)


This article shows you how to configure geo-replication for an Azure SQL Database using Transact-SQL.


Geo-replication enables creating up to 4 replica (secondary) databases in different data center locations (regions). Secondary databases are available in the case of a data center outage or the inability to connect to the primary database.

Geo-replication is only available for Standard and Premium databases. 

Standard databases can have one non-readable secondary and must use the recommended region. Premium databases can have up to four readable secondaries in any of the available regions.


To configure geo-replication, you need the following:

- An Azure subscription - If you do not have an Azure subscription, simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A logical Azure SQL Database server <MyLocalServer> and a SQL database <MyDB> - The primary database that you want to replicate to a different geographical region.
- One or more logical Azure SQL Database servers <MySecondaryServer(n)> - The logical servers that will be the partner servers in which you will create geo-replication secondary databases.
- A login that is DBManager on the primary, have db_ownership of the local database that you will geo-replicate, and be DBManager on the partner server(s) to which you will configure geo-replication.
- Newest version of SQL Server Management Studio - To obtain the newest version of SQL Server Management Studio (SSMS), go to [Download SQL Server Management Studio] (https://msdn.microsoft.com/library/mt238290.aspx). For information on using SQL Server Management Studio to manage an Azure SQL Database logical servers and databases, see [Managing Azure SQL Database using SQL Server Management Studio](sql-database-manage-azure-ssms.md)

## Add secondary database

You can use the **ALTER DATABASE** statement to create a geo-replicated secondary database on a partner server. You execute this statement on the master database of the server containing the database to be replicated. The geo-replicated database (the "primary database") will have the same name as the database being replicated and will, by default, have the same service level as the primary database. The secondary database can be readable or non-readable, and can be a single database or an elastic databbase. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).
After the secondary database is created and seeded, data will begin replicating asynchronously from the primary database. The steps below describe how to configure geo-replication using Management Studio. Steps to create non-readable and readable secondaries, either with a single database or an elastic database, are provided.

> [AZURE.NOTE] If the secondary database exists on the specified partner server (for example, because a geo-replication relationship currently exists or previously existed, the command will fail.


### Add non-readable secondary (single database)

Use the following steps to create a non-readable secondary as a single database.

1. Using version 13.0.600.65 or later of SQL Server Management Studio.

 	 > [AZURE.IMPORTANT] Download the [latest](https://msdn.microsoft.com/library/mt238290.aspx) version of SQL Server Management Studio. It is recommended that you always use the latest version of Management Studio to remain in sync with updates to the Azure portal.


2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a geo-replication primary with a non-readable secondary database on MySecondaryServer1 where MySecondaryServer1 is your friendly server name.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer1> WITH (ALLOW_CONNECTIONS = NO);

4. Click **Execute** to run the query.


### Add readable secondary (single database)
Use the following steps to create a readable secondary as a single database.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a geo-replication primary with a readable secondary database on a secondary server.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer2> WITH (ALLOW_CONNECTIONS = ALL);

4. Click **Execute** to run the query.



### Add non-readable secondary (elastic database)
Use the following steps to create a non-readable secondary as an elastic database.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make a local database into a geo-replication primary with a non-readable secondary database on a secondary server in an elastic pool.

        ALTER DATABASE <MyDB>
           ADD SECONDARY ON SERVER <MySecondaryServer3> WITH (ALLOW_CONNECTIONS = NO
           , SERVICE_OBJECTIVE = ELASTIC_POOL (name = MyElasticPool1));

4. Click **Execute** to run the query.



### Add readable secondary (elastic database)
Use the following steps to create a readable secondary as an elastic database.

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


## Initiate a planned failover promoting a secondary database to become the new primary

You can use the **ALTER DATABASE** statement to promote a secondary database to become the new primary database in a planned fashion, demoting the existing primary to become a secondary. This statement is executed on the master database on the Azure SQL Database logical server in which the geo-replicated secondary database that is being promoted resides. This functionality is designed for planned failover, such as during the DR drills, and requires that the primary database be available.

The command performs the following workflow:

1. Temporarily switches replication to synchronous mode, causing all outstanding transactions to be flushed to the secondary and blocking all new transactions;

2. Switches the roles of the two databases in the geo-replication partnership.  

This sequence guarantees that no data loss will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. For more information, see [ALTER DATABASE (Transact-SQL)](https://msdn.microsoft.com/library/mt574871.aspx) and [Service Tiers](sql-database-service-tiers.md).


> [AZURE.NOTE] If the primary database is unavailable when the command is issued, the command will fail with the error message indicating that the primary server is not available. In rare cases, it is possible that the operation cannot complete and may appear stuck. In this case, the user can execute the force failover command and accept data loss.

Use the following steps to initiate a planned failover.

1. In Management Studio, connect to the Azure SQL Database logical server in which a geo-replicated secondary database resides.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make the geo-replicated database  into a geo-replication primary with a readable secondary database on <MySecondaryServer4> in <ElasticPool2>.

        ALTER DATABASE <MyDB> FAILOVER;

4. Click **Execute** to run the query.



## Initiate an unplanned failover from the primary database to the secondary database

You can use the **ALTER DATABASE** statement to promote a secondary database to become the new primary database in an unplanned fashion, forcing the demotion of the existing primary to become a secondary at a time when the primary databse is no longer available. This statement is executed on the master database on the Azure SQL Database logical server in which the geo-replicated secondary database that is being promoted resides.

This functionality is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable. When forced failover is invoked, the specified secondary database immediately becomes the primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database, an incremental backup is taken on the original primary database and the old primary database is made into a secondary database for the new primary database; subsequently, it is merely a synchronizing replica of the new primary.

However, because Point In Time Restore is not supported on the secondary databases, if the user wishes to recover data committed to the old primary database that had not been replicated to the new primary database before the forced failover occurred, the user will need to engage support to recover this lost data.

> [AZURE.NOTE] If the command is issued when the both primary and secondary are online the old primary will become the new secondary but data synchronization will not be attempted. So some data loss may occur.


If the primary database has multiple secondary databases, the command will succeed only on the secondary server on which the command was executed. However, the other secondaries will not know that the forced failover occurred. The user will have to manually repair this configuration using a “remove secondary” API and then reconfigure geo-replication on these additional secondaries.

Use the following steps to forcibly remove geo-replicated secondary from a geo-replication partnership.

1. In Management Studio, connect to the Azure SQL Database logical server in which a geo-replicated secondary database resides.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following **ALTER DATABASE** statement to make <MyLocalDB> into a geo-replication primary with a readable secondary database on <MySecondaryServer4> in <ElasticPool2>.

        ALTER DATABASE <MyDB>   FORCE_FAILOVER_ALLOW_DATA_LOSS;

4. Click **Execute** to run the query.

## Monitor geo-replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  You can use the **sys.dm_geo_replication_links** dynamic management view in the master database to return information about all exiting replication links for each database on the Azure SQL Database logical server. This view contains a row for each of the replication link between primary and secondary databases. You can use the **sys.dm_replication_status** dynamic management view to return a row for each Azure SQL Database that is currently engaged in a replication replication link. This includes both primary and secondary databases. If more than one continuous replication link exists for a given primary database, this table contains a row for each of the relationships. The view is created in all databases, including the logical master. However, querying this view in the logical master returns an empty set. You can use the **sys.dm_operation_status** dynamic management view to show the status for all database operations including the status of the replication links. For more information, see [sys.geo_replication_links (Azure SQL Database)](https://msdn.microsoft.com/library/mt575501.aspx), [sys.dm_geo_replication_link_status (Azure SQL Database)](https://msdn.microsoft.com/library/mt575504.aspx), and [sys.dm_operation_status (Azure SQL Database)](https://msdn.microsoft.com/library/dn270022.aspx).

Use the following steps to monitor a geo-replication partnership.

1. In Management Studio, connect to your Azure SQL Database logical server.

2. Open the Databases folder, expand the **System Databases** folder, right-click on **master**, and then click **New Query**.

3. Use the following statement to show all databases with geo-replication links.

        SELECT database_id, start_date, modify_date, partner_server, partner_database, replication_state_desc, role, secondary_allow_connections_desc FROM [sys].geo_replication_links;

4. Click **Execute** to run the query.
5. Open the Databases folder, expand the **System Databases** folder, right-click on **MyDB**, and then click **New Query**.
6. Use the following statement to show the replication lags and last replication time of my secondary databases of MyDB.

        SELECT link_guid, partner_server, last_replication, replication_lag_sec FROM sys.dm_geo_replication_link_status

7. Click **Execute** to run the query.
8. Use the following statement to show the most recent geo-replication operations associated with database MyDB.

        SELECT * FROM sys.dm_operation_status where major_resource_is = 'MyDB'
        ORDER BY start_time DESC

9. Click **Execute** to run the query.


## Next steps

- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)


## Additional resources

- [Spotlight on new geo-replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
- [Designing cloud applications for business continuity using geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/services/sql-database/)
