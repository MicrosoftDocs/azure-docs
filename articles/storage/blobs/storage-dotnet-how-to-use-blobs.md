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

This tutorial will show you how to use [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) with ASP.NET and Visual Studio 2017. It will show how to upload, list, download, and delete blobs in the context of a simple Web API project that works with images. If you are developing for Xamarin, see [How to use Blob Storage from Xamarin](https://docs.microsoft.com/azure/storage/blobs/storage-xamarin-blob-storage).

Azure Storage also works on other .NET platforms, such as .NET Core and Xamarin, and the APIs used in this guide are available on more than just Windows. This tutorial will use Windows and Visual Studio 2017, but the code samples can work in any .NET environment where Azure Storage APIs work.

## Get the sample project

To begin, [clone the sample project from GitHub](https://github.com/cartermp/TutorialForStorage). The rest of the tutorial will work with this project.

If you're unfamiliar with git, you can also download the project as a zip file. In the GitHub repository, there is a green button called **Clone or download**. You can click that and select **Download ZIP**:

![Screenshot of GitHub showing how to clone or download the sample application](media/storage-blobs-introduction/download-sample.png)

## Set up your environment

Ensure that you have [Visual Studio 2017](https://www.visualstudio.com/vs/) installed with the **ASP.NET and web development** and **Azure Development** workloads. This will give you all of the tools that you will need for this tutorial.

![Screenshot of searching for the Azure Storage Emulator via Windows search](media/storage-blobs-introduction/workloads.png)

## Run the application locally

First, start the [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/common/storage-use-emulator) by pressing the **Windows** key on your keyboard and searching for **Azure Storage Emulator**:

![Screenshot of searching for the Azure Storage Emulator via Windows search](media/storage-blobs-introduction/storage-emulator.png)

This will start the Azure Storage Emulator on your machine, and open a command prompt which you can use to control it from there.

Open the [sample application](https://github.com/cartermp/TutorialForStorage) in Visual Studio 2017. Start it by pressing **f5** in Visual Studio. This will launch the web app on `http://localhost:58673/` so that you can interact with it or click the API tab to browse the reference.

Next, enter the following in your browser to test that your GET API is working:

```
http://localhost:58673/api/blobs
```

You should see a response that is similar to the following (if viewed as JSON):

```
[
    "Block blob with name 'Awesome-Mountain-River-Wallpaper.jpg', content type 'application/octet-stream', size '1465150', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/Awesome-Mountain-River-Wallpaper.jpg'",
    "Block blob with name 'Beautiful Stream Desktop Wallpapers (2).jpg', content type 'application/octet-stream', size '382544', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/Beautiful Stream Desktop Wallpapers (2).jpg'",
    "Block blob with name 'Forest-river-wallpaper-Hd.jpg', content type 'application/octet-stream', size '2690689', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/Forest-river-wallpaper-Hd.jpg'",
    "Block blob with name 'Grand-Canyon-Colorado-River.jpg', content type 'application/octet-stream', size '261788', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/Grand-Canyon-Colorado-River.jpg'",
    "Block blob with name 'Smith-River.jpg', content type 'application/octet-stream', size '519207', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/Smith-River.jpg'",
    "Block blob with name 'grand-canyon-colorado-river-1.jpg', content type 'application/octet-stream', size '232356', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/grand-canyon-colorado-river-1.jpg'",
    "Block blob with name 'ws_Columbia_Mountain_River_Grass_1366x768.jpg', content type 'application/octet-stream', size '450769', and URI 'http://127.0.0.1:10000/devstoreaccount1/quickstart/ws_Columbia_Mountain_River_Grass_1366x768.jpg'"
]
```

## Basic blob operations

The following sections will walk through the basics of interacting with blob storage within an ASP.NET Web API project:

* Storage account and container creation, done in a constructor.
* Uploading a file on the server to a blob.
* Download a file from a blob to the server.
* Deleting a blob.
* Listing metadata about each blob.

The code samples below are pulled directly from the [sample application](https://github.com/cartermp/TutorialForStorage) (with some minor modifications to help readability). You can see them all in unison near the bottom of this article.

## Create a storage account and container

The first thing you need to do is initialize a [Storage Account](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount?view=azure-dotnet) and [Container](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet). In most cases, the best place to do that is via a constructor in a class.

```csharp
private readonly string CONN_STRING_SETTING = "AzureStorageConnectionString";
private readonly CloudBlobClient _client;
private readonly CloudBlobContainer _container;

// Initialize this controller with storage account and blob container
public BlobsController()
{
    var connString = CloudConfigurationManager.GetSetting(CONN_STRING_SETTING);
    var account = CloudStorageAccount.Parse(connString);

    _client = account.CreateCloudBlobClient();
    _container = _client.GetContainerReference(CONTAINER_NAME);
}
```

Every blob in Azure Storage must reside in a container. The container name is part of how you uniquely identify any blob in Azure Storage, and is your entry point for any blob operation.

Container names must also be a valid DNS name. To learn more about containers and naming, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## Upload to a blob

```csharp
[Route("api/blobs/upload")]
public async Task UploadFile(string path)
{
    var filePathOnServer = Path.Combine(HostingEnvironment.MapPath(UPLOAD_PATH), path);

    using (var fileStream = File.OpenRead(filePathOnServer))
    {
        var filename = Path.GetFileName(path); // Trim fully pathed filename to just the filename
        var blockBlob = _container.GetBlockBlobReference(filename);

        await blockBlob.UploadFromStreamAsync(fileStream);
    }
}
```

The [`UploadFromStreamAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfromstreamasync?view=azure-dotnet) method is a general-purpose API for uploading from anything which can be exposed as a stream to a blob. There are other APIs available such as [`UploadTextAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadtextasync?view=azure-dotnet), [`UploadFromFileAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfromfileasync?view=azure-dotnet), and [`UploadFromByteArrayAsync`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfrombytearrayasync?view=azure-dotnet).


## Download a blob

```csharp
[HttpGet]
[Route("api/blobs/download")]
public async Task DownloadFile(string blobName)
{
    var blockBlob = _container.GetBlockBlobReference(blobName);

    var downloadsPathOnServer = Path.Combine(HostingEnvironment.MapPath(DOWNLOAD_PATH), blockBlob.Name);

    using (var fileStream = File.OpenWrite(downloadsPathOnServer))
    {
        await blockBlob.DownloadToStreamAsync(fileStream);
    }
}
```

The [`DownloadToStreamAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtostreamasync?view=azure-dotnet)method is a general-purpose API for downloading to anything that can be exposed as a stream. There are other APIs available such as [`DownloadTextAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.downloadtextasync?view=azure-dotnet#Definiti), [`DownloadToFileAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync?view=azure-dotnet), and [`DownloadToByteArrayAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtobytearrayasync?view=azure-dotnet).

## Delete a blob

```csharp
public async Task Delete(string blobName)
{
    var blob = _container.GetBlobReference(blobName);
    await blob.DeleteIfExistsAsync();
}
```

[`DeleteIfExistsAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteifexistsasync?view=azure-dotnet) will delete a blob if it exists. It returns a `Task<bool>`, where `true` indicates that it successfully deleted the blob, and `false` indicates that the container did not exist. In this case, we can simply ignore it.

You can also use the [`DeleteAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteasync?view=azure-dotnet) method, but you'll need to handle any exceptions if the blob doesn't exist yourself.

## List blobs in a container

To list blobs in a container, call [`ListBlobs`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobs?view=azure-dotnet) on the container as done in the HTTP GET call from the API controller:

```csharp
public async Task<IEnumerable<string>> Get()
{
    var blobsInfoList = new List<string>();
    var blobs = _container.ListBlobs(); // Use ListBlobsSegmentedAsync for containers with large numbers of files
    var blobsList = new List<IListBlobItem>(blobs);

    if (blobsList.Count == 0)
    {
        await InitializeContainerWithSampleData();

        // Refresh enumeration after initializing
        blobs = _container.ListBlobs();
        blobsList.AddRange(blobs);
    }

    foreach (var item in blobs)
    {
        if (item is CloudBlockBlob blob)
        {
            var blobInfoString = $"Block blob with name '{blob.Name}', " +
                $"content type '{blob.Properties.ContentType}', " +
                $"size '{blob.Properties.Length}', " +
                $"and URI '{blob.Uri}'";

            blobsInfoList.Add(blobInfoString);
        }
    }

    return blobsInfoList;
}
```

You've likely noticed that an [`is` expression](https://docs.microsoft.com/dotnet/csharp/language-reference/keywords/is) is needed on the `blob` item in the `for` loop. This is because each `blob` is of type [`IListBlobItem`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.ilistblobitem?view=azure-dotnet), which is a common interface implemented by multiple blob types. This tutorial uses Block Blobs, which are the most common kinds of blobs. If you are working with Page Blobs or Blob Directories, you can cast to those types instead.

If you have a large number of blobs, you may need to use other listing APIs such as [ListBlobsSegmentedAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient.listblobssegmentedasync?view=azure-dotnet).

## Basic blob operations together

Now that you've run the the [sample application](https://github.com/cartermp/TutorialForStorage), take a look at the basic operations on Blobs that it performs. All code for interacting with blobs is in a single file, `BlobsController.cs`.

```csharp
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Azure;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Diagnostics;
using System.IO;
using System.Web.Hosting;

namespace TutorialForStorage.Controllers
{
    public class BlobsController : ApiController
    {
        private readonly string CONN_STRING_SETTING = "AzureStorageConnectionString";
        private readonly string CONTAINER_NAME = "quickstart";
        private readonly string UPLOAD_PATH = "~/Images/";
        private readonly string DOWNLOAD_PATH = "~/Downloads";
        private readonly CloudBlobClient _client;
        private readonly CloudBlobContainer _container;

        // Initialize this controller with storage account and blob container
        public BlobsController()
        {
            var connString = CloudConfigurationManager.GetSetting(CONN_STRING_SETTING);
            var account = CloudStorageAccount.Parse(connString);

            _client = account.CreateCloudBlobClient();
            _container = _client.GetContainerReference(CONTAINER_NAME);
        }

        public async Task<IEnumerable<string>> Get()
        {
            var blobsInfoList = new List<string>();
            var blobs = _container.ListBlobs(); // Use ListBlobsSegmentedAsync for containers with large numbers of files
            var blobsList = new List<IListBlobItem>(blobs);

            if (blobsList.Count == 0)
            {
                await InitializeContainerWithSampleData();

                // Refresh enumeration after initializing
                blobs = _container.ListBlobs();
                blobsList.AddRange(blobs);
            }

            foreach (var item in blobs)
            {
                if (item is CloudBlockBlob blob)
                {
                    var blobInfoString = $"Block blob with name '{blob.Name}', " +
                        $"content type '{blob.Properties.ContentType}', " +
                        $"size '{blob.Properties.Length}', " +
                        $"and URI '{blob.Uri}'";

                    blobsInfoList.Add(blobInfoString);
                }
            }

            return blobsInfoList;
        }

        public string Get(string name)
        {
            // Retrieve reference to a blob by filename, e.g. "photo1.jpg".
            var blob = _container.GetBlockBlobReference(name);
            var blobInfoString = $"Block blob with name '{blob.Name}', " +
                        $"content type '{blob.Properties.ContentType}', " +
                        $"size '{blob.Properties.Length}', " +
                        $"and URI '{blob.Uri}'";
            return blobInfoString;
        }

        [Route("api/blobs/upload")]
        public async Task UploadFile(string path)
        {
            var filePathOnServer = Path.Combine(HostingEnvironment.MapPath(UPLOAD_PATH), path);

            using (var fileStream = File.OpenRead(filePathOnServer))
            {
                var filename = Path.GetFileName(path); // Trim fully pathed filename to just the filename
                var blockBlob = _container.GetBlockBlobReference(filename);

                await blockBlob.UploadFromStreamAsync(fileStream);
            }
        }

        [HttpGet]
        [Route("api/blobs/download")]
        public async Task DownloadFile(string blobName)
        {
            var blockBlob = _container.GetBlockBlobReference(blobName);

            var downloadsPathOnServer = Path.Combine(HostingEnvironment.MapPath(DOWNLOAD_PATH), blockBlob.Name);

            using (var fileStream = File.OpenWrite(downloadsPathOnServer))
            {
                await blockBlob.DownloadToStreamAsync(fileStream);
            }
        }

        public async Task Delete(string blobName)
        {
            var blob = _container.GetBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }

        public async Task InitializeContainerWithSampleData()
        {
            var folderPath = HostingEnvironment.MapPath(UPLOAD_PATH);
            var folder = Directory.GetFiles(folderPath);

            foreach (var file in folder)
            {
                await UploadFile(file);
            }
        }
    }
}
```

## Run the sample application in Azure

To publish the [application this sample application](https://github.com/cartermp/TutorialForStorage) to Azure, you'll need an Azure Storage account. The easiest way to do this is with Visual Studio Connected Services.

### Create a storage account with Connected Services

1. In **Solution Explorer**, right-click on **Connected Services**.
2. From the context menu, select **Add > Connected Service**.
3. In the **Connected Services** dialog box, select **Cloud Storage with Azure Storage**, and then select **Create a new Storage Account**.

![A screenshot of creating a Storage account with Visual Studio Connected Services](media/storage-blobs-introduction/storage-blob-create-account.png)

4. In the **Azure Storage** dialog box, complete the form. Under **Resource Group**, select **Create new**. Under **Location**, pick anything you like.
5. Once your account has been created, click **Add**. This will install all the necessary dependencies that you'll need to get started.

### Add the connection string to the release configuration file.

After you've added a service reference through Connected Services, it will have placed a true connection string in the `appSettings` section of your `Web.config` like so:

```xml
<appSettings>
    <add key="AzureStorageConnectionString" value="UseDevelopmentStorage=true" />

    <!-- Azure Storage: STORAGE_NAME -->
    <add key="<STORAGE_NAME>_AzureStorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=STORAGE_NAME;AccountKey=<ACCOUNT_KEY_HERE>;EndpointSuffix=core.windows.net" />
</appSettings>
```

Replace the `"UseDevelopmentStroage=true"` value with the real connection string generated by Connected Services.

### Publish to Azure

Finally, you can publish to Azure!

1. In **Solution Explorer**, right-click and select **Publish**.
2. Under **Microsoft Azure App Service**, ensure that **Create New** is selected and press the **Publish** button.
3. Fill out the form - all fields should be automatically populated with values that will allow you to create a new App Service web app with the project.
4. Click **Create**.

After it creates the App Service web app, and the application is fully published, a browser window will open and you can interact with the sample app live over the internet!

## Next steps

Now that you've learned the basics of Blob storage, follow these links to learn more.

### Microsoft Azure Storage Explorer
* [Microsoft Azure Storage Explorer](https://docs.microsoft.com/azure/vs-azure-tools-storage-manage-with-storage-explorer) is a free, crossplatform application which allows you to work visually with Azure Storage Data.

### More samples
* [Azure Storage samples using .NET](https://docs.microsoft.com/en-us/azure/storage/common/storage-samples-dotnet)
* [Azure Storage sample for Xamarin](https://developer.xamarin.com/samples/xamarin-forms/WebServices/AzureStorage/)
* [Azure Storage Service - Photo Uploader Sample using Xamarin for Android, iOS and Windows](https://azure.microsoft.com/resources/samples/storage-blob-xamarin-image-uploader/)

### Blob storage reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/mt347887.aspx)
* [REST API reference](/rest/api/storageservices/azure-storage-services-rest-api-reference)

### Conceptual Guides
* [Transfer data with AzCopy command-line utility](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Get started with File storage for .NET](https://docs.microsoft.com/azure/storage/files/storage-dotnet-how-to-use-files)
* [How to use Azure blob storage with the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki)
* [Storing and Accessing Data in Azure Storage for Xamarin](https://developer.xamarin.com/guides/xamarin-forms/cloud-services/storage/azure-storage/)