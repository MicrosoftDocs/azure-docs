---
title: Get started with Azure Blob storage (object storage) using .NET | Microsoft Docs
description: Store unstructured data in the cloud with Azure Blob storage (object storage).
services: storage
documentationcenter: .net
author: tamram
manager: timlt
editor: tysonn

ms.assetid: d18a8fc8-97cb-4d37-a408-a6f8107ea8b3
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 03/27/2017
ms.author: tamram
---
# Get started with Azure Blob storage using .NET

[!INCLUDE [storage-selector-blob-include](../../../includes/storage-selector-blob-include.md)]

[!INCLUDE [storage-check-out-samples-dotnet](../../../includes/storage-check-out-samples-dotnet.md)]

This tutorial will show you how to use Azure Blob Storage with .NET and Visual Studio 2017. It will show how to upload, list, download, and delete blobs in the context of an Image Gallery sample application. By the end of this tutorial, you should know how to use Blob Storage for basic tasks.

## Set up you environment

First, ensure that you have [Visual Studio 2017](https://www.visualstudio.com/vs/) installed with the [Azure Development workload](https://www.visualstudio.com/vs/visual-studio-workloads/). This will give you all of the tools that you will need for this tutorial.

Next, create a new ASP.NET Core Razor Pages project from **File > New Project > Visual C# > ASP.NET Core Web Application**, and select this option:

(image)

### Create a storage account with Add Service Reference

1. In **Solution Explorer**, right-click the project.
2. From the context menu, select **Add > Connected Service**.
3. In the **Connected Services** dialog box, select **Cloud Storage with Azure Storage**, and then select **Configure**.

(image)

4. In the **Azure Storage** dialog box, select **Create a New storage Account** and complete the form. If you have an existing account, select that instead.
5. Select **Add**.

Now you're ready to code!

## Create a class to represent Images

First, we'll need to have a way to represent images coming from Azure Blob Storage. In **Solution Explorer**, right-click the solution and add a new folder named `Models`. Select the created folder node and create a C# file named `Image.cs`. Replace the default code with this:

```csharp
using System;

/// <summary>
/// A representation of an image in Blob storage.
/// Does not contain the actual bits of an image itself for efficiency reasons.
/// </summary>
public class Image
{
    /// <summary>
    /// Unique identifier for an image in Blob Storage. This can be used to determine images within our own app.
    /// </summary>
    public Guid ID { get; set; }

    /// <summary>
    /// The URI for this image which can uniquely identify it in Azure's Blob Storage service.
    /// </summary>
    public URI StorageUri { get; set; }

    // TODO
    public string FileExtension { get; set; }
}
```

We'll use this class throughout the tutorial.

## Create a new layer to interact with Blob Storage APIs

To follow best practices with ASP.NET Core apps, we'll represent interactions with Blob Storage via an interface and its implementation. This will allow you to stub out the interface implemention with a testable implementation if you're interested in testing its logic.

In **Solution Explorer**, right-click the solution and add a new folder named `StorageService`. In that folder, create a new C# file named `IStorageService.cs`. Replace the default template code with the following:

```csharp
public interface IStorageService
{
    Task AddNewImageAsync(Stream imageFileStream);
    List<Image> GetAllImages();
    Task<Stream> DownloadBlobContent(Image image);
    Task DeleteImageFromBlob(Image image);
}
```

Next, we'll implement this interface. Right-click the `StorageService` folder and add a new C# class called `StorageService.cs`. Replace the default template code with the following:

```csharp
// Using statements...

public class StorageService : IStorageService
{
    private readonly CloudBlobClient _client;
    private readonly CloudBlobContainer _container;
    private readonly string CONTAINER_NAME = "images";

    public StorageService()
    {
        var account = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("YOUR KEY HERE"));
        _client = account.CreateCloudBlobClient();
        _container = _client.GetContainerReference(CONTAINER_NAME);
        _container.CreateIfNotExists();
    }

    public async Task AddNewImageAsync(Stream imageFileStream)
    {
        throw new NotImplementedException();
    }

    public async List<Image> GetAllImages()
    {
        throw new NotImplementedException();
    }

    public async Task<Stream> DownloadBlobContentAsync(Image image)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteImageBlobAsync(Image image)
    {
        throw new NotImplementedException();
    }
}
```

Now, open the **Web.Config** file and look for the Azure Storage connection string generated by Connected Services. Replace `YOUR KEY HERE` with the `key` name of the connection string found in your **Web.Config**.

This class represents an object which interacts with the Blob Storage client APIs. Upon instantiation, it will:

1. Read your the connection string from your configuration file and parse it into a representation of your Storage account.
2. Create a client for Blob storage.
3. Create a container by name if it doesn't already exist.

By default, the new container is private, meaning that you must specify your storage access key to download blobs from this container. If you want to make the files within the container available to everyone, you can set the container to be public using the following code:

```csharp
_container.SetPermissions(
    new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
```

Anyone on the Internet can see blobs in a public container. However, you can modify or delete them only if you have the appropriate account access key or a shared access signature.

## Upload an image to a blob

Let's implement the `UploadToBlob` method:

```csharp
public async Task AddNewImageAsync(Stream imageFileStream, string fileExtension)
{
    var imageGuid = Guid.NewGuid();
    var blobName = imageGuid + fileExtension;
    var blob = _container.GetBlockBlobReference(blobName);

    await blob.UploadFromStreamAsync(imageFileStream);
}
```

This method is very simple. First, it creates a unique name for a new blob to store an image. `GetContainerReference` will generate associated metadata to send off the stream to Azure Blob Storage. Finally, `UploadFromStreamAsync` will perform the upload. This operation will also create the blob in Azure Storage.

## List all images in a container

Next, let's implement `GetAllImages`:

```csharp
public async List<Image> GetAllImages()
{
    var imageList = new List<Image>();
    var blobList = _container.ListBlobs();

    foreach (var blob in blobList)
    {
        var image = new Image();

        var blobUriPath = blob.Uri.AbsolutePath;

        // Associate the image ID with the GUID from the blob.
        image.ID = new Guid(blobUriPath.Substring(blobUriPath.IndexOf("."), Guid.Empty.ToString().Length));
        image.StorageUri = blob.Uri;
    }

    return imageList;
}
```

The key call in this method is `ListBlobs()`. This will return an `IEnumerable` of [`IListBlobItem>`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.ilistblobitem?view=azure-dotnet) rather than a specific blob type. If you wish to treat each of these items as a specific blob type, you must cast them to either a `CloudBlockBlob`, `CloudPageBlob`, or `CloudBlobDirectory` type. However, in this tutorial we only need a blob's URI to display images in our image gallery.

## Download an image blob's content

Let's implement the `DownloadBlobContentAsync` method:

```csharp
public async Task<Stream> DownloadBlobContentAsync(Image image, Stream fileStream)
{
    var blobName = image.ID + image.FileExtension;
    var blob = _container.GetBlockBlobReference(blobName);

    await blob.DownloadToStreamAsync(fileStream);

    return fileStream;
}
```

The `DownloadToStreamAsync` method does what its name implies. This facility is quite useful, because you can do whatever you like with a stream. In our case, we'll write this stream to the response of the web app to allow you to download the file directly.

## Delete an image from a blob

Finally, let's implement `DeleteImageBlobAsync`:

```csharp
public async Task DeleteImageBlobAsync(Image image)
{
    var blobName = image.ID + image.FileExtension;
    var blob = _container.GetBlockBlobReference(blobName);

    await blob.DeleteAsync();
}
```

This will completely delete the image from Blob Storage.

## Wire up the blob service code

Now that we have all of our operations on Blob Storage implemented, let's complete our web app by calling everything! Just as a reminder, the [entire source code for this app is already on GitHub](some-url-here.com).

TODO

## Next steps

Now that you've learned the basics of Blob storage, follow these links to learn more.

### Microsoft Azure Storage Explorer
* [Microsoft Azure Storage Explorer (MASE)](../../vs-azure-tools-storage-manage-with-storage-explorer.md) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.

### Blob storage samples
* [Getting Started with Azure Blob Storage in .NET](https://azure.microsoft.com/documentation/samples/storage-blob-dotnet-getting-started/)

### Blob storage reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/mt347887.aspx)
* [REST API reference](/rest/api/storageservices/azure-storage-services-rest-api-reference)

### Conceptual guides
* [Transfer data with the AzCopy command-line utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Get started with File storage for .NET](../files/storage-dotnet-how-to-use-files.md)
* [How to use Azure blob storage with the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki)
