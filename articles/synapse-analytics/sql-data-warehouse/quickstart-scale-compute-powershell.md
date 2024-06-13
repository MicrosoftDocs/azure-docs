---
title: "Quickstart: Scale compute for dedicated SQL pools (formerly SQL DW) using Azure PowerShell"
description: You can scale compute for dedicated SQL pools (formerly SQL DW) using Azure PowerShell.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: kedodd
ms.date: 02/21/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom:
  - devx-track-azurepowershell
  - mode-api
---

# Quickstart: Scale compute for dedicated SQL pool (formerly SQL DW) with Azure PowerShell

You can scale compute for Azure Synapse Analytics [dedicated SQL pools](sql-data-warehouse-overview-what-is.md) in an Azure Synapse Workspace using Azure PowerShell. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools (formerly SQL DW) or in Azure Synapse connected workspaces. This content does not apply to dedicated SQL pools created in Azure Synapse workspaces. There are different PowerShell cmdlets to use for each, for example, use `Set-AzSqlDatabase` for a dedicated SQL pool (formerly SQL DW), but `Update-AzSynapseSqlPool` for a dedicated SQL pool in an Azure Synapse Workspace. For similar instructions for dedicated SQL pools in Azure Synapse Analytics workspaces, see [Quickstart: Scale compute for dedicated SQL pools in Azure Synapse workspaces with Azure PowerShell](quickstart-scale-compute-workspace-powershell.md).
> For more on the differences between dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart assumes you already have a dedicated SQL pool (formerly SQL DW). If you need to create one, use [Create and Connect - portal](create-data-warehouse-portal.md) to create a dedicated SQL pool (formerly SQL DW) called `mySampleDataWarehouse`.

## Sign in to Azure

Sign in to your Azure subscription using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

To see which subscription you're using, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Get-AzSubscription
```

If you need to use a different subscription than the default, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Set-AzContext -SubscriptionName "MySubscription"
```

## Look up data warehouse information

Locate the database name, server name, and resource group for the data warehouse you plan to pause and resume.

Follow these steps to find location information for your data warehouse.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Azure Synapse Analytics (formerly SQL DW)** in the main search bar of the Azure portal.
1. Select `mySampleDataWarehouse` from the **Azure Synapse Analytics (formerly SQL DW)** page to open the data warehouse.
    :::image type="content" source="media/quickstart-scale-compute-powershell/locate-data-warehouse-information.png" alt-text="A screenshot of the Azure portal with the server name and resource group highlighted.":::

1. The data warehouse name will be used as the database name. Remember, a data warehouse is one type of database. Also remember down the server name, and the resource group. You will use the server name and the resource group name in the pause and resume commands.
1. Use only the first part of the server name in the PowerShell cmdlets. In the preceding image, the full server name is `sqlpoolservername.database.windows.net`. We use `sqlpoolservername` as the server name in the PowerShell cmdlet.

For example, to retrieve the properties and status of a dedicated SQL pool (formerly SQL DW):

```powershell
Get-AzSqlDatabase -ResourceGroupName "resourcegroupname" -ServerName "sqlpoolservername" -DatabaseName "mySampleDataWarehouse"
```

To retrieve all the data warehouses in a given server, and their status:

```powershell
Get-AzSqlDatabase -ResourceGroupName "resourcegroupname" -ServerName "sqlpoolservername"
$database | Select-Object DatabaseName,Status
```

## Scale compute

In dedicated SQL pool (formerly SQL DW), you can increase or decrease compute resources by adjusting data warehouse units. The [Create and Connect - portal](create-data-warehouse-portal.md) created `mySampleDataWarehouse` and initialized it with 400 DWUs. The following steps adjust the DWUs for `mySampleDataWarehouse`.

To change data warehouse units, use the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet. The following example sets the data warehouse units to DW300c for the database `mySampleDataWarehouse`, which is hosted in the resource group `resourcegroupname` on server **sqlpoolservername**.

```powershell
Set-AzSqlDatabase -ResourceGroupName "resourcegroupname" -DatabaseName "mySampleDataWarehouse" -ServerName "sqlpoolservername" -RequestedServiceObjectiveName "DW300c"
```

After the scaling operation is complete, the cmdlet returns output reflecting the new status, similar to the output of `Get-AzSqlDatabase`:

```console
ResourceGroupName                : resourcegroupname
ServerName                       : sqlpoolservername
DatabaseName                     : mySampleDataWarehouse
Location                         : North Europe
DatabaseId                       : 34d2ffb8-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Edition                          : DataWarehouse
CollationName                    : SQL_Latin1_General_CP1_CI_AS
CatalogCollation                 :
MaxSizeBytes                     : 263882790666240
Status                           : Online
CreationDate                     : 1/20/2023 9:18:12 PM
CurrentServiceObjectiveId        : 284f1aff-xxxx-xxxx-xxxx-xxxxxxxxxxxx
CurrentServiceObjectiveName      : DW300c
RequestedServiceObjectiveName    : DW300c
RequestedServiceObjectiveId      :
ElasticPoolName                  :
EarliestRestoreDate              :
Tags                             :
ResourceId                       : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/
                                resourceGroups/resourcegroupname/providers/Microsoft.Sql/servers/sqlpoolservername/databases/mySampleDataWarehouse
CreateMode                       :
ReadScale                        : Disabled
ZoneRedundant                    :
Capacity                         : 2700
Family                           :
SkuName                          : DataWarehouse
LicenseType                      :
AutoPauseDelayInMinutes          :
MinimumCapacity                  :
ReadReplicaCount                 :
HighAvailabilityReplicaCount     :
CurrentBackupStorageRedundancy   : Geo
RequestedBackupStorageRedundancy : Geo
SecondaryType                    :
MaintenanceConfigurationId       : /subscriptions/d8392f63-xxxx-xxxx-xxxx-xxxxxxxxxxxx/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_Default
EnableLedger                     : False
PreferredEnclaveType             :
PausedDate                       :
ResumedDate                      :
```

## Check data warehouse state

To see the current state of the data warehouse, use the [Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet. This cmdlet shows the state of the `mySampleDataWarehouse` database in resource group `resourcegroupname` and server `sqlpoolservername.database.windows.net`.

```powershell
$database = Get-AzSqlDatabase -ResourceGroupName "resourcegroupname" -ServerName "sqlpoolservername" -DatabaseName "mySampleDataWarehouse"
$database
```

You can see the `Status` of the database in the output. In this case, you can see that this database is `Online`.  When you run this command, you should receive a `Status` value of `Online`, `Pausing`, `Resuming`, `Scaling`, or `Paused`.

To see the status by itself, use the following command:

```powershell
$database | Select-Object DatabaseName, Status
```

## Next steps

You have now learned how to scale compute for dedicated SQL pool (formerly SQL DW). To learn more about dedicated SQL pool (formerly SQL DW), continue to the tutorial for loading data.

> [!div class="nextstepaction"]
> [Load data into a dedicated SQL pool](load-data-from-azure-blob-storage-using-copy.md)

- To get started with Azure Synapse Analytics, see [Get Started with Azure Synapse Analytics](../get-started.md).
- To learn more about dedicated SQL pools in Azure Synapse Analytics, see [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](sql-data-warehouse-overview-what-is.md)