<properties
	pageTitle="Get started with blob storage and Visual Studio connected services (cloud services) | Microsoft Azure"
	description="How to get started using Azure Blob storage in a cloud service project in Visual Studio after connecting to a storage account using Visual Studio connected services"
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

# Get started with Azure Blob Storage and Visual Studio connected services (cloud services projects)

[AZURE.INCLUDE [storage-try-azure-tools](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

This article describes how to get started with Azure Blob Storage after you created or referenced an Azure Storage account by using the Visual Studio **Add Connected Services** dialog in a Visual Studio cloud services project. We'll show you how to access and create blob containers, and how to perform common tasks like uploading, listing, and downloading blobs. The samples are written in C\# and use the [Microsoft Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/dn261237.aspx).

Azure Blob Storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files.

Just as files live in folders, storage blobs live in containers. After you have created a storage, you create one or more containers in the storage. For example, in a storage called “Scrapbook,” you can create containers in the storage called “images” to store pictures and another called “audio” to store audio files. After you create the containers, you can upload individual blob files to them.

- For more information on programmatically manipulating blobs, see [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md).
- For general information about Azure Storage, see [Storage documentation](https://azure.microsoft.com/documentation/services/storage/).
- For general information about Azure Cloud Services, see [Cloud Services documentation](https://azure.microsoft.com/documentation/services/cloud-services/).
- For more information about programming ASP.NET applications, see [ASP.NET](http://www.asp.net).

## Access blob containers in code

To programmatically access blobs in cloud service projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

        using Microsoft.Framework.Configuration;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Blob;
        using System.Threading.Tasks;
        using LogLevel = Microsoft.Framework.Logging.LogLevel;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("<storage account name>_AzureStorageConnectionString"));

3. Get a **CloudBlobClient** object to reference an existing container in your storage account.

		// Create a blob client.
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object to reference a specific blob container.

        // Get a reference to a container named “mycontainer.”
        CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

> [AZURE.NOTE] Use all of the code shown in the previous procedure in front of the code shown in the following sections.

## Create a container in code

> [AZURE.NOTE] Some APIs that perform calls out to Azure Storage in ASP.NET are asynchronous. See [Asynchronous programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code in the following example assumes that you are using async programming methods.

To create a container in your storage account, all you need to do is add a call to **CreateIfNotExistsAsync** as in the following code:

    // If “mycontainer” doesn’t exist, create it.
    await container.CreateIfNotExistsAsync();


To make the files within the container available to everyone, you can set the container to be public by using the following code.

	await container.SetPermissionsAsync(new BlobContainerPermissions
    {
        PublicAccess = BlobContainerPublicAccessType.Blob
    });


Anyone on the Internet can see blobs in a public container, but you can
modify or delete them only if you have the appropriate access key.

## Upload a blob into a container

Azure Storage supports block blobs and page blobs. In the majority of cases, block blob is the recommended type to use.

To upload a file to a block blob, get a container reference and use it to get a block blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the **UploadFromStream** method. This operation creates the blob if it didn't previously exist, or overwrites it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

    // Retrieve a reference to a blob named "myblob".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

    // Create or overwrite the "myblob" blob with contents from a local file.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        blockBlob.UploadFromStream(fileStream);
    }

## List the blobs in a container

To list the blobs in a container, first get a container reference. You can then use the container's **ListBlobs** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a  returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, **CloudPageBlob**, or **CloudBlobDirectory** object. If the type is unknown, you can use a type check to determine which to cast it to. The following code demonstrates how to retrieve and output the URI of each item in the **photos** container:

	// Loop over items within the container and output the length and URI.
	foreach (IListBlobItem item in container.ListBlobs(null, false))
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

As shown in the previous code sample, the blob service has the concept of directories within containers, as well. This is so that you can organize your blobs in a more folder-like structure. For example, consider the following set of block blobs in a container named **photos**:

	photo1.jpg
	2010/architecture/description.txt
	2010/architecture/photo3.jpg
	2010/architecture/photo4.jpg
	2011/architecture/photo5.jpg
	2011/architecture/photo6.jpg
	2011/architecture/description.txt
	2011/photo7.jpg

When you call **ListBlobs** on the container (as in the previous sample), the collection returned
contains **CloudBlobDirectory** and **CloudBlockBlob** objects representing the directories and blobs contained at the top level. Here is the resulting output:

	Directory: https://<accountname>.blob.core.windows.net/photos/2010/
	Directory: https://<accountname>.blob.core.windows.net/photos/2011/
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg


Optionally, you can set the **UseFlatBlobListing** parameter of of the **ListBlobs** method to
**true**. This results in every blob being returned as a **CloudBlockBlob**, regardless of directory. Here is the call to **ListBlobs**:

    // Loop over items within the container and output the length and URI.
	foreach (IListBlobItem item in container.ListBlobs(null, true))
	{
	   ...
	}

and here are the results:

	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2010/architecture/description.txt
	Block blob of length 314618: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo3.jpg
	Block blob of length 522713: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo4.jpg
	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2011/architecture/description.txt
	Block blob of length 419048: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo5.jpg
	Block blob of length 506388: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo6.jpg
	Block blob of length 399751: https://<accountname>.blob.core.windows.net/photos/2011/photo7.jpg
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg

For more information, see [CloudBlobContainer.ListBlobs](https://msdn.microsoft.com/library/azure/dd135734.aspx).

## Download blobs

To download blobs, first retrieve a blob reference and then call the **DownloadToStream** method. The following
example uses the **DownloadToStream** method to transfer the blob
contents to a stream object that you can then persist to a local file.

    // Get a reference to a blob named "photo1.jpg".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

    // Save blob contents to a file.
    using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
    {
        blockBlob.DownloadToStream(fileStream);
    }

You can also use the **DownloadToStream** method to download the contents of a blob as a text string.

	// Get a reference to a blob named "myblob.txt"
	CloudBlockBlob blockBlob2 = container.GetBlockBlobReference("myblob.txt");

	string text;
	using (var memoryStream = new MemoryStream())
	{
		blockBlob2.DownloadToStream(memoryStream);
		text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
	}

## Delete blobs

To delete a blob, first get a blob reference and then call the
**Delete** method.

    // Get a reference to a blob named "myblob.txt".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

    // Delete the blob.
    blockBlob.Delete();


## List blobs in pages asynchronously

If you are listing a large number of blobs, or you want to control the number of results you return in one listing operation, you can list blobs in pages of results. This example shows how to return results in pages asynchronously, so that execution is not blocked while waiting to return a large set of results.

This example shows a flat blob listing, but you can also perform a hierarchical listing, by setting the **useFlatBlobListing** parameter of the **ListBlobsSegmentedAsync** method to **false**.

Because the sample method calls an asynchronous method, it must be prefaced with the **async** keyword, and it must return a **Task** object. The await keyword specified for the **ListBlobsSegmentedAsync** method suspends execution of the sample method until the listing task completes.

    async public static Task ListBlobsSegmentedInFlatListing(CloudBlobContainer container)
    {
        // List blobs to the console window, with paging.
        Console.WriteLine("List blobs in pages:");

        int i = 0;
        BlobContinuationToken continuationToken = null;
        BlobResultSegment resultSegment = null;

        // Call ListBlobsSegmentedAsync and enumerate the result segment returned, while the continuation token is non-null.
        // When the continuation token is null, the last page has been returned and execution can exit the loop.
        do
        {
            // This overload allows control of the page size. You can return all remaining results by passing null for the maxResults parameter,
            // or by calling a different overload.
            resultSegment = await container.ListBlobsSegmentedAsync("", true, BlobListingDetails.All, 10, continuationToken, null, null);
            if (resultSegment.Results.Count<IListBlobItem>() > 0) { Console.WriteLine("Page {0}:", ++i); }
            foreach (var blobItem in resultSegment.Results)
            {
                Console.WriteLine("\t{0}", blobItem.StorageUri.PrimaryUri);
            }
            Console.WriteLine();

            //Get the continuation token.
            continuationToken = resultSegment.ContinuationToken;
        }
        while (continuationToken != null);
    }

## Next steps

[AZURE.INCLUDE [vs-storage-dotnet-blobs-next-steps](../../includes/vs-storage-dotnet-blobs-next-steps.md)]
