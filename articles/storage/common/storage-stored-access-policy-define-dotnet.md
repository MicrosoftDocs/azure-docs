---
title: Create a stored access policy with .NET
titleSuffix: Azure Storage
description: Use Azure Storage and .NET to create a stored access policy. Exercise additional levels of control over service-level shared access signatures on the server.
services: storage
author: pauljewellmsft

ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 07/12/2021
ms.author: pauljewell
ms.reviewer: ozgun
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Create a stored access policy with .NET

A stored access policy provides an additional level of control over service-level shared access signatures (SAS) on the server side. Defining a stored access policy serves to group shared access signatures and to provide additional restrictions for shared access signatures that are bound by the policy. You can use a stored access policy to change the start time, expiry time, or permissions for a SAS, or to revoke it after it has been issued.

The following Azure Storage resources support stored access policies:

- Blob containers
- File shares
- Queues
- Tables

> [!NOTE]
> A stored access policy on a container can be associated with a shared access signature granting permissions to the container itself or to the blobs it contains. Similarly, a stored access policy on a file share can be associated with a shared access signature granting permissions to the share itself or to the files it contains.  
>
> Stored access policies are supported for a service SAS only. Stored access policies are not supported for account SAS or user delegation SAS.

For more information about stored access policies, see [Create a stored access policy](/rest/api/storageservices/define-stored-access-policy).

## Create a stored access policy

The underlying REST operation to create a stored access policy is [Set Container ACL](/rest/api/storageservices/set-container-acl). You must authorize the operation to create a stored access policy via Shared Key by using the account access keys in a connection string. Authorizing the **Set Container ACL** operation with Microsoft Entra credentials is not supported. For more information, see [Permissions for calling data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-data-operations).

The following code examples create a stored access policy on a container. You can use the access policy to specify constraints for a service SAS on the container or its blobs.

To create a stored access policy on a container with version 12 of the .NET client library for Azure Storage, call one of the following methods:

- [BlobContainerClient.SetAccessPolicy](/dotnet/api/azure.storage.blobs.blobcontainerclient.setaccesspolicy)
- [BlobContainerClient.SetAccessPolicyAsync](/dotnet/api/azure.storage.blobs.blobcontainerclient.setaccesspolicyasync)

The following example creates a stored access policy that is in effect for one day and that grants read/write permissions:

```csharp
async static Task CreateStoredAccessPolicyAsync(string containerName)
{
    string connectionString = "";

    // Use the connection string to authorize the operation to create the access policy.
    // Azure AD does not support the Set Container ACL operation that creates the policy.
    BlobContainerClient containerClient = new BlobContainerClient(connectionString, containerName);

    try
    {
        await containerClient.CreateIfNotExistsAsync();

        // Create one or more stored access policies.
        List<BlobSignedIdentifier> signedIdentifiers = new List<BlobSignedIdentifier>
        {
            new BlobSignedIdentifier
            {
                Id = "mysignedidentifier",
                AccessPolicy = new BlobAccessPolicy
                {
                    StartsOn = DateTimeOffset.UtcNow.AddHours(-1),
                    ExpiresOn = DateTimeOffset.UtcNow.AddDays(1),
                    Permissions = "rw"
                }
            }
        };
        // Set the container's access policy.
        await containerClient.SetAccessPolicyAsync(permissions: signedIdentifiers);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine(e.ErrorCode);
        Console.WriteLine(e.Message);
    }
    finally
    {
        await containerClient.DeleteAsync();
    }
}
```

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Create a stored access policy](/rest/api/storageservices/define-stored-access-policy)
- [Configure Azure Storage connection strings](storage-configure-connection-string.md)

## Resources

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](../blobs/blob-v11-samples-dotnet.md#create-a-stored-access-policy).
