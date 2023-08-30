---
title: "Quickstart: Pause and resume compute in dedicated SQL pool in a Synapse Workspace with Azure PowerShell"
description: You can use Azure PowerShell to pause and resume dedicated SQL pool compute resources in an Azure Synapse Workspace.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 02/21/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom: azure-synapse, devx-track-azurepowershell
---

# Quickstart: Pause and resume compute in dedicated SQL pool in a Synapse Workspace with Azure PowerShell

You can use Azure PowerShell to pause and resume dedicated SQL pool in a Synapse Workspace compute resources.
If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools created in Azure Synapse Workspaces and not dedicated SQL pools (formerly SQL DW). There are different PowerShell cmdlets to use for each, for example, use `Suspend-AzSqlDatabase` for a dedicated SQL pool (formerly SQL DW), but `Suspend-AzSynapseSqlPool` for a dedicated SQL pool in an Azure Synapse Workspace. For instructions to pause and resume a dedicated SQL pool (formerly SQL DW), see [Quickstart: Pause and resume compute in dedicated SQL pool (formerly SQL DW) with Azure PowerShell](pause-and-resume-compute-powershell.md).
> For more on the differences between dedicated SQL pool (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772). 

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart assumes you already have a dedicated SQL pool that was created in a Synapse workspace that you can pause and resume. If you need, [Create an Azure Synapse workspace](../quickstart-create-workspace.md) and then [create a dedicated SQL pool using Synapse Studio](../quickstart-create-sql-pool-studio.md).

## Sign in to Azure

Sign in to your Azure subscription using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

To see which subscription you are using, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Get-AzSubscription
```

If you need to use a different subscription than the default, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Set-AzContext -SubscriptionName "MySubscription"
```

## Look up dedicated SQL pool information

Locate the pool name, server name, and resource group for the dedicated SQL pool you plan to pause and resume.

Follow these steps to find location information for your dedicated SQL pool in the Azure Synapse Workspace:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Azure Synapse Analytics** in the menu of the Azure portal, or search for **Azure Synapse Analytics** in the search bar.
1. Select `mySampleDataWarehouse` from the **Azure Synapse Analytics** page. The SQL pool opens.

    :::image type="content" source="././media/pause-and-resume-compute-portal/compute-online.png" alt-text="Screenshot of the Azure portal indicating that the dedicated SQL pool compute is online.":::

1. Remember the resource group name, dedicated SQL pool name, and workspace name. 

## Pause compute

To save costs, you can pause and resume compute resources on-demand. For example, if you are not using the pool during the night and on weekends, you can pause it during those times, and resume it during the day.

> [!NOTE]  
> There is no charge for compute resources while the pool is paused. However, you continue to be charged for storage.

To pause a pool, use the [Suspend-AzSynapseSqlPool](/powershell/module/az.synapse/suspend-azsynapsesqlpool?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) cmdlet. The following example pauses a SQL pool named `mySampleDataWarehouse` hosted in workspace named `synapseworkspacename`. The server is in an Azure resource group named **myResourceGroup**.

```powershell
Suspend-AzSynapseSqlPool –ResourceGroupName "myResourceGroup" `
-WorkspaceName "synapseworkspacename" –Name "mySampleDataWarehouse"
```

The following example retrieves the pool into the `$pool` object. It then pipes the object to [Suspend-AzSynapseSqlPool](/powershell/module/az.synapse/suspend-azsynapsesqlpool?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The results are stored in the object `$resultPool`. The final command shows the results.

```powershell
$pool = Get-AzSynapseSqlPool –ResourceGroupName "myResourceGroup" `
-WorkspaceName "synapseworkspacename" –Name "mySampleDataWarehouse"
$resultPool = $pool | Suspend-AzSynapseSqlPool
$resultPool
```

The **Status** output of the resulting `$resultPool` object contains the new status of the pool, **Paused**.

## Resume compute

To start a pool, use the [Resume-AzSynapseSqlPool](/powershell/module/az.synapse/resume-AzSynapseSqlPool?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) cmdlet. The following example starts a pool named `mySampleDataWarehouse` hosted on a workspace named `sqlpoolservername`. The server is in an Azure resource group named **myResourceGroup**.

```powershell
Resume-AzSynapseSqlPool –ResourceGroupName "myResourceGroup" `
-WorkspaceName "synapseworkspacename" -Name "mySampleDataWarehouse"
```

The next example retrieves the pool into the `$pool` object. It then pipes the object to [Resume-AzSynapseSqlPool](/powershell/module/az.synapse/resume-AzSynapseSqlPool?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) and stores the results in `$resultpool`. The final command shows the results.

```powershell
$pool = Get-AzSynapseSqlPool –ResourceGroupName "myResourceGroup" `
-WorkspaceName "synapseworkspacename" –Name "mySampleDataWarehouse"
$resultPool = $pool | Resume-AzSynapseSqlPool
$resultPool
```

The **Status** output of the resulting `$resultPool` object contains the new status of the pool, **Online**.

## Clean up resources

You are being charged for data warehouse units and data stored your dedicated SQL pool. These compute and storage resources are billed separately.

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the dedicated SQL pool.

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and select on your SQL pool.

1. To pause compute, select the **Pause** button. When the SQL pool is paused, you see a **Resume** button.  To resume compute, select **Resume**.

1. To remove the dedicated SQL pool so you are not charged for compute or storage, select **Delete**.

1. To remove the resource group, select **myResourceGroup**, and then select **Delete resource group**.

## Next steps

- To get started with Azure Synapse Analytics, see [Get Started with Azure Synapse Analytics](../get-started.md).
- To learn more about dedicated SQL pools in Azure Synapse Analytics, see [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](sql-data-warehouse-overview-what-is.md)
- To learn more about SQL pool, continue to the [Load data into dedicated SQL pool (formerly SQL DW)](./load-data-from-azure-blob-storage-using-copy.md) article. For additional information about managing compute capabilities, see the [Manage compute overview](sql-data-warehouse-manage-compute-overview.md) article.
- For more on the differences between dedicated SQL pool (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).
- See [Quickstart: Scale compute for dedicated SQL pools in Azure Synapse Workspaces with Azure PowerShell](quickstart-scale-compute-workspace-powershell.md)
