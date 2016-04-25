<properties 
    pageTitle="Manage an elastic database pool (PowerShell) | Microsoft Azure" 
    description="Learn how to use PowerShell to manage an elastic database pool."  
	services="sql-database" 
    documentationCenter="" 
    authors="stevestein" 
    manager="jhubbard" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="powershell"
    ms.workload="data-management" 
    ms.date="04/25/2016"
    ms.author="sstein"/>

# Monitor and manage an elastic database pool with PowerShell 

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-manage-portal.md)
- [PowerShell](sql-database-elastic-pool-manage-powershell.md)
- [C#](sql-database-elastic-pool-manage-csharp.md)
- [T-SQL](sql-database-elastic-pool-manage-tsql.md)

Manage an [elastic database pool](sql-database-elastic-pool.md) using PowerShell cmdlets. 

For common error codes, see [SQL error codes for SQL Database client applications: Database connection error and other issues](sql-database-develop-error-messages.md).

Values for pools can be found in [eDTU and storage limits](sql-database-elastic-pool#eDTU-and-storage-limits-for-elastic-pools-and-elastic-databases). 

## Prerequisites
* Azure PowerShell 1.0 or higher. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).
* Elastic database pools are only available with SQL Database V12 servers. If you have a SQL Database V11 server, [use PowerShell to upgrade to V12 and create a pool](sql-database-upgrade-server-portal.md) in one step.

## Create a new database in an elastic pool

Create a new database directly inside a pool with the [New-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619339.aspx). 


	New-AzureRmSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"


## Move a database into an elastic pool

Move an existing database into a pool with the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433.aspx) cmdlet and set the **ElasticPoolName** parameter. 

	Set-AzureRmSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

## Change performance settings of a pool

Use the [Set-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt603511.aspx) cmdlet. Set the -Dtu parameter to the eDTUs per pool. See [eDTU and storage limits](sql-database-elastic-pool#eDTU-and-storage-limits-for-elastic-pools-and-elastic-databases) for possible values.  

    Set-AzureRmSqlElasticPool –ResourceGroupName “resourcegroup1” –ServerName “server1” –ElasticPoolName “elasticpool1” –Dtu 1200 –DatabaseDtuMax 100 –DatabaseDtuMin 50 


## Get the status of pool operations

Track the status of pool operations including creation and updates using the [Get-AzureRmSqlElasticPoolActivity](https://msdn.microsoft.com/library/azure/mt603812.aspx) cmdlet.

	Get-AzureRmSqlElasticPoolActivity –ResourceGroupName “resourcegroup1” –ServerName “server1” –ElasticPoolName “elasticpool1” 


## Get the status of moving an elastic database into and out of a pool

Track the status of a database move into or out of a pool using the [Get-AzureRmSqlDatabaseActivity](https://msdn.microsoft.com/library/azure/mt603687.aspx) cmdlet.

	Get-AzureRmSqlDatabaseActivity -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

## Get usage data for a pool

Metrics that can be retrieved as a percentage of the resource pool limit:   


| Metric name | Description |
| :-- | :-- |
| cpu\_percent | Average CPU utilization |
| data\_io\_percent | Average IO utilization | 
| log\_write\_percent | Average Log utilization | 
| memory\_percent | Average Memory utilization | 
| DTU\_percent | Average eDTU utilization (as a max value of CPU/IO/Log utilization) |  
| max\_concurrent\_requests | Maximum number of concurrent user requests (workers) |  
| max\_concurrent\_sessions | Maximum number of concurrent user sessions | 
| storage\_in\_megabytes | Total storage size for the elastic pool | 

**Metrics granularity/retention periods:**

* Data will be returned at 5 minute granularity.  
* Data retention is 14 days.  


This cmdlet and API limits the number of rows that can be retrieved in one call to 1000 rows (about 3 days of data at 5 minute granularity). But this command can be called multiple times with different start/end time intervals to retrieve more data 


Retrieve the metrics:

	$metrics = (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 

Get additional days by repeating the call and appending the data:

	$metrics = $metrics + (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015") 


## Get resource consumption metrics for an elastic database

These APIs are the same as the current (V12) APIs used for monitoring the resource utilization of a standalone database, except for the following semantic difference 

* For this API metrics retrieved are expressed as a percentage of the per databaseDtuMax (or equivalent cap for the underlying metric like CPU, IO etc) set for that pool. For example, 50% utilization of any of these metrics indicates that the specific resource consumption is at 50% of the per DB cap limit for that resource in the parent pool. 

Get the metrics:

    $metrics = (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 

Get additional days if needed by repeating the call and appending the data:

    $metrics = $metrics + (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015") 

## Latency of elastic pool operations

- Changing the min eDTUs per database or max eDTUs per database typically completes in 5 minutes or less.
- Changing the eDTUs per pool of the pool depends on the total amount of space used by all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.

## Migrate from V11 to V12 servers

PowerShell cmdlets are available to start, stop, or monitor an upgrade to Azure SQL Database V12 from V11 or any other pre-V12 version.

- [Upgrade to SQL Database V12 using PowerShell](sql-database-upgrade-server-powershell.md)

For reference documentation about these PowerShell cmdlets, see:


- [Get-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603582.aspx)
- [Start-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt619403.aspx)
- [Stop-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603589.aspx)


The Stop- cmdlet means cancel, not pause. There is no way to resume an upgrade, other than starting again from the beginning. The Stop- cmdlet cleans up and releases all appropriate resources.

## Monitor and manage a pool PowerShell example


    $subscriptionId = '<Azure subscription id>'
    $resourceGroupName = '<resource group name>'
    $location = '<datacenter location>'
    $serverName = '<server name>'
    $poolName = '<pool name>'
    $databaseName = '<database name>'
    
    Login-AzureRmAccount
    Set-AzureRmContext -SubscriptionId $subscriptionId
    
    
    Set-AzureRmSqlElasticPool –ResourceGroupName $resourceGroupName –ServerName $serverName –ElasticPoolName $poolName –Dtu 1200 –DatabaseDtuMax 100 –DatabaseDtuMin 50 
    
    $poolResourceId = '/subscriptions/' + $subscriptionId + '/resourceGroups/' + $resourceGroupName + '/providers/Microsoft.Sql/servers/' + $serverName + '/elasticPools/' + $poolName
    $dbResourceId = '/subscriptions/' + $subscriptionId + '/resourceGroups/' + $resourceGroupName + '/providers/Microsoft.Sql/servers/' + $serverName + '/databases/' + $databaseName 
    $startTime1 = '2/10/2016'
    $endTime1 = '2/14/2016'
    $startTime2 = '2/14/2016'
    $endTime2 = '2/18/2016'
    
    $metrics = (Get-AzureRmMetric -ResourceId $poolResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime1 -EndTime $endTime1) 
    $metrics
    
    $metrics = $metrics + (Get-AzureRmMetric -ResourceId $poolResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime2 -EndTime $endTime2)
        
    $metrics = (Get-AzureRmMetric -ResourceId $dbResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime1 -EndTime $endTime1) 
    
	$metrics = $metrics + (Get-AzureRmMetric -ResourceId $dbResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime2 -EndTime $endTime2)
    

## Next steps

- [Create elastic jobs](sql-database-elastic-jobs-overview.md) Elastic jobs let you run T-SQL scripts against any number of databases in the pool.
