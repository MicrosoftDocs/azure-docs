---
title: Enable public read access for containers and blobs in Azure Blob storage | Microsoft Docs
description: Learn how to make containers and blobs available for anonymous access, and how to access them programmatically.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/30/2019
ms.author: tamram
ms.reviewer: cbrooks
---

# Manage anonymous read access to containers and blobs

You can enable anonymous, public read access to a container and its blobs in Azure Blob storage. By doing so, you can grant read-only access to these resources without sharing your account key, and without requiring a shared access signature (SAS).

Public read access is best for scenarios where you want certain blobs to always be available for anonymous read access. For more fine-grained control, you can create a shared access signature. Shared access signatures enable you to provide restricted access using different permissions, for a specific time period. For more information about creating shared access signatures, see [Using shared access signatures (SAS) in Azure Storage](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Grant anonymous users permissions to containers and blobs

By default, a container and any blobs within it may be accessed only by a user that has been given appropriate permissions. To grant anonymous users read access to a container and its blobs, you can set the container public access level. When you grant public access to a container, then anonymous users can read blobs within a publicly accessible container without authorizing the request.

You can configure a container with the following permissions:

* **No public read access:** The container and its blobs can be accessed only by the storage account owner. This is the default for all new containers.
* **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available. Anonymous clients cannot enumerate the blobs within the container.
* **Public read access for container and its blobs:** All container and blob data can be read by anonymous request. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

You can use the following to set container permissions:

* [Azure portal](https://portal.azure.com)
* [Azure PowerShell](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Azure CLI](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#create-and-manage-blobs)
* Programmatically, by using one of the storage client libraries or the REST API

### Set container public access level in the Azure portal

From the [Azure portal](https://portal.azure.com), you can update the public access level for one or more containers:

1. Navigate to your storage account in the Azure portal.
1. Under **Blob service** on the menu blade, select **Blobs**.
1. Select the containers for which you want to set the public access level.
1. Use the **Change access level** button to display the public access settings.
1. Select the desired public access level from the **Public access level** dropdown and click the OK button to apply the change to the selected containers.

The following screenshot shows how to change the public access level for the selected containers.

![Screenshot showing how to set public access level in the portal](./media/storage-manage-access-to-resources/storage-manage-access-to-resources-0.png)

> [!NOTE]
> You cannot change the public access level for an individual blob. Public access level is set only at the container level.

### Set container public access level with .NET

To set permissions for a container using C# and the Storage Client Library for .NET, first retrieve the container's existing permissions by calling the **GetPermissions** method. Then set the **PublicAccess** property for the **BlobContainerPermissions** object that is returned by the **GetPermissions** method. Finally, call the **SetPermissions** method with the updated permissions.

The following example sets the container's permissions to full public read access. To set permissions to public read access for blobs only, set the **PublicAccess** property to **BlobContainerPublicAccessType.Blob**. To remove all permissions for anonymous users, set the property to **BlobContainerPublicAccessType.Off**.

```csharp
public static void SetPublicContainerPermissions(CloudBlobContainer container)
{
    BlobContainerPermissions permissions = container.GetPermissions();
    permissions.PublicAccess = BlobContainerPublicAccessType.Container;
    container.SetPermissions(permissions);
}
```

## Access containers and blobs anonymously

A client that accesses containers and blobs anonymously can use constructors that do not require credentials. The following examples show a few different ways to reference containers and blobs anonymously.

### Create an anonymous client object

You can create a new service client object for anonymous access by providing the Blob storage endpoint for the account. However, you must also know the name of a container in that account that's available for anonymous access.

```csharp
public static void CreateAnonymousBlobClient()
{
    // Create the client object using the Blob storage endpoint.
    CloudBlobClient blobClient = new CloudBlobClient(new Uri(@"https://storagesample.blob.core.windows.net"));

    // Get a reference to a container that's available for anonymous access.
    CloudBlobContainer container = blobClient.GetContainerReference("sample-container");

    // Read the container's properties. Note this is only possible when the container supports full public read access.
    container.FetchAttributes();
    Console.WriteLine(container.Properties.LastModified);
    Console.WriteLine(container.Properties.ETag);
}
```

### Reference a container anonymously

If you have the URL to a container that is anonymously available, you can use it to reference the container directly.

```csharp
public static void ListBlobsAnonymously()
{
    // Get a reference to a container that's available for anonymous access.
    CloudBlobContainer container = new CloudBlobContainer(new Uri(@"https://storagesample.blob.core.windows.net/sample-container"));

    // List blobs in the container.
    foreach (IListBlobItem blobItem in container.ListBlobs())
    {
        Console.WriteLine(blobItem.Uri);
    }
}
```

### Reference a blob anonymously

If you have the URL to a blob that is available for anonymous access, you can reference the blob directly using that URL:

```csharp
public static void DownloadBlobAnonymously()
{
    CloudBlockBlob blob = new CloudBlockBlob(new Uri(@"https://storagesample.blob.core.windows.net/sample-container/logfile.txt"));
    blob.DownloadToFile(@"C:\Temp\logfile.txt", System.IO.FileMode.Create);
}
```

## Features available to anonymous users

The following table shows which operations may be called anonymously when a container is configured for public access.

| REST Operation | Public read access to container | Public read access to blobs only |
| --- | --- | --- |
| List Containers | Authorized requests only | Authorized requests only |
| Create Container | Authorized requests only | Authorized requests only |
| Get Container Properties | Anonymous requests allowed | Authorized requests only |
| Get Container Metadata | Anonymous requests allowed | Authorized requests only |
| Set Container Metadata | Authorized requests only | Authorized requests only |
| Get Container ACL | Authorized requests only | Authorized requests only |
| Set Container ACL | Authorized requests only | Authorized requests only |
| Delete Container | Authorized requests only | Authorized requests only |
| List Blobs | Anonymous requests allowed | Authorized requests only |
| Put Blob | Authorized requests only | Authorized requests only |
| Get Blob | Anonymous requests allowed | Anonymous requests allowed |
| Get Blob Properties | Anonymous requests allowed | Anonymous requests allowed |
| Set Blob Properties | Authorized requests only | Authorized requests only |
| Get Blob Metadata | Anonymous requests allowed | Anonymous requests allowed |
| Set Blob Metadata | Authorized requests only | Authorized requests only |
| Put Block | Authorized requests only | Authorized requests only |
| Get Block List (committed blocks only) | Anonymous requests allowed | Anonymous requests allowed |
| Get Block List (uncommitted blocks only or all blocks) | Authorized requests only | Authorized requests only |
| Put Block List | Authorized requests only | Authorized requests only |
| Delete Blob | Authorized requests only | Authorized requests only |
| Copy Blob | Authorized requests only | Authorized requests only |
| Snapshot Blob | Authorized requests only | Authorized requests only |
| Lease Blob | Authorized requests only | Authorized requests only |
| Put Page | Authorized requests only | Authorized requests only |
| Get Page Ranges | Anonymous requests allowed | Anonymous requests allowed |
| Append Blob | Authorized requests only | Authorized requests only |

## Next steps

* [Authorization for the Azure Storage Services](https://docs.microsoft.com/rest/api/storageservices/authorization-for-the-azure-storage-services)
* [Using Shared Access Signatures (SAS)](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)