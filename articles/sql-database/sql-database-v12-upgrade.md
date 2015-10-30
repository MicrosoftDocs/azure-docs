<properties 
	pageTitle="Upgrade to Azure SQL Database V12" 
	description="Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases using the Azure Portal." 
	services="sql-database" 
	documentationCenter="" 
	authors="stevestein" 
	manager="jeffreyg"
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="data-management" 
	ms.date="10/28/2015" 
	ms.author="sstein"/>


# Upgrade to SQL Database V12


> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-v12-upgrade.md)
- [PowerShell](sql-database-upgrade-server.md)


SQL Database V12 is the latest version of SQL Database and has many [advantages over the previous version](sql-database-v12-whats-new.md). SQL Database V12 is recommended for all new development.

> [AZURE.IMPORTANT] All databases on the server will remain online and available throughout the upgrade operation. Upgrading to SQL Database V12 does not take any databases offline.

During the process of upgrading to SQL Database V12 you must also update all Web and Business databases to a new service tier. 

To assist you with upgrading, the SQL Database service recommends an appropriate service tier and performance level (pricing tier) for each database. The service recommends the best tier for running your existing database’s workload by analyzing the historical usage for your database. 

For servers with 2 or more databases, migrating to an [elastic database pool](sql-database-elastic-pool.md) is likely to be more cost effective than upgrading to individual performance levels. You can easily migrate databases directly from V11 servers into elastic database pools using PowerShell. You can also use the portal to migrate V11 databases into a pool but you must first upgrade to a V12 server (following the directions in this article) -- then [add a pool to the server](sql-database-elastic-pool-portal.md#step-1-add-a-pool-to-a-server) and put some or all of the databases in the pool.


## Start the upgrade

1. In the [Azure Preview Portal](http://portal.azure.com/) browse to the server you want to upgrade by selecting **BROWSE ALL** > **SQL servers**, and selecting the desired server.
2. Select **Latest SQL database update**, then select **Upgrade this server**.

      ![upgrade server][1]

## Upgrade your Web and Business databases

2. Upgrade all Web and Business databases. If your server has any Web or Business databases you must upgrade them. To assist you with upgrading, the SQL Database service recommends an appropriate service tier and performance level (pricing tier) for each database. By analyzing the historical usage for each database, the service recommends a tier that is best suited for running your existing database’s workload. 
    
    Select each database to review and select the recommended pricing tier to upgrade to. You can always browse the available pricing tiers and select the one that suits your environment best.

     ![databases][2]



7. After clicking the suggested tier you will be presented with the **Choose your ricing tier** blade where you can select a tier and then click the **Select** button to change to that tier. Select a new tier for each Web or Business database

    ![recommendations][6]


After all databases on the server are eligible you are ready to start the upgrade

## Start the upgrade

3. When all the databases on the server are eligible for upgrade you need to **TYPE THE SERVER NAME** to verify that you want to perform the upgrade, and then click **OK**. 

    ![verify upgrade][3]


4. The upgrade starts and displays the in progress notification. The upgrade process is initiated. Depending on the details of your specific databases upgrading to V12 can take some time. During this time all databases on the server will remain online but server and database management actions will be restricted.

    ![upgrade in progress][4]

    At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for a very small duration (typically measured in seconds). If an application has transient fault handling (retry logic) for connection terminations then it is sufficient to protect against dropped connections at the end of the upgrade. 

5. After the upgrade operation completes the **Latest Update** blade will display **Enabled**.

    ![V12 enabled][5]  


## Monitor databases after upgrading to SQL Database V12


After upgrading, it is recommended to monitor the database actively to ensure applications are running at the desired performance and optimize usage as needed. The following additional steps are recommended for monitoring the database.


**Resource consumption data:** For Basic, Standard, and Premium databases more granular resource consumption data is available through the [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) DMV in the user database. This DMV provides near real time resource consumption information at 15 second granularity for the previous hour of operation. The DTU percentage consumption for an interval is computed as the maximum percentage consumption of the CPU, IO and log dimensions. Here is a query to compute the average DTU percentage consumption over the last hour:

    SELECT end_time
    	 , (SELECT Max(v)
             FROM (VALUES (avg_cpu_percent)
                         , (avg_data_io_percent)
                         , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.dm_db_resource_stats
    ORDER BY end_time DESC;

For more information, see [Azure SQL Database performance guidance for single databases](http://msdn.microsoft.com/library/azure/dn369873.aspx) and [Price and performance considerations for an elastic database pool](sql-database=elastic-pool-guidance.md).


**Alerts:** Set up 'Alerts' in the Azure Portal to notify you when the DTU consumption for an upgraded database approaches certain high level. Database alerts can be setup in the Azure Portal for various performance metrics like DTU, CPU, IO, and Log. Browse to your database and select **Alert rules** in the **Settings** blade.

For example, you can set up an email alert on “DTU Percentage” if the average DTU percentage value exceeds 75% over the last 5 minutes. Refer to [Receive alert notifications](insights-receive-alert-notifications.md) to learn more about how to configure alert notifications.





## Next Steps

- [Create an elastic database pool](sql-database-elastic-pool-portal.md) and add some or all of the databases into the pool.
- [Change the service tier and performance level of your database](sql-database-scale-up.md).



## Related Links

- [What's new in SQL Database V12](sql-database-v12-whats-new.md)
- [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md)


<!--Image references-->
[1]: ./media/sql-database-v12-upgrade/latest-sql-database-update.png
[2]: ./media/sql-database-v12-upgrade/upgrade-server2.png
[3]: ./media/sql-database-v12-upgrade/upgrade-server3.png
[4]: ./media/sql-database-v12-upgrade/online-during-upgrade.png
[5]: ./media/sql-database-v12-upgrade/enabled.png
[6]: ./media/sql-database-v12-upgrade/recommendations.png




