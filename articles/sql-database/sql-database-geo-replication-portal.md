<properties 
    pageTitle="Geo-Replication for Azure SQL Database (Azure Preview Portal)" 
    description="Geo-Replication for Azure SQL Database using the Azure Preview Portal" 
    services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jeffreyg" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="data-management" 
    ms.date="10/21/2015"
    ms.author="sstein"/>

# Geo-Replication for Azure SQL Database (Azure Preview Portal)


> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [Transact-SQL](sql-database-geo-replication-transact-sql.md)


This article shows you how to configure Geo-Replication for SQL Database with the [Azure Preview Portal](https://portal.azure.com).



> [AZURE.NOTE] Geo-replication is not available for Basic databases. Must have Standard or Premium. Standard must use the recommended target region and secondary is non-readable. Premium can use any target region and can have readable secondarys.


To configure Geo-Replication you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- A logical Azure SQL Database server and a SQL database - The primary database that you want to replicate to a different geographical region.
- A logical Azure SQL Database server - The logical server into which you will create a geo-replication secondary database.
- Azure PowerShell 1.0 Preview. You can download and install the Azure PowerShell modules by following [How to install and configure Azure PowerShell](powershell-install-configure.md).




## Add secondary database

The following steps make the local database into a Geo-Replication primary (assuming that it is not already) and begins replicating data from it to a secondary database with the same name on another "partner" server.  

To enable a secondary you must be the subscription owner or co-owner. 


The replicated database on the secondary server will have the same name as the database on the primary server and will, by default, have the same service level. The secondary database can be readable or non-readable, and can be a single database or an elastic database. For more information, see [Service Tiers](sql-database-service-tiers.md).
After the secondary is created and seeded, data will begin replicating from the primary database to the new secondary database. 

> [AZURE.NOTE] If the partner database already exists (for example - as a result of terminating a previous geo-replication relationship) the command will fail.




### Add secondary

1. In the [Azure Preview Portal](https://portal.azure.com) browse to the database that you want to setup for Geo-Replication.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**:

    ![Add secondary][1]

3. Select the region to create the secondary database. Premium databases can use any region for a secondary, Standard databases must use the recommended region:

    ![Geo-Replication][2]

4. Configure the **Secondary type** (**Readable**, or **Non-readable**), and then pick an existing server in the selected region or create a new **Server** to be used for the secondary database.

    ![Create Secondary][4]

5. Click **Create** to add the secondary.
 
    ![Create Secondary][5]

6. The secondary database is created and the seeding process begins. When the seeding process is complete the database displays a status of **Non-readable**.
 
    ![seeding][6]




## Remove secondary database

The operation permanently terminates the replication to the secondary database and change the role of the secondary to a regular read-write database. If the connectivity to the secondary database is broken the command succeeds but the secondary will not become read-write until after connectivity is restored.  

1. In the [Azure Preview Portal](https://portal.azure.com) browse to the primary database in the Geo-Replication partnership.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. In the **SECONDARIES** list select the database you want to remove from the Geo-Replication partnership.
4. Click **Stop now**.

    ![remove secondary][7]


5. Clicking **Stop now** opens the **Stop replication** confirmation window so click **Yes** to remove the secondary.


    ![confirm removal][8]



## Initiate a planned failover from the primary database to the secondary database

The secondary database can be switched to primary and vice versa. It is designed for planned failover such as during the DR drills. The command performs the following workflow: 

1. Temporarily switch replication to synchronous mode. This will cause all outstanding transactions to be flushed to the secondary; 

2. Switch the roles of the two databases in the geo-replication relationship.  

This sequence guarantees that no data loos will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. 

NOTE:  If the primary database is unavailable when the command is issued it will fail with the error message indicating that the primary server is not available. In rare cases it is possible that the operation cannot complete and may appear stuck. In this case the user can call the force failover command and accept data loss. 




## Initiate an unplanned failover from the primary database to the secondary database

### Cleanup

### Allow/disallow data loss


In the case on an outage when the primary is no longer available the secondary database can be switched to primary using forced failover. It is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable.  

When forced failover is invoked, the specified secondary database immediately becomes a primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database after the forced failover operation, an incremental backup is taken on the original primary database and it is made into a secondary for the new primary database; subsequently, it is merely a replica of the new primary. But because Point In Time Restore is not supported on the secondary databases, if the user wishes to recovery data committed to the old primary database which had not been replicated to the new primary database, she has to engage CSS to restore a database to the know log backup. 

NOTE: If the command is issued when the both primary and secondary are online the old primary will become the new secondary but data synchronization will not be attempted. So some data loss may occur. 


If the primary database has multiple secondaries the command will partially succeed. The secondary on which the command was executed will become primary. The old primary however will remain primary, i.e. the two primaries will end up in inconsistent state and connected by a suspended replication link. The user will have to manually repair this configuration using a “remove secondary” API on either of these primary databases. 




## Monitor Geo-Replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  


   

## Next steps

- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)




## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)


<!--Image references-->
[1]: ./media/sql-database-geo-replication-portal/configure-geo-replication.png
[2]: ./media/sql-database-geo-replication-portal/add-secondary.png
[3]: ./media/sql-database-geo-replication-portal/create-secondary.png
[4]: ./media/sql-database-geo-replication-portal/secondary-type.png
[5]: ./media/sql-database-geo-replication-portal/create.png
[6]: ./media/sql-database-geo-replication-portal/seeding0.png
[7]: ./media/sql-database-geo-replication-portal/remove-secondary.png
[8]: ./media/sql-database-geo-replication-portal/stop-confirm.png

