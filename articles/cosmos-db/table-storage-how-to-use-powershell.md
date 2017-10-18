---
title: Perform operations on Azure Table storage with PowerShell | Microsoft Docs
description: Tutorial - Perform operations on Azure Table storage with PowerShell
services: storage
documentationcenter: storage
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 10/17/2017
ms.author: robinsh
---

# Perform Azure Table storage operations with Azure PowerShell 


> [NOTE]
> This article was written for basic Azure Table storage. However, these PowerShell commands should work for both classic Table Storage and the premium offering for Azure Storage Tables that is part of Cosmos DB Tables. For more information, see [Azure RM Storage Tables PowerShell module for Cosmos DB Tables](https://blogs.technet.microsoft.com/paulomarques/2017/05/23/azure-rm-storage-tables-powershell-module-now-includes-support-for-cosmos-db-tables/).
>

Azure Table Storage is a NoSQL datastore, which you can use to store and query huge sets of structured, non-relational data. The main components of the service are tables, entities, and properties. A table is a collection of entities. An entity is a set of properties. Each entity can have up to 252 properties, which are all name-value pairs. This article assumes that you are already familiar with the Azure Table Storage Service concepts. For detailed information, see [Understanding the Table Service Data Model](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model) and [Get started with Azure Table storage using .NET](table-storage-how-to-use-dotnet.md).

This how-to article covers common Table storage operations. You learn how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities
> * Delete a table

This how-to article has you create a storage account in a new resource group so you can easily remove it at the end. If you'd rather use an existing storage account, you can do that instead.

The examples require Azure PowerShell module version 4.4.0 or later. In a PowerShell window, run `Get-Module -ListAvailable AzureRM` to find the version. If nothing is listed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

## Sign in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
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
$storageTable = Get-AzureStorageTable –Context $ctx | select Name
```

## Retrieve a reference to a specific table

To perform operations on a table, you need a reference to the specific table. Get a reference using [Get-AzureStorageTable](/powershell/module/azure.storage/Get-AzureStorageTable). 

```powershell
$storageTable = Get-AzureStorageTable –Name $tableName –Context $ctx
```

## Managing table entities

Now that you have a table, let's look at how to manage entities in the table. 

### Add table entities

An entity can have up to 255 properties, including 3 system properties: **PartitionKey**, **RowKey**, and **Timestamp**. You are responsible for inserting and updating the values of **PartitionKey** and **RowKey**. The server manages the value of **Timestamp**, which cannot be modified. Together the **PartitionKey** and **RowKey** uniquely identify every entity within a table.

* **PartitionKey**: Determines the partition that the entity is stored in.
* **RowKey**: Uniquely identifies the entity within the partition.

You may define up to 252 custom properties for an entity. For more information, see [Understanding the Table Service Data Model](http://msdn.microsoft.com/library/azure/dd179338.aspx).

Add entities to a table using Add-StorageTableRow. These examples use partition keys with values "partition1" and "partition2", and row keys equal to state abbreviations. The properties in each entity are username and id. 

```powershell
$partitionKey1 = "partition1"
$partitionKey2 = "partition2"

# add four rows 
Add-StorageTableRow `
    -table $storageTable `
    -partitionKey $partitionKey1 `
    -rowKey ("CA") -property @{"username"="Chris";"id"=1}

Add-StorageTableRow `
    -table $storageTable `
    -partitionKey $partitionKey2 `
    -rowKey ("NM") -property @{"username"="Jessie";"id"=2}

Add-StorageTableRow `
    -table $storageTable `
    -partitionKey $partitionKey1 `
    -rowKey ("WA") -property @{"username"="Christine";"id"=3}

Add-StorageTableRow `
    -table $storageTable `
    -partitionKey $partitionKey2 `
    -rowKey ("TX") -property @{"username"="Steven";"id"=4}
```

### Query the table entities

There are several different ways to query the entities in a table. 

#### Retrieve all entities

To retrieve all entities, use Get-AzureStorageTableRowAll.

```powershell
Get-AzureStorageTableRowAll -table $storagetable | ft
```

This yields results similar to the following table.

| id | username | partition | rowkey |
|----|---------|---------------|----|
| 1 | Chris | partition1 | CA |
| 3 | Christine | partition1 | WA |
| 2 | Jessie | partition2 | NM |
| 4 | Steven | partition2 | TX |

#### Retrieve entities for a specific partition

To retrieve all entities in a specific partition, use Get-AzureStorageTableRowByPartitionKey.

```powershell
Get-AzureStorageTableRowByPartitionKey -table $storageTable -partitionKey $partitionKey1 | ft
```
The results look similar to the following table.

| id | username | partition | rowkey |
|----|---------|---------------|----|
| 1 | Chris | partition1 | CA |
| 3 | Christine | partition1 | WA |

#### Retrieve entities for a specific value in a specific column

To retrieve entities where the value in a specific column equals a specified value, use Get-AzureStorageTableRowByColumnName.

```powershell
Get-AzureStorageTableRowByColumnName -table $storageTable `
    -columnName "username" `
    -value "Chris" 
    -operator Equal
```

This query retrieves one record.

|----|----|
| id | 1 |
| username | Chris |
| PartitionKey | partition1 |
| RowKey      | CA |

#### Retrieve entities using a custom filter 

To retrieve entities using a custom filter, use Get-AzureStorageTableRowByCustomFilter.
s
```powershell
Get-AzureStorageTableRowByCustomFilter -table $storageTable -customFilter "(id eq 1)"
```

This query retrieves one record.

|----|----|
| id | 1 |
| username | Chris |
| PartitionKey | partition1 |
| RowKey      | CA |

### Updating entities 

These are three steps for updating entities. First, retrieve the entity to be changed. Second, make the change. Third, commit the change using Get-Update-AzureStorageTableRow.

Update the entity with username = 'Jessie' to have username = 'Jessie2'. This example also shows another way to create a custom filter using the .NET types. 

```powershell
# Create a filter and get the entity to be updated.
[string]$filter = `
    [Microsoft.WindowsAzure.Storage.Table.TableQuery]::GenerateFilterCondition("username",`
    [Microsoft.WindowsAzure.Storage.Table.QueryComparisons]::Equal,"Jessie")
$user = Get-AzureStorageTableRowByCustomFilter -table $storageTable -customFilter $filter

# Change the entity.
$user.username = "Jessie2" 

# To commit the change, pipe the updated record into the update cmdlet.
$user | Update-AzureStorageTableRow -table $storageTable 

# To see the new record, query the table.
Get-AzureStorageTableRowByCustomFilter -table $storageTable `
    -customFilter "(username eq 'Jessie2')"
```

The results show the Jessie2 record.

|----|----|
| id | 2 |
| username | Jessie2 |
| PartitionKey | partition2 |
| RowKey      | NM |

### Deleting table entities

You can delete one entity at a time, or all entities in the table with one command.

#### Deleting one entity

To delete a single entity, get a reference to that entity and pipe it into Remove-AzureStorageTableRow.

```powershell
# Set filter.
[string]$filter = `
  [Microsoft.WindowsAzure.Storage.Table.TableQuery]::GenerateFilterCondition("username",`
  [Microsoft.WindowsAzure.Storage.Table.QueryComparisons]::Equal,"Jessie2")

# Retrieve entity to be deleted, then pipe it into the remove cmdlet.
$userToDelete = Get-AzureStorageTableRowByCustomFilter -table $storageTable -customFilter 
$userToDelete | Remove-AzureStorageTableRow -table $storageTable 

# Retrieve entities from table and see that Jessie2 has been deleted.
Get-AzureStorageTableRowAll -table $storagetable | ft
```

#### Delete all rows in the table 

To delete all rows in the table, you retrieve all rows and pipe the results into the remove cmdlet. 

```powershell
# Get all rows and pipe it into the remove cmdlet.
Get-AzureStorageTableRowAll `
    -table $storageTable | Remove-AzureStorageTableRow -table $storageTable 

# List entities in the table (there won't be any).
Get-AzureStorageTableRowAll -table $storagetable | ft
```

## Delete a table

To delete a table, use [Remove-AzureStorageTable](/powershell/module/azure.storage/Remove-AzureStorageTable). This removes the table, including all of its data.

```powershell
Remove-AzureStorageTable –Name $tableName –Context $ctx

# Retrieve the list of tables to verify our table has been removed.
Get-AzureStorageTable –Context $Ctx | select Name
```

## Clean up resources

If you created a new resource group and a new table in that group, you can remove all of the assets you have created in this exercise by removing the resource group. This command deletes all resources contained within the group as well as the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about common Table storage operations with PowerShell, including how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities
> * Delete a table

For more information, please see the following articles.

* [Storage PowerShell cmdlets](/powershell/module/azurerm.storage#storage)

* [Working with Azure Storage Tables from PowerShell](https://blogs.technet.microsoft.com/paulomarques/2017/01/17/working-with-azure-storage-tables-from-powershell/).

* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
