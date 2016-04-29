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
    ms.date="04/28/2016"
    ms.author="sidneyh"/>

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


## Move a database into an elastic pool

You can move a database into or out of a pool with the [Set-AzureRmSqlDatabase](https://msdn.microsoft.com/library/azure/mt619433.aspx). 

	Set-AzureRmSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

## Change performance settings of a pool

When performance suffers, you can change the settings of the pool to accommodate growth. Use the [Set-AzureRmSqlElasticPool](https://msdn.microsoft.com/library/azure/mt603511.aspx) cmdlet. Set the -Dtu parameter to the eDTUs per pool. See [eDTU and storage limits](sql-database-elastic-pool#eDTU-and-storage-limits-for-elastic-pools-and-elastic-databases) for possible values.  

    Set-AzureRmSqlElasticPool –ResourceGroupName “resourcegroup1” –ServerName “server1” –ElasticPoolName “elasticpool1” –Dtu 1200 –DatabaseDtuMax 100 –DatabaseDtuMin 50 


## Get the status of pool operations

Creating a pool can take time. To track the status of pool operations including creation and updates, use the [Get-AzureRmSqlElasticPoolActivity](https://msdn.microsoft.com/library/azure/mt603812.aspx) cmdlet.

	Get-AzureRmSqlElasticPoolActivity –ResourceGroupName “resourcegroup1” –ServerName “server1” –ElasticPoolName “elasticpool1” 


## Get the status of moving an elastic database into and out of a pool

Moving a database can take time. Track a move status using the [Get-AzureRmSqlDatabaseActivity](https://msdn.microsoft.com/library/azure/mt603687.aspx) cmdlet.

	Get-AzureRmSqlDatabaseActivity -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

## Get usage data for a pool

Metrics that can be retrieved as a percentage of the resource pool limit:   


| Metric name | Description |
| :-- | :-- |
| cpu\_percent | Average compute utilization in percentage of the limit of the pool. |
| physical\_data\_read\_percent | Average I/O utilization in percentage based on the limit of the pool. |
| log\_write\_percent | Average write resource utilization in percentage of the limit of the pool. | 
| DTU\_consumption\_percent | Average eDTU utilization in percentage of eDTU limit for the pool | 
| storage\_percent | Average storage utilization in percentage of the storage limit of the pool. |  
| workers\_percent | Maximum concurrent workers (requests) in percentage based on the limit of the pool. |  
| sessions\_percent | Maximum concurrent sessions in percentage based on the limit of the pool. | 
| eDTU_limit | Current max elastic pool DTU setting for this elastic pool during this interval. |
| storage\_limit | Current max elastic pool storage limit setting for this elastic pool in megabytes during this interval. |
| eDTU\_used | Average eDTUs used by the pool in this interval. |
| storage\_used | Average storage used by the pool in this interval in bytes |

**Metrics granularity/retention periods:**

* Data will be returned at 5 minute granularity.  
* Data retention is 14 days.  

This cmdlet and API limits the number of rows that can be retrieved in one call to 1000 rows (about 3 days of data at 5 minute granularity). But this command can be called multiple times with different start/end time intervals to retrieve more data 

To retrieve the metrics:

	$metrics = (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015")  


## Get resource usage data for an elastic database

These APIs are the same as the current (V12) APIs used for monitoring the resource utilization of a standalone database, except for the following semantic difference. 

For this API, metrics retrieved are expressed as a percentage of the per max eDTUs (or equivalent cap for the underlying metric like CPU, IO etc) set for that pool. For example, 50% utilization of any of these metrics indicates that the specific resource consumption is at 50% of the per database cap limit for that resource in the parent pool. 

To retrieve the metrics:

    $metrics = (Get-AzureRmMetric -ResourceId /subscriptions/<subscriptionId>/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 

## Example: retrieve resource consumption metrics for a pool and its databases

This example retrieves the consumption metrics for a given elastic pool and all its databases. Collected data is formatted and written to a .csv formatted file. The file can be browsed with Excel.

	$subscriptionId = '<Azure subscription id>'	      # Azure subscription ID
	$resourceGroupName = '<resource group name>'             # Resource Group
	$serverName = <server name>                              # server name
	$poolName = <elastic pool name>                          # pool name
		
	# Login to Azure account and select the subscription.
	Login-AzureRmAccount
	Set-AzureRmContext -SubscriptionId $subscriptionId
	
	# Get resource usage metrics for an elastic pool for the specified time interval.
	$startTime = '4/27/2016 00:00:00'  # start time in UTC
	$endTime = '4/27/2016 01:00:00'    # end time in UTC
	
	# Construct the pool resource ID and retrive pool metrics at 5 minute granularity.
	$poolResourceId = '/subscriptions/' + $subscriptionId + '/resourceGroups/' + $resourceGroupName + '/providers/Microsoft.Sql/servers/' + $serverName + '/elasticPools/' + $poolName
	$poolMetrics = (Get-AzureRmMetric -ResourceId $poolResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime -EndTime $endTime) 
	
	# Get the list of databases in this pool.
	$dbList = Get-AzureRmSqlElasticPoolDatabase -ResourceGroupName $resourceGroupName -ServerName $serverName -ElasticPoolName $poolName
	
	# Get resource usage metrics for a database in an elastic database for the specified time interval.
	$dbMetrics = @()
	foreach ($db in $dbList)
	{
	    $dbResourceId = '/subscriptions/' + $subscriptionId + '/resourceGroups/' + $resourceGroupName + '/providers/Microsoft.Sql/servers/' + $serverName + '/databases/' + $db.DatabaseName
	    $dbMetrics = $dbMetrics + (Get-AzureRmMetric -ResourceId $dbResourceId -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime $startTime -EndTime $endTime)
	}
	
	#Optionally you can format the metrics and output as .csv file using the following script block.
	$command = {
    param($metricList, $outputFile)

    # Format metrics into a table.
    $table = @()
    foreach($metric in $metricList) { 
      foreach($metricValue in $metric.MetricValues) {
        $sx = New-Object PSObject -Property @{
            Timestamp = $metricValue.Timestamp.ToString()
            MetricName = $metric.Name; 
            Average = $metricValue.Average;
            ResourceID = $metric.ResourceId 
          }
          $table = $table += $sx
      }
    }
    
    # Output the metrics into a .csv file.
    write-output $table | Export-csv -Path $outputFile -Append -NoTypeInformation
	}
	
	# Format and output pool metrics
	Invoke-Command -ScriptBlock $command -ArgumentList $poolMetrics,c:\temp\poolmetrics.csv
	
	# Format and output database metrics
	Invoke-Command -ScriptBlock $command -ArgumentList $dbMetrics,c:\temp\dbmetrics.csv



## Latency of elastic pool operations

- Changing the min eDTUs per database or max eDTUs per database typically completes in 5 minutes or less.
- Changing the eDTUs per pool depends on the total amount of space used by all databases in the pool. Changes average 90 minutes or less per 100 GB. For example, if the total space used by all databases in the pool is 200 GB, then the expected latency for changing the pool eDTU per pool is 3 hours or less.

## Migrate from V11 to V12 servers

PowerShell cmdlets are available to start, stop, or monitor an upgrade to Azure SQL Database V12 from V11 or any other pre-V12 version.

- [Upgrade to SQL Database V12 using PowerShell](sql-database-upgrade-server-powershell.md)

For reference documentation about these PowerShell cmdlets, see:


- [Get-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603582.aspx)
- [Start-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt619403.aspx)
- [Stop-AzureRMSqlServerUpgrade](https://msdn.microsoft.com/library/azure/mt603589.aspx)


The Stop- cmdlet means cancel, not pause. There is no way to resume an upgrade, other than starting again from the beginning. The Stop- cmdlet cleans up and releases all appropriate resources.

## Next steps

- [Create elastic jobs](sql-database-elastic-jobs-overview.md) Elastic jobs let you run T-SQL scripts against any number of databases in the pool.
- See [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md): use elastic database tools to scale-out, move data, query, or create transactions.