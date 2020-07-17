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
using Azure;
using Azure.Core;
using Azure.Storage;
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
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

After you install the package, add this using statement to the top of your code file.

```csharp
using Azure.Identity;
```

Get a client ID, a client secret, and a tenant ID. To do this, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md). As part of that process, you'll have to assign one of the following [role-based access control (RBAC)](../../role-based-access-control/overview.md) roles to your security principal. 

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using a client ID, a client secret, and a tenant ID.  

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

You can set the ACL of a directory recursively. You add up to 32 entries (security principals) to the ACL of a directory or file. 

### [.NET](#tab/dotnet)

Set an ACL recursively by calling the **DataLakeDirectoryClient.SetAccessControlRecursiveAsync** method. Pass this method a [List](/dotnet/api/system.collections.generic.list-1) of [PathAccessControlItems](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem). Each [PathAccessControlItems](/dotnet/api/azure.storage.files.datalake.models.pathaccesscontrolitem) defines an ACL entry.

This example gets and sets the ACL of a directory named `my-parent-directory`. These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object id ""xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```cs
public async void SetACLRecursively(DataLakeServiceClient serviceClient)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
            GetDirectoryClient("my-parent-directory");

    List<PathAccessControlItem> accessControlList = 
        new List<PathAccessControlItem>() 
    {
        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read | 
            RolePermissions.Write | 
            RolePermissions.Execute),
                    
        new PathAccessControlItem(AccessControlType.Group, 
            RolePermissions.Read | 
            RolePermissions.Execute),
                    
        new PathAccessControlItem(AccessControlType.Other, 
            RolePermissions.None),

        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read | 
            RolePermissions.Execute, 
            entityId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
    };

    await directoryClient.SetAccessControlRecursiveAsync
        (accessControlList, null);
}

```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Update ACL recursively

You can update an existing ACL recursively.

### [.NET](#tab/dotnet)

Update an ACL recursively by calling the **DataLakeDirectoryClient.UpdateAccessControlRecursiveAsync** method. 

This example adds write permission to an ACL entry, and then updates the ACL with that entry. 

```cs
public async void UpdateACLsRecursively(DataLakeServiceClient serviceClient)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
        GetDirectoryClient("my-parent-directory");

    List<PathAccessControlItem> accessControlListUpdate = 
        new List<PathAccessControlItem>()
    {
        new PathAccessControlItem(AccessControlType.User, 
            RolePermissions.Read |
            RolePermissions.Write | 
            RolePermissions.Execute, 
            entityId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"),
    };

    await directoryClient.UpdateAccessControlRecursiveAsync
        (accessControlListUpdate, null);

}
```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Remove ACL entries recursively

You can remove one or more ACL entries recursively.

### [.NET](#tab/dotnet)

Remove ACL entries by calling the **DataLakeDirectoryClient.RemoveAccessControlRecursiveAsync** method. 

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. 

```cs
public async void RemoveACLsRecursively(DataLakeServiceClient serviceClient)
{
    DataLakeDirectoryClient directoryClient =
        serviceClient.GetFileSystemClient("my-container").
            GetDirectoryClient("my-parent-directory");

    List<RemovePathAccessControlItem> accessControlListForRemoval = 
        new List<RemovePathAccessControlItem>()
        {
            new RemovePathAccessControlItem(AccessControlType.User, 
            entityId: "4a9028cf-f779-4032-b09d-970ebe3db258"),
        };

    await directoryClient.RemoveAccessControlRecursiveAsync
        (accessControlListForRemoval, null);

}
```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

## Recover from failures

You application might encounter a run-time error, or a permission error. Permission errors can occur if the security principal that you used to connect to your storage account doesn't have permission to modify the ACL of a directory or file that is in the hierarchy of files being modified.

If your application encounters an error, you can address fix the error, and then restart the process. Your application can resume where it left off by using a continuation token. 

You don't have to use this token if you prefer to restart from the very beginning. You can re-apply ACL entries without any negative impact.

## [.NET](#tab/dotnet)

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of ``null`` for the continuation token parameter. 

```cs
public async Task<string> ResumeAsync(DataLakeServiceClient serviceClient,
    DataLakeDirectoryClient directoryClient,
    List<PathAccessControlItem> accessControlList, 
    string continuationToken)
{
    try
    {
        var accessControlChangeResult =
            await directoryClient.SetAccessControlRecursiveAsync(
                accessControlList, null, continuationToken: continuationToken);

        if (accessControlChangeResult.Value.Counters.FailedChangesCount > 0)
        {
            continuationToken =
                accessControlChangeResult.Value.ContinuationToken;
        }

        return continuationToken;
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex.ToString());
        return continuationToken;
    }

}
```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

If you want the process to complete uninterrupted by permission errors, you can pass in an **AccessControlChangedOptions** object and set the **ContinueOnFailure** property of that object to ``true``.

### [.NET](#tab/dotnet)

This example sets ACL entries recursively. If this code encounters a permission error, it records that failure and continues execution. This example prints the number of failures to the console. 

```cs
public async Task ContinueOnFailureAsync(DataLakeServiceClient serviceClient,
    DataLakeDirectoryClient directoryClient, 
    List<PathAccessControlItem> accessControlList)
{
    var accessControlChangeResult = 
        await directoryClient.SetAccessControlRecursiveAsync(
            accessControlList, null, new AccessControlChangeOptions() 
            { ContinueOnFailure = true });

    var counters = accessControlChangeResult.Value.Counters;

    Console.WriteLine("Number of directories changed: " +
        counters.ChangedDirectoriesCount.ToString());

    Console.WriteLine("Number of files changed: " +
        counters.ChangedFilesCount.ToString());

    Console.WriteLine("Number of failures: " +
        counters.FailedChangesCount.ToString());
}
```

### [Python](#tab/python)

Put something here.

### [PowerShell](#tab/azure-powershell)

Put something here.

---

---

## Questions

1. Will there be a dedicated preview SDK or will this be preview functionality within the latest GA SDK?  This affects where we put guidance. If the later, then we can add snippets to existing content and call out that this functionality is in preview.

## See also

* Put a see also here.
