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

This tutorial will show you how to use [Azure Blob Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) with ASP.NET and Visual Studio 2017. It will show how to upload, list, download, and delete blobs in the context of a simple Web API project.

## Get the sample project

To begin, [clone the sample project from GitHub](https://github.com/cartermp/TutorialForStorage). The rest of the tutorial will work with this project.

If you're unfamiliar with git, you can also download the project as a zip file. In the GitHub repository, there is a green button called **Clone or download**. You can click that and select **Download ZIP**:

![Screenshot of GitHub showing how to clone or download the sample application](media/storage-blobs-introduction/download-sample.png)

## Set up your environment

Ensure that you have [Visual Studio 2017](https://www.visualstudio.com/vs/) installed with the **ASP.NET and web development** and **Azure Development** workloads. This will give you all of the tools that you will need for this tutorial.

![Screenshot of searching for the Azure Storage Emulator via Windows search](media/storage-blobs-introduction/workloads.png)

## Run the application locally

Open the [sample application](https://github.com/cartermp/TutorialForStorage) in Visual Studio 2017. Start it by pressing **f5** in Visual Studio. This will launch the web app on `http://localhost:58673/` so that you can interact with it. You can explore the shape of the API by entering `http://localhost:58673/api` to explore the REST API.

Next, start the [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/common/storage-use-emulator) by pressing the **Windows** key on your keyboard and searching for **Azure Storage Emulator**:

![Screenshot of searching for the Azure Storage Emulator via Windows search](media/storage-blobs-introduction/storage-emulator.png)

This will start the Azure Storage Emulator on your machine, and open a command prompt which you can use to control it from there.

It's very easly to GET/PUT/DELETE to the running app with tools such as [cURL](https://curl.haxx.se/) or [Postman](https://www.getpostman.com/). For example, the following PUT:

```
PUT /api/blobs/4 HTTP/1.1
Host: localhost:58673
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 61b387e3-56cb-ea8f-dcbd-1020655aff41

"I have a kitty."
```

Will upload the text string "I have a kitty" to the Blob Storage emulator and create a blob named "4".

You can list all blobs with a GET call:

```
GET /api/blobs/ HTTP/1.1
Host: localhost:58673
Content-Type: application/json
Cache-Control: no-cache
Postman-Token: 975eca0c-a33b-e64a-ffe9-70fa67bd8b20
```

This will download the contents of all blobs in the emulator and send a response as JSON:

```json
[
    {
        "ID": "1",
        "Content": "I have a cat who I love"
    },
    {
        "ID": "2",
        "Content": "I have a wonderful bicycle."
    },
    {
        "ID": "3",
        "Content": "I have a cat who likes to be pet."
    },
    {
        "ID": "4",
        "Content": "I have a kitty."
    }
]
```

## Basic Blob operations

Now that you've run the the [sample application](https://github.com/cartermp/TutorialForStorage), take a look at the basic operations on Blobs that it performs. All code for interacting with blobs is in a single file, `BlobsController.cs`:

```csharp
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Http;

namespace TutorialForStorage.Controllers
{
    public class BlobModel
    {
        public string ID { get; set; }
        public string Content { get; set; }
    }

    public class BlobsController : ApiController
    {
        private readonly string CONN_STRING = "AzureStorageConnectionString";
        private readonly string CONTAINER_NAME = "myblobs";
        private readonly CloudBlobClient _client;
        private readonly CloudBlobContainer _container;

        public BlobsController()
        {
            // CONN_STRING is defined in the applications Web.config file.
            var connString = ConfigurationManager.AppSettings[CONN_STRING];
            var account = CloudStorageAccount.Parse(connString);

            _client = account.CreateCloudBlobClient();
            _container = _client.GetContainerReference(CONTAINER_NAME);
            _container.CreateIfNotExists();
        }

        // List all blob contents
        public async Task<IEnumerable<BlobModel>> Get()
        {
            var blobContents = new List<BlobModel>();
            var blobs = _container.ListBlobs();

            foreach (var blob in blobs)
            {
                if (blob is CloudBlockBlob cbb)
                {
                    var blobContent = await cbb.DownloadTextAsync();
                    var blobName = cbb.Name;

                    var model = new BlobModel
                    {
                        ID = blobName,
                        Content = blobContent
                    };

                    blobContents.Add(model);
                }
            }

            return blobContents;
        }

        // Download the contents of a single blob
        public async Task<string> Get(string id)
        {
            var blob = _container.GetBlockBlobReference(id);
            return await blob.DownloadTextAsync();
        }

        // Upload content to a new blob
        public async Task Put(string id, [FromBody]string content)
        {
            var blob = _container.GetBlockBlobReference(id);
            await blob.UploadTextAsync(content);
        }

        // Delete a blob
        public async Task Delete(string id)
        {
            var blob = _container.GetBlockBlobReference(id);
            await blob.DeleteIfExistsAsync();
        }
    }
}
```

As you can see, basic operations on blobs are very straightforward. Let's take a more focused look at each section.

## Create a storage account and container

In the constructor, a [Storage Account](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.cloudstorageaccount?view=azure-dotnet) and [Container](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer?view=azure-dotnet) are created as follows:

1. Parse the connection string (which could be for local development or an actual connection string).
2. Creates a client, which could then be used to create multiple containers.
3. Creates a container by name if it doesn't already exist.

```csharp
private readonly string CONN_STRING = "AzureStorageConnectionString";
private readonly string CONTAINER_NAME = "myblobs";
private readonly CloudBlobClient _client;
private readonly CloudBlobContainer _container;

public BlobsController()
{
    // CONN_STRING is defined in the applications Web.config file.
    var connString = ConfigurationManager.AppSettings[CONN_STRING];
    var account = CloudStorageAccount.Parse(connString);

    _client = account.CreateCloudBlobClient();
    _container = _client.GetContainerReference(CONTAINER_NAME);
    _container.CreateIfNotExists();
}
```

Every blob in Azure Storage must reside in a container. The container name is part of how you uniquely identify any blob in Azure Storage, and is your entry point for any blob operation.

Container names must also be a valid DNS name. To learn more about containers and naming, see [Naming and Referencing Containers, Blobs, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata).

## List blobs in a container

To list blobs in a container, call [`ListBlobs`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.listblobs?view=azure-dotnet) on the container as done in the HTTP GET call from the API controller:

```csharp
public async Task<IEnumerable<BlobModel>> Get()
{
    var blobContents = new List<BlobModel>();
    var blobs = _container.ListBlobs();

    foreach (var blob in blobs)
    {
        if (blob is CloudBlockBlob cbb)
        {
            var blobContent = await cbb.DownloadTextAsync();
            var blobName = cbb.Name;

            var model = new BlobModel
            {
                ID = blobName,
                Content = blobContent
            };

            blobContents.Add(model);
        }
    }

    return blobContents;
}
```

You've likely noticed that an [`is` expression](https://docs.microsoft.com/dotnet/csharp/language-reference/keywords/is) is needed on the `blob` item in the `for` loop. This is because each `blob` is of type [`IListBlobItem`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.ilistblobitem?view=azure-dotnet), which is a common interface implemented by multiple blob types. This tutorial uses Block Blobs, which are the most common kinds of blobs. If you are working with Page Blobs or Blob Directories, you can cast to those types instead.

If you have a large number of blobs, you may need to use other listing APIs such as [ListBlobsSegmentedAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobclient.listblobssegmentedasync?view=azure-dotnet).

## Download a blob

```csharp
public async Task<string> Get(string id)
{
    var blob = _container.GetBlockBlobReference(id);
    return await blob.DownloadTextAsync();
}
```

The [`DownloadTextAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.downloadtextasync?view=azure-dotnet#Definiti) method is used to download text, since we know that the blob is text. There are other APIs available such as [`DownloadToFileAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtofileasync?view=azure-dotnet), [`DownloadToStreamAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtostreamasync?view=azure-dotnet), and to [`DownloadToByteArrayAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblob.downloadtobytearrayasync?view=azure-dotnet).

## Upload to a blob

```csharp
public async Task Put(string id, [FromBody]string content)
{
    var blob = _container.GetBlockBlobReference(id);
    await blob.UploadTextAsync(content);
}
```

The [`UploadTextAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadtextasync?view=azure-dotnet) will upload string content to a blob, optionally creating the blob if it does not exist. There are other APIs available such as [`UploadFromFileAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfromfileasync?view=azure-dotnet), [`UploadFromStreamAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfromstreamasync?view=azure-dotnet), and [`UploadFromByteArrayAsync`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.windowsazure.storage.file.cloudfile.uploadfrombytearrayasync?view=azure-dotnet).

## Delete a blob

```csharp
public async Task Delete(string id)
{
    var blob = _container.GetBlockBlobReference(id);
    await blob.DeleteIfExistsAsync();
}
```

[`DeleteIfExistsAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteifexistsasync?view=azure-dotnet) will delete a blob if it exists. It returns a `Task<bool>`, where `true` indicates that it successfully deleted the blob, and `false` indicates that the container did not exist. In this case, we can simply ignore it.

You can also use the [`DeleteAsync`](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.blob.cloudblobcontainer.deleteasync?view=azure-dotnet) method, but you'll need to handle any exceptions if the blob doesn't exist yourself.

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

### Blob storage reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/mt347887.aspx)
* [REST API reference](/rest/api/storageservices/azure-storage-services-rest-api-reference)

### Conceptual Guides
* [Transfer data with AzCopy command-line utility](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)
* [Get started with File storage for .NET](https://docs.microsoft.com/azure/storage/files/storage-dotnet-how-to-use-files)
* [How to use Azure blob storage with the WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki)