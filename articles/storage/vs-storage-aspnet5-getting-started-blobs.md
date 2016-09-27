<properties
	pageTitle="Get started with blob storage and Visual Studio connected services (ASP.NET 5) | Microsoft Azure"
	description="How to get started using Azure Blob storage in a Visual Studio ASP.NET 5 project after you have created a storage account using Visual Studio connected services"
	services="storage"
	documentationCenter=""
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="web"
	ms.tgt_pltfrm="vs-getting-started"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/18/2016"
	ms.author="tarcher"/>

# Get started with Azure Blob storage and Visual Studio connected services (ASP.NET 5)

[AZURE.INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

##Overview

This article describes how to get started using Azure Blob storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET 5 project by using the Visual Studio Add Connected Services dialog.

Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files. This article describes how to get started with blob storage after you create an Azure storage account by using the Visual Studio **Add Connected Services** dialog in an ASP.NET 5 project.

Just as files live in folders, storage blobs live in containers. After you have created a storage, you create one or more containers in the storage. For example, in a storage called “Scrapbook,” you can create containers in the storage called “images” to store pictures and another called “audio” to store audio files. After you create the containers, you can upload individual blob files to them. See [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md) for more information on programmatically manipulating blobs.

##Access blob containers in code

To programmatically access blobs in ASP.NET 5 projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declarations to the top of any C# file in which you want to programmatically access Azure storage.

		using Microsoft.Extensions.Configuration;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
		using System.Threading.Tasks;
		using LogLevel = Microsoft.Extensions.Logging.LogLevel;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

		 CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

    **NOTE:** Use all of the above code in front of the code in the following sections.


3. Use a **CloudBlobClient** object to get a **CloudBlobContainer** reference to an existing container in your storage account.

		// Create a blob client.
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

        // Get a reference to a container named “mycontainer.”
        CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");



##Create a container in code

You can also use the **CloudBlobClient** to create a container in your storage account. All you need to do is to add a call to **CreateIfNotExistsAsync** as in the following code:

	// Create a blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Get a reference to a container named “my-new-container.”
    CloudBlobContainer container = blobClient.GetContainerReference("my-new-container");

    // If “mycontainer” doesn’t exist, create it.
    await container.CreateIfNotExistsAsync();


**NOTE:** The APIs that perform calls to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

To make the files within the container available to everyone, you can set the container to be public by using the following code.

	await container.SetPermissionsAsync(new BlobContainerPermissions
    {
        PublicAccess = BlobContainerPublicAccessType.Blob
    });

##Upload a blob into a container

To upload a blob file into a container, get a container reference and use it to get a blob reference. After you have a blob reference, you can upload any stream of data to it by calling the **UploadFromStreamAsync** method. This operation creates the blob if it’s not already there, or overwrites it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

	// Get a reference to a blob named "myblob".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

    // Create or overwrite the "myblob" blob with the contents of a local file
    // named “myfile”.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        await blockBlob.UploadFromStreamAsync(fileStream);
    }

##List the blobs in a container
To list the blobs in a container, first get a container reference. You can then call the container's **ListBlobsSegmentedAsync** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, **CloudPageBlob**, or **CloudBlobDirectory** object. If you don’t know the blob type, you can use a type check to determine which to cast it to. The following code demonstrates how to retrieve and output the URI of each item in a container.

	BlobContinuationToken token = null;
    do
    {
        BlobResultSegment resultSegment = await container.ListBlobsSegmentedAsync(token);
        token = resultSegment.ContinuationToken;

        foreach (IListBlobItem item in resultSegment.Results)
        {
            if (item.GetType() == typeof(CloudBlockBlob))
            {
                CloudBlockBlob blob = (CloudBlockBlob)item;
                Console.WriteLine("Block blob of length {0}: {1}", blob.Properties.Length, blob.Uri);
            }

            else if (item.GetType() == typeof(CloudPageBlob))
            {
                CloudPageBlob pageBlob = (CloudPageBlob)item;

                Console.WriteLine("Page blob of length {0}: {1}", pageBlob.Properties.Length, pageBlob.Uri);
            }

            else if (item.GetType() == typeof(CloudBlobDirectory))
            {
                CloudBlobDirectory directory = (CloudBlobDirectory)item;

                Console.WriteLine("Directory: {0}", directory.Uri);
            }
        }
    } while (token != null);

There are others ways to list the contents of a blob container. See [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md#list-the-blobs-in-a-container) for more information.

##Download a blob
To download a blob, first get a reference to the blob, and then call the **DownloadToStreamAsync** method. The following example uses the **DownloadToStreamAsync** method to transfer the blob contents to a stream object that you can then save as a local file.

	// Get a reference to a blob named "photo1.jpg".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

	// Save the blob contents to a file named “myfile”.
	using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
	{
    	await blockBlob.DownloadToStreamAsync(fileStream);
	}

There are other ways to save blobs as files. See [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md#download-blobs) for more information.

##Delete a blob
To delete a blob, first get a reference to the blob, and then call the **DeleteAsync** method on it.

	// Get a reference to a blob named "myblob.txt".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

	// Delete the blob.
	await blockBlob.DeleteAsync();

## Next steps

[AZURE.INCLUDE [vs-storage-dotnet-blobs-next-steps](../../includes/vs-storage-dotnet-blobs-next-steps.md)]
