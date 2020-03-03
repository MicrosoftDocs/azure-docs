---
title: Copy data in the cloud using PowerShell
description: This PowerShell script copies data from one location in an Azure Blob Storage to another location in the same Blob Storage.
services: data-factory
ms.author: jingwang
author: linda33wj
manager: shwang
ms.service: data-factory
ms.workload: data-services
ms.topic: article
ms.custom: seo-lt-2019
ms.date: 09/12/2017
---

# Use PowerShell to create a data factory pipeline to copy data in the cloud

This sample PowerShell script creates a pipeline in Azure Data Factory that copies data from one location to another location in an Azure Blob Storage.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

## Prerequisites
* **Azure Storage account**. You use the blob storage as both the **source** and **sink** data stores. If you don't have an Azure storage account, see the [Create a storage account](../../storage/common/storage-account-create.md) on creating one. 
* Create a **blob container** in Blob Storage, create an input **folder** in the container, and upload some files to the folder. You can use tools such as [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) to connect to Azure Blob storage, create a blob container, upload input file, and verify the output file.

## Sample script

> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/copy-from-azure-blob-to-blob/copy-from-azure-blob-to-blob.ps1 "Copy from Blob Storage -> Blob Storage")]


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

Additional Azure Data Factory PowerShell script samples can be found in the [Azure Data Factory PowerShell samples](../samples-powershell.md).
