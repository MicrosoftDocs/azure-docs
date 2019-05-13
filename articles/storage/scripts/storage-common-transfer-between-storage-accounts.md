---
title: Azure PowerShell Script Sample - Migrate blobs across storage accounts using AzCopy on Windows | Microsoft Docs
description: Using AzCopy, copies the Blob contents of one Azure Storage Account to another.
services: storage
documentationcenter: na
author: roygara
manager: jeconnoc

ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: sample
ms.date: 02/01/2018
ms.author: rogarana
---

# Migrate blobs across storage accounts using AzCopy on Windows

This sample copies all blob objects from a user-provided source storage account to a user-provided target storage account. 

This is accomplished by making use of the `Get-AzStorageContainer` command, which lists all the containers in a storage account. The sample then issues AzCopy commands, copying each container from the source storage account to the destination storage account. If any failures occur, the sample retries $retryTimes (default is 3, and can be modified with the `-RetryTimes` parameter). If failure is experienced on each retry, the user can rerun the script by providing the sample with the last successfully copied container using the `-LastSuccessContainerName` parameter. The sample then continues copying containers from that point.

This sample requires the Azure PowerShell Storage module version **0.7** or later. You can check your installed version using `Get-Module -ListAvailable Az.storage`. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). 

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

This sample also requires the latest version of [AzCopy on Windows](https://aka.ms/downloadazcopy). The default install directory is `C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\`

This sample takes in a source storage account name and key, a target storage account name and key, and the full filepath of the AzCopy.exe (if it is not installed at the default directory).

The following are examples of the input for this sample:

If AzCopy is installed at the default directory:
```powershell
srcStorageAccountName: ExampleSourceStorageAccountName
srcStorageAccountKey: ExampleSourceStorageAccountKey
DestStorageAccountName: ExampleTargetStorageAccountName
DestStorageAccountKey: ExampleTargetStorageAccountKey
```

If AzCopy is not installed at the default directory:

```Powershell
srcStorageAccountName: ExampleSourceStorageAccountName
srcStorageAccountKey: ExampleSourceStorageAccountKey
DestStorageAccountName: ExampleTargetStorageAccountName
DestStorageAccountKey: ExampleTargetStorageAccountKey
AzCopyPath: C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe
```

If failure is experienced and the sample must be rerun from a particular container: 

`.\copyScript.ps1 -LastSuccessContainerName myContainerName`

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/migrate-blobs-between-accounts/migrate-blobs-between-accounts.ps1 "Migrate blobs between storage accounts.")]

## Script explanation

This script uses the following commands to copy data from one storage account to another. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzStorageContainer](/powershell/module/az.storage/Get-AzStorageContainer) | Returns the containers associated with this Storage account. |
| [New-AzStorageContext](/powershell/module/az.storage/New-AzStorageContext) | Creates an Azure Storage context. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Blob storage](../blobs/storage-samples-blobs-powershell.md).
