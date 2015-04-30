<properties 
   pageTitle="Create and manage a SQL Database elastic database pool using PowerShell" 
   description="Create and manage an Azure SQL Database elastic database pool using PowerShell" 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jeffreyg" 
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="data-management" 
   ms.date="04/29/2015"
   ms.author="adamkr; sstein"/>

# Create and manage a SQL Database elastic pool with PowerShell (preview)

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-pool-portal.md)
- [PowerShell](sql-database-elastic-pool-powershell.md)


## Overview

This article shows you how to create and manage a SQL Database elastic pool using PowerShell.


The individual steps to create an elastic pool with Azure PowerShell are broken out and explained for clarity. For those who simply want a concise list of commands, see the **Putting it all together** section at the bottom of this article.

This article will show you how to create everything you need to create and configure an elastic pool, except for the Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.

> [AZURE.NOTE] Elastic pools are currently in preview, and only available with SQL Database V12  Servers.


## Prerequisites

To create an elastic pool with PowerShell, you need to have Azure PowerShell installed and running, and switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets. 

You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

The cmdlets for creating and managing Azure SQL Databases and elastic pools are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	PS C:\>Switch-AzureMode -Name AzureResourceManager

For detailed information, see [Using Windows PowerShell with Resource Manager](powershell-azure-resource-manager.md).


## Configure your credentials and select your subscription

Now that you are running the Azure resource manager module you have access to all the necessary cmdlets to create and configure an elastic pool. First you must establish access to your Azure account. Run the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	PS C:\>Add-AzureAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.


### Select your Azure subscription

To select the subscription you need your subscription Id or subscription name (**-SubscriptionName**). You can copy it from the previous step, or if you have multiple subscriptions you can run the **Get-Subscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	PS C:\>Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000


## Create a resource group, server, and firewall rule

Now you have access to run cmdlets against your Azure subscription so the next step is establishing the resource group that contains the server where the elastic pool will be created. You can edit the next command to use whatever valid location you choose. Run **(Get-AzureLocation | where-object {$_.Name -eq "Microsoft.Sql/servers" }).Locations** to get a list of valid locations.

If you already have a resource group you can go to the next step, or you can run the following command to create a new resource group:

	PS C:\>New-AzureResourceGroup -Name "resourcegroup1" -Location "West US"

### Create a server 

Elastic pools are created inside Azure SQL Servers. If you already have a server you can go to the next step, or you can run the following command to create a new V12 server. Replace the ServerName with the name for your server. It must be unique to Azure SQL Servers so you may get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt will appear after the server is successfully created. You can edit the  command to use whatever valid location you choose.

	PS C:\>New-AzureSqlServer -ResourceGroupName "resourcegroup1" -ServerName "server1" -Location "West US" -ServerVersion "12.0"

When you run this command a window opens asking for a **User name** and **Password**. This is  not your Azure credentials, enter the user name and password that will be the administrator credentials you want to create for the new server.  


### Configure a server firewall rule to allow access to the server

Establish a firewall rule to access the server. Run the following command replacing the start and end IP addresses with valid values for your computer.

If your server needs to allow access to other Azure services, add the **-AllowAllAzureIPs** switch that will add a special firewall rule and allow all azure traffic access to the server.

	PS C:\>New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroup1" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"

For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).


## Create an elastic pool, and elastic databases

Now you have a resource group, a server, and a firewall rule configured so you can access the server the following command will create the elastic pool. This command creates a pool that shares a total of 400 DTUs. Each database in the pool is guaranteed to always have 10 DTUs available (DatabaseDtuMin). Individual databases in the pool can consume a maximum of 100 DTUs (DatabaseDtuMax). For detailed parameter explanations, see [Azure SQL Database elastic pools](sql-database-elastic-pool.md). 


	PS C:\>New-AzureSqlElasticPool -ResourceGroupName "resourcegroup1" -ServerName "server1" -ElasticPoolName "elasticpool1" -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100


### Create or add elastic databases into a pool

The elastic pool created in the previous step is empty, it has no databases in it. The following sections show how to create new databases inside of the elastic pool, and also how to add existing databases into the pool.


### Create a new elastic database inside an elastic pool

To create a new database directly inside an elastic pool, use the **New-AzureSqlDatabase** cmdlet and set the **ElasticPoolName** parameter.


	PS C:\>New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"



### Move an existing database into an elastic pool

To move an existing database into an elastic pool, use the **Set-AzurSqlDatabase** cmdlet and set the **ElasticPoolName** parameter. 


For demonstration, create a database that's not in an elastic pool.

	PS C:\>New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -Edition "Standard"

Move the existing database into the elastic pool.

	PS C:\>Set-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

## Monitoring elastic databases and elastic pools

### Get the status of elastic pool operations

You can track the status of elastic pool operations including creation and updates. 

	PS C:\> Get-AzureSqlElasticPoolActivity –ResourceGroupName “resourcegroup1” –ServerName “server1” –ElasticPoolName “elasticpool1” 


