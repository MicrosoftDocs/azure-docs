---
title: "PowerShell script: Copy data in the cloud by using Azure Data Factory | Microsoft Docs"
description: This PowerShell script copies data from one location in an Azure Blob Storage to another location in the same Blob Storage. 
services: data-factory
author: spelluru
manager: jhubbard
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2017
ms.author: spelluru
---

# Use PowerShell to create a data factory pipeline to copy data in the cloud

This sample PowerShell script creates an Azure Cosmos DB API account. 

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

## Sample script

> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/copy-from-azure-blob-to-blob/copy-from-azure-blob-to-blob.ps1?highlight=9,12-15,18,21-23,26-29,32-37 "Copy from Blob Storage -> Blob Storage")]


## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName "myResourceGroup"
```
To remove the data factory from the resource group, run the following command: 

```powershell
Remove-AzureRmDataFactoryV2 -Name "<data factory name>" -ResourceGroupName "<resource group name>"
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
| [Invoke-AzureRmDataFactoryV2PipelineRun](/powershell/module/azurerm.datafactoryv2/Invoke-azurermdatafactoryv2pipelinerun) | Creates a run for the pipeline. In other words, runs the pipeline. |
| [Get-AzureRmDataFactoryV2ActivityRun](/powershell/module/azurerm.datafactoryv2/get-azurermdatafactoryv2activityrun) | Gets details about the run of the activity (activity run) in the pipeline. 
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Cosmos DB PowerShell script samples can be found in the [Azure Cosmos DB PowerShell scripts](../samples-powershell.md).