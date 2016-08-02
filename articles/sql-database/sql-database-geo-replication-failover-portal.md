<properties 
    pageTitle="Initiate a planned or unplanned failover for Azure SQL Database with the Azure portal | Microsoft Azure" 
    description="Initiate a planned or unplanned failover for Azure SQL Database using the Azure portal" 
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
    ms.date="07/19/2016"
    ms.author="sstein"/>

# Initiate a planned or unplanned failover for Azure SQL Database with the Azure portal


> [AZURE.SELECTOR]
- [Azure portal](sql-database-geo-replication-failover-portal.md)
- [PowerShell](sql-database-geo-replication-failover-powershell.md)
- [T-SQL](sql-database-geo-replication-failover-transact-sql.md)


This article shows you how to initiate failover to a secondary SQL Database with the [Azure portal](http://portal.azure.com). To configure Geo-Replication, see [Configure Geo-Replication for Azure SQL Database](sql-database-geo-replication-portal.md).


## Initiate a failover

The secondary database can be switched to become the primary.  

1. In the [Azure portal](http://portal.azure.com) browse to the primary database in the Geo-Replication partnership.
2. On the SQL Database blade, select **All settings** > **Geo-Replication**.
3. In the **SECONDARIES** list, select the database you want to become the new primary and click **Failover**.

    ![failover][2]

4. Click **Yes** to begin the failover.

The command will immediately switch the secondary database into the primary role. 

There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. If the primary database has multiple secondary databases, the command will automatically reconfigure the other secondaries to connect to the new primary. The entire operation should take less than a minute to complete under normal circumstances. 

>[AZURE.NOTE] If the primary is online and committing transactions when the command is issued some data loss may occur.


## Next steps   

- To learn recovering after a disaster using Active Geo-Replication, including pre and post recovery steps and performing a disaster recovery drill, see [Disaster Recovery Drills](sql-database-disaster-recovery.md)
- For a Sasha Nosov blog post about Active Geo-Replication, see [Spotlight on new Geo-Replication capabilities](https://azure.microsoft.com/blog/spotlight-on-new-capabilities-of-azure-sql-database-geo-replication/)
- For information about designing cloud applications to use Active Geo-Replication, see [Designing cloud applications for business continuity using Geo-Replication](sql-database-designing-cloud-solutions-for-disaster-recovery.md)
- For information about using Active Geo-Replication with elastic database pools, see [Elastic Pool disaster recovery strategies](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md).
- For an overview of business continurity, see [Business Continuity Overview](sql-database-business-continuity.md)




<!--Image references-->
[1]: ./media/sql-database-geo-replication-failover-portal/failover.png
[2]: ./media/sql-database-geo-replication-failover-portal/secondaries.png
