---
title: Access public containers and blobs anonymously with .NET
titleSuffix: Azure Storage
description: Use the Azure Storage client library for .NET to access public containers and blobs anonymously.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/16/2022
ms.author: tamram
ms.reviewer: fryu
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Access public containers and blobs anonymously with .NET

Azure Storage supports optional public read access for containers and blobs. Clients can access public containers and blobs anonymously by using the Azure Storage client libraries, as well as by using other tools and utilities that support data access to Azure Storage.

This article shows how to access a public container or blob from .NET. For information about configuring anonymous read access on a container, see [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md). For information about preventing all anonymous access to a storage account, see [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md).

A client that accesses containers and blobs anonymously can use constructors that do not require credentials. The following examples show a few different ways to reference containers and blobs anonymously.

> [!IMPORTANT]
> Any firewall rules that are in effect for the storage account apply even when public access is enabled for a container.

## Create an anonymous client object

You can create a new service client object for anonymous access by providing the Blob storage endpoint for the account. However, you must also know the name of a container in that account that's available for anonymous access.

# [\.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Security.cs" id="Snippet_CreateAnonymousBlobClient":::

# [\.NET v11 SDK](#tab/dotnet11)

```csharp
public static void CreateAnonymousBlobClient()
{
    // Create the client object using the Blob storage endpoint for your account.
    CloudBlobClient blobClient = new CloudBlobClient(
        new Uri(@"https://storagesamples.blob.core.windows.net"));

    // Get a reference to a container that's available for anonymous access.
    CloudBlobContainer container = blobClient.GetContainerReference("sample-container");

    // Read the container's properties.
    // Note this is only possible when the container supports full public read access.
    container.FetchAttributes();
    Console.WriteLine(container.Properties.LastModified);
    Console.WriteLine(container.Properties.ETag);
}
```

---

## Reference a container anonymously

If you have the URL to a container that is anonymously available, you can use it to reference the container directly.

# [\.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Security.cs" id="Snippet_ListBlobsAnonymously":::

# [\.NET v11 SDK](#tab/dotnet11)

```csharp
public static void ListBlobsAnonymously()
{
    // Get a reference to a container that's available for anonymous access.
    CloudBlobContainer container = new CloudBlobContainer(
        new Uri(@"https://storagesamples.blob.core.windows.net/sample-container"));

    // List blobs in the container.
    // Note this is only possible when the container supports full public read access.
    foreach (IListBlobItem blobItem in container.ListBlobs())
    {
        Console.WriteLine(blobItem.Uri);
    }
}
```

---

## Reference a blob anonymously

If you have the URL to a blob that is available for anonymous access, you can reference the blob directly using that URL:

# [\.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Security.cs" id="Snippet_DownloadBlobAnonymously":::

# [\.NET v11 SDK](#tab/dotnet11)

```csharp
public static void DownloadBlobAnonymously()
{
    CloudBlockBlob blob = new CloudBlockBlob(
        new Uri(@"https://storagesamples.blob.core.windows.net/sample-container/logfile.txt"));
    blob.DownloadToFile(@"C:\Temp\logfile.txt", FileMode.Create);
}
```

---

## Next steps

- [Configure anonymous public read access for containers and blobs](anonymous-read-access-configure.md)
- [Prevent anonymous public read access to containers and blobs](anonymous-read-access-prevent.md)
- [Authorizing access to Azure Storage](../common/authorize-data-access.md)
