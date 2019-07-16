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

This guide shows you how to use PowerShell to interact with objects, manage directories, and set access permissions (access control lists) for files and directories in storage accounts that have a hierarchical namespace. 

To use the examples presented in this article, you'll need to create a storage account, and then enable the hierarchical namespace feature on that account. See [Create a storage account](data-lake-storage-quickstart-create-account.md).

> [!NOTE]
> The content featured in this article uses terms such as *blobs* and *containers* instead of *files* and *file systems*. That's because Azure Data Lake Storage Gen2 is built on blob storage, and in blob storage a *file* is persisted as a *blob*, and a *file system* is persisted as a *container*.

## Connect to the storage account

1. Open a Windows PowerShell command window.

2. Verify that you have Azure PowerShell module Az version 0.7 or later.

   ```powershell
   Get-Module -Name Az.* -ListAvailable | select Name,Version
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

## Delete a directory from a file system (container)

Delete a directory by using the `Remove-AzStorageBlobDirectory` cmdlet.

```powershell
$containerName = "mycontainer"
$directory = "my-new-directory"
Remove-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory 
```

## Upload a file (blob) to a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$localSrcFile = "C:\help.txt"
Set-AzStorageBlobContent -Context $ctx -File $localSrcFile -Container $containerName -Blob "$($directory)/text1.txt" -Force 
```

## List the files (blobs) in a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName 
```

## Get a file (blob) from a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt
$blob
```

## Get the access control list (ACL) of a directory

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$dir = Get-AzStorageBlobDirectory -Context $ctx -Container $containerName -BlobDirectoryPath my-directory -FetchPermission
$dir
$dir.CloudBlobDirectory.Properties
```
## Get the ACL of a file (blob)

Do blah by using the blah.

This example does blah.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt -FetchPermission
$blob
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
## Set the ACL of a file (blob)

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

## Perform common tasks with your files (blobs)

You can use the same set of PowerShell commands to interact with your data objects regardless of whether the account has a hierarchical namespace. To find examples that help you perform common tasks such as creating a container (file system), uploading and downloading blobs (files), and deleting blobs and containers, see [Quickstart: Upload, download, and list blobs by using Azure PowerShell](storage-quickstart-blobs-powershell.md).

The rest of this article presents snippets that help you perform tasks related only to accounts that have a hierarchical namespace.

## Next steps

Explore more APIs in the [blob package](https://docs.microsoft.com/python/api/azure-storage-blob/azure.storage.blob?view=azure-python) section of the [Azure Client SDK for Python](https://docs.microsoft.com/python/api/overview/azure/storage/client?view=azure-python) docs.
