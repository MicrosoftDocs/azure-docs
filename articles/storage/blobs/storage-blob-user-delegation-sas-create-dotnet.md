---
title: Create a user delegation SAS for Azure Blob, Azure Files, and Azure Queue with .NET
titleSuffix: Azure Storage
description: Learn how to create a user delegation SAS for a container or blob with Microsoft Entra credentials by using the .NET client library for Blob Storage, File Storage, or Queue Storage.
services: storage
author: stevenmatthew
ms.author: shaas
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 09/06/2024
ms.reviewer: dineshm
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
# Customer intent: As a developer, I want to create a user delegation SAS for blobs and containers, files, or queues using .NET, so that I can securely grant limited access to storage resources based on user permissions.
---

# Create a user delegation SAS for Azure Blob, Azure Files, and Azure Queue with .NET

[!INCLUDE [storage-dev-guide-selector-user-delegation-sas](../../../includes/storage-dev-guides/storage-dev-guide-selector-user-delegation-sas.md)]

[!INCLUDE [storage-auth-sas-intro-include](../../../includes/storage-auth-sas-intro-include.md)]

This article shows how to use Microsoft Entra credentials to create a user delegation SAS for a container or blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

[!INCLUDE [storage-auth-user-delegation-include](../../../includes/storage-auth-user-delegation-include.md)]

## Assign Azure roles for access to data

When a Microsoft Entra security principal attempts to access data, that security principal must have permissions to the resource. Whether the security principal is a managed identity in Azure or a Microsoft Entra user account running code in the development environment, the security principal must be assigned an Azure role that grants access to data. For information about assigning permissions via Azure RBAC, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).

[!INCLUDE [storage-dev-guide-user-delegation-sas-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-user-delegation-sas-dotnet.md)]

## Create a user delegation SAS

You can create a user delegation SAS for a blob container, blob, file share, file, or queue, based on the needs of your app.

### [Container](#tab/container)

Once you've obtained the user delegation key, you can create a user delegation SAS to delegate limited access to a container. The following code example shows how to create a user delegation SAS for a container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateUserDelegationSASContainer":::

### [Blob](#tab/blob)

Once you've obtained the user delegation key, you can create a user delegation SAS to delegate limited access to a blob. The following code example shows how to create a user delegation SAS for a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_CreateUserDelegationSASBlob":::

### [Files](#tab/file)
Once you've obtained the user delegation key, you can create a user delegation SAS to delegate limited access to a file. The following code example shows how to create a user delegation SAS for a file:

```csharp
public static async Task<Uri> CreateUserDelegationSASFile(
    FileClient fileClient,
    UserDelegationKey userDelegationKey)
{
    // Create a SAS token for the container resource that's also valid for 1 day
    FileSasBuilder sasBuilder = new BlobSasBuilder()
    {
        FileContainerName = fileClient.FileContainerName,
        FileName = fileClient.Name,
        Resource = "f",
        StartsOn = DateTimeOffset.UtcNow,
        ExpiresOn = DateTimeOffset.UtcNow.AddDays(1)
    };

    // Specify the necessary permissions
    sasBuilder.SetPermissions(FileSasPermissions.Read | FileSasPermissions.Write);

     // Add the SAS token to the file URI
    ShareUriBuilder uriBuilder = new ShareUriBuilder(shareClient.Uri)
    {
        // Specify the user delegation key
        Sas = sasBuilder.ToSasQueryParameters(
            userDelegationKey,
            fileClient
            .GetParentFileContainerClient()
            .GetParentFileServiceClient().AccountName)
    };
    return uriBuilder.ToUri();
```

### [Queue](#tab/queue)
Once you've obtained the user delegation key, you can create a user delegation SAS to delegate limited access to a queue. The following code example shows how to create a user delegation SAS for a queue:

```csharp
public static async Task<Uri> CreateUserDelegationSASQueue(
    QueueClient queueClient,
    UserDelegationKey userDelegationKey)
{
    // Create a SAS token for the container resource that's also valid for 1 day
    QueueSasBuilder sasBuilder = new QueueSasBuilder()
    {
        QueueContainerName = queueClient.QueueContainerName,
        QueueName = queueClient.Name,
        Resource = "q",
        StartsOn = DateTimeOffset.UtcNow,
        ExpiresOn = DateTimeOffset.UtcNow.AddDays(1)
    };

    // Specify the necessary permissions
    sasBuilder.SetPermissions(QueueSasPermissions.Read | QueueSasPermissions.Write);

     // Add the SAS token to the queue URI
    BlobUriBuilder uriBuilder = new BlobUriBuilder(blobClient.Uri)
    {
        // Specify the user delegation key
        Sas = sasBuilder.ToSasQueryParameters(
            userDelegationKey,
            queueClient
            .GetParentFileContainerClient()
            .GetParentFileServiceClient().AccountName)
    };
    return uriBuilder.ToUri();
}
```


---

## Use a user delegation SAS to authorize a client object

You can use a user delegation SAS to authorize a client object to perform operations on a blob container, blob, file share, file, or queue based on the permissions granted by the SAS.

### [Container](#tab/container)

The following code example shows how to use the user delegation SAS to authorize a [BlobContainerClient](/dotnet/api/azure.storage.blobs.blobcontainerclient) object. This client object can be used to perform operations on the container resource based on the permissions granted by the SAS.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseUserDelegationSASContainer":::

### [Blob](#tab/blob)

The following code example shows how to use the user delegation SAS to authorize a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) object. This client object can be used to perform operations on the blob resource based on the permissions granted by the SAS.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSas.cs" id="Snippet_UseUserDelegationSASBlob":::

### [Files](#tab/file)

The following code example shows how to use the user delegation SAS to authorize a [FileClient](/dotnet/api/azure.storage.files.shares.sharefileclient) object. This client object can be used to perform operations in an Azure file share based on the permissions granted by the SAS.

```csharp
// Create a Uri object with a user delegation SAS appended
FileClient fileClient = filesServiceClient
    .GetFileShareClient("sample-share")
    .GetRootDirectoryClient()
    .GetFileClient("sample-file.txt");
Uri fileSASURI = await CreateUserDelegationSASFile(fileClient, userDelegationKey);

// Create a file client object with SAS authorization
FileClient fileClientSAS = new FileClient(fileSASURI);
```

### [Queue](#tab/queue)

The following code example shows how to use the user delegation SAS to authorize a [QueueClient](/dotnet/api/azure.storage.queues.queueclient) object. This client object can be used to perform operations on the queue resource based on the permissions granted by the SAS.

```csharp
// Create a Uri object with a user delegation SAS appended
QueueClient queueClient = queueServiceClient
    .GetQueueClient("sample-queue");
Uri queueSASURI = await CreateUserDelegationSASQueue(queueClient, userDelegationKey);

// Create a queue client object with SAS authorization
QueueClient queueClientSAS = new QueueClient(queueSASURI);
```

---

## Resources

To learn more about creating a user delegation SAS using the Azure Blob Storage client library for .NET, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/CreateSAS.cs)

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library method for getting a user delegation key uses the following REST API operation:

- [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md)
- [Create a user delegation SAS](/rest/api/storageservices/create-user-delegation-sas)

[!INCLUDE [storage-dev-guide-next-steps-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-dotnet.md)]
