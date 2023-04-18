---
title: "Quickstart: Scale compute for dedicated SQL pools in Azure Synapse workspaces."
description: You can scale compute for dedicated SQL pools in Azure Synapse workspaces using Azure PowerShell.
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

# Quickstart: Scale compute for dedicated SQL pools in Azure Synapse Workspaces with Azure PowerShell

You can scale compute for Azure Synapse Analytics [dedicated SQL pools](sql-data-warehouse-overview-what-is.md) using Azure PowerShell. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools created in Azure Synapse Analytics workspaces. This content does not apply to dedicated SQL pools (formerly SQL DW) or dedicated SQL pools (formerly SQL DW) in connected workspaces. There are different PowerShell cmdlets to use for each, for example, use `Set-AzSqlDatabase` for a dedicated SQL pool (formerly SQL DW), but `Update-AzSynapseSqlPool` for a dedicated SQL pool in an Azure Synapse Workspace. For similar instructions for dedicated SQL pools (formerly SQL DW), see [Quickstart: Scale compute for dedicated SQL pools (formerly SQL DW) using Azure PowerShell](quickstart-scale-compute-powershell.md).
> For more on the differences between dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart assumes you already have a dedicated SQL pool that was created in a Synapse workspace. If you need, [Create an Azure Synapse workspace](../quickstart-create-workspace.md) and then [create a dedicated SQL pool using Synapse Studio](../quickstart-create-sql-pool-studio.md).

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
1. Search for **Azure Synapse Analytics** in the search bar of the Azure portal.
1. Select your Synapse workspace from the list.
1. Select **SQL pools** under **Analytics pools** in the menu list.
1. If you see the message `The dedicated pools listed below are hosted on the connected SQL Server`, your dedicated SQL pool (formerly SQL DW) is in a Connected workspace. Stop, and instead use the PowerShell examples in [Quickstart: Scale compute for dedicated SQL pool (formerly SQL DW) with Azure PowerShell](quickstart-scale-compute-powershell.md). Proceed for dedicated SQL pools created in a Synapse workspace.
1. Select the name of your dedicated SQL pool from the **Synapse workspace | SQL pools** page. In the following samples, we use `contoso_dedicated_sql_pool`.
1. As in the following image, we use `contoso-synapse-workspace` as the Azure Synapse workspace name in the following PowerShell samples, in the resource group `contoso`.

    :::image type="content" source="./media/quickstart-scale-compute-workspace-powershell/locate-synapse-workspace-name.png" alt-text="A screenshot of the Azure portal with the server name and workspace highlighted.":::

For example, to retrieve the properties and status of a dedicated SQL pool created in a Synapse workspace:

```powershell
Get-AzSynapseSqlPool -ResourceGroupName "contoso" -Workspacename "contoso-synapse-workspace" -name "contoso_dedicated_sql_pool"
```

To retrieve all the data warehouses in a given server, and their status:

```powershell
$pools = Get-AzSynapseSqlPool -ResourceGroupName "resourcegroupname" -Workspacename "synapse-workspace-name"
$pools | Select-Object DatabaseName,Status,Tags
```

## Scale compute

You can increase or decrease compute resources by adjusting the dedicated SQL pool's data warehouse units. The **Workload management** menu of the Azure portal provides scaling, but this can also be accomplished with PowerShell.

To change data warehouse units, use the [Update-AzSynapseSqlPool](/powershell/module/az.synapse/update-azsynapsesqlpool) PowerShell cmdlet. The following example sets the data warehouse units to DW300c for the database `contoso_dedicated_sql_pool`, which is hosted in the resource group `contoso` in the Synapse workspace **contoso-synapse-workspace**.

```powershell
Update-AzSynapseSqlPool -ResourceGroupName "contoso" -Workspacename "contoso-synapse-workspace" -name "contoso_dedicated_sql_pool" -PerformanceLevel  "DW300c"
```

The PowerShell cmdlet will begin the scaling operation. Use the `Get-AzSynapseSqlPool` cmdlet to observe the progress of the scaling operation. For example, you will see `Status` reported as "Scaling". Eventually, the pool will report the new `Sku` value and `Status` of "Online".

```console
ResourceGroupName     : contoso
WorkspaceName         : contoso-synapse-workspace
SqlPoolName           : contoso_dedicated_sql_pool
Sku                   : DW300c
MaxSizeBytes          : 263882790666240
Collation             : SQL_Latin1_General_CP1_CI_AS
SourceDatabaseId      :
RecoverableDatabaseId :
ProvisioningState     : Succeeded
Status                : Scaling
RestorePointInTime    :
CreateMode            :
CreationDate          : 2/21/2023 11:33:45 PM
StorageAccountType    : GRS
Tags                  : {[createdby, chrisqpublic]}
TagsTable             :
                        Name       Value
                        =========  =======
                        createdby  chrisqpublic
                        
Location              : westus3
Id                    : /subscriptions/abcdefghijk-30b0-4d4f-9ebb-abcdefghijk/resourceGroups/contoso/providers/Microsoft.Synapse/workspaces/contoso-synapse-workspace/sqlPools/contoso_dedicated_sql_pool
Type                  : Microsoft.Synapse/workspaces/sqlPools
```

## Next steps

You have now learned how to scale compute for dedicated SQL pool in a Synapse workspace. To learn more about dedicated SQL pools, continue to the tutorial for loading data.

> [!div class="nextstepaction"]
> [Load data into a dedicated SQL pool](load-data-from-azure-blob-storage-using-copy.md)

- To get started with Azure Synapse Analytics, see [Get Started with Azure Synapse Analytics](../get-started.md).
- To learn more about dedicated SQL pools in Azure Synapse Analytics, see [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](sql-data-warehouse-overview-what-is.md)
- [Quickstart: Scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace with the Azure portal](quickstart-scale-compute-workspace-portal.md)