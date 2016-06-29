<properties
	pageTitle="Powershell script to identify single databases suitable for a pool"
	description="An elastic database pool is a collection of available resources that are shared by a group of elastic databases. This document provides a Powershell script to help assess the suitability of using an elastic database pool for a group of databases."
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.devlang="NA"
	ms.date="06/06/2016"
	ms.author="sstein"
	ms.workload="data-management"
	ms.topic="article"
	ms.tgt_pltfrm="NA"/>

# PowerShell script for identifying databases suitable for an elastic database pool

The sample PowerShell script in this article estimates the aggregate eDTU values for user databases in a SQL Database server. The script collects data while it runs, and for a typical production workload, you should run the script for at least a day. Ideally, you want to run the script for a duration that represents your databases' typical workload--that is, long enough to capture data that represents normal and peak utilization for the databases. Running the script a week or even longer will likely give a more accurate estimate.

This script is particularly useful for evaluating databases on v11 servers, where pools are not supported, for migration to v12 servers, where pools are supported. On v12 servers, SQL Database has built-in intelligence that will analyze historical usage telemetry and recommend a pool when it will be more cost-effective. For information about how to use this feature, see [Monitor, manage, and size an elastic database pool](sql-database-elastic-pool-manage-portal.md)

> [AZURE.IMPORTANT] You must keep the PowerShell window open while running the script. Do not close the PowerShell window until you have run the script for the amount of time required. 

## Prerequisites 

Install the following prior to running the script.:

- The latest [Powershell command-line tools](http://go.microsoft.com/?linkid=9811175&clcid=0x409).
- The [SQL Server 2014 feature pack](https://www.microsoft.com/download/details.aspx?id=42295).

### Script details

You can run the script from your local machine or a VM on the cloud. When running it from your local machine, you may incur data egress charges because the script needs to download data from your target databases. Below shows data volume estimation based on number of target databases and duration of running the script. For Azure data transfer costs refer to [Data Transfer Pricing Details](https://azure.microsoft.com/pricing/details/data-transfers/).
       
 -     1 database per hour = 38KB
 -     1 database per day = 900KB
 -     1 database per week = 6MB
 -     100 databases per day = 90MB
 -     500 databases per week = 3GB

The script excludes databases that aren't good candidates for the current public preview offering of the Standard tier.If you need to exclude additional databases from the target server, change the script to meet your criteria. By default, the script does not compile information for the following:

* Elastic databases (databases already in an elastic pool)
* The server's master database

The script needs an output database to store intermediate data for analysis. You can use a new or existing database. Although not technically required for the tool to run, the output database should be in a different server to avoid impacting the analysis outcome. The performance level of the output database should be at least S0 or higher. When collecting data for a large number of databases over a long period of time, you might consider upgrading your output database to a higher performance level.

The script needs you to provide the credentials to connect to the target server (the elastic database pool candidate) with a full server name, <*dbname*>**.database.windows.net**. The script doesn’t support analyzing more than one server at a time.

After submitting values for the initial set of parameters, you are prompted to log on to your azure account. This is for logging on to your target server, not the output database server.
	
If you run into the following warnings while running the script you can ignore them:

- WARNING: The Switch-AzureMode cmdlet is deprecated.
- WARNING: Could not obtain SQL Server Service information. An attempt to connect to WMI on 'Microsoft.Azure.Commands.Sql.dll' failed with the following error: The RPC server is unavailable.

When the script completes, it outputs the estimated number of eDTUs needed for a pool to contain all candidate databases in the target server. This estimated eDTU can be used for creating and configuring the pool. Once the pool is created and databases moved into the pool, monitor the pool closely for a few days and make any adjustments to the pool eDTU configuration as necessary. See [Monitor, manage, and size an elastic database pool](sql-database-elastic-pool-manage-portal.md).


   [AZURE.INCLUDE [learn-about-deployment-models-classic-include](../../includes/learn-about-deployment-models-classic-include.md)]
    
    param (
	[Parameter(Mandatory=$true)][string]$AzureSubscriptionName, # Azure Subscription name - can be found on the Azure portal: https://portal.azure.com/
	[Parameter(Mandatory=$true)][string]$ResourceGroupName, # Resource Group name - can be found on the Azure portal: https://portal.azure.com/
	[Parameter(Mandatory=$true)][string]$servername, # full server name like "abcdefg.database.windows.net"
	[Parameter(Mandatory=$true)][string]$username, # user name
	[Parameter(Mandatory=$true)][string]$serverPassword, # password
	[Parameter(Mandatory=$true)][string]$outputServerName, # metrics collection database for analysis. full server name like "zyxwvu.database.windows.net"
	[Parameter(Mandatory=$true)][string]$outputdatabaseName,
	[Parameter(Mandatory=$true)][string]$outputDBUsername,
	[Parameter(Mandatory=$true)][string]$outputDBpassword,
	[Parameter(Mandatory=$true)][int]$duration_minutes # How long to run. Recommend to run for the period of time when your typical workload is running. At least 10 mins.
	)
	
	Login-AzureRmAccount
	Select-AzureSubscription $AzureSubscriptionName
	
	$server = Get-AzureRmSqlServer -ServerName $servername.Split('.')[0] -ResourceGroupName $ResourceGroupName
	
	# Check version/upgrade status of the server
	$upgradestatus = Get-AzureRmSqlServerUpgrade -ServerName $servername.Split('.')[0] -ResourceGroupName $ResourceGroupName
	$version = ""
	if ([string]::IsNullOrWhiteSpace($server.ServerVersion)) 
	{
	$version = $upgradestatus.Status
	}
	else
	{
	$version = $server.ServerVersion
	}
	
	# For Elastic database pool candidates, we exclude master, and any databases that are already in a pool. You may add more databases to the excluded list below as needed
	$ListOfDBs = Get-AzureRmSqlDatabase -ServerName $servername.Split('.')[0] -ResourceGroupName $ResourceGroupName | Where-Object {$_.DatabaseName -notin ("master") -and $_.CurrentServiceLevelObjectiveName -notin ("ElasticPool") -and $_.CurrentServiceObjectiveName -notin ("ElasticPool")}
	
	$outputConnectionString = "Data Source=$outputServerName;Integrated Security=false;Initial Catalog=$outputdatabaseName;User Id=$outputDBUsername;Password=$outputDBpassword"
	$destinationTableName = "resource_stats_output"
	
	# Create a table in output database for metrics collection
	$sql = "
	IF  NOT EXISTS (SELECT * FROM sys.objects 
	WHERE object_id = OBJECT_ID(N'$($destinationTableName)') AND type in (N'U'))
	
	BEGIN
	Create Table $($destinationTableName) (database_name varchar(128), slo varchar(20), end_time datetime, avg_cpu float, avg_io float, avg_log float, db_size float);
	Create Clustered Index ci_endtime ON $($destinationTableName) (end_time);
	END
	TRUNCATE TABLE $($destinationTableName);
	"
	Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $sql -ConnectionTimeout 120 -QueryTimeout 120 
	
	# waittime (minutes) is interval between data collection queries in the loop below.
	$Waittime = 10
	$end_Time = [DateTime]::UtcNow
	$start_time = $end_time.AddMinutes(-$Waittime)
	$finish_time = $end_Time.AddMinutes($duration_minutes)
	
	While ($end_time -lt $finish_time)
	{
	Write-Host "Collecting metrics..." 
	foreach ($db in $ListOfDBs)
	{
	if ($version -in ("12.0", "Completed")) # for V12 databases 
	{
	$sql = "Declare @dbname varchar(128) = '$($db.DatabaseName)';"
	$sql += "Declare @SLO varchar(20) = '$($db.CurrentServiceObjectiveName)';"
	$sql+= "
	Declare @DTU_cap int, @db_size float;
	Select @DTU_cap = CASE @SLO 
	WHEN 'Basic' THEN 5
	WHEN 'S0' THEN 10
	WHEN 'S1' THEN 20
	WHEN 'S2' THEN 50
	WHEN 'S3' THEN 100
	WHEN 'P1' THEN 125
	WHEN 'P2' THEN 250
	WHEN 'P3' THEN 1000
	ELSE 50 -- assume Web/Business DBs
	END
	SELECT @db_size = SUM(reserved_page_count) * 8.0/1024/1024 FROM sys.dm_db_partition_stats
	SELECT @dbname as database_name, @SLO as SLO, dateadd(second, round(datediff(second, '2015-01-01', end_time) / 15.0, 0) * 15,'2015-01-01')
	as end_time, avg_cpu_percent * (@DTU_cap/100.0) AS avg_cpu, avg_data_io_percent * (@DTU_cap/100.0) AS avg_io, avg_log_write_percent * (@DTU_cap/100.0) AS avg_log, @db_size as db_size FROM sys.dm_db_resource_stats
	WHERE end_time > '$($start_time)' and end_time <= '$($end_time)';
	" 
	}
	else
	{
	$sql = "Declare @dbname varchar(128) = '$($db.DatabaseName)';"
	$sql += "Declare @SLO varchar(20) = '$($db.CurrentServiceObjectiveName)';"
	$sql+= "
	Declare @DTU_cap int, @db_size float;
	Select @DTU_cap = CASE @SLO 
	WHEN 'Basic' THEN 5
	WHEN 'S0' THEN 10
	WHEN 'S1' THEN 20
	WHEN 'S2' THEN 50
	WHEN 'P1' THEN 100
	WHEN 'P2' THEN 200
	WHEN 'P3' THEN 800
	ELSE 50 -- assume Web/Business DBs
	END
	SELECT @db_size = SUM(reserved_page_count) * 8.0/1024/1024 from sys.dm_db_partition_stats
	SELECT @dbname as database_name, @SLO as SLO, dateadd(second, round(datediff(second, '2015-01-01', end_time) / 15.0, 0) * 15,'2015-01-01')
	as end_time, avg_cpu_percent * (@DTU_cap/100.0) AS avg_cpu, avg_data_io_percent * (@DTU_cap/100.0) AS avg_io, avg_log_write_percent * (@DTU_cap/100.0) AS avg_log, @db_size as db_size FROM sys.dm_db_resource_stats
	WHERE end_time > '$($start_time)' and end_time <= '$($end_time)';
	" 
	}
	
	$result = Invoke-Sqlcmd -ServerInstance $servername -Database $db.DatabaseName -Username $username -Password $serverPassword -Query $sql -ConnectionTimeout 120 -QueryTimeout 3600 
	#bulk copy the metrics to output database
	$bulkCopy = new-object ("Data.SqlClient.SqlBulkCopy") $outputConnectionString 
	$bulkCopy.BulkCopyTimeout = 600
	$bulkCopy.DestinationTableName = "$destinationTableName";
	$bulkCopy.WriteToServer($result);
	
	}
	
	$start_time = $start_time.AddMinutes($Waittime)
	$end_time = $end_time.AddMinutes($Waittime)
	Write-Host $start_time
	Write-Host $end_time
	do {
	Start-Sleep 1
	   }
	until (([DateTime]::UtcNow) -ge $end_time)
	}
	
	Write-Host "Analyzing the collected metrics...."
	# Analysis query that does aggregation of the resource metrics to calculate pool size.
	$sql1 = 'Declare @DTU_Perf_99 as float, @DTU_Storage as float;
	WITH group_stats AS
	(
	SELECT end_time, SUM(db_size) AS avg_group_Storage, SUM(avg_cpu) AS avg_group_cpu, SUM(avg_io) AS avg_group_io,SUM(avg_log) AS avg_group_log
	FROM resource_stats_output 
	WHERE slo LIKE '
	
	$sql2 = '
	GROUP BY end_time
	)
	-- calculate aggregate storage and DTUs for all DBs in the group
	, group_DTU AS
	(
	SELECT end_time, avg_group_Storage, 
	(SELECT Max(v)
	   FROM (VALUES (avg_group_cpu), (avg_group_log), (avg_group_io)) AS value(v)) AS avg_group_DTU
	FROM group_stats
	)
	-- Get top 1 percent of the storage and DTU utilization samples.
	, top1_percent AS (
	SELECT TOP 1 PERCENT avg_group_Storage, avg_group_dtu FROM group_dtu ORDER BY [avg_group_DTU] DESC
	)
	
	-- Max and 99th percentile DTU for the given list of databases if converted into an elastic pool. Storage is increased by factor of 1.25 to accommodate for future growth. Currently storage limit of the pool is determined by the amount of DTUs based on 1GB/DTU.
	--SELECT MAX(avg_group_Storage)*1.25/1024.0 AS Group_Storage_DTU, MAX(avg_group_dtu) AS Group_Performance_DTU, MIN(avg_group_dtu) AS Group_Performance_DTU_99th_percentile FROM top1_percent;
	SELECT @DTU_Storage = MAX(avg_group_Storage)*1.25/1024.0, @DTU_Perf_99 = MIN(avg_group_dtu) FROM top1_percent;
	IF @DTU_Storage > @DTU_Perf_99 
	SELECT ''Total number of DTUs dominated by storage: '' + convert(varchar(100), @DTU_Storage)
	ELSE 
	SELECT ''Total number of DTUs dominated by resource consumption: '' + convert(varchar(100), @DTU_Perf_99)'
	
	#check if there are any web/biz edition dbs in the collected metrics
	$checkslo = "SELECT TOP 1 slo FROM resource_stats_output WHERE slo LIKE 'shared%'"
	$output = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $checkslo -QueryTimeout 3600 | select -expand slo
	if ($output -like "Shared*")
	{
	write-host "`nWeb/Business edition:" -BackgroundColor Green -ForegroundColor Black
	$sql = $sql1 + "'Shared%'"  + $sql2
	$data = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $sql -QueryTimeout 3600
	$data | %{'{0}' -f $_[0]}
	}
	
	#check if there are any basic edition dbs in the collected metrics
	$checkslo = "SELECT TOP 1 slo FROM resource_stats_output WHERE slo LIKE 'Basic%'"
	$output = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $checkslo -QueryTimeout 3600 | select -expand slo
	if ($output -like "Basic*")
	{
	write-host "`nBasic edition:" -BackgroundColor Green -ForegroundColor Black
	$sql = $sql1 + "'Basic%'"  + $sql2
	$data = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $sql -QueryTimeout 3600
	$data | %{'{0}' -f $_[0]} 
	}
	
	#check if there are any standard edition dbs in the collected metrics
	$checkslo = "SELECT TOP 1 slo FROM resource_stats_output WHERE slo LIKE 'S%' AND slo NOT LIKE 'Shared%'"
	$output = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $checkslo -QueryTimeout 3600 | select -expand slo
	if ($output -like "S*")
	{
	write-host "`nStandard edition:" -BackgroundColor Green -ForegroundColor Black
	$sql = $sql1 + "'S%' AND slo NOT LIKE 'Shared%'"  + $sql2
	$data = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $sql -QueryTimeout 3600
	$data | %{'{0}' -f $_[0]}
	}
	
	#check if there are any premium edition dbs in the collected metrics
	$checkslo = "SELECT TOP 1 slo FROM resource_stats_output WHERE slo LIKE 'P%'"
	$output = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $checkslo -QueryTimeout 3600 | select -expand slo
	if ($output -like "P*")
	{
	write-host "`nPremium edition:" -BackgroundColor Green -ForegroundColor Black
	$sql = $sql1 + "'P%'"  + $sql2
	$data = Invoke-Sqlcmd -ServerInstance $outputServerName -Database $outputdatabaseName -Username $outputDBUsername -Password $outputDBpassword -Query $sql -QueryTimeout 3600
	$data | %{'{0}' -f $_[0]}
}

        

