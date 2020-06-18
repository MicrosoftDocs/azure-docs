---
title: Scale compute for Synapse SQL pool (Azure PowerShell)
description: You can scale compute for Synapse SQL pool (data warehouse) using Azure PowerShell.
services: synapse-analytics
author: Antvgski
manager: craigg
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice: 
ms.date: 04/17/2018
ms.author: anvang
ms.reviewer: igorstan
ms.custom: seo-lt-2019
---


# Quickstart: Scale compute for Synapse SQL pool with Azure PowerShell

You can scale compute for Synapse SQL pool (data warehouse) using Azure PowerShell. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Before you begin

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

This quickstart assumes you already have a SQL pool that you can scale. If you need to create one, use [Create and Connect - portal](create-data-warehouse-portal.md) to create a SQL pool called **mySampleDataWarehouse**.

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

## Look up data warehouse information

Locate the database name, server name, and resource group for the data warehouse you plan to pause and resume.

Follow these steps to find location information for your data warehouse.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **Azure Synapse Analytics (formerly SQL DW)** in the left navigation page of the Azure portal.
3. Select **mySampleDataWarehouse** from the **Azure Synapse Analytics (formerly SQL DW)** page to open the data warehouse.

    ![Server name and resource group](./media/quickstart-scale-compute-powershell/locate-data-warehouse-information.png)

4. Write down the data warehouse name, which will be used as the database name. Remember, a data warehouse is one type of database. Also write down the server name, and the resource group. You will use the server name and the resource group name in the pause and resume commands.
5. Use only the first part of the server name in the PowerShell cmdlets. In the preceding image, the full server name is sqlpoolservername.database.windows.net. We use **sqlpoolservername** as the server name in the PowerShell cmdlet.

## Scale compute

In SQL pool, you can increase or decrease compute resources by adjusting data warehouse units. The [Create and Connect - portal](create-data-warehouse-portal.md) created **mySampleDataWarehouse** and initialized it with 400 DWUs. The following steps adjust the DWUs for **mySampleDataWarehouse**.

To change data warehouse units, use the [Set-AzSqlDatabase](/powershell/module/az.sql/set-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet. The following example sets the data warehouse units to DW300c for the database **mySampleDataWarehouse**, which is hosted in the Resource group **resourcegroupname** on server **sqlpoolservername**.

```Powershell
Set-AzSqlDatabase -ResourceGroupName "resourcegroupname" -DatabaseName "mySampleDataWarehouse" -ServerName "sqlpoolservername" -RequestedServiceObjectiveName "DW300c"
```

## Check data warehouse state

To see the current state of the data warehouse, use the [Get-AzSqlDatabase](/powershell/module/az.sql/get-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) PowerShell cmdlet. This cmdlet shows the state of the **mySampleDataWarehouse** database in ResourceGroup **resourcegroupname** and server **sqlpoolservername.database.windows.net**.

```powershell
$database = Get-AzSqlDatabase -ResourceGroupName resourcegroupname -ServerName sqlpoolservername -DatabaseName mySampleDataWarehouse
```

Which will result in something like this:

```powershell
ResourceGroupName             : resourcegroupname
ServerName                    : sqlpoolservername
DatabaseName                  : mySampleDataWarehouse
Location                      : North Europe
DatabaseId                    : 34d2ffb8-b70a-40b2-b4f9-b0a39833c974
Edition                       : DataWarehouse
CollationName                 : SQL_Latin1_General_CP1_CI_AS
CatalogCollation              :
MaxSizeBytes                  : 263882790666240
Status                        : Online
CreationDate                  : 11/20/2017 9:18:12 PM
CurrentServiceObjectiveId     : 284f1aff-fee7-4d3b-a211-5b8ebdd28fea
CurrentServiceObjectiveName   : DW300c
RequestedServiceObjectiveId   : 284f1aff-fee7-4d3b-a211-5b8ebdd28fea
RequestedServiceObjectiveName :
ElasticPoolName               :
EarliestRestoreDate           :
Tags                          :
ResourceId                    : /subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/
                                resourceGroups/resourcegroupname/providers/Microsoft.Sql/servers/sqlpoolservername/databases/mySampleDataWarehouse
CreateMode                    :
ReadScale                     : Disabled
ZoneRedundant                 : False
```

You can see the **Status** of the database in the output. In this case, you can see that this database is online.  When you run this command, you should receive a Status value of Online, Pausing, Resuming, Scaling, or Paused.

To see the status by itself, use the following command:

```powershell
$database | Select-Object DatabaseName,Status
```

## Next steps

You have now learned how to scale compute for SQL pool. To learn more about SQL pool, continue to the tutorial for loading data.

> [!div class="nextstepaction"]
>[Load data into a SQL pool](load-data-from-azure-blob-storage-using-polybase.md)
