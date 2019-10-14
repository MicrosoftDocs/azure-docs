---
title: Manage file and directory level permissions in Azure Storage by using PowerShell
description: Use PowerShell cmdlets to manage manage file and directory level permissions in Azure Blob storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: conceptual
ms.date: 06/26/2019
ms.author: normesta
ms.reviewer: prishet
---

# Manage file and directory level permissions in Azure Storage by using PowerShell

This article shows you how to use PowerShell to get and set the access control lists (ACLs) of directories and files in storage accounts that have a hierarchical namespace.

## Connect to your storage account

1. Open a Windows PowerShell command window.

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that contains your directories and files.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

4. Get the storage account context that contains your directories and files.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

## Get the ACL of a directory

Get the ACL of a directory by using the `Get-AzStorageBlob`cmdlet with the `-FetchPermission` parameter.

This example gets the ACL of a directory, and then prints the short form of the ACL to the console.

```powershell
$containerName = "mycontainer"
$dir = Get-AzStorageBlob -Container $containerName -blob my-directory -Context $ctx -FetchPermission
$dir.CloudBlobDirectory.PathProperties
```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Get the ACL of a file

Get the access permissions of a file by using the `Get-AzStorageBlobFromDirectory` with the `-FetchPermission` and `BlobRelativePath` parameters.

This example gets the ACL of a file and then prints the short form of ACL to the console.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt -FetchPermission
$blob.ICloudBlob.PathProperties
```

## Set the ACL of a directory

Use the `New-AzStorageBlobPathACL` cmdlet to set the ACL on a directory for the owning user, owning group, or other users. Then, use the `Set-AzStorageBlobDirectory` cmdlet to commit the ACL.

This example sets the ACL on a directory for the owning user, owning group, or other users.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$acl = New-AzStorageBlobPathACL -AccessControlType user -Permission rw- -DefaultScope
$acl = New-AzStorageBlobPathACL -AccessControlType group -Permission rw- -InputObject $acl
$acl = New-AzStorageBlobPathACL -AccessControlType other -Permission -wx -InputObject $acl
$dir = Set-AzStorageBlobDirectory -Context $ctx -Container $containerName -Path $directory -ACL $acl
$dir.CloudBlobDirectory.PathProperties
```

## Set the ACL of a file

Use the `New-AzStorageBlobPathACL` cmdlet to set ACL on a file for the owning user, owning group, or other users. Then, use the `Set-AzStorageBlob` to commit the ACL.

This example sets ACL on a file for the owning user, owning group, or other users.

```powershell
$containerName = "mycontainer"
$directory = "my-directory"
$acl = New-AzStorageBlobPathACL -AccessControlType user -Permission r-x 
$acl = New-AzStorageBlobPathACL -AccessControlType group -Permission rwx -InputObject $acl 
$acl = New-AzStorageBlobPathACL -AccessControlType other -Permission "-w-" -InputObject $acl
$blob = Set-AzStorageBlob -Context $ctx -Container $containerName -Path text1.txt -ACL $acl
$blob.ICloudBlob.PathProperties
```

## Sample

Put link to github sample here along with some explanatory text.

## Next steps

To learn more about working with Blob storage by using PowerShell, see [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

To find a comprehensive list of Microsoft Azure PowerShell Storage cmdlets, see [Storage PowerShell cmdlets](/powershell/module/az.storage).
