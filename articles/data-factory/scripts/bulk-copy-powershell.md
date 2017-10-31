---
title: "PowerShell script: Copy data in bulk by using Azure Data Factory | Microsoft Docs"
description: This PowerShell script shows how to use Azure Data Factory to copy data from a source data store to a destination data store in bulk. 
services: data-factory
author: spelluru
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/31/2017
ms.author: spelluru
---

# PowerShell script - copy multiple tables in bulk by using Azure Data Factory

This sample PowerShell script copies a number of tables from Azure SQL Database to Azure SQL Data Warehouse.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Prerequisites

* **Azure Storage account**. The Azure Storage account is used as staging blob storage in the bulk copy operation. 
* **Azure SQL Database**. This database contains the source data. 
* **Azure SQL Data Warehouse**. This data warehouse holds the data copied over from the SQL Database. 

### Prepare SQL Database and SQL Data Warehouse

**Prepare the source Azure SQL Database**

Create an Azure SQL Database with Adventure Works LT sample data following [Create an Azure SQL database](../sql-database/sql-database-get-started-portal.md) article. This tutorial copies all the tables from this sample database to a SQL data warehouse.

**Prepare the sink Azure SQL Data Warehouse**

1. If you don't have an Azure SQL Data Warehouse, see the [Create a SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-get-started-tutorial.md#create-a-sql-data-warehouse) article for steps to create one.

2. Create corresponding table schemas in SQL Data Warehouse. You can use [Migration Utility](https://www.microsoft.com/download/details.aspx?id=49100) to **migrate schema** from Azure SQL Database to Azure SQL Data Warehouse. You use Azure Data Factory to migrate/copy data in a later step.

**Azure services to access SQL server**
For both SQL Database and SQL Data Warehouse, allow Azure services to access SQL server. Ensure that **Allow access to Azure services** setting is turned **ON** for your Azure SQL server. This setting allows the Data Factory service to read data from your Azure SQL Database and write data to your Azure SQL Data Warehouse. To verify and turn on this setting, do the following steps:

1. Click **More services** hub on the left and click **SQL servers**.
2. Select your server, and click **Firewall** under **SETTINGS**.
3. In the **Firewall settings** page, click **ON** for **Allow access to Azure services**.

## Sample script

> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/bulk-copy-from-sql-databse-to-sql-data-warehouse/bulk-copy-from-sql-databse-to-sql-data-warehouse.ps1 "Copy from Blob Storage -> Blob Storage")]


## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName $resourceGroupName
```
To remove the data factory from the resource group, run the following command: 

```powershell
Remove-AzureRmDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [Set-AzureRmDataFactoryV2](/powershell/module/azurerm.datafactoryv2/set-azurermdatafactoryv2) | Create a data factory. |
| [Set-AzureRmDataFactoryV2LinkedService](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactoryv2linkedservice) | Creates a linked service in the data factory. A linked service links a data store or compute to a data factory. |
| [Set-AzureRmDataFactoryV2Dataset](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactoryv2dataset) | Creates a dataset in the data factory. A dataset represents input/output for an activity in a pipeline. | 
| [Set-AzureRmDataFactoryV2Pipeline](/powershell/module/azurerm.datafactoryv2/Set-azurermdatafactorv2ypipeline) | Creates a pipeline in the data factory. A pipeline contains one or more activities that performs a certain operation. In this pipeline, a copy activity copies data from one location to another location in an Azure Blob Storage. |
| [Invoke-AzureRmDataFactoryV2Pipeline](/powershell/module/azurerm.datafactoryv2/Invoke-azurermdatafactoryv2pipelinerun) | Creates a run for the pipeline. In other words, runs the pipeline. |
| [Get-AzureRmDataFactoryV2ActivityRun](/powershell/module/azurerm.datafactoryv2/get-azurermdatafactoryv2activityrun) | Gets details about the run of the activity (activity run) in the pipeline. 
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Factory PowerShell script samples can be found in the [Azure Data Factory PowerShell scripts](../samples-powershell.md).