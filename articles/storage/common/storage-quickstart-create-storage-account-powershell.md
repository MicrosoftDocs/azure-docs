---
title: Azure Quickstart - Create a storage account using PowerShell | Microsoft Docs
description: Quickly learn to create a new storage account with PowerShell
services: storage
documentationcenter: ''
author: robinsh
manager: timlt
editor: tysonn

ms.assetid: 
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 06/29/2017
ms.author: robinsh
---

# Create a storage account using PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This guide details using PowerShell to create an Azure Storage account. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

This quick start requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. This example will use **eastus**. Store this in a variable and use the variable so you can change it in one place.

```powershell
Get-AzureRmLocation | select Location 
$location = "eastus"
```

## Create resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```powershell
# put resource group in a variable so you can use the same group name going forward
#   without hardcoding it repeatedly
$resourceGroup = "contoso-storage-accounts"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 
```

## Create a general-purpose standard storage account

There are several types of storage accounts, depending on how it is going to be used, and for which service (blobs, files, tables, or queues). This table shows the possibilities.

|**Type of storage account**|**General-purpose Standard**|**General-purpose Premium**|**Blob storage, hot and cool access tiers**|
|-----|-----|-----|-----|
|**Services supported**| Blob, File, Table, Queue services | Blob service | Blob service|
|**Types of blobs supported**|Block blobs, page blobs, append blobs | Page blobs | Block blobs and append blobs|

Use [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount) to create a general-purpose standard storage account that you can use for all four services. Name the storage account *contosomvcstandard*, and configure it to have Locally Redundant Storage and blob encryption enabled.

```powershell
New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name "contosomvcstandard" `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage `
  -EnableEncryptionService Blob
```

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group and all related resources. In this case, it removes the storage account you created.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this quick start, you've created a general-purpose standard storage account. To learn how to upload and download blobs with your storage account, continue to the Blob storage quickstart.
> [!div class="nextstepaction"]
> [Transfer objects to/from Azure Blob storage using PowerShell](../blobs/storage-quickstart-blobs-powershell.md)