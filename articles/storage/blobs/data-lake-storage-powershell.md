---
title: "Put title here"
description: Put description here.
services: storage
author: normesta
ms.service: storage
ms.topic: quickstart
ms.date: 06/26/2019
ms.author: normesta
---

# Use PowerShell with Azure Data Lake Storage Gen2

This guide shows you how to use PowerShell to interact with objects, manage directories, and set directory-level access permissions (access-control lists) in storage accounts that have a hierarchical namespace. 

To use the examples presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*.

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

## Add directory to a file system (container)

Create a directory by using the `New-AzStorageBlobDirectory` cmdlet. 

Pass in the storage account context and the name of the file system (container) that you want to add the directory to.

```powershell
$containerName = "mycontainer"
$directory = New-AzStorageBlobDirectory -Context $ctx -Container $containerName
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

## Delete a directory from a file system (container)

Delete a directory by using the `Remove-AzStorageBlobDirectory` cmdlet.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
Remove-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory 
```

## Get the access permissions of a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$dir2 = Get-AzStorageBlob -Context $ctx -Name $containerName -Blob "my-directory/" -FetchPermission
```

## Set the access permissions of a directory

Do blah by using the blah.

This example does blah.

```powershell
Example goes here.
```

## Perform common tasks with your files (blobs)

You can use the same set of PowerShell commands to interact with your data objects regardless of whether the account has a hierarchical namespace. To find examples that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Upload, download, and list blobs by using Azure PowerShell](storage-quickstart-blobs-powershell.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace.

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
