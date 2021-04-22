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
ms.date: 03/23/2021
---
# Configure maintenance window (Preview)
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]


Configure the [maintenance window (Preview)](maintenance-window.md) for an Azure SQL database, elastic pool, or Azure SQL Managed Instance database during resource creation, or anytime after a resource is created. 

The *System default* maintenance window is 5PM to 8AM daily (local time of the Azure region the resource is located) to avoid peak business hours interruptions. If the *System default* maintenance window is not the best time, select one of the other available maintenance windows.

The ability to change to a different maintenance window is not available for every service level or in every region. For details on availability, see [Maintenance window availability](maintenance-window.md#availability).

> [!Important]
> Configuring maintenance window is a long running asynchronous operation, similar to changing the service tier of the Azure SQL resource. The resource is available during the operation, except a short reconfiguration that happens at the end of the operation and typically lasts up to 8 seconds even in case of interrupted long-running transactions. To minimize the impact of the reconfiguration you should perform the operation outside of the peak hours.

## Configure maintenance window during database creation 

# [Portal](#tab/azure-portal)

To configure the maintenance window when you create a database, elastic pool, or managed instance, set the desired **Maintenance window** on the **Additional settings** page. 

## Set the maintenance window while creating a single database or elastic pool

For step-by-step information on creating a new database or pool, see [Create an Azure SQL Database single database](single-database-create-quickstart.md).

   :::image type="content" source="media/maintenance-window-configure/additional-settings.png" alt-text="Create database additional settings tab":::


## Set the maintenance window while creating a managed instance

For step-by-step information on creating a new managed instance, see [Create an Azure SQL Managed Instance](../managed-instance/instance-create-quickstart.md).

   :::image type="content" source="media/maintenance-window-configure/additional-settings-mi.png" alt-text="Create managed instance additional settings tab":::




# [PowerShell](#tab/azure-powershell)

The following examples show how to configure the maintenance window using Azure PowerShell. You can [install Azure PowerShell](/powershell/azure/install-az-ps), or use the Azure Cloud Shell.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Discover available maintenance windows

When setting the maintenance window, each region has its own maintenance window options that correspond to the timezone for the region the database or pool is located. 

### Discover SQL Database and elastic pool maintenance windows 

The following example returns the available maintenance windows for the *eastus2* region using the [Get-AzMaintenancePublicConfiguration](/powershell/module/az.maintenance/get-azmaintenancepublicconfiguration) cmdlet. For databases and elastic pools, set `MaintenanceScope` to `SQLDB`.

   ```powershell-interactive
   $location = "eastus2"

   Write-Host "Available maintenance schedules in ${location}:"
   $configurations = Get-AzMaintenancePublicConfiguration
   $configurations | ?{ $_.Location -eq $location -and $_.MaintenanceScope -eq "SQLDB"}
   ```

### Discover SQL Managed Instance maintenance windows 

The following example returns the available maintenance windows for the *eastus2* region using the [Get-AzMaintenancePublicConfiguration](/powershell/module/az.maintenance/get-azmaintenancepublicconfiguration) cmdlet. For managed instances, set `MaintenanceScope` to `SQLManagedInstance`.

   ```powershell-interactive
   $location = "eastus2"

   Write-Host "Available maintenance schedules in ${location}:"
   $configurations = Get-AzMaintenancePublicConfiguration
   $configurations | ?{ $_.Location -eq $location -and $_.MaintenanceScope -eq "SQLManagedInstance"}
   ```


## Set the maintenance window while creating a single database

The following example creates a new database and sets the maintenance window using the [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase) cmdlet. The `-MaintenanceConfigurationId` must be set to a valid value for your database's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


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



## Set the maintenance window while creating an elastic pool

The following example creates a new elastic pool and sets the maintenance window using the [New-AzSqlElasticPool](/powershell/module/az.sql/new-azsqlelasticpool) cmdlet. The maintenance window is set on the elastic pool, so all databases in the pool have the pool's maintenance window schedule. The `-MaintenanceConfigurationId` must be set to a valid value for your pool's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


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

## Set the maintenance window while creating a managed instance

The following example creates a new managed instance and sets the maintenance window using the [New-AzSqlInstance](/powershell/module/az.sql/new-azsqlinstance) cmdlet. The maintenance window is set on the instance, so all databases in the instance have the instance's maintenance window schedule. For `-MaintenanceConfigurationId`, the *MaintenanceConfigName* must be a valid value for your instance's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


   ```powershell
   New-AzSqlInstance -Name "your_mi_name" `
     -ResourceGroupName "your_resource_group_name" `
     -Location "your_mi_location" `
     -SubnetId /subscriptions/{SubID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Network/virtualNetworks/{VNETName}/subnets/{SubnetName} `
     -MaintenanceConfigurationId "/subscriptions/{SubID}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_{Region}_{MaintenanceConfigName}" `
     -AsJob
   ```

# [CLI](#tab/azure-cli)

The following examples show how to configure the maintenance window using Azure CLI. You can [install the Azure CLI](/cli/azure/install-azure-cli), or use the Azure Cloud Shell. 

Configuring the maintenance window with the Azure CLI is only available for SQL Managed Instance.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/cli](https://shell.azure.com/cli). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Discover available maintenance windows

When setting the maintenance window, each region has its own maintenance window options that correspond to the timezone for the region the database or pool is located.

### Discover SQL Database and elastic pool maintenance windows

The following example returns the available maintenance windows for the *eastus2* region using the [az maintenance public-configuration list
](/cli/azure/maintenance/public-configuration#az_maintenance_public_configuration_list) command. For databases and elastic pools, set `maintenanceScope` to `SQLDB`.

   ```azurecli
   location="eastus2"

   az maintenance public-configuration list --query "[?location=='$location'&&contains(maintenanceScope,'SQLDB')]"
   ```

### Discover SQL Managed Instance maintenance windows

The following example returns the available maintenance windows for the *eastus2* region using the [az maintenance public-configuration list
](/cli/azure/maintenance/public-configuration#az_maintenance_public_configuration_list) command. For managed instances, set `maintenanceScope` to `SQLManagedInstance`.

   ```azurecli
   az maintenance public-configuration list --query "[?location=='eastus2'&&contains(maintenanceScope,'SQLManagedInstance')]"
   ```

## Set the maintenance window while creating a single database

The following example creates a new database and sets the maintenance window using the [az sql db create](/cli/azure/sql/db#az_sql_db_create) command. The `--maint-config-id` (or `-m`) must be set to a valid value for your database's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


   ```azurecli
    # Set variables for your database
    resourceGroupName="your_resource_group_name"
    serverName="your_server_name"
    databaseName="your_db_name"

    # Set selected maintenance window
    maintenanceConfig="SQL_EastUS2_DB_1"

    # Create database
    az sql db create \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $databaseName \
      --edition GeneralPurpose \
      --family Gen5 \
      --capacity 2 \
      --maint-config-id $maintenanceConfig
   ```

## Set the maintenance window while creating an elastic pool

The following example creates a new elastic pool and sets the maintenance window using the [az sql elastic-pool create](/cli/azure/sql/elastic-pool#az_sql_elastic_pool_create) cmdlet. The maintenance window is set on the elastic pool, so all databases in the pool have the pool's maintenance window schedule. The `--maint-config-id` (or `-m`) must be set to a valid value for your pool's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


   ```azurecli
    # Set variables for your pool
    resourceGroupName="your_resource_group_name"
    serverName="your_server_name"
    poolName="your_pool_name"

    # Set selected maintenance window
    maintenanceConfig="SQL_EastUS2_DB_2"

    # Create elastic pool
    az sql elastic-pool create \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $poolName \
      --edition GeneralPurpose \
      --family Gen5 \
      --capacity 2 \
      --maint-config-id $maintenanceConfig
   ```

## Set the maintenance window while creating a managed instance

The following example creates a new managed instance and sets the maintenance window using [az sql mi create](/cli/azure/sql/mi#az_sql_mi_create). The maintenance window is set on the instance, so all databases in the instance have the instance's maintenance window schedule. *MaintenanceConfigName* must be a valid value for your instance's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

   ```azurecli
   az sql mi create -g mygroup -n myinstance -l mylocation -i -u myusername -p mypassword --subnet /subscriptions/{SubID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Network/virtualNetworks/{VNETName}/subnets/{SubnetName} -m /subscriptions/{SubID}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_{Region}_{MaintenanceConfigName}
   ```

-----

## Configure maintenance window for existing databases


When applying a maintenance window selection to a database, a brief reconfiguration (several seconds) may be experienced in some cases as Azure applies the required changes.

# [Portal](#tab/azure-portal)

The following steps set the maintenance window on an existing database, elastic pool, or managed instance using the Azure portal:


## Set the maintenance window for an existing database or elastic pool

1. Navigate to the SQL database or elastic pool you want to set the maintenance window for.
1. In the **Settings** menu select **Maintenance**, then select the desired maintenance window.

   :::image type="content" source="media/maintenance-window-configure/maintenance.png" alt-text="SQL database Maintenance page":::


## Set the maintenance window for an existing managed instance

1. Navigate to the managed instance you want to set the maintenance window for.
1. In the **Settings** menu select **Maintenance**, then select the desired maintenance window.

   :::image type="content" source="media/maintenance-window-configure/maintenance-mi.png" alt-text="SQL managed instance Maintenance page":::



# [PowerShell](#tab/azure-powershell)

## Set the maintenance window for an existing database

The following example sets the maintenance window on an existing database using the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase) cmdlet. 
The `-MaintenanceConfigurationId` must be set to a valid value for your database's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

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
It's important to make sure that the `$maintenanceConfig` value is a valid value for your pool's region.  To get valid values for a region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

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



## Set the maintenance window on an existing managed instance

The following example sets the maintenance window on an existing managed instance using the [Set-AzSqlInstance](/powershell/module/az.sql/set-azsqlinstance) cmdlet. 
It's important to make sure that the `$maintenanceConfig` value must be a valid value for your instance's region.  To get valid values for a region, see [Discover available maintenance windows](#discover-available-maintenance-windows).


   ```powershell-interactive
   Set-AzSqlInstance -Name "your_mi_name" `
     -ResourceGroupName "your_resource_group_name" `
     -MaintenanceConfigurationId "/subscriptions/{SubID}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_{Region}_{MaintenanceConfigName}" `
     -AsJob
   ```

# [CLI](#tab/azure-cli)

The following examples show how to configure the maintenance window using Azure CLI. You can [install the Azure CLI](/cli/azure/install-azure-cli), or use the Azure Cloud Shell.

## Set the maintenance window for an existing database

The following example sets the maintenance window on an existing database using the [az sql db update](/cli/azure/sql/db#az_sql_db_update) command. The `--maint-config-id` (or `-m`) must be set to a valid value for your database's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

   ```azurecli
    # Select different maintenance window
    maintenanceConfig="SQL_EastUS2_DB_2"

    # Update database
    az sql db update \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $databaseName \
      --maint-config-id $maintenanceConfig
   ```

## Set the maintenance window on an existing elastic pool

The following example sets the maintenance window on an existing elastic pool using the [az sql elastic-pool update](/cli/azure/sql/elastic-pool#az_sql_elastic_pool_update) command. 
It's important to make sure that the `maintenanceConfig` value is a valid value for your pool's region.  To get valid values for a region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

   ```azurecli
    # Select different maintenance window
    maintenanceConfig="SQL_EastUS2_DB_1"

    # Update pool
    az sql elastic-pool update \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $poolName \
      --maint-config-id $maintenanceConfig
   ```

## Set the maintenance window on an existing managed instance

The following example sets the maintenance window using [az sql mi update](/cli/azure/sql/mi#az_sql_mi_update). The maintenance window is set on the instance, so all databases in the instance have the instance's maintenance window schedule. For `-MaintenanceConfigurationId`, the *MaintenanceConfigName* must be a valid value for your instance's region. To get valid values for your region, see [Discover available maintenance windows](#discover-available-maintenance-windows).

   ```azurecli
   az sql mi update -g mygroup  -n myinstance -m /subscriptions/{SubID}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_{Region}_{MainteanceConfigName}
   ```

-----

## Cleanup resources

Be sure to delete unneeded resources after you're finished with them to avoid unnecessary charges.

# [Portal](#tab/azure-portal)

1. Navigate to the SQL database or elastic pool you no longer need.
1. On the **Overview** menu, select the option to delete the resource.


# [PowerShell](#tab/azure-powershell)

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

# [CLI](#tab/azure-cli)

   ```azurecli
   az sql db delete \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $databaseName

   az sql elastic-pool delete \
      --resource-group $resourceGroupName \
      --server $serverName \
      --name $poolName
   ```

-----

## Next steps

- To learn more about maintenance window, see [Maintenance window (Preview)](maintenance-window.md).
- For more information, see [Maintenance window FAQ](maintenance-window-faq.yml).
- To learn about optimizing performance, see [Monitoring and performance tuning in Azure SQL Database and Azure SQL Managed Instance](monitor-tune-overview.md).
