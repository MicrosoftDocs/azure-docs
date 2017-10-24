---
title: Perform operations on Azure Cosmos DB Table storage with PowerShell | Microsoft Docs
description: How to perform operations on Azure Cosmos Table storage with PowerShell
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
# Perform Azure Cosmos DB Table storage operations with Azure PowerShell 

>[!NOTE]
> Azure Cosmos DB is the premium offering for Azure Storage Tables. The PowerShell cmdlets for Cosmos DB are a subset of the cmdlets that work against standard Table Storage. If you are using standard Table Storage, please see [Azure Storage Table operations with PowerShell](table-storage-how-to-use-powershell.md).
>

<!-- fix this part robin -->
The Table PI in Azure Cosmos DB enables you to store and query huge sets of structured, non-relational data. The main components of the service are tables, entities, and properties. A table is a collection of entities. An entity is a set of properties. Each entity can have up to 252 properties, which are all name-value pairs. This article assumes that you are already familiar with the Azure Table Storage Service concepts. For detailed information, see [Understanding the Table Service Data Model](/rest/api/storageservices/Understanding-the-Table-Service-Data-Model) and [Get started with Azure Table storage using .NET](table-storage-how-to-use-dotnet.md).

This how-to article covers common Table storage operations. You learn how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities

The examples require Azure PowerShell module version 4.4.0 or later. In a PowerShell window, run `Get-Module -ListAvailable AzureRM` to find the version. If nothing is listed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

## Preparation

Cosmos DB Table APIs are in preview, so you have to install them locally in order to use these PowerShell cmdletswith them. For instructions on how to do that, see [Azure RM Storage Tables PowerShell module for Cosmos DB Tables](https://blogs.technet.microsoft.com/paulomarques/2017/05/23/azure-rm-storage-tables-powershell-module-now-includes-support-for-cosmos-db-tables/).

You can not create a Cosmos Table DB using PowerShell, so before proceeding with PowerShell, go into the portal and create a Cosmos DB account in a resource group. Put the resource group name and the Cosmos DB account name in your script. You need both of these to access the tables. If you already have a Cosmos DB account, you can use that instead of creating a new one.

<!-- robin add a reference to a quick start or something if available -->

## Sign in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create a table or reference a table

You use the same command to get a reference to a table and to create a table. 
To create a table or to get a reference to a table, use **Get-AzureStorageTableTable**. If you call this with the name of a table that doesn't exist, it will create a new table with that name and return a reference to the new table. If the table does exist, it returns a reference to that table.

```powershell
# set the name of the resource group in which your Cosmos DB Account resides.
$resourceGroup = "contosocosmosrg"
# if you want to make sure the resource group is valid, try this command
Get-AzureRmResourceGroup -Name $resourceGroup

# set the Cosmos DB account name 
$cosmosDBAccountName = "contosocosmostbl" 

# set the table name 
$tableName = "contosotable1"

# Get a reference to a table. This will create the table if it doesn't exist.
$storageTable = Get-AzureStorageTableTable `
  -resourceGroup $resourceGroup `
  -tableName $tableName `
  -databaseName $cosmosDBAccountName 
```
<!-- Robin: Paulo changed it to use account name, get exact parameter -->

You can't list the tables in the Cosmos DB Account using PowerShell, but you can log into the portal and see the table. Now let's look at how to manage the entities in the table.

[!INCLUDE [storage-table-entities-powershell-include](../../includes/storage-table-entities-powershell-include.md)]

## Delete a table 

PowerShell doesn't support deleting tables from Cosmos DB. To delete a table, go to the [Azure portal](https://azure.portal.com), locate the Azure Cosmos DB Account you're using, then delete the table. 

## Clean up resources

If you created a new resource group and created a new Cosmos DB Account in that group, you can remove all of the assets you have created in this exercise by removing the resource group. This command deletes all resources contained within the group as well as the resource group itself.

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

For more information, please see the following articles.

* [Working with Azure Storage Tables from PowerShell](https://blogs.technet.microsoft.com/paulomarques/2017/01/17/working-with-azure-storage-tables-from-powershell/)

* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
