---
title: Define a stored access policy with .NET - Azure Storage
description: Learn how to define a stored access policy using the .NET client library.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/06/2019
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Define a stored access policy with .NET

A stored access policy provides an additional level of control over service-level shared access signatures (SAS) on the server side. Defining a stored access policy serves to group shared access signatures and to provide additional restrictions for shared access signatures that are bound by the policy. You can use a stored access policy to change the start time, expiry time, or permissions for a SAS, or to revoke it after it has been issued.
  
 The following storage resources support stored access policies:  
  
- Blob containers  
- File shares  
- Queues  
- Tables  
  
> [!NOTE]
> A stored access policy on a container can be associated with a shared access signature granting permissions to the container itself or to the blobs it contains. Similarly, a stored access policy on a file share can be associated with a shared access signature granting permissions to the share itself or to the files it contains.  
>
> Stored access policies are supported for a service SAS only. Stored access policies are not supported for account SAS or user delegation SAS.  

## Create a stored access policy

The following code creates a stored access policy on a container. You can use the access policy to specify constraints for a service SAS on the container or its blobs.

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
            SharedAccessBlobPermissions.Write | SharedAccessBlobPermissions.Create | SharedAccessBlobPermissions.Delete
    };

    // Get the container's existing permissions.
    BlobContainerPermissions permissions = await container.GetPermissionsAsync();

    // Add the new policy to the container's permissions, and set the container's permissions.
    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
    await container.SetPermissionsAsync(permissions);
}
```

## See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md)
- [Define a stored access policy](/rest/api/storageservices/define-stored-access-policy)

