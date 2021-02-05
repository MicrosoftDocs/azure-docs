---
title: Configure SQL maintenance window (Preview)
description: Learn how to set the time when planned maintenance should be performed on your Azure SQL databases, elastic pools, and managed instance databases.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.topic: how-to
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 02/04/2021
---
# Configure SQL maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Configure the [SQL maintenance window (Preview)](sql-maintenance-window.md) for an Azure SQL database, elastic pool, or Azure SQL Managed Instance database during database creation or anytime after a database is created. 

The *SQL_default* maintenance window is 5PM to 8AM daily (local time of the Azure region the database is hosted in) to avoid peak business hours interruptions. If the default maintenance window is not the best time, select one of the other available maintenance windows:

* **SQL_Default** window, 5PM to 8AM local time Mon-Sunday 
* **Weekday** window, 10PM to 6AM local time Monday to Thursday
* **Weekend** window, 10PM to 6AM local time Friday to Sunday

SQL maintenance window is not available for every service level or in every region. For details on availability, see [SQL maintenance window availability](sql-maintenance-window.md#availability).

## Configure SQL maintenance window during database creation 

# [Portal](#tab/azure-portal)

To configure the maintenance window when you create a database, set the desired **Maintenance window** on the **Additional settings** page. 

For step-by-step information on creating a new SQL database and setting the SQL maintenance window, see [Create an Azure SQL Database single database](single-database-create-quickstart.md).

   :::image type="content" source="media/sql-maintenance-window-configure/additional-settings.png" alt-text="Create database additional settings tab":::



## Configure SQL maintenance window for an existing database 


To configure the maintenance window for an existing database in the Azure portal:

1. Navigate to the SQL database, elastic pool, or managed instance you want to set the maintenance window for.
1. In the **Settings** menu select **Maintenance**, then select the desired maintenance window.

   :::image type="content" source="media/sql-maintenance-window-configure/maintenance.png" alt-text="SQL database Maintenance page":::


# [PowerShell](#tab/azure-powershell)

To configure the maintenance window using Windows PowerShell:

## Prerequisites
For this tutorial, an existing database is required. If you don't already have a SQL database, see [Create a single database](single-database-create-quickstart.md?tabs=azure-powershell) to create one.

## Discover maintenance windows

Each region has its own set of available maintenance windows. Available options can be discovered using the [Get-AzMaintenancePublicConfiguration](/powershell/module/az.maintenance/get-azmaintenancepublicconfiguration) cmdlet.

   ```powershell-interactive
   $location = "eastus2"

   Write-Host "Available maintenance schedules in ${location}:"
   $configurations = Get-AzMaintenancePublicConfiguration
   $configurations | ?{ $_.Location -eq $location -and $_.MaintenanceScope -eq "SQLDB"}
   ```


## Create database with selected maintenance window

Once maintenance window is selected, new database can be created using [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet.


   ```powershell-interactive
    # Set variables for your database
    $resourceGroupName = "your_resource_group_name"
    $serverName = "your_server_name"
    $databaseName = "your_db_name"
    
    # Set selected maintenance window
    $maintenanceConfig = "SQL_EastUS2_DB_1"

    Write-host "Creating a gen5 2 vCore database with maintenance window ${maintenanceConfig} ..."
    $database = New-AzSqlDatabase `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName `
      -Edition GeneralPurpose `
      -ComputeGeneration Gen5 `
      -VCore 2 `
      -MaintenanceConfigurationId $maintenanceConfig
    $database
   ```



## Create elastic pool with selected maintenance window

The following example creates new elastic pool using the [New-AzSqlElasticPool](/powershell/module/az.sql/new-azsqlelasticpool) cmdlet with maintenance window selected. All databases inside this pool are going to follow pool's maintenance window.


   ```powershell-interactive
    # Set variables for your pool
    $resourceGroupName = "your_resource_group_name"
    $serverName = "your_server_name"
    $poolName = "your_pool_name"
    
    # Set selected maintenance window
    $maintenanceConfig = "SQL_EastUS2_DB_2"

    Write-host "Creating a Standard 50 pool with maintenance window ${maintenanceConfig} ..."
    $pool = New-AzSqlElasticPool `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -ElasticPoolName $poolName `
      -Edition "Standard" `
      -Dtu 50 `
      -DatabaseDtuMin 10 `
      -DatabaseDtuMax 20 `
      -MaintenanceConfigurationId $maintenanceConfig
    $pool
   ```


## Apply maintenance window to existing database

Maintenance window can be applied to existing database using the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet. It's important to match schedule and resource locations.

   ```powershell-interactive
    # Select different maintenance window
    $maintenanceConfig = "SQL_EastUS2_DB_2"

    Write-host "Changing database maintenance window to ${maintenanceConfig} ..."
    $database = Set-AzSqlDatabase `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName `
      -MaintenanceConfigurationId $maintenanceConfig
    $database
   ```

## Apply maintenance window to existing elastic pool

The same applies to elastic pool except that cmdlet needed is [Set-AzSqlElasticPool](/powershell/module/az.sql/set-azsqlelasticpool).

   ```powershell-interactive
    # Select different maintenance window
    $maintenanceConfig = "SQL_EastUS2_DB_1"
    
    Write-host "Changing pool maintenance window to ${maintenanceConfig} ..."
    $pool = Set-AzSqlElasticPool `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -ElasticPoolName $poolName `
      -MaintenanceConfigurationId $maintenanceConfig
    $pool
   ```


## Cleanup resources

When you're finished with this tutorial, delete the resources.


   ```powershell-interactive
    # Delete database
    Remove-AzSqlDatabase `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -DatabaseName $databaseName
    
    # Delete elastic pool
    Remove-AzSqlElasticPool `
      -ResourceGroupName $resourceGroupName `
      -ServerName $serverName `
      -ElasticPoolName $poolName
   ```


## Next steps

- To learn more about SQL maintenance window, see [SQL maintenance window](sql-maintenance-window.md).
- For more information, see [SQL maintenance window FAQ](sql-maintenance-window-faq.yml).
- To learn about optimizing performance, see [Monitoring and performance tuning in Azure SQL Database and Azure SQL Managed Instance](monitor-tune-overview.md).
