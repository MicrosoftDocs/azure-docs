---
title: "PowerShell script: Add a blob dataset to an Azure Data Share | Microsoft Docs"
description: This PowerShell script adds a blob dataset to an existing share.
services: data-share
author: joannapea

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: joanpo
---

# Use PowerShell to create a data share in Azure

This PowerShell script adds a blob dataset to an existing Data Share.

## Sample script

```powershell
# Set variables with your own values
$resourceGroupName = "<Resource group name>"
$dataShareAccountName = "<Data share account name>"
$dataShareName = "<Data share name>"
$blobDatasetName = "<Dataset name>"
$blobContainer = "<Blob container name>"
$blobFilePath = "<Blob file path>"
$storageAccountResourceId = "<Storage account resource id>"

#Add a blob dataset to the datashare
New-AzDataShareDataSet -ResourceGroupName $resourceGroupName -AccountName $dataShareAccountName -ShareName $dataShareName -Name $blobDataSetName -StorageAccountResourceId $storageAccountResourceId -FilePath $blobFilePath

```


## Script explanation

This script uses the following commands: 

| Command | Notes |
|---|---|
| [New-AzDataShareDataSet](/powershell/module/az.datashare/new-azdatasharedataset?view=azps-2.6.0) | Adds a dataset to a data share. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
