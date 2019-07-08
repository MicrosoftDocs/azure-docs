---
title: Perform Azure Table storage operations with PowerShell | Microsoft Docs
description: Perform Azure Table storage operations with PowerShell.
services: cosmos-db
author: roygara

ms.service: cosmos-db
ms.topic: article
ms.date: 04/05/2019
ms.author: rogarana
ms.subservice: cosmosdb-table
---

# Perform Azure Table storage operations with Azure PowerShell 
[!INCLUDE [storage-table-cosmos-db-tip-include](../../../includes/storage-table-cosmos-db-langsoon-tip-include.md)]

Azure Table storage is a NoSQL datastore that you can use to store and query huge sets of structured, non-relational data. The main components of the service are tables, entities, and properties. A table is a collection of entities. An entity is a set of properties. Each entity can have up to 252 properties, which are all name-value pairs. This article assumes that you are already familiar with the Azure Table Storage Service concepts. For detailed information, see [Understanding the Table Service Data Model](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model) and [Get started with Azure Table storage using .NET](../../cosmos-db/table-storage-how-to-use-dotnet.md).

This how-to article covers common Azure Table storage operations. You learn how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities
> * Delete a table

This how-to article shows you how to create a new Azure Storage account in a new resource group so you can easily remove it when you're done. If you'd rather use an existing Storage account, you can do that instead.

The examples require Az PowerShell modules `Az.Storage (1.1.0 or greater)` and `Az.Resources (1.2.0 or greater)`. In a PowerShell window, run `Get-Module -ListAvailable Az*` to find the version. If nothing is displayed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

> [!IMPORTANT]
> Using this Azure feature from PowerShell requires that you have the `Az` module installed. The current version of `AzTable` is not compatible with the older AzureRM module.
> Follow the [latest install instructions for installing Az module](/powershell/azure/install-az-ps) if needed.

After Azure PowerShell is installed or updated, you must install module **AzTable**, which has the commands for managing the entities. To install this module, run PowerShell as an administrator and use the **Install-Module** command.

> [!IMPORTANT]
> For module name compatibility reasons we are still publishing this same module under the old name `AzureRmStorageTables` in PowerShell Gallery. This document will reference the new name only.

```powershell
Install-Module AzTable
```

## Sign in to Azure

Sign in to your Azure subscription with the `Add-AzAccount` command and follow the on-screen directions.

```powershell
Add-AzAccount
```

## Retrieve list of locations

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. These examples use **eastus**. Store this value in the variable **location** for future use.

```powershell
Get-AzLocation | select Location
$location = "eastus"
```

## Create resource group

Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. Store the resource group name in a variable for future use. In this example, a resource group named *pshtablesrg* is created in the *eastus* region.

```powershell
$resourceGroup = "pshtablesrg"
New-AzResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

## Create storage account

Create a standard general-purpose storage account with locally redundant storage (LRS) using [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount). Be sure to specify a unique storage account name. Next, get the context that represents the storage account. When acting on a storage account, you can reference the context instead of repeatedly providing your credentials.

```powershell
$storageAccountName = "pshtablestorage"
$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage

$ctx = $storageAccount.Context
```

## Create a new table

To create a table, use the [New-AzStorageTable](/powershell/module/az.storage/New-AzStorageTable) cmdlet. In this example, the table is called `pshtesttable`.

```powershell
$tableName = "pshtesttable"
New-AzStorageTable –Name $tableName –Context $ctx
```

## Retrieve a list of tables in the storage account

Retrieve a list of tables in the storage account using [Get-AzStorageTable](/powershell/module/azure.storage/Get-AzureStorageTable).

```powershell
Get-AzStorageTable –Context $ctx | select Name
```

## Retrieve a reference to a specific table

To perform operations on a table, you need a reference to the specific table. Get a reference using [Get-AzStorageTable](/powershell/module/azure.storage/Get-AzureStorageTable).

```powershell
$storageTable = Get-AzStorageTable –Name $tableName –Context $ctx
```

## Reference CloudTable property of a specific table

> [!IMPORTANT]
> Usage of CloudTable is mandatory when working with **AzTable** PowerShell module. Call the **Get-AzTableTable** command to get the reference to this object. This command also creates the table if it does not already exist.

To perform operations on a table using **AzTable**, you need a reference to CloudTable property of a specific table.

```powershell
$cloudTable = (Get-AzStorageTable –Name $tableName –Context $ctx).CloudTable
```

[!INCLUDE [storage-table-entities-powershell-include](../../../includes/storage-table-entities-powershell-include.md)]

## Delete a table

To delete a table, use [Remove-AzStorageTable](/powershell/module/az.storage/Remove-AzStorageTable). This cmdlet removes the table, including all of its data.

```powershell
Remove-AzStorageTable –Name $tableName –Context $ctx

# Retrieve the list of tables to verify the table has been removed.
Get-AzStorageTable –Context $Ctx | select Name
```

## Clean up resources

If you created a new resource group and storage account at the beginning of this how-to,  you can remove all of the assets you have created in this exercise by removing the resource group. This command deletes all resources contained within the group as well as the resource group itself.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about common Azure Table storage operations with PowerShell, including how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities
> * Delete a table

For more information, see the following articles

* [Storage PowerShell cmdlets](/powershell/module/az.storage#storage)

* [Working with Azure Tables from PowerShell - AzureRmStorageTable/AzTable PS Module v2.0](https://paulomarquesc.github.io/working-with-azure-storage-tables-from-powershell)

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
