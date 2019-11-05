---
title: Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (PowerShell)
description: Use PowerShell cmdlets to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: normesta
ms.reviewer: prishet
---

# Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (PowerShell)

This article shows you how to use PowerShell to create and manage directories, files, and POSIX [access control lists](data-lake-storage-access-control.md) (ACLs) in storage accounts that have a hierarchical namespace. 

[Reference documentation](/dotnet/api/azure.storage.blobs) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs) | [Sample](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs/samples)

## Connect to the account

1. Open a Windows PowerShell command window.

2. Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

   ```powershell
   Connect-AzAccount
   ```

3. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that you want create and manage directories in.

   ```powershell
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

4. Get the storage account context.

   ```powershell
   $storageAccount = Get-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>"
   $ctx = $storageAccount.Context
   ```

   * Replace the `<resource-group-name>` placeholder value with the name of your resource group.

   * Replace the `<storage-account-name>` placeholder value with the name of your storage account.

## Create a file system

A file system acts as a container for your files. You can create one by using the `New-AzDatalakeGen2FileSystem` cmdlet. 

This example creates a file system named `my-file-system`.

```powershell
$filesystemName = "my-file-system";
New-AzDatalakeGen2FileSystem -Context $ctx -Name $filesystemName
```

## Create a directory

Create a directory reference by using the `New-AzDataLakeGen2Item` cmdlet. 

This example adds a directory named `my-directory` to a file system.

```powershell
$filesystemName = "my-file-system";
$dirname = "my-directory"
New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Directory
```

## Rename or move a directory

Rename or move a directory by using the `Move-AzDataLakeGen2Item` cmdlet.

This example renames a directory from the name `my-directory` to the name `my-new-directory`.

```powershell
$filesystemName = "my-file-system";
$dirname2 = "my-new-directory"
Move-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -DestFileSystem $filesystemName -DestPath $dirname2
```

## Delete a directory

Delete a directory by using the `Remove-AzDataLakeGen2Item` cmdlet.

This example deletes a directory named `my-directory`. 

```powershell
$filesystemName = "my-file-system";
$dirname = "my-directory"
Remove-AzDataLakeGen2Item  -Context $ctx -FileSystem $filesystemName -Path $dirname 
```

## Get the ACL of a directory

Get the ACL of a directory by using the `Get-AzStorageBlob`cmdlet with the `-FetchPermission` parameter.

This example gets the ACL of a directory, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system";
$dir = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
```

The output might look something like the following:

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/get-acl.png)

In this example, the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL of a directory

Use the `New-AzDataLakeGen2ItemAclObject` cmdlet to create an ACL for the owning user, owning group, or other users. Then, use the `Update-AzDataLakeGen2Item` cmdlet to commit the ACL.

This example sets the ACL on a directory for the owning user, owning group, or other users, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system";
$dirname = "my-directory"
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission "-wx" -InputObject $acl
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname -Acl $acl
$dir = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
```

The output would look like the following:

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/set-acl.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).


## Upload a file to a directory

Upload a file to a directory by using the `New-AzDataLakeGen2Item` cmdlet.

This example uploads a file named `upload.txt` to a directory named `my-directory`. 

```powershell
$localSrcFile =  "upload.txt"
$filesystemName = "my-file-system";
$dirname = "my-directory"
$destPath = $dirname + "/" + (Get-Item $localSrcFile).Name
New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $destPath -Source $localSrcFile -Force 
```

## Get the ACL of a file

Get the access permissions of a file by using the `Get-AzDataLakeGen2Item` cmdlet. 

This example gets the ACL of a file and then prints the ACL to the console.

```powershell
$filePath = "my-directory/upload.txt"
$file = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath
$file.ACL
```

The output might look something like the following:

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/get-acl.png)

In this example, the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Set the ACL of a file

Use the `New-AzDataLakeGen2ItemAclObject` cmdlet to create an ACL for the owning user, owning group, or other users. Then, use the `Update-AzDataLakeGen2Item` cmdlet to commit the ACL.

This example sets the ACL on a file for the owning user, owning group, or other users, and then prints the ACL to the console.

```powershell
$filesystemName = "my-file-system";
$filePath = "my-directory/upload.txt"
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rw- 
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission rw- -InputObject $acl 
$acl = New-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission "-wx" -InputObject $acl
Update-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath -Acl $acl
$file = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $filePath
$file.ACL
```
The output would look like the following:

![Get ACL output](./media/data-lake-storage-directory-file-acl-powershell/set-acl.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Download from a directory

Download a file from a directory by using the `Get-AzDataLakeGen2ItemContent` cmdlet.

This example downloads a file named `upload.txt` from a directory named `my-directory`. 

```powershell
$filesystemName = "my-file-system";
$filePath = "my-directory/upload.txt"
$downloadFilePath = "download.txt"
Get-AzDataLakeGen2ItemContent -Context $ctx -FileSystem $filesystemName -Path $filePath -Destination $downloadFilePath
```

## List directory contents

List the contents of a directory by using the `Get-AzDataLakeGen2ChildItem` cmdlet.

This example lists the contents of a directory named `my-directory`. 

```powershell
$filesystemName = "my-file-system";
$dirname = "my-directory"
Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Path $dirname
```

This example lists the contents of a directory named `my-directory` and includes ACLs in the list.

```powershell
$filesystemName = "my-file-system";
$dirname = "my-directory"
Get-AzDataLakeGen2ChildItem -Context $ctx -FileSystem $filesystemName -Path $dirname -Recurse -FetchPermission
```

## See also

To learn more about working with Blob storage by using PowerShell, see [Using Azure PowerShell with Azure Storage](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

To find a comprehensive list of Microsoft Azure PowerShell Storage cmdlets, see [Storage PowerShell cmdlets](/powershell/module/az.storage).

