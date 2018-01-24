---
title: Pause and resume compute in Azure SQL Data Warehouse - PowerShell | Microsoft Docs
description: PowerShell tasks that pause compute for an Azure SQL Data Warehouse to save costs. Resume compute when you are ready to use the data warehouse.
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jhubbard
editor: ''

ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: manage
ms.date: 01/23/2018
ms.author: barbkess

---
# Pause and resume compute for an Azure SQL Data Warehouse in the Azure portal
Pause compute for an Azure SQL Data Warehouse to save costs. Resume compute when you are ready to use the data warehouse.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Before you begin

This quickstart assumes you already have a SQL data warehouse. If you don't already have a data warehouse, you can use [Create and Connect - portal](create-data-warehouse-portal.md) to create a data warehouse called **mySampleDataWarehouse**. 

This tutorial requires the Azure PowerShell module version 4.0 or later. To see your current version, open PowerShell and run `Get-Module -ListAvailable AzureRM`. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 


## Log in to Azure

Log in to your Azure subscription using the [Add-AzureRmAccount](/powershell/module/azurerm.profile/add-azurermaccount) command and follow the on-screen directions.

```powershell
Add-AzureRmAccount
```

To see which subscription you are using, run [Get-AzureRmSubscription](/powershell/module/azurerm.profile/get-azurermsubscription).

```powershell
Get-AzureRmSubscription
```

If you need to use a different subscription than the default, run [Select-AzureRmSubscription](/powershell/module/azurerm.profile/select-azurermsubscription).

```powershell
Select-AzureRmSubscription -SubscriptionName "MySubscription"
```

## Pause compute
To save costs, you can pause and resume compute resources on-demand. For example, if you won't be using the database during the night and on weekends, you can pause it during those times, and resume it during the day. You won't be charged for compute resources while the database is paused. However, you will continue to be charged for storage. 

To pause a database, use the [Suspend-AzureRmSqlDatabase](/powershell/module/azurerm.sql/suspend-azurermsqldatabase.md) cmdlet. The following example pauses a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

> [!NOTE]
> Note that if your server is foo.database.windows.net, use "foo" as the -ServerName in the PowerShell cmdlets.
>
> 

```Powershell
Suspend-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Suspend-AzureRmSqlDatabase](/powershell/module/azurerm.sql/suspend-azurermsqldatabase.md). The results are stored in the object resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Suspend-AzureRmSqlDatabase
$resultDatabase
```


## Resume compute
To start a database, use the [Resume-AzureRmSqlDatabase][Resume-AzureRmSqlDatabase] cmdlet. The following example starts a database named Database02 hosted on a server named Server01. The server is in an Azure resource group named ResourceGroup1.

```Powershell
Resume-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" -DatabaseName "Database02"
```

A variation, this next example retrieves the database into the $database object. It then pipes the object to [Resume-AzureRmSqlDatabase](/powershell/module/azurerm.sql/resume-azurermsqldatabase.md) and stores the results in $resultDatabase. The final command shows the results.

```Powershell
$database = Get-AzureRmSqlDatabase –ResourceGroupName "ResourceGroup1" `
–ServerName "Server01" –DatabaseName "Database02"
$resultDatabase = $database | Resume-AzureRmSqlDatabase
$resultDatabase
```

## Clean up resources

You are being charged for data warehouse units and data stored your data warehouse. These compute and storage resources are billed separately. 

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the data warehouse. 

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and click on your data warehouse.

    ![Clean up resources](media/load-data-from-azure-blob-storage-using-polybase/clean-up-resources.png)

1. To pause compute, click the **Pause** button. When the data warehouse is paused, you see a **Start** button.  To resume compute, click **Start**.

2. To remove the data warehouse so you are not charged for compute or storage, click **Delete**.

3. To remove the SQL server you created, click **mynewserver-20171113.database.windows.net**, and then click **Delete**.  Be careful with this deletion, since deleting the server also deletes all databases assigned to the server.

4. To remove the resource group, click **myResourceGroup**, and then click **Delete resource group**.


## Next steps
You have now paused and resumed compute for your data warehouse. To learn more about Azure SQL Data Warehouse, continue to the tutorial for loading data.

> [!div class="nextstepaction"]
>[Load data into a SQL data warehouse](load-data-from-azure-blob-storage-using-polybase.md)