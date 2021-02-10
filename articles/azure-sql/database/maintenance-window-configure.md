---
title: Configure maintenance window (Preview)
description: Learn how to set the time when planned maintenance should be performed on your Azure SQL databases, elastic pools, and managed instance databases.
services: sql-database
ms.service: sql-db-mi
ms.subservice: service
ms.topic: how-to
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 02/09/2021
---
# Configure maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Configure the [maintenance window (Preview)](maintenance-window.md) for an Azure SQL database, elastic pool, or Azure SQL Managed Instance database during database creation or anytime after a database is created. 

The *SQL_default* maintenance window is 5PM to 8AM daily (local time of the Azure region the database is hosted in) to avoid peak business hours interruptions. If the default maintenance window is not the best time, select one of the other available maintenance windows:

* **SQL_Default** window, 5PM to 8AM local time Mon-Sunday 
* **Weekday** window, 10PM to 6AM local time Monday to Thursday
* **Weekend** window, 10PM to 6AM local time Friday to Sunday

Maintenance window is not available for every service level or in every region. For details on availability, see [Maintenance window availability](maintenance-window.md#availability).

## Configure maintenance window during database creation 

# [Portal](#tab/azure-portal)

To configure the maintenance window when you create a database, set the desired **Maintenance window** on the **Additional settings** page. 

For step-by-step information on creating a new SQL database and setting the maintenance window, see [Create an Azure SQL Database single database](single-database-create-quickstart.md).

   :::image type="content" source="media/maintenance-window-configure/additional-settings.png" alt-text="Create database additional settings tab":::




# [PowerShell](#tab/azure-powershell)

To configure the maintenance window using Windows PowerShell:

## Discover available maintenance windows

When setting the maintenance window, each region has its own maintenance window options that correspond to the timezone for the region the database or pool is located. 

The following example returns the available maintenance windows for the *eastus2* region using the [Get-AzMaintenancePublicConfiguration](/powershell/module/az.maintenance/get-azmaintenancepublicconfiguration) cmdlet.

   ```powershell-interactive
   $location = "eastus2"

   Write-Host "Available maintenance schedules in ${location}:"
   $configurations = Get-AzMaintenancePublicConfiguration
   $configurations | ?{ $_.Location -eq $location -and $_.MaintenanceScope -eq "SQLDB"}
   ```


## Set the maintenance window during database creation

The following example creates a new database and sets the maintenance window using the [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet. The example uses a valid maintenance window for the eastus2 region from the previous example: `SQL_EastUS2_DB_1`. 


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



## Set the maintenance window during elastic pool creation

The following example creates a new elastic pool and sets the maintenance window using the [New-AzSqlElasticPool](/powershell/module/az.sql/new-azsqlelasticpool) cmdlet. The maintenance window is set on the elastic pool, so all databases in the pool inherit the pool's maintenance window schedule.


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

-----

## Set the maintenance window for an existing database 

# [Portal](#tab/azure-portal)

The following steps set the maintenance window on an existing database using the Azure portal:

1. Navigate to the SQL database, elastic pool, or managed instance you want to set the maintenance window for.
1. In the **Settings** menu select **Maintenance**, then select the desired maintenance window.

   :::image type="content" source="media/maintenance-window-configure/maintenance.png" alt-text="SQL database Maintenance page":::



# [PowerShell](#tab/azure-powershell)



The following example sets the maintenance window on an existing database using the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet. 
It's important to make sure that the `$maintenanceConfig` value is a valid value for your database's region. To get valid values for your database's region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

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

## Set the maintenance window on an existing elastic pool

The following example sets the maintenance window on an existing elastic pool using the [Set-AzSqlElasticPool](/powershell/module/az.sql/set-azsqlelasticpool) cmdlet. 
It's important to make sure that the `$maintenanceConfig` value is a valid value for your pool's region.  To get valid values for your pool's region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

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

Be sure to delete resources after you're finished with them to avoid unnecessary charges. 


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

- To learn more about maintenance window, see [Maintenance window (Preview)](maintenance-window.md).
- For more information, see [Maintenance window FAQ](maintenance-window-faq.yml).
- To learn about optimizing performance, see [Monitoring and performance tuning in Azure SQL Database and Azure SQL Managed Instance](monitor-tune-overview.md).
