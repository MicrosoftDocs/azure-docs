---
title: Create and manage directories in Azure Storage by using PowerShell
description: Use PowerShell cmdlets to create and manage directories in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.topic: article
ms.date: 06/26/2019
ms.author: normesta
---

# Create and manage directories in Azure Storage by using PowerShell

This article shows you how to use PowerShell to manage directories in storage accounts that have a hierarchical namespace.

## Connect to the storage account

1. Open a Windows PowerShell command window.

2. Verify that you have Azure PowerShell module Az version 0.7 or later.

   ```powershell
   Get-InstalledModule -Name Az -AllVersions | select Name,Version
   ```

   If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

3. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

4. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

5. Get the storage account context that defines the storage account you want to use.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

## Create a directory

Create a directory by using the `New-AzStorageBlobDirectory` cmdlet. 

Pass in the storage account context and the name of the file system (container) that you want to add the directory to.

```powershell
$containerName = "mycontainer"
$newDirectory = "my-directory"
$directory = New-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $newDirectory
```

## Rename or move a directory

Rename or move a directory by using the `Move-AzStorageBlobDirectory` cmdlet.

This example renames a directory named `my-directory` to `my-new-directory`.

```powershell
$containerName = "mycontainer"
$sourceDirectory = "my-directory"
$destinationDirectory = "my-new-directory"
$dir3 = Move-AzStorageBlobDirectory -Context $ctx -SrcContainer $containerName -SrcPath $sourceDirectory -DestContainer $containerName -DestPath $destinationDirectory
```

## Delete a directory

Delete a directory by using the `Remove-AzStorageBlobDirectory` cmdlet.

This example deletes a directory named `my-directory` directory. 

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
Remove-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory 
```

## Upload a file to a directory

Upload a directory by using the `Set-AzStorageBlobContent` cmdlet.

This example uploads a file named `text1.txt` to the `my-directory` directory. 

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$localSrcFile = "C:\help.txt"
Set-AzStorageBlobContent -Context $ctx -File $localSrcFile -Container $containerName -Blob "$($directory)/text1.txt" -Force 
```

## Download a file from a directory

Download a file from a directory by using the `Get-AzStorageBlobFromDirectory` cmdlet.

This example downloads a file named `text1.txt` from the `my-directory` directory. 

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt
$blob
```

## List the contents of a directory

List the contents of a directory by using the `Get-AzStorageBlobFromDirectory` cmdlet.

This example lists the contents of the `my-directory` directory. 

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName 
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
