<properties 
	pageTitle="Upgrade SQL Database Web/Business Databases to New Service Tiers" 
	description="Upgrade Azure SQL Database Web or Business database to the new Azure SQL Database service tiers/performance levels." 
	services="sql-database" 
	documentationCenter="" 
	authors="jenniehubbard" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.date="12/3/2014" 
	ms.author="jhubbard" 
	ms.workload="" 
	ms.topic="" 
	ms.tgt_pltfrm=""/>


#Upgrade SQL Database Web/Business Databases to New Service Tiers

<p> Azure Web and Business SQL databases run in a shared, multi-tenant environment without any reserved resource capacity for the database. The activity of other databases in your cluster can impact your performance. Resource availability at any given point depends heavily on other concurrent workloads running in the system. This can result in highly varying and unpredictable database application performance. Customer feedback is that this unpredictable performance is difficult to manage, and they prefer more predictable performance. 

To address this feedback, Azure SQL Database service  introduced new database service tiers [(Basic,Standard and Premium)](http://azure.microsoft.com/blog/2014/08/26/new-azure-sql-database-service-tiers-generally-available-in-september-with-reduced-pricing-and-enhanced-sla/ ),  which offer predictable performance and a wealth of new features for business continuity and security. These new service tiers are designed to provide a specified level of resources for a database workload, regardless of other customer workloads running in that environment. This results in highly predictable performance behavior. As part of this release, the Web and Business service tiers are being deprecated and retired in September 2015. 

With these changes come questions about how to evaluate and decide which new service tier is the best fit for their current Web and Business (W/B) databases and about the actual upgrade process itself. This paper provides a guided methodology for upgrading Web/Business database to the new service tiers/performance levels.

Upgrade of a Web/Business database to the new service tier involves the following steps:

1.	Determine the service tier that provides you the minimum level of feature capability required for your application or business requirements
2.	Determine performance level based on historical resource usage
3.	Upgrade to the chosen service tier/performance level
4.	Monitor the database post-upgrade and adjust service tier/performance level as needed

## 1. Determine service tier based on feature capability

Determine the service tier that provides you the minimum level of feature capability required for your application or business requirements For example, consider your requirements like how long backups are retained OR if Standard or Active Geo-Replication features are needed OR overall maximum database size needed etc. These requirement will impact your minimum service tier choice (Refer to the [service tier announcement blog). ](http://azure.microsoft.com/blog/2014/08/26/new-azure-sql-database-service-tiers-generally-available-in-september-with-reduced-pricing-and-enhanced-sla/ ) 

‘Basic’ tier is primarily used for very small, low activity databases. So, for an upgrade you should usually start with the ‘Standard’ or ‘Premium’ tier based on your feature when choosing your service tier. Refer to the [Azure documentation](http://msdn.microsoft.com/en-us/library/azure/dn741336.aspx) for the service tier/performance level-specific limits for the concurrent requests/sessions.

##2. Determine performance level based on resource usage 
Azure SQL Database service provides Web/Business database resource consumption in the sys.resource_stats view [(see MSDN documentation),](http://msdn.microsoft.com/library/azure/dn269979.aspx) in the master database of the logical server where your current database is located. It displays resource consumption data in percentages of the limit of the performance level. This view provides data for up to the last 14 days, at 5 minute intervals. Since Web/Business databases do not have any guaranteed DTUs/resource limits associated with them, we normalize the percentage values in terms of the amount of resources available to a database in S2 performance level. The average DTU percentage consumption of a database at any specific interval can be calculated as the highest percentage value among CPU, IO and Log usage at that interval. Run the following query on the master database to retrieve the average DTU consumption for a database:

 
                   
     SELECT start_time, end_time
	 ,(SELECT Max(v)
         FROM (VALUES (avg_cpu_percent)
                    , (avg_physical_data_read_percent)
                    , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.resource_stats
    WHERE database_name = '<your db name>'
    ORDER BY end_time DESC;

DTU consumption information in terms of an S2 database level allows you to normalize the current consumption of your Web/Business databases in terms of new tier databases and see where they fit better. For example, if your average DTU percentage consumption shows a value of 80%, it indicates that the database is consuming DTU at the rate of 80% of the limit of a database at S2 performance level. If you see values greater than 100% in the sys.resource_stats view, it means that you need a performance tier larger than S2. As an example, let’s say you see a peak DTU percentage value of 300%.  This tells you that you are using three times more resources than would be available in an S2.  To determine a reasonable starting size, compare the DTUs available in an S2 (50 DTUs) with the next higher sizes (P1 = 100 DTUs, or 200% of S2, P2 = 200 DTUs or 400% of S2). Because you are at 300% of S2 you would want to start with a P2 and re-test.

Based on the DTU usage percent and the largest edition that was required to fit your workload, you can determine which service tier and performance level is best suited for your database workload(as indicated through DTU percentage and relative DTU powers of various [performance levels).](http://msdn.microsoft.com/library/azure/dn741336.aspx) Here is a table that provides a mapping of the Web/Business resource consumption percentage to equivalent new tier performance levels: 

![resource consumption](http://i.imgur.com/nPodQZH.png)

> **Note**: Relative DTU numbers between various performance levels are based on the [Azure SQL Database Benchmark](http://msdn.microsoft.com/library/azure/dn741327.aspx) workload. Since your database’s workload is likely to be different from the benchmark, you should use the above calculations as the guideline for an initial fit for your Web/Business database in the new tiers. Once you have moved the database to the new tier, use the process outlined in the previous section to validate/fine tune the right service tier that fits your workload needs.
> 
> **Note**: While the suggested new edition tier/performance level takes into consideration your database activity over the last 14 days, this data is based on resource consumption data samples averaged over 5 minutes. As such it can miss short term bursts of activity that are shorter than 5 minutes in duration. So, this guidance should be used as a starting point to upgrade your database to. Once you upgrade the database to the suggested tier, more monitoring, testing and validations are needed and the database can be moved Up/down to a different tier/performance level as needed.

Here is a query on the master database that performs the calculation for your Web/Business tier database and suggests which edition is likely to fit your workload for each of these 5 minute data sample intervals.

> **Note:** This query is useful only for Web/Business databases and will **not** give correct results for databases in the new tiers.

    WITH DTU_mapping AS
    ( SELECT *
        FROM ( VALUES (1, 10,'Basic'), (2, 20,'S0'), (3, 40,'S1'), (4, 100, 'S2')
                    , (5, 200, 'P1'), (6, 400,'P2'), (7, 1600, 'P3')
           ) AS t(id, percent_of_S2, target_edition)
    ), rc as
    ( SELECT start_time, end_time
           , (SELECT Max(v)
                FROM (VALUES (avg_cpu_percent)
                       		, (avg_physical_data_read_percent)
                       		, (avg_log_write_percent)
                   ) AS value(v)) as [avg_DTU_percent]
        FROM sys.resource_stats	
       WHERE database_name = 'WebDB'
    )
    SELECT rc.*
         , (SELECT TOP(1) t.target_edition
              FROM DTU_mapping AS t
             WHERE t.percent_of_S2 > CAST(1.2*rc.avg_DTU_percent as int)
             ORDER BY t.percent_of_S2) as target_edition
    FROM rc;

**Sample result:**

![Sample Result](http://i.imgur.com/CTnjv26.png)

Graphed you can see the trend of average DTU percentage consumption over time. Here is an example graph for a database that is in within an S2 level most of the time, with some peak activity shooting up to a P1 database level.  DTU consumption over time varies from ‘Basic’ limits up to ‘P1’ limits. To fully fit this database in the new tier, you will need a Premium service tier database with ‘P1’ performance level. On the other hand, an S2 level database can work  if these occasional bursts to P1 level are rare.

![DTU Usage](http://i.imgur.com/e4N4ay5.png)

##3. Upgrade to the new service tier/performance level
After you determine your service tier/performance level for your Web/Business database, there are multiple ways to upgrade the database to the new tier:


- Azure Management Portal
- Azure PowerShell 
- [Service Management REST API](http://msdn.microsoft.com/en-us/library/azure/dn505719.aspx)
- Transact-SQL 

For ad-hoc migration of Web/Business databases, use the [Azure Management Portal](https://manage.windowsazure.com/). See the “Upgrade to a Higher Service Tier” section of the [Changing Database Service Tiers and Performance Levels](http://msdn.microsoft.com/en-us/library/azure/dn369872.aspx) article for steps to upgrade using the Azure Management Portal.

To perform the operation on multiple databases in a server/subscription or to automate the process, use PowerShell or Transact-SQL commands.

##Upgrade using Azure PowerShell
You can use the end-to-end sample to upgrade a Web/Business database using Azure PowerShell below. The steps to upgrade a database is as follows:

1. Set the server context with the **New-AzureSqlDatabaseServerContext** cmdlet 
2. Get the database to be upgraded with the **Get-AzureSqlDatabase** cmdlet
3. Get the desired performance level based on the  name (example: S1, S2, P1) using **Set-AzureSqlDatabase –ServiceObjective**
4. Use **Set-AzureSqlDatabase** to specify the new service tier and performance level for the database

A sample script to upgrade a server and database to the desired service tier/performance level is shown below:

    # Get the credential for the server. Provide login that is in dbmanager role of server
    $credential = Get-Credential
    # Provide server name in the cmdlet below:
    $serverContext = New-AzureSqlDatabaseServerContext -ServerName "<server_name>" -Credential $credential
    # Provide database name in the cmdlet below:
    $db = Get-AzureSqlDatabase $serverContext –DatabaseName "<database_name>"
    $service_tier = "<desired_service_tier>"
    $performance_level = Get-AzureSqlDatabaseServiceObjective $serverContext -ServiceObjectiveName "<desired_performance_level>"
    Set-AzureSqlDatabase $serverContext –Database $db –ServiceObjective $performance_level –Edition $service_tier


## Upgrade using Transact-SQL

To upgrade an existing Web/Business database using Transact-SQL you can use the 
[ALTER DATABASE statement](http://msdn.microsoft.com/library/azure/ms174269.aspx). The ALTER DATABASE command to upgrade a database to the new service tier/performance level is shown below:

    ALTER DATABASE <db_name> MODIFY (EDITION = '<service_tier>', SERVICE_OBJECTIVE = '<performance_level>');
      	 

##4.	Monitoring the upgrade of the new service tier/performance level
Azure SQL Database provides progress information on management operations (like CREATE, ALTER, DROP) performed on a database in the sys.dm_operation_status dynamic management view in the master database of the logical server where your current database is located [see sys.dm _operation _status documentation.](http://msdn.microsoft.com/library/azure/dn270022.aspx) Use the operation status DMV to determine progress of the upgrade operation for a database. This sample query shows all of the management operations performed on a database:

    SELECT o.operation, o.state_desc, o.percent_complete
    , o.error_code, o.error_desc, o.error_severity, o.error_state
    , o.start_time, o.last_modify_time
    FROM sys.dm_operation_status AS o
    WHERE o.resource_type_desc = 'DATABASE'
    and o.major_resource_id = '<database_name>'
    ORDER BY o.last_modify_time DESC;

If you used the management portal for the upgrade, a notification is also available from within the portal for the operation.

## Impact of the upgrade
Upgrading Web/Business databases to the new service tier/performance levels is an online operation. Your database will continue to work through the upgrade operation. At the time of the actual transition to the new performance level temporary dropping of the connections to the database can happen for very small duration (in seconds). If an application has transient fault handling for connection terminations then it is sufficient to protect against dropped connections at the end of the upgrade. For best practices on handling connection terminations, refer to [Azure SQL Database Best Practices to Prevent Request Denials or Connection Termination.](http://msdn.microsoft.com/library/azure/dn338082.aspx)

For more details on how to estimate the latency of the upgrade operation, see “Understanding and Estimating Latency in Database Changes” section of [Changing Database Service Tiers and Performance Levels.](http://msdn.microsoft.com/library/azure/dn369872.aspx)

##What happens when database workload reaches the resource limits after upgrade?
Performance levels are calibrated and governed to provide the needed resources to run your database workload up to the max limits allowed for your selected service tier/performance level (i.e. resource consumption is at 100%). If your workload is hitting the limits in one of CPU/Data IO/Log IO limits, you will continue to receive the resources at the maximum allowed level, but you are likely to see increased latencies for your queries. Hitting one of these limits will not result in any errors, but just a slowdown in your workload, unless the slowdown becomes so severe that queries start timing out. If you are hitting limits of maximum allowed concurrent user sessions/requests (worker threads), you will see explicit errors (Refer to the MSDN documentation) for any further connections/requests.

##Monitoring the database post-upgrade
After upgrade of the Web/Business database into the new tier, it is recommended to monitor the database actively to ensure applications are running at the desired performance and optimize usage as needed. The following additional steps are recommended for monitoring the database.


**Resource consumption data:** For Basic, Standard, and Premium databases more granular resource consumption data is available through a new DMV called [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) in the user database. This DMV provides near real time resource consumption information at 15 second granularity for the previous hour of operation. The DTU percentage consumption for an interval is computed as the maximum percentage consumption of the CPU, IO & log dimensions. Here is a query to compute the average DTU percentage consumption over the last hour:

    SELECT end_time
    	 , (SELECT Max(v)
             FROM (VALUES (avg_cpu_percent)
                         , (avg_data_io_percent)
                         , (avg_log_write_percent)
    	   ) AS value(v)) AS [avg_DTU_percent]
    FROM sys.dm_db_resource_stats
    ORDER BY end_time DESC;

 
Additional [documentation](http://msdn.microsoft.com/en-us/library/dn800981.aspx) contains details of how to use this DMV.  [Azure SQL Database Performance Guidance](http://msdn.microsoft.com/en-us/library/azure/dn369873.aspx) covers how to monitor and tune your application.

**Memory impact on performance:** Although memory is one of the resource dimensions that contributes to the DTU rating, SQL Database is designed to use all available memory for database operations. For this reason memory consumption is not included in the average DTU consumption in the above query. On the other hand, if you are downsizing to a lower performance level, then available memory for the database is reduced. This can result in higher IO consumption affecting DTU consumed. So, when downsizing to a lower performance level, make sure that you have enough headroom in the IO percentage. Use [sys.dm_ db_ resource_stats](http://msdn.microsoft.com/library/azure/dn800981.aspx) DMV mentioned above to monitor this.



- **Alerts:** Set up 'Alerts' in the Azure Management Portal to notify you when the DTU consumption for an upgraded database approaches certain high level. Database alerts can be setup in the Azure Management Portal for various performance metrics like DTU, CPU, IO, and Log. 

	For example, you can set up an email alert on “DTU Percentage” if the average DTU percentage value exceeds 75% over the last 5 minutes. Refer to [How to: Receive Alert Notifications and Manage Alert Rules in Azure](http://msdn.microsoft.com/en-us/library/azure/dn306638.aspx) to learn more about how to configure alert notifications.


- **Scheduled performance level upgrade/downgrade:** If your application has specific scenarios that require more performance only at certain times of the day/week, you can use [Azure Automation](http://msdn.microsoft.com/library/azure/dn643629.aspx) to upsize/downsize your database to a higher/lower performance level as a planned operation.

	For example, upgrade the database to a higher performance level for the duration of a weekly batch/maintenance job and downsize it after the job completes. This kind of scheduling is also useful for any large resource-intensive operations like data loading, index rebuilding etc.  Note that the Azure SQL Database billing model is based on hourly usage of a service tier/performance level. This flexibility allows you to plan for scheduled or planned upgrades more cost efficiently.

##Summary
Azure SQL Database service provides telemetry data and tools to evaluate your Web/Business database workloads and determine the best service tier fit for upgrade. The upgrade process is quite simple and can be done without taking the database offline and with no data loss. Upgraded databases benefit from the predictable performance and additional features provided by the new service tiers.
