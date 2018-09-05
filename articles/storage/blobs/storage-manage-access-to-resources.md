---
title: Enable public read access for containers and blobs in Azure Blob storage | Microsoft Docs
description: Learn how to make containers and blobs available for anonymous access, and how to access them programmatically.
services: storage
author: tamram


ms.service: storage
ms.topic: article
ms.date: 04/26/2017
ms.author: tamram
---

# Manage anonymous read access to containers and blobs
You can enable anonymous, public read access to a container and its blobs in Azure Blob storage. By doing so, you can grant read-only access to these resources without sharing your account key, and without requiring a shared access signature (SAS).

Public read access is best for scenarios where you want certain blobs to always be available for anonymous read access. For more fine-grained control, you can create a shared access signature. Shared access signatures enable you to provide restricted access using different permissions, for a specific time period. For more information about creating shared access signatures, see [Using shared access signatures (SAS) in Azure Storage](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).

## Grant anonymous users permissions to containers and blobs
By default, a container and any blobs within it may be accessed only by the owner of the storage account. To give anonymous users read permissions to a container and its blobs, you can set the container permissions to allow public access. Anonymous users can read blobs within a publicly accessible container without authenticating the request.

You can configure a container with the following permissions:

* **No public read access:** The container and its blobs can be accessed only by the storage account owner. This is the default for all new containers.
* **Public read access for blobs only:** Blobs within the container can be read by anonymous request, but container data is not available. Anonymous clients cannot enumerate the blobs within the container.
* **Full public read access:** All container and blob data can be read by anonymous request. Clients can enumerate blobs within the container by anonymous request, but cannot enumerate containers within the storage account.

You can use the following to set container permissions:

* [Azure portal](https://portal.azure.com)
* [Azure PowerShell](../common/storage-powershell-guide-full.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Azure CLI](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#create-and-manage-blobs)
* Programmatically, by using one of the storage client libraries or the REST API

### Set container permissions in the Azure portal
To set container permissions in the [Azure portal](https://portal.azure.com), follow these steps:

1. Open your **Storage account** blade in the portal. You can find your storage account by selecting **Storage accounts** in the main portal menu blade.
1. Under **BLOB SERVICE** on the menu blade, select **Blobs**.
1. Right-click on the container row or select the ellipsis to open the container's **Context menu**.
1. Select **Access policy** in the context menu.
1. Select an **Access type** from the drop down menu.

    ![Edit Container Metadata dialog](./media/storage-manage-access-to-resources/storage-manage-access-to-resources-0.png)

### Set container permissions with .NET
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
A client that accesses containers and blobs anonymously can use constructors that do not require credentials. The following examples show a few different ways to reference Blob service resources anonymously.

### Create an anonymous client object
You can create a new service client object for anonymous access by providing the Blob service endpoint for the account. However, you must also know the name of a container in that account that's available for anonymous access.

```csharp
public static void CreateAnonymousBlobClient()
{
    // Create the client object using the Blob service endpoint.
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
The following table shows which operations may be called by anonymous users when a container's ACL is set to allow public access.

| REST Operation | Permission with full public read access | Permission with public read access for blobs only |
| --- | --- | --- |
| List Containers |Owner only |Owner only |
| Create Container |Owner only |Owner only |
| Get Container Properties |All |Owner only |
| Get Container Metadata |All |Owner only |
| Set Container Metadata |Owner only |Owner only |
| Get Container ACL |Owner only |Owner only |
| Set Container ACL |Owner only |Owner only |
| Delete Container |Owner only |Owner only |
| List Blobs |All |Owner only |
| Put Blob |Owner only |Owner only |
| Get Blob |All |All |
| Get Blob Properties |All |All |
| Set Blob Properties |Owner only |Owner only |
| Get Blob Metadata |All |All |
| Set Blob Metadata |Owner only |Owner only |
| Put Block |Owner only |Owner only |
| Get Block List (committed blocks only) |All |All |
| Get Block List (uncommitted blocks only or all blocks) |Owner only |Owner only |
| Put Block List |Owner only |Owner only |
| Delete Blob |Owner only |Owner only |
| Copy Blob |Owner only |Owner only |
| Snapshot Blob |Owner only |Owner only |
| Lease Blob |Owner only |Owner only |
| Put Page |Owner only |Owner only |
| Get Page Ranges |All |All |
| Append Blob |Owner only |Owner only |

## Next steps

* [Authentication for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dd179428.aspx)
* [Using Shared Access Signatures (SAS)](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Delegating Access with a Shared Access Signature](https://msdn.microsoft.com/library/azure/ee395415.aspx)