### Get the status of moving an elastic database into and out of an elastic pool

	PS C:\>Get-AzureSqlElasticPoolDatabaseActivity -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1"

### Get resource consumption metrics for an elastic pool

Metrics that can be retrieved as a percentage of the resource pool limit:   

* Average CPU utilization  - cpu_percent 
* Average IO utilization - data_io_percent 
* Average Log utilization - log_write_percent 
* Average Memory utilization - memory_percent 
* Average DTU utilization (as a max value of CPU/IO/Log utilization) – DTU_percent 
* Maximum number of concurrent user requests (workers) – max_concurrent_requests 
* Maximum number of concurrent user sessions – max_concurrent_sessions 
* Total storage size for the elastic pool – storage_in_megabytes 


Metrics granularity/retention periods:

* Data will be returned at 5 minute granularity.  
* Data retention is 14 days.  


This cmdlet and API limits the number of rows that can be retrieved in one call to 1000 rows (about 3 days of data at 5 minute granularity). But this command can be called multiple times with different start/end time intervals to retrieve more data 


Retrieve the metrics:

	PS C:\> $metrics = (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 

Get additional days by repeating the call and appending the data:

	PS C:\> $metrics = $metrics + (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015") 
 
Format the table:

    PS C:\> $table = Format-MetricsAsTable $metrics 

Export to a CSV file:

    PS C:\> foreach($e in $table) { Export-csv -Path c:\temp\metrics.csv -input $e -Append -NoTypeInformation} 

### Get resource consumption metrics for an elastic database

These APIs are the same as the current (V12) APIs used for monitoring the resource utilization of a standalone database, except for the following semantic difference 

* For this API metrics retrieved are expressed as a percentage of the per databaseDtuMax (or equivalent cap for the underlying metric like CPU, IO etc) set for that elastic pool. For example, 50% utilization of any of these metrics indicates that the specific resource consumption is at 50% of the per DB cap limit for that resource in the parent elastic pool. 

Get the metrics:
    PS C:\> $metrics = (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 

Get additional days if needed by repeating the call and appending the data:

    PS C:\> $metrics = $metrics + (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015") 

Format the table:

    PS C:\> $table = Format-MetricsAsTable $metrics 

Export to a CSV file:

    PS C:\> foreach($e in $table) { Export-csv -Path c:\temp\metrics.csv -input $e -Append -NoTypeInformation}


## Putting it all together


    Switch-AzureMode -Name AzureResourceManager
    Add-AzureAccount
    Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000
    New-AzureResourceGroup -Name "resourcegroup1" -Location "West US"
    New-AzureSqlServer -ResourceGroupName "resourcegroup1" -ServerName "server1" -Location "West US" -ServerVersion "12.0"
    New-AzureSqlServerFirewallRule -ResourceGroupName "resourcegroup1" -ServerName "server1" -FirewallRuleName "rule1" -StartIpAddress "192.168.0.198" -EndIpAddress "192.168.0.199"
    New-AzureSqlElasticPool -ResourceGroupName "resourcegroup1" -ServerName "server1" -ElasticPoolName "elasticpool1" -Edition "Standard" -Dtu 400 -DatabaseDtuMin 10 -DatabaseDtuMax 100
    New-AzureSqlDatabase -ResourceGroupName "resourcegroup1" -ServerName "server1" -DatabaseName "database1" -ElasticPoolName "elasticpool1" -MaxSizeBytes 10GB
    
    
    $metrics = (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 
    $metrics = $metrics + (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/elasticPools/franchisepool -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015")
    $table = Format-MetricsAsTable $metrics
    foreach($e in $table) { Export-csv -Path c:\temp\metrics.csv -input $e -Append -NoTypeInformation}

    $metrics = (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/18/2015" -EndTime "4/21/2015") 
    $metrics = $metrics + (Get-Metrics -ResourceId /subscriptions/d7c1d29a-ad13-4033-877e-8cc11d27ebfd/resourceGroups/FabrikamData01/providers/Microsoft.Sql/servers/fabrikamsqldb02/databases/myDB -TimeGrain ([TimeSpan]::FromMinutes(5)) -StartTime "4/21/2015" -EndTime "4/24/2015")
    $table = Format-MetricsAsTable $metrics
    foreach($e in $table) { Export-csv -Path c:\temp\metrics.csv -input $e -Append -NoTypeInformation}

## Next steps

After creating an elastic pool, you can manage elastic databases in the pool by creating elastic jobs. Elastic jobs facilitate running T-SQL scripts against any number of databases in the pool.

For more information, see [Elastic database jobs overview](sql-database-elastic-jobs-overview.md).


## Elastic database reference

For more information about elastic databases and elastic database pools, including API and error details, see [Elastic database pool reference](sql-database-elastic-pool-reference.md).