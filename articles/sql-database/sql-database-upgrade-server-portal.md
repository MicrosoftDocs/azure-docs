<properties
	pageTitle="Upgrade to Azure SQL Database V12 using the Azure portal | Microsoft Azure"
	description="Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases, and how to upgrade a V11 server migrating its databases directly into an elastic database pool using the Azure portal."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-management"
	ms.date="08/08/2016"
	ms.author="sstein"/>


# Upgrade to Azure SQL Database V12 using the Azure portal


> [AZURE.SELECTOR]
- [Azure portal](sql-database-upgrade-server-portal.md)
- [PowerShell](sql-database-upgrade-server-powershell.md)


SQL Database V12 is the latest version so upgrading existing servers to SQL Database V12 is recommended.
SQL Database V12 has many [advantages over the previous version](sql-database-v12-whats-new.md) including:

- Increased compatibility with SQL Server.
- Improved premium performance and new performance levels.
- [Elastic database pools](sql-database-elastic-pool.md).

This article provides directions for upgrading existing SQL Database V11 servers and databases to SQL Database V12.

During the process of upgrading to V12 you will upgrade any Web and Business databases to a new service tier so directions for upgrading Web and Business databases are included.

In addition, migrating to an [elastic database pool](sql-database-elastic-pool.md) can be more cost effective than upgrading to individual performance levels (pricing tiers) for single databases. Pools also simplify database management because you only need to manage the performance settings for the pool rather than separately managing the performance levels of individual databases. If you have databases on multiple servers consider moving them into the same server and taking advantage of putting them into a pool. You can easily [auto-migrate databases from V11 servers directly into elastic database pools using PowerShell](sql-database-upgrade-server-powershell.md). You can also use the portal to migrate V11 databases into a pool but in the portal you must already have a V12 server to create a pool. Directions are provided later in this article to create the pool after the server upgrade if you have [databases that can benefit from a pool](sql-database-elastic-pool-guidance.md).

Note that your databases will remain online and continue to work throughout the upgrade operation. At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for a very small duration that is typically around 90 seconds but can be as much as 5 minutes. If your application has [transient fault handling for connection terminations](sql-database-connectivity-issues.md) then it is sufficient to protect against dropped connections at the end of the upgrade.

Upgrading to SQL Database V12 cannot be undone. After an upgrade the server cannot be reverted to V11.

After upgrading to V12, [service tier recommendations](sql-database-service-tier-advisor.md) and [elastic pool performance considerations](sql-database-elastic-pool-guidance.md) will not immediately be available until the service has time to evaluate your workloads on the new server. V11 server recommendation history does not apply to V12 servers so it is not retained.

## Prepare to upgrade

