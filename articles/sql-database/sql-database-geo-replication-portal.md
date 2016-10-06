<properties 
    pageTitle="Configure Geo-Replication for Azure SQL Database with the Azure portal | Microsoft Azure" 
    description="Configure Geo-Replication for Azure SQL Database using the Azure portal" 
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
   ms.workload="NA"
    ms.date="07/14/2016"
    ms.author="sstein"/>

# Configure Geo-Replication for Azure SQL Database with the Azure portal


> [AZURE.SELECTOR]
- [Overview](sql-database-geo-replication-overview.md)
- [Azure Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [T-SQL](sql-database-geo-replication-transact-sql.md)

This article shows you how to configure Active Geo-Replication for SQL Database with the [Azure portal](http://portal.azure.com).

To initiate failover with the Azure portal, see [Initiate a planned or unplanned failover for Azure SQL Database with the Azure portal](sql-database-geo-replication-failover-portal.md).

>[AZURE.NOTE] Active Geo-Replication (readable secondaries) is now available for all databases in all service tiers. In April 2017 the non-readable secondary type will be retired and existing non-readable databases will automatically be upgraded to readable secondaries.

To configure Geo-Replication using the Azure portal, you need the following:

- An Azure subscription. 
- An Azure SQL Database database - The primary database that you want to replicate to a different geographical region.

## Add secondary database

The following steps create a new secondary database in a Geo-Replication partnership.  

To add a secondary you must be the subscription owner or co-owner. 

The secondary database will have the same name as the primary database and will, by default, have the same service level. The secondary database can be readable or non-readable, and can be a single database or an elastic database. For more information, see [Service Tiers](sql-database-service-tiers.md).
After the secondary is created and seeded, data will begin replicating from the primary database to the new secondary database. 

> [AZURE.NOTE] If the partner database already exists (for example - as a result of terminating a previous Geo-Replication relationship) the command will fail.

### Add secondary

1. In the [Azure portal](http://portal.azure.com) browse to the database that you want to setup for Geo-Replication.
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

1. In the [Azure portal](http://portal.azure.com) browse to the primary database in the Geo-Replication partnership.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. In the **SECONDARIES** list select the database you want to remove from the Geo-Replication partnership.
4. Click **Stop Replication**.

    ![remove secondary][7]


5. Clicking **Stop Replication** opens a confirmation window so click **Yes** to remove the database from the Geo-Replication partnership (set it to a read-write database not part of any replication).


    ![confirm removal][8]


## Next steps

- To learn more about Active Geo-Replication, see - [Active Geo-Replication](sql-database-geo-replication-overview.md)
- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)


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

