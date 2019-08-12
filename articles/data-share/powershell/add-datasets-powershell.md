---
title: "PowerShell script: Add a blob dataset to a Data Share | Microsoft Docs"
description: This PowerShell script adds a blob dataset to an existing share.
services: data-share
author: t-roupa

ms.service: data-share
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 07/07/2019
ms.author: t-roupa
---

# Use PowerShell to create a data share in Azure

This PowerShell script adds a blob dataset to an existing Data Share.

## Prerequisites
* **Azure Resource Group**. If you don't have an Azure resource group, see [Create a resource group](../../azure-resource-manager/deploy-to-subscription.md) on creating one.
* **Azure Data Share Account**. If you don't have an Azure Data Share account, see [Create a Data Share account](/create-new-share-account-powershell.md) on creating one.
* **Azure Data Share**. If you don't have an Azure Data Share, see [Create a Data Share account](/create-new-share-account-powershell.md) on creating one.


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
| [New-AzDataShareDataSet](/powershell/module/az.resources/new-azdatasharedataset) | Adds a dataset to a data share. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Share PowerShell script samples can be found in the [Azure Data Share PowerShell samples](../samples-powershell.md).
