---
title: "PowerShell script: Incrementally load data by using Azure Data Factory | Microsoft Docs"
description: This PowerShell script shows how to use Azure Data Factory to copy data incrementally from an Azure SQL Database to an Azure Blob Storage.. 
services: data-factory
author: linda33wj
manager: craigg
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 10/31/2017
ms.author: jingwang
---

# PowerShell script - Incrementally load data by using Azure Data Factory
This sample PowerShell script loads only new or updated records from a source data store to a sink data store after the initial full copy of data from the source to the sink.  

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

See [tutorial: incremental copy](../tutorial-incremental-copy-powershell.md#prerequisites) for the prerequisites for running this sample. 

## Sample script

> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/incremental-copy-from-azure-sql-to-blob/incremental-copy-from-azure-sql-to-blob.ps1 "Incremental copy from Azure SQL Database to Azure Blob Storage")]

## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourceGroupName
```
To remove the data factory from the resource group, run the following command: 

```powershell
Remove-AzDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [Set-AzDataFactoryV2](/powershell/module/az.datafactory/set-Azdatafactoryv2) | Create a data factory. |
| [Set-AzDataFactoryV2LinkedService](/powershell/module/az.datafactory/Set-Azdatafactoryv2linkedservice) | Creates a linked service in the data factory. A linked service links a data store or compute to a data factory. |
| [Set-AzDataFactoryV2Dataset](/powershell/module/az.datafactory/Set-Azdatafactoryv2dataset) | Creates a dataset in the data factory. A dataset represents input/output for an activity in a pipeline. | 
| [Set-AzDataFactoryV2Pipeline](/powershell/module/az.datafactory/Set-Azdatafactoryv2pipeline) | Creates a pipeline in the data factory. A pipeline contains one or more activities that performs a certain operation. In this pipeline, a copy activity copies data from one location to another location in an Azure Blob Storage. |
| [Invoke-AzDataFactoryV2Pipeline](/powershell/module/az.datafactory/Invoke-Azdatafactoryv2pipeline) | Creates a run for the pipeline. In other words, runs the pipeline. |
| [Get-AzDataFactoryV2ActivityRun](/powershell/module/az.datafactory/get-Azdatafactoryv2activityrun) | Gets details about the run of the activity (activity run) in the pipeline. 
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Factory PowerShell script samples can be found in the [Azure Data Factory PowerShell scripts](../samples-powershell.md).
