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

## First, connect to the storage account

See [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Get access control lists (ACLs)

You can get the ACL of a directory or a file.

### Get the ACL of a directory

Get the ACL of a directory by using the `Get-AzStorageBlobFromDirectory`cmdlet with the `-FetchPermission` parameter.

This example gets the ACL of a directory, and then prints the short form of the ACL to the console.

```powershell
$containerName = "mycontainer"
$dir = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath my-directory -FetchPermission
$dir
$dir.CloudBlobDirectory.Properties
```

The short form of an ACL might look something like the following:

`user::rwx group::r-x other::--`

This string means that the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Get the ACL of a file

Get the access permissions of a file by using the `Get-AzStorageBlobFromDirectory` with the `-FetchPermission` and `BlobRelativePath` parameters.

This example gets the ACL of a file and then prints the short form of ACL to the console.

```powershell
$containerName = "mycontainer"
$directoryName = "my-directory"
$blob = Get-AzStorageBlobFromDirectory -Context $ctx -Container $containerName -BlobDirectoryPath $directoryName  -BlobRelativePath text1.txt -FetchPermission
$blob
```

## Set access control lists (ACLs)

You can set the ACL of a directory or a file.

### Set the ACL of a directory

Use the `New-AzStorageBlobPathACL` cmdlet to set ACLs for the owning user, owning group, or other users. 

Use the `Set-AzStorageBlobDirectory` to commit the ACLs.

This example sets ACLs on a file for the owning user, owning group, or other users.

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

### Set the ACL of a file

Use the `New-AzStorageBlobPathACL` cmdlet to set ACLs for the owning user, owning group, or other users. 

Use the `Set-AzStorageBlob` to commit the ACLs.

This example sets ACLs on a file for the owning user, owning group, or other users.

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

To learn more about working with Blob storage by using PowerShell, see [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

To find a comprehensive list of Microsoft Azure PowerShell Storage cmdlets, see [Storage PowerShell cmdlets](/powershell/module/az.storage).
