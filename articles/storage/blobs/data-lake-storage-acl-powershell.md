---
title: Manage directory and file access permissions in Azure Storage by using PowerShell
description: Use PowerShell cmdlets to manage directory and file access permissions in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.topic: quickstart
ms.date: 06/26/2019
ms.author: normesta
---

# Manage directory and file access permissions in Azure Storage by using PowerShell

This article shows you how to use PowerShell to manage directory and file access permissions in storage accounts that have a hierarchical namespace. 

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

## Get the access control list (ACL) of a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$dir = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath my-directory -FetchPermission
$dir
$dir.CloudBlobDirectory.Properties
```

## Set the ACL of a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$acl = New-AzStorageBlobPathACL -AccessControlType user -Permission rw- -DefaultScope
$acl = New-AzStorageBlobPathACL -AccessControlType group -Permission rw- -InputObject $acl 
$acl = New-AzStorageBlobPathACL -AccessControlType other -Permission "-wx" -InputObject $acl
$dir1 = Set-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory -ACL $acl
$directory.CloudBlobDirectory
$blob.ICloudBlob.PathProperties
```

## Get the ACL of a file

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt -FetchPermission
$blob
```

## Set the ACL of a file

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$acl = New-AzStorageBlobPathACL -AccessControlType user -Permission r-x 
$acl = New-AzStorageBlobPathACL -AccessControlType group -Permission rwx -InputObject $acl 
$acl = New-AzStorageBlobPathACL -AccessControlType other -Permission "-w-" -InputObject $acl
$blob = Set-AzStorageBlob -Context $ctx -Container $containerName -Path text.txt -ACL $acl
$blob.ICloudBlob.PathProperties
```

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
