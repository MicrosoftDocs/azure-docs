---
title: 'Quickstart: Pause and resume compute in Azure SQL Data Warehouse - PowerShell | Microsoft Docs'
description: Use PowerShell to pause compute in Azure SQL Data Warehouse to save costs. Resume compute when you are ready to use the data warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: quickstart
ms.subservice: manage
ms.date: 03/20/2019
ms.author: kevin
ms.reviewer: igorstan
---
# Quickstart: Pause and resume compute in Azure SQL Data Warehouse with PowerShell

Use PowerShell to pause compute in Azure SQL Data Warehouse to save costs. [Resume compute](sql-data-warehouse-manage-compute-overview.md) when you are ready to use the data warehouse.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Before you begin

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

This quickstart assumes you already have a SQL data warehouse that you can pause and resume. If you need to create one, you can use [Create and Connect - portal](create-data-warehouse-portal.md) to create a data warehouse called **mySampleDataWarehouse**.

## Log in to Azure

Log in to your Azure subscription using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

To see which subscription you are using, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription).

```powershell
Get-AzSubscription
```

If you need to use a different subscription than the default, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

```powershell
Set-AzContext -SubscriptionName "MySubscription"
```

## Look up data warehouse information

Locate the database name, server name, and resource group for the data warehouse you plan to pause and resume.

Follow these steps to find location information for your data warehouse.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **SQL databases** in the left page of the Azure portal.
3. Select **mySampleDataWarehouse** from the **SQL databases** page. The data warehouse opens.

    ![Server name and resource group](media/pause-and-resume-compute-powershell/locate-data-warehouse-information.png)

4. Write down the data warehouse name, which is the database name. Also write down the server name, and the resource group.
6. If your server is foo.database.windows.net, use only the first part as the server name in the PowerShell cmdlets. In the preceding image, the full server name is newserver-20171113.database.windows.net. Drop the suffix and use **newserver-20171113** as the server name in the PowerShell cmdlet.

## Pause compute

To save costs, you can pause and resume compute resources on-demand. For example, if you are not using the database during the night and on weekends, you can pause it during those times, and resume it during the day. There is no charge for compute resources while the database is paused. However, you continue to be charged for storage.

To pause a database, use the [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase) cmdlet. The following example pauses a data warehouse named **mySampleDataWarehouse** hosted on a server named **newserver-20171113**. The server is in an Azure resource group named **myResourceGroup**.


```Powershell
Suspend-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "newserver-20171113" –DatabaseName "mySampleDataWarehouse"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Suspend-AzSqlDatabase](/powershell/module/az.sql/suspend-azsqldatabase). The results are stored in the object resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "newserver-20171113" –DatabaseName "mySampleDataWarehouse"
$resultDatabase = $database | Suspend-AzSqlDatabase
$resultDatabase
```


## Resume compute

To start a database, use the [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase) cmdlet. The following example starts a database named mySampleDataWarehouse hosted on a server named newserver-20171113. The server is in an Azure resource group named myResourceGroup.

```Powershell
Resume-AzSqlDatabase –ResourceGroupName "myResourceGroup" `
–ServerName "newserver-20171113" -DatabaseName "mySampleDataWarehouse"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Resume-AzSqlDatabase](/powershell/module/az.sql/resume-azsqldatabase) and stores the results in $resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzSqlDatabase
$resultDatabase
```

## Check status of your data warehouse operation

To check the status of your data warehouse, use the [Get-AzSqlDatabaseActivity](https://docs.microsoft.com/powershell/module/az.sql/Get-AzSqlDatabaseActivity#description) cmdlet.

```
Get-AzSqlDatabaseActivity -ResourceGroupName "ResourceGroup01" -ServerName "Server01" -DatabaseName "Database02"
```

## Clean up resources

You are being charged for data warehouse units and data stored your data warehouse. These compute and storage resources are billed separately.

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the data warehouse.

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and click on your data warehouse.

    ![Clean up resources](media/load-data-from-azure-blob-storage-using-polybase/clean-up-resources.png)

2. To pause compute, click the **Pause** button. When the data warehouse is paused, you see a **Start** button.  To resume compute, click **Start**.

3. To remove the data warehouse so you are not charged for compute or storage, click **Delete**.

4. To remove the SQL server you created, click **mynewserver-20171113.database.windows.net**, and then click **Delete**.  Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

5. To remove the resource group, click **myResourceGroup**, and then click **Delete resource group**.


## Next steps

You have now paused and resumed compute for your data warehouse. To learn more about Azure SQL Data Warehouse, continue to the tutorial for loading data.

> [!div class="nextstepaction"]
> [Load data into a SQL data warehouse](load-data-from-azure-blob-storage-using-polybase.md)
