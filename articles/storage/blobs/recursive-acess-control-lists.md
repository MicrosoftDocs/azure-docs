---
title: Setting access control lists recursively in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Put some description here.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 07/13/2020
ms.author: normesta
ms.reviewer: prishet
---

# Setting access control lists recursively

The recursive ACL process provides the ability to add, update or remove ACL entries for folders/files within a parent directory for ADLS Gen2. This helps with propagation of permission updates from parent directory to existing child folders/files.

> [!NOTE]
> The ability to set access lists recursively is a in public preview, and is available in the blah and blah regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adls/qa-preview-signup). 

## Before you begin

Make sure that you have the correct permission to set ACLs on your account. You'll need these things:

- A provisioned AAD Service Principal or user that has been assigned Storage Blob Data Owner role on the target account or container OR Owning user for target container/directory on which recursive ACL process is to be executed. (Note: owning user must have permissions for all child items for this target container/directory) 

- Ensure a working understanding of how ACLs are applied in ADLS Gen2 as described in: https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control

## General workflow

Describe the workflow

## Known issues

- Java, JavaScript, Azure CLI, and Azure Storage Explorer are not yet supported.
- Support for Java, JavaScript, and CLI? What about Storage Explorer.
- The maximum number of ACLs that can be applied to a file/folder is 32 access ACLs and 32 default ACLs. For more information, refer to ADLS Gen2 access control 

## Best practices

- Handling run-time errors: If there are run-time errors (such as outage, client machine connectivity etc.), the best practice for recovery is to restart the recursive ACL process. If an ACL has already been applied, re-applying that ACL has no negative impact. 

- Handling permission errors (403): If you encounter access control exceptions for an intermediate directory/file during the recursive ACL process, the most common reason is the user/SPN does not have sufficient permissions to apply ACLs for that given directory/file. Process stops and a continuation token is provided. Fix permission issue and use continuation token to process the remaining dataset (files/folders that have been successfully processed will not need to be reprocessed) 

- Credentials: As best practice, we recommend provisioning an AAD service principal assigned with the Storage Blob Data Owner role scoped to the target account or container. 

- Performance: To help lower latency for access to the ADLS Gen2 storage account, we recommend running the recursive ACL process in an Azure VM that is in the same region as your ADLS Gen2 storage account. 

## Use PowerShell

Get the bits (guidance)
Capture read me items for the preview.

### Example

Here is a PowerShell example:

```powershell
$accountName = "normestarecursiveaclgen2"
$accountKey = "xznGsj4h+pYJO+NhzSsif0BSB7zkYbB7u4pqP7xorS97zfNn87Qd/yhTRs7K5fMokPOlfohgMLLw1/RQgkW1Dw=="
$filesystemName = "priyatestrecursivefs"
$id = 
$localSrcFile = "recursivefile.txt"

############################

Add-AzAccount

# create 2 storage credentials for sharedkey and oauth
$ctx = New-AzStorageContext  $accountName -StorageAccountKey $accountKey 
$ctx2 = New-AzStorageContext  $accountName

# create file system
$container1 = New-AzDatalakeGen2FileSystem -Context $ctx -Name $filesystemName
write-output "New container created:" $container1

# prepare the items to set acl recursive
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Directory -Path dir0 
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Directory -Path dir0 
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Directory -Path dir0/dir1
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Directory -Path dir0/dir2
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Path dir0/dir1/file1 -Source $localSrcFile -Force
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Path dir0/dir1/file2 -Source $localSrcFile -Force
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Path dir0/dir1/file3 -Source $localSrcFile -Force
New-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName -Path dir0/dir2/file3 -Source $localSrcFile -Force
New-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path dir0/dir2/file4 -Source $localSrcFile -Force 


# check the items permission
Get-AzDataLakeGen2Item -Context $ctx2 -FileSystem $filesystemName
Get-AzDataLakeGen2ChildItem -Context $ctx2 -FileSystem $filesystemName -Recurse

# create valid ACL for update/set
$acl1 = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -Permission rwx 
$acl1 = Set-AzDataLakeGen2ItemAclObject -AccessControlType group -Permission r-x -InputObject $acl1 
$acl1 = Set-AzDataLakeGen2ItemAclObject -AccessControlType other -Permission "---" -InputObject $acl1
$acl1 = Set-AzDataLakeGen2ItemAclObject -AccessControlType user -EntityId $id -Permission rwx -InputObject $acl1 
$acl1

## Directory
Set-AzDataLakeGen2AclRecursive -Context $ctx -FileSystem $filesystemName -Path dir0 -Acl $acl1
$dirname = "dir0/"
$dir = Get-AzDataLakeGen2Item -Context $ctx -FileSystem $filesystemName -Path $dirname
$dir.ACL
```

## .NET

Put readme items here.

### Example

Here is a .NET example:

```csharp
await test.FileSystem.GetRootDirectoryClient().SetAccessControlListAsync(ExecuteOnlyAccessControlList);

TokenCredential tokenCredential = GetOAuthCredential(TestConfigHierarchicalNamespace);
Uri uri = new Uri($"{TestConfigHierarchicalNamespace.BlobServiceEndpoint}/{fileSystemName}/{topDirectoryName}").ToHttps();

// Create tree as AAD App
DataLakeDirectoryClient directory = InstrumentClient(new DataLakeDirectoryClient(uri, tokenCredential, GetOptions()));
await directory.CreateAsync();
DataLakeDirectoryClient subdirectory1 = await directory.CreateSubDirectoryAsync(GetNewDirectoryName());
DataLakeFileClient file1 = await subdirectory1.CreateFileAsync(GetNewFileName());
DataLakeFileClient file2 = await subdirectory1.CreateFileAsync(GetNewFileName());
DataLakeDirectoryClient subdirectory2 = await directory.CreateSubDirectoryAsync(GetNewDirectoryName());
DataLakeFileClient file3 = await subdirectory2.CreateFileAsync(GetNewFileName());

// Add file as superuser
DataLakeFileClient file4 = await test.FileSystem.GetDirectoryClient(directory.Name)
   .GetSubDirectoryClient(subdirectory2.Name)
   .CreateFileAsync(GetNewFileName());
DataLakeFileClient file5 = await test.FileSystem.GetDirectoryClient(directory.Name)
   .GetSubDirectoryClient(subdirectory2.Name)
   .CreateFileAsync(GetNewFileName());
DataLakeFileClient file6 = await test.FileSystem.GetDirectoryClient(directory.Name)
   .GetSubDirectoryClient(subdirectory2.Name)
   .CreateFileAsync(GetNewFileName());
// Add directory as superuser
DataLakeDirectoryClient subdirectory3 = await test.FileSystem.GetDirectoryClient(directory.Name)
   .GetSubDirectoryClient(subdirectory2.Name)
   .CreateSubDirectoryAsync(GetNewDirectoryName());

AccessControlChangeOptions options = new AccessControlChangeOptions()
{
   ContinueOnFailure = true
};

// Act
AccessControlChangeResult result = await directory.SetAccessControlRecursiveAsync(
   accessControlList: AccessControlList,
   progressHandler: null,
   options);

// Assert
Assert.AreEqual(3, result.Counters.ChangedDirectoriesCount);
Assert.AreEqual(3, result.Counters.ChangedFilesCount);
Assert.AreEqual(4, result.Counters.FailedChangesCount);

```

## Python

### Example

## Questions

1. Will there be a dedicated preview SDK or will this be preview functionality within the latest GA SDK?  This affects where we put guidance. If the later, then we can add snippets to existing content and call out that this functionality is in preview.

## See also

* Put a see also here.