- **Upgrade all Web and Business databases**: See [Upgrade all Web and Business databases](sql-database-upgrade-server-portal.md#upgrade-all-web-and-business-databases) section below or see [Monitor and manage an elastic database pool (PowerShell)](sql-database-elastic-pool-manage-powershell.md).
- **Review and suspend Geo-Replication**: If your Azure SQL database is configured for Geo-Replication you should document its current configuration and [stop Geo-Replication](sql-database-geo-replication-portal.md#remove-secondary-database). After the upgrade completes reconfigure your database for Geo-Replication.
- **Open these ports if you have clients on an Azure VM**: If your client program connects to SQL Database V12 while your client runs on an Azure virtual machine (VM), you must open port ranges 11000-11999 and 14000-14999 on the VM. For details, see [Ports for SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md).



## Start the upgrade

1. In the [Azure portal](https://portal.azure.com/) browse to the server you want to upgrade by selecting **BROWSE** > **SQL servers**, and selecting the v2.0 server you want to upgrade.
2. Select **Latest SQL Database Update**, then select **Upgrade this server**.

      ![upgrade server][1]

3. Upgrading a server to the latest SQL Database Update is permanent and irreversible. To confirm the upgrade, type the name of your server and click **OK**.

## Upgrade all Web and Business databases

If your server has any Web or Business databases you must upgrade them. During the process of upgrading to SQL Database V12 you will update all Web and Business databases to a new service tier.    

To assist you with upgrading, the SQL Database service recommends an appropriate service tier and performance level (pricing tier) for each database. The service recommends the best tier for running your existing database’s workload by analyzing the historical usage for your database.

3. In the **Upgrade this server** blade select each database to review and select the recommended pricing tier to upgrade to. You can always browse the available pricing tiers and select the one that suits your environment best.


     ![databases][2]


7. After clicking the suggested tier you will be presented with the **Choose your pricing tier** blade where you can select a tier and then click the **Select** button to change to that tier. Select a new tier for each Web or Business database.

    What is important to note is that your SQL database is not locked into any specific service tier or performance level, so as the requirements of your database change you can easily change between the available service tiers and performance levels. In fact, Basic, Standard, and Premium SQL Databases are billed by the hour, and you have the ability to scale each database up or down 4 times within a 24 hour period.

    ![recommendations][6]


After all databases on the server are eligible you are ready to start the upgrade

## Confirm the upgrade

3. When all the databases on the server are eligible for upgrade you need to **TYPE THE SERVER NAME** to verify that you want to perform the upgrade, and then click **OK**.

    ![verify upgrade][3]


4. The upgrade starts and displays the in progress notification. The upgrade process is initiated. Depending on the details of your specific databases upgrading to V12 can take some time. During this time all databases on the server will remain online but server and database management actions will be restricted.

    ![upgrade in progress][4]

    At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for a very small duration (typically measured in seconds). If an application has transient fault handling (retry logic) for connection terminations then it is sufficient to protect against dropped connections at the end of the upgrade.

5. After the upgrade operation completes the **Latest Update** blade will display **Enabled**.

    ![V12 enabled][5]  

## Move your databases into an elastic database pool

In the [Azure portal](https://portal.azure.com/) browse to the V12 server and click **Add pool**.

-or-

If you see a message saying **Click here to view the recommended elastic database pools for this server**, click it to easily create a pool that is optimized for your server's databases. For details, see [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).

![Add pool to a server][7]

Follow the directions in the [Create an elastic database pool](sql-database-elastic-pool.md) article to finish creating your pool.

## Monitor databases after upgrading to SQL Database V12

>[AZURE.IMPORTANT] Upgrade to the latest version of SQL Server Management Studio (SSMS) to take advantage of the new v12 capabilities. [Download SQL Server Management Studio] (https://msdn.microsoft.com/library/mt238290.aspx).

After upgrading, actively monitor the database to ensure applications are running at the desired performance, and then optimize settings as required.

In addition to monitoring individual databases, you can monitor elastic database pools [Monitor, manage, and size an elastic database pool with the Azure portal](sql-database-elastic-pool-manage-portal.md) or with [PowerShell](sql-database-elastic-pool-powershell.md#monitoring-elastic-databases-and-elastic-database-pools).


**Resource consumption data:** For Basic, Standard, and Premium databases resource consumption data is available through the [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) DMV in the user database. This DMV provides near real time resource consumption information at 15 second granularity for the previous hour of operation. The DTU percentage consumption for an interval is computed as the maximum percentage consumption of the CPU, IO and log dimensions. Here is a query to compute the average DTU percentage consumption over the last hour:

    SELECT end_time
    	 , (SELECT Max(v)
             FROM (VALUES (avg_cpu_percent)
                         , (avg_data_io_percent)
                         , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.dm_db_resource_stats
    ORDER BY end_time DESC;

Additional monitoring information:

- [Azure SQL Database performance guidance for single databases](http://msdn.microsoft.com/library/azure/dn369873.aspx).
- [Price and performance considerations for an elastic database pool](sql-database-elastic-pool-guidance.md).
- [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md)




**Alerts:** Set up 'Alerts' in the Azure portal to notify you when the DTU consumption for an upgraded database approaches certain high level. Database alerts can be setup in the Azure portal for various performance metrics like DTU, CPU, IO, and Log. Browse to your database and select **Alert rules** in the **Settings** blade.

For example, you can set up an email alert on “DTU Percentage” if the average DTU percentage value exceeds 75% over the last 5 minutes. Refer to [Receive alert notifications](../azure-portal/insights-receive-alert-notifications.md) to learn more about how to configure alert notifications.





## Next steps

- [Check for pool recommendations and create a pool](sql-database-elastic-pool-create-portal.md).
- [Change the service tier and performance level of your database](sql-database-scale-up.md).



## Related Links

- [What's new in SQL Database V12](sql-database-v12-whats-new.md)
- [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md)


<!--Image references-->
[1]: ./media/sql-database-upgrade-server-portal/latest-sql-database-update.png
[2]: ./media/sql-database-upgrade-server-portal/upgrade-server2.png
[3]: ./media/sql-database-upgrade-server-portal/upgrade-server3.png
[4]: ./media/sql-database-upgrade-server-portal/online-during-upgrade.png
[5]: ./media/sql-database-upgrade-server-portal/enabled.png
[6]: ./media/sql-database-upgrade-server-portal/recommendations.png
[7]: ./media/sql-database-upgrade-server-portal/new-elastic-pool.png
