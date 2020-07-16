---
title: Set ACLs recursively in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Put some description here.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 07/13/2020
ms.author: normesta
ms.reviewer: prishet
---

# Set access control lists (ACLs) recursively in Azure Data Lake Storage Gen2

The recursive ACL process provides the ability to add, update or remove ACL entries for folders/files within a parent directory for ADLS Gen2. This helps with propagation of permission updates from parent directory to existing child folders/files. 

To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control). 

> [!NOTE]
> The ability to set access lists recursively is a in public preview, and is available in the blah and blah regions. To enroll in the preview, see [this form](https://aka.ms/adls/qa-preview-signup). 

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.

## Set up your project

Some sort of intro comment

> [!NOTE] 
> To help lower latency for access to the ADLS Gen2 storage account, we recommend running the recursive ACL process in an Azure VM that is in the same region as your ADLS Gen2 storage account.

### [.NET](#tab/dotnet)

To get started, install the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package.

For more information about how to install NuGet packages, see [Install and manage packages in Visual Studio using the NuGet Package Manager](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-visual-studio).

Then, add these using statements to the top of your code file.

```csharp
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Azure.Storage;
using System.IO;
using Azure;
```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Connect to your account

- Credentials: As best practice, we recommend provisioning an AAD service principal assigned with the Storage Blob Data Owner role scoped to the target account or container. 

- A provisioned AAD Service Principal or user that has been assigned Storage Blob Data Owner role on the target account or container OR Owning user for target container/directory on which recursive ACL process is to be executed. (Note: owning user must have permissions for all child items for this target container/directory) 

### [.NET](#tab/dotnet)

To use the snippets in this article, you'll need to create a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that represents the storage account. 

#### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using an account key.

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient,
    string accountName, string accountKey)
{
    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient
        (new Uri(dfsUri), sharedKeyCredential);
}
```

#### Connect by using Azure Active Directory (AD)

You can use the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) to authenticate your application with Azure AD.

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient, 
    String accountName, String clientID, string clientSecret, string tenantID)
{

    TokenCredential credential = new ClientSecretCredential(
        tenantID, clientID, clientSecret, new TokenCredentialOptions());

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), credential);
}

```

> [!NOTE]
> For more examples, see the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) documentation.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Set ACL recursively

This code sets the ACL. Explain what set means.

- The maximum number of ACLs that can be applied to a file/folder is 32 access ACLs and 32 default ACLs. For more information, refer to ADLS Gen2 access control 

### [.NET](#tab/dotnet)

Get the access control list (ACL) of a directory by calling the [DataLakeDirectoryClient.GetAccessControlAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.getaccesscontrolasync) method and set the ACL by calling the [DataLakeDirectoryClient.SetAccessControlList](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.setaccesscontrollist) method.

> [!NOTE]
> If your application authorizes access by using Azure Active Directory (Azure AD), then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control). 

This example gets and sets the ACL of a directory named `my-directory`. The string `user::rwx,group::r-x,other::rw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

```cs
public async Task SetDirectoryACLRecursive(DataLakeFileSystemClient fileSystemClientD)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    IList<PathAccessControlItem> accessControlList
        = PathAccessControlExtensions.ParseAccessControlList
        ("user::rwx,group::r-x,other::rw-");

    directoryClient.SetAccessControlList(accessControlList);

}

```

If you want to set an ACL for an object ID, you'd just use the blah parameter.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Update ACL recursively

This code updates an ACL recursively.

- The maximum number of ACLs that can be applied to a file/folder is 32 access ACLs and 32 default ACLs. For more information, refer to ADLS Gen2 access control

### [.NET](#tab/dotnet)

Put something here.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Remove ACL recursively

This code removes and ACL recursively

### [.NET](#tab/dotnet)

Put something here.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Handle errors

This code keeps track of a continuation token and shows how you would resume operation.

- Handling run-time errors: If there are run-time errors (such as outage, client machine connectivity etc.), the best practice for recovery is to restart the recursive ACL process. If an ACL has already been applied, re-applying that ACL has no negative impact.
- 
- Handling permission errors (403): If you encounter access control exceptions for an intermediate directory/file during the recursive ACL process, the most common reason is the user/SPN does not have sufficient permissions to apply ACLs for that given directory/file. Process stops and a continuation token is provided. Fix permission issue and use continuation token to process the remaining dataset (files/folders that have been successfully processed will not need to be reprocessed) 

## [.NET](#tab/dotnet)

Put something here.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

This code continues execution even if there is a failure.

### [.NET](#tab/dotnet)

Put something here.

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---


## Example

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

---

## Questions

1. Will there be a dedicated preview SDK or will this be preview functionality within the latest GA SDK?  This affects where we put guidance. If the later, then we can add snippets to existing content and call out that this functionality is in preview.

## See also

* Put a see also here.
