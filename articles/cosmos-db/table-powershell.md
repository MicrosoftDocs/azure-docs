---
title: Perform Azure Cosmos DB Table API operations with PowerShell | Microsoft Docs
description: How to perform Azure Cosmos DB Table API operations with PowerShell
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
ms.date: 11/02/2017
ms.author: robinsh
---
# Perform Azure Cosmos DB Table API operations with Azure PowerShell 

>[!NOTE]
>Azure Cosmos DB Table API provides premium features for table storage such as turnkey global distribution, low latency reads and writes, automatic secondary indexing, and dedicated throughput. In most cases, the PowerShell commands in this article work for both Azure Cosmos DB Table API and Azure Table storage, but this article is specific to Azure Cosmos DB Table API. If you are using Azure Table storage, see [Perform Azure Table storage operations with Azure PowerShell](table-storage-how-to-use-powershell.md).
>

Azure Cosmos DB Table API enables you to store and query huge sets of structured, non-relational data. The main components of the service are tables, entities, and properties. A table is a collection of entities. An entity is a set of properties. Each entity can have up to 252 properties, which are all name-value pairs. This article assumes that you are already familiar with the Azure Cosmos DB Table API concepts. For detailed information, see [Introduction to Azure Cosmos DB Table API](table-introduction.md) and [Build a .NET application using the Table API](create-table-dotnet.md).

This how-to article covers common Table API operations. You learn how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities

## Prerequisites

The examples require Azure PowerShell module version 4.4.0 or later. In a PowerShell window, run `Get-Module -ListAvailable AzureRM` to find the version. If nothing is displayed, or you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 

After Azure PowerShell is installed or updated, you must install module **AzureRmStorageTable**, which has the commands for managing the entities. To install this module, run PowerShell as an administrator and use the **Install-Module** command.

```powershell
Install-Module AzureRmStorageTable
```

While Azure Cosmos DB Table API is in preview, you also have to install its assemblies locally in order to use these PowerShell cmdlets. For instructions on how to do that, see [Azure RM Storage Tables PowerShell module for Cosmos DB Tables](https://blogs.technet.microsoft.com/paulomarques/2017/05/23/azure-rm-storage-tables-powershell-module-now-includes-support-for-cosmos-db-tables/).

To try out the following exercises, you need an Azure Cosmos DB database account. If you don't already have one, create a new Azure Cosmos DB account using the [Azure portal](https://portal.azure.com). For help creating a new database account, see [Azure Cosmos DB: Create a database account](create-table-dotnet.md#create-a-database-account).

Get the database account name and resource group from the portal; you need these values to put in your script to access the tables. 

## Sign in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create a table or reference a table

To create a table or to get a reference to a table, use **Get-AzureStorageTableTable**. If you call this cmdlet with the name of a table that doesn't exist, it creates a new table with that name and returns a reference to the new table. If the table does exist, it returns a reference to the existing table.

```powershell
# set the name of the resource group in which your Cosmos DB Account resides.
$resourceGroup = "contosocosmosrg"
# if you want to make sure the resource group is valid, try this command
Get-AzureRmResourceGroup -Name $resourceGroup

# set the Cosmos DB account name 
$cosmosDBAccountName = "contosocosmostbl" 

# set the table name 
$tableName = "contosotable1"

# Get a reference to a table. This creates the table if it doesn't exist.
$storageTable = Get-AzureStorageTableTable `
  -resourceGroup $resourceGroup `
  -tableName $tableName `
  -cosmosDbAccount $cosmosDBAccountName 
```

You can't list the tables in the Azure Cosmos DB account using PowerShell, but you can sign in to the portal and see the table. Now let's look at how to manage the entities in the table.

[!INCLUDE [storage-table-entities-powershell-include](../../includes/storage-table-entities-powershell-include.md)]

## Delete a table 

PowerShell doesn't support deleting tables from Azure Cosmos DB. To delete a table, go to the [Azure portal](https://azure.portal.com), locate the Azure Cosmos DB account you're using, then find and delete the table. 

## Clean up resources

If you created a new resource group and created a new Azure Cosmos DB account in that group, you can remove all of the assets you have created in this exercise by removing the resource group. This command deletes all resources contained within the group as well as the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about common Table API operations with PowerShell, including how to: 

> [!div class="checklist"]
> * Create a table
> * Retrieve a table
> * Add table entities
> * Query a table
> * Delete table entities

For more information, see the following articles:

* [Working with Azure Storage Tables from PowerShell](https://blogs.technet.microsoft.com/paulomarques/2017/01/17/working-with-azure-storage-tables-from-powershell/)

* [Microsoft Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.