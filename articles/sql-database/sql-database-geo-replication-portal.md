<properties 
    pageTitle="Configure geo-replication for Azure SQL Database with the Azure portal | Microsoft Azure" 
    description="Configure geo-replication for Azure SQL Database using the Azure portal" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="data-management" 
    ms.date="04/25/2016"
    ms.author="sstein"/>

# Configure geo-replication for Azure SQL Database with the Azure portal


> [AZURE.SELECTOR]
- [Azure portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [Transact-SQL](sql-database-geo-replication-transact-sql.md)


This article shows you how to configure geo-replication for SQL Database with the [Azure portal](http://portal.azure.com).

To initiate failover, see [Initiate a planned or unplanned failover for Azure SQL Database](sql-database-geo-replication-failover-portal.md).

>[AZURE.NOTE] Active Geo-Replication (readable secondaries) is now available for all databases in all service tiers. In April 2017 the non-readable secondary type will be retired and existing non-readable databases will automatically be upgraded to readable secondaries.

You can configure up to 4 readable secondary databases in the same or different data center locations (regions). Secondary databases are available in the case of a data center outage or the inability to connect to the primary database.

To configure geo-replication you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- An Azure SQL Database database - The primary database that you want to replicate to a different geographical region.



## Add secondary database

The following steps create a new secondary database in a geo-replication partnership.  

To add a secondary you must be the subscription owner or co-owner. 

The secondary database will have the same name as the primary database and will, by default, have the same service level. The secondary database can be readable or non-readable, and can be a single database or an elastic database. For more information, see [Service Tiers](sql-database-service-tiers.md).
After the secondary is created and seeded, data will begin replicating from the primary database to the new secondary database. 

> [AZURE.NOTE] If the partner database already exists (for example - as a result of terminating a previous geo-replication relationship) the command will fail.




### Add secondary

1. In the [Azure portal](http://portal.azure.com) browse to the database that you want to setup for geo-replication.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. Select the region to create the secondary database.


    ![Add secondary][1]


4. Configure the **Secondary type** (**Readable**, or **Non-readable**).
5. Select or configure the server for the secondary database.

    ![Create Secondary][3]

5. Optionally, you can add a secondary database to an elastic database pool:

       - Click **Elastic database pool** and select a pool on the target server to create the secondary database in. A pool must already exist on the target server as this workflow does not create a new pool.

6. Click **Create** to add the secondary.
 
6. The secondary database is created and the seeding process begins. 
 
    ![seeding][6]

7. When the seeding process is complete the secondary database displays its status (non-readable.

    ![secondary ready][9]



## Remove secondary database

The operation permanently terminates the replication to the secondary database and change the role of the secondary to a regular read-write database. If the connectivity to the secondary database is broken the command succeeds but the secondary will not become read-write until after connectivity is restored.  

1. In the [Azure portal](http://portal.azure.com) browse to the primary database in the geo-replication partnership.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. In the **SECONDARIES** list select the database you want to remove from the geo-replication partnership.
4. Click **Stop Replication**.

    ![remove secondary][7]


5. Clicking **Stop Replication** opens a confirmation window so click **Yes** to remove the database from the geo-replication partnership (set it to a read-write database not part of any replication).


    ![confirm removal][8]



## Initiate a failover

The secondary database can be switched to become the primary.  

1. In the [Azure portal](http://portal.azure.com) browse to the primary database in the geo-replication partnership.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. In the **SECONDARIES** list, select the database you want to become the new primary.
4. Click **Failover**.

    ![failover][10]

The command performs the following workflow: 

1. Temporarily switch replication to synchronous mode. This will cause all outstanding transactions to be flushed to the secondary. 

2. Switch the primary and secondary roles of the two databases in the geo-replication partnership.  

For planned failover, this sequence guarantees that no data loss will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. 

   

## Next steps

- [Initiate a planned or unplanned failover for Azure SQL Database](sql-database-geo-replication-failover-portal.md)
- [Designing cloud applications for business continuity using geo-replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)


## Additional resources

- [Security Configuration for Geo-Replication](sql-database-geo-replication-security-config.md)
- [Spotlight on new geo-replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
- [SQL Database BCDR FAQ](sql-database-bcdr-faq.md)
- [Business Continuity Overview](sql-database-business-continuity.md)
- [Point-in-Time Restore](sql-database-point-in-time-restore.md)
- [Geo-Restore](sql-database-geo-restore.md)
- [Active-Geo-Replication](sql-database-geo-replication-overview.md)
- [Designing applications for cloud disaster recovery](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md)


<!--Image references-->
[1]: ./media/sql-database-geo-replication-portal/configure-geo-replication.png
[2]: ./media/sql-database-geo-replication-portal/add-secondary.png
[3]: ./media/sql-database-geo-replication-portal/create-secondary.png
[4]: ./media/sql-database-geo-replication-portal/secondary-type.png
[5]: ./media/sql-database-geo-replication-portal/create.png
[6]: ./media/sql-database-geo-replication-portal/seeding0.png
[7]: ./media/sql-database-geo-replication-portal/remove-secondary.png
[8]: ./media/sql-database-geo-replication-portal/stop-confirm.png
[9]: ./media/sql-database-geo-replication-portal/seeding-complete.png
[10]: ./media/sql-database-geo-replication-portal/failover.png

