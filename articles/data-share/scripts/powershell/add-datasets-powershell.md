---
title: "PowerShell script: Add a blob dataset to an Azure Data Share"
description: This PowerShell script adds a blob dataset to an existing share.
author: chvukosw
ms.author: chvukosw
ms.service: azure-data-share
ms.topic: article
ms.date: 10/13/2026
ms.custom: devx-track-azurepowershell, msecd-doc-authoring-1030
ai-usage: ai-assisted
---

# Use PowerShell to add a blob dataset to a data share in Azure

> [!IMPORTANT]
> Azure Data Share is being retired. You can no longer create new Azure Data Share accounts, and existing capabilities will remain in maintenance mode through October 30, 2027. For retirement timelines, transition guidance, and recommended next steps, see the [Azure Data Share retirement announcement](https://aka.ms/ADS-Deprecation).

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
| [New-AzDataShareDataSet](/powershell/module/az.datashare/new-azdatasharedataset) | Adds a dataset to a data share. |
|||

## Related content

For more information on the Azure PowerShell, see [Azure PowerShell documentation](/powershell/).

Other Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../../samples-powershell.md).
