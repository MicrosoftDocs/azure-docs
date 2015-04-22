<properties 
	pageTitle="Getting Started with Azure Storage" 
	description="How to get started using Azure blob storage in an ASP.NET 5 project in Visual Studio" 
	services="storage" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="storage" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="kempb"/>

# Getting Started with Azure Storage (ASP.NET 5 Projects)

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-aspnet5-getting-started-blobs.md)
> - [What Happened](vs-storage-aspnet5-what-happened.md)

> [AZURE.SELECTOR]
> - [Blobs](vs-storage-aspnet5-getting-started-blobs.md)
> - [Queues](vs-storage-aspnet5-getting-started-queues.md)
> - [Tables](vs-storage-aspnet5-getting-started-tables.md)

Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files.

To get started, you need to create an Azure storage account and then create one or more containers in the storage. For example, you could make a storage called “Scrapbook,” then create containers in the storage called “images” to store pictures and another called “audio” to store audio files. After you create the containers, you can upload individual blob files to them. See [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md "How to use Blob Storage from .NET") for more information on programmatically manipulating blobs.

To programmatically access blobs in ASP.NET 5 projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

		using Microsoft.Framework.ConfigurationModel;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Blob;
		using System.Threading.Tasks;

2. Use the following code to get the configuration setting.

		 IConfigurationSourceRoot config = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

#####Get the storage connection string
Before you can do anything with a blob, you need to get the connection string for the storage account the blobs will live in. You can use the **CloudStorageAccount** type to represent your storage account information. If you’re using an ASP.NET 5 project, you can you call the get method of the Configuration object to get your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      config.Get("MicrosoftAzureStorage:<storageAccountName>_AzureStorageConnectionString"));

#####Create a container
Just as files live in folders, storage blobs live in containers. You can use a **CloudBlobClient** object to reference an existing container, or you can call the CreateCloudBlobClient() method to create a new container.

The following code shows how to create a new blob storage container. The code first creates a **BlobClient** object so that you can access the object's functions, such as creating a storage container. Then, the code tries to reference a storage container named “mycontainer.” If it can’t find a container with that name, it creates one.

**NOTE:** The APIs that perform calls out to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous Programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

	// Create a blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Get a reference to a container named “mycontainer.”
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // If “mycontainer” doesn’t exist, create it.
    await container.CreateIfNotExistsAsync();    

By default, the new container is private and you must specify your storage access key to download blobs from this container. If you want to make the files within the container available to everyone, you can set the container to be public by using the following code.

	await container.SetPermissionsAsync(new BlobContainerPermissions
    {
        PublicAccess = BlobContainerPublicAccessType.Blob
    });

**NOTE:** Use all of this code in front of the code in the following sections.

#####Upload a blob into a container
To upload a blob file into a container, get a container reference and use it to get a blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the **UploadFromStreamAsync()** method. This operation will create the blob if it’s not already there, or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

	// Get a reference to a blob named "myblob".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");            

    // Create or overwrite the "myblob" blob with the contents of a local file
    // named “myfile”.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        await blockBlob.UploadFromStreamAsync(fileStream);
    }

#####List the blobs in a container
To list the blobs in a container, first get a container reference. You can then call the container's **ListBlobsSegmentedAsync()** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, **CloudPageBlob**, or **CloudBlobDirectory** object. If you don’t know the blob type, you can use a type check to determine which to cast it to. The following code demonstrates how to retrieve and output the URI of each item in a container.

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

There are others ways to list the contents of a blob container. See [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md/#list-blob) for more information.

#####Download a blob
To download a blob, first get a reference to the blob and then call the **DownloadToStreamAsync()** method. The following example uses the **DownloadToStreamAsync()** method to transfer the blob contents to a stream object that you can then save as a local file.

	// Get a reference to a blob named "photo1.jpg".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

	// Save the blob contents to a file named “myfile”.
	using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
	{
    	await blockBlob.DownloadToStreamAsync(fileStream);
	}

There are other ways to save blobs as files. See [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md/#download-blobs) for more information.

#####Delete a blob
To delete a blob, first get a reference to the blob and then call the **DeleteAsync()** method on it.

	// Get a reference to a blob named "myblob.txt".
	CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

	// Delete the blob.
	await blockBlob.DeleteAsync();

[Learn more about Azure Storage](http://azure.microsoft.com/documentation/services/storage/)
See also [Browsing Storage Resources in Server Explorer](http://msdn.microsoft.com/library/azure/ff683677.aspx) and [ASP.NET 5](http://www.asp.net/vnext).
