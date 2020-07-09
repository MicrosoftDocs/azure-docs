---
title: Create a stored access policy with .NET
titleSuffix: Azure Storage
description: Learn how to create a stored access policy using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/16/2020
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
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

For more information about stored access policies, see [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy).

## Create a stored access policy

The underlying REST operation to create a stored access policy is [Set Container ACL](/rest/api/storageservices/set-container-acl). You must authorize the operation to create a stored access policy via Shared Key by using the account access keys in a connection string. Authorizing the **Set Container ACL** operation with Azure AD credentials is not supported. For more information, see [Permissions for calling blob and queue data operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

The following code examples create a stored access policy on a container. You can use the access policy to specify constraints for a service SAS on the container or its blobs.

# [.NET v12 SDK](#tab/dotnet)

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

# [.NET v11 SDK](#tab/dotnet11)

To create a stored access policy on a container with version 12 of the .NET client library for Azure Storage, call one of the following methods:

- [CloudBlobContainer.SetPermissions](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setpermissions)
- [CloudBlobContainer.SetPermissionsAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblobcontainer.setpermissionsasync)

The following example creates a stored access policy that is in effect for one day and that grants read, write, and list permissions:

```csharp
private static async Task CreateStoredAccessPolicyAsync(CloudBlobContainer container, string policyName)
{
    // Create a new stored access policy and define its constraints.
    // The access policy provides create, write, read, list, and delete permissions.
    SharedAccessBlobPolicy sharedPolicy = new SharedAccessBlobPolicy()
    {
        // When the start time for the SAS is omitted, the start time is assumed to be the time when Azure Storage receives the request.
        SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
        Permissions = SharedAccessBlobPermissions.Read | SharedAccessBlobPermissions.List |
            SharedAccessBlobPermissions.Write
    };

    // Get the container's existing permissions.
    BlobContainerPermissions permissions = await container.GetPermissionsAsync();

    // Add the new policy to the container's permissions, and set the container's permissions.
    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
    await container.SetPermissionsAsync(permissions);
}
```

---

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy)
- [Configure Azure Storage connection strings](storage-configure-connection-string.md)
