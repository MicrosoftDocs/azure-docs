---
title: Perform Azure Table storage operations with PowerShell | Microsoft Docs
description: Perform Azure Table storage operations with PowerShell.
services: cosmos-db
author: roygara

ms.service: cosmos-db
ms.topic: article
ms.date: 03/14/2018
ms.author: rogarana
ms.component: cosmosdb-table
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

The examples require Azure PowerShell module version 4.4.0 or later. In a PowerShell window, run `Get-Module -ListAvailable AzureRM` to find the version. If nothing is displayed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

After Azure PowerShell is installed or updated, you must install module **AzureRmStorageTable**, which has the commands for managing the entities. To install this module, run PowerShell as an administrator and use the **Install-Module** command.

```powershell
Install-Module AzureRmStorageTable
```

## Sign in to Azure

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions.

```powershell
Connect-AzureRmAccount
```

## Retrieve list of locations

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. These examples use **eastus**. Store this value in the variable **location** for future use.

```powershell
Get-AzureRmLocation | select Location 
$location = "eastus"
```

## Create resource group

Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/New-AzureRmResourceGroup) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. Store the resource group name in a variable for future use. In this example, a resource group named *pshtablesrg* is created in the *eastus* region.

```powershell
$resourceGroup = "pshtablesrg"
New-AzureRmResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

## Create storage account

Create a standard general-purpose storage account with locally-redundant storage (LRS) using [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount). Get the storage account context that defines the storage account to be used. When acting on a storage account, you reference the context instead of repeatedly providing the credentials.

```powershell
$storageAccountName = "pshtablestorage"
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage

$ctx = $storageAccount.Context
```

## Create a new table

To create a table, use the [New-AzureStorageTable](/powershell/module/azure.storage/New-AzureStorageTable) cmdlet. In this example, the table is called `pshtesttable`.

```powershell
$tableName = "pshtesttable"
New-AzureStorageTable –Name $tableName –Context $ctx
```

## Retrieve a list of tables in the storage account

Retrieve a list of tables in the storage account using [Get-AzureStorageTable](/powershell/module/azure.storage/Get-AzureStorageTable).

```powershell
Get-AzureStorageTable –Context $ctx | select Name
```

## Retrieve a reference to a specific table

To perform operations on a table, you need a reference to the specific table. Get a reference using [Get-AzureStorageTable](/powershell/module/azure.storage/Get-AzureStorageTable). 

```powershell
$storageTable = Get-AzureStorageTable –Name $tableName –Context $ctx
```

[!INCLUDE [storage-table-entities-powershell-include](../../../includes/storage-table-entities-powershell-include.md)]

## Delete a table

To delete a table, use [Remove-AzureStorageTable](/powershell/module/azure.storage/Remove-AzureStorageTable). This cmdlet removes the table, including all of its data.

```powershell
Remove-AzureStorageTable –Name $tableName –Context $ctx

# Retrieve the list of tables to verify the table has been removed.
Get-AzureStorageTable –Context $Ctx | select Name
```

## Clean up resources

If you created a new resource group and storage account at the beginning of this how-to,  you can remove all of the assets you have created in this exercise by removing the resource group. This command deletes all resources contained within the group as well as the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
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

* [Storage PowerShell cmdlets](/powershell/module/azurerm.storage#storage)

* [Working with Azure Storage Tables from PowerShell](https://blogs.technet.microsoft.com/paulomarques/2017/01/17/working-with-azure-storage-tables-from-powershell/)

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
