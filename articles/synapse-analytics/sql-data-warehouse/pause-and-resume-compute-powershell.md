---
title: 'Quickstart: Pause and resume compute in dedicated SQL pool (formerly SQL DW) with Azure PowerShell'
description: You can use Azure PowerShell to pause and resume dedicated SQL pool (formerly SQL DW). compute resources.
services: synapse-analytics
author: julieMSFT
ms.author: jrasnick
manager: craigg
ms.reviewer: igorstan
ms.date: 03/20/2019
ms.topic: quickstart
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
  - seo-lt-2019
  - azure-synapse
  - devx-track-azurepowershell
  - mode-api
---
# Quickstart: Pause and resume compute in dedicated SQL pool (formerly SQL DW) with Azure PowerShell

You can use Azure PowerShell to pause and resume dedicated SQL pool (formerly SQL DW) compute resources.
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart assumes you already have a dedicated SQL pool (formerly SQL DW) that you can pause and resume. If you need to create one, you can use [Create and Connect - portal](create-data-warehouse-portal.md) to create a dedicated SQL pool (formerly SQL DW) called **mySampleDataWarehouse**.

## Log in to Azure

Log in to your Azure subscription using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command and follow the on-screen directions.

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

## Look up dedicated SQL pool (formerly SQL DW) information

Locate the database name, server name, and resource group for the dedicated SQL pool (formerly SQL DW) you plan to pause and resume.

Follow these steps to find location information for your dedicated SQL pool (formerly SQL DW):

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Click **Azure Synapse Analytics (formerly SQL DW)** in the left page of the Azure portal.
1. Select **mySampleDataWarehouse** from the **Azure Synapse Analytics (formerly SQL DW)** page. The SQL pool opens.

    ![Server name and resource group](./media/pause-and-resume-compute-powershell/locate-data-warehouse-information.png)

1. Write down the dedicated SQL pool (formerly SQL DW) name, which is the database name. Also write down the server name, and the resource group.
1. Use only the first part of the server name in the PowerShell cmdlets. In the preceding image, the full server name is sqlpoolservername.database.windows.net. We use **sqlpoolservername** as the server name in the PowerShell cmdlet.

## Pause compute

To save costs, you can pause and resume compute resources on-demand. For example, if you are not using the database during the night and on weekends, you can pause it during those times, and resume it during the day.

>[!NOTE]
>There is no charge for compute resources while the database is paused. However, you continue to be charged for storage.

To pause a database, use the [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) cmdlet. The following example pauses a SQL pool named **mySampleDataWarehouse** hosted on a server named **sqlpoolservername**. The server is in an Azure resource group named **myResourceGroup**.

```Powershell
Suspend-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "sqlpoolservername" –DatabaseName "mySampleDataWarehouse"
```

The following example retrieves the database into the $database object. It then pipes the object to [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). The results are stored in the object resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "sqlpoolservername" –DatabaseName "mySampleDataWarehouse"
$resultDatabase = $database | Suspend-AzSqlDatabase
$resultDatabase
```

## Resume compute

To start a database, use the [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) cmdlet. The following example starts a database named **mySampleDataWarehouse** hosted on a server named **sqlpoolservername**. The server is in an Azure resource group named **myResourceGroup**.

```Powershell
Resume-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "sqlpoolservername" -DatabaseName "mySampleDataWarehouse"
```

The next example retrieves the database into the $database object. It then pipes the object to [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) and stores the results in $resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "sqlpoolservername" –DatabaseName "mySampleDataWarehouse"
$resultDatabase = $database | Resume-AzSqlDatabase
$resultDatabase
```

## Check status of your SQL pool operation

To check the status of your dedicated SQL pool (formerly SQL DW), use the [Get-AzSqlDatabaseActivity](/powershell/module/az.sql/Get-AzSqlDatabaseActivity?toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) cmdlet.

```Powershell
Get-AzSqlDatabaseActivity -ResourceGroupName "myResourceGroup" -ServerName "sqlpoolservername" -DatabaseName "mySampleDataWarehouse"
```

## Clean up resources

You are being charged for data warehouse units and data stored your dedicated SQL pool (formerly SQL DW). These compute and storage resources are billed separately.

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the SQL pool.

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and click on your SQL pool.

    ![Clean up resources](./media/load-data-from-azure-blob-storage-using-polybase/clean-up-resources.png)

2. To pause compute, click the **Pause** button. When the SQL pool is paused, you see a **Start** button.  To resume compute, click **Start**.

3. To remove the SQL pool so you are not charged for compute or storage, click **Delete**.

4. To remove the SQL server you created, click **sqlpoolservername.database.windows.net**, and then click **Delete**.  Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

5. To remove the resource group, click **myResourceGroup**, and then click **Delete resource group**.

## Next steps

To learn more about SQL pool, continue to the [Load data into dedicated SQL pool (formerly SQL DW)](./load-data-from-azure-blob-storage-using-copy.md) article. For additional information about managing compute capabilities, see the [Manage compute overview](sql-data-warehouse-manage-compute-overview.md) article.
