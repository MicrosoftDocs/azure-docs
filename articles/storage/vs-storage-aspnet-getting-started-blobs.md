<properties
	pageTitle="Get started with blob storage and Visual Studio connected services (ASP.NET) | Microsoft Azure"
	description="How to get started using Azure Blob storage in an ASP.NET project in Visual Studio after connecting to a storage account using Visual Studio connected services"
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

# Get started with blob storage and Visual Studio connected services (ASP.NET)

[AZURE.INCLUDE [storage-try-azure-tools](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

This article describes how to get started using Azure Blob storage after you have created or referenced an Azure storage account in an ASP.NET app by using the  Visual Studio **Add Connected Services** dialog box. The article shows you how to create blob containers and perform other common tasks such as uploading, listing, downloading, and deleting blobs. The samples are written in C\# and
use the [Microsoft Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/dn261237.aspx).

 - For more general information about using Azure Blob storage, see [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md).
 - For more information about ASP.NET projects, see [ASP.NET](http://www.asp.net).


Azure Blob storage is a service for storing large amounts of unstructured data that can be accessed from anywhere in the world via HTTP or HTTPS. A single blob can be any size. Blobs can be things like images, audio and video files, raw data, and document files.

Just as files live in folders, storage blobs live in containers. After you have created a storage account, you create one or more containers in the storage. For example, in a storage called “Scrapbook,” you can create blob containers in the storage called “images” to store pictures and another called “audio” to store audio files. After you create the containers, you can upload individual blob files to them.




## Access blob containers in code

To programmatically access blobs in ASP.NET projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

		using Microsoft.Azure;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Auth;
		using Microsoft.WindowsAzure.Storage.Blob;


2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

		CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

    > [AZURE.NOTE] Use all of the previous code in front of the code in the following sections.

3. Get a **CloudBlobClient** object to reference an existing container in your storage account.

		// Create a blob client.
		CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

        // Get a reference to a container named “mycontainer.”
        CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

> [AZURE.NOTE] Some of the APIs that perform calls out to Azure Storage in ASP.NET 5 are asynchronous. See [Asynchronous Programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information.


## Create a blob container in code

You can also use the **CloudBlobClient** object to create a container in your storage account. All you need to do is add a call to **CreateIfNotExistsAsync** to the above code as shown in the following example.

    // If “mycontainer” doesn’t exist, create it.
    await container.CreateIfNotExistsAsync();

## Upload a blob into a container

Azure Blob storage supports block blobs and page blobs.  In the majority of cases, block blob is the recommended type to use.

To upload a file to a block blob, get a container reference and use it to get
a block blob reference. Once you have a blob reference, you can upload any
stream of data to it by calling the **UploadFromStream** method. This operation will create the blob if it didn't previously exist,
or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

    // Create or overwrite the "myblob" blob with contents from a local file.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        blockBlob.UploadFromStream(fileStream);
    }

## List the blobs in a container

To list the blobs in a container, use the **ListBlobs** method to retrieve the blobs and/or directories
within it. To access the rich set of properties and methods for a
returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**,
**CloudPageBlob**, or **CloudBlobDirectory** object.  If the type is unknown, you can use a
type check to determine which to cast it to.  The following code
demonstrates how to retrieve and output the URI of each item in
the **photos** container.

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

As shown in the previous example, the blob service has the concept of directories within containers, as
well. This is so that you can organize your blobs in a more folder-like
structure. For example, consider the following set of block blobs in a container
named **photos**.

	photo1.jpg
	2010/architecture/description.txt
	2010/architecture/photo3.jpg
	2010/architecture/photo4.jpg
	2011/architecture/photo5.jpg
	2011/architecture/photo6.jpg
	2011/architecture/description.txt
	2011/photo7.jpg

When you call **ListBlobs** on the 'photos' container (as shown in the previous example), the collection returned
will contain **CloudBlobDirectory** and **CloudBlockBlob** objects
representing the directories and blobs contained at the top level. The following example shows the resulting output.

	Directory: https://<accountname>.blob.core.windows.net/photos/2010/
	Directory: https://<accountname>.blob.core.windows.net/photos/2011/
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg


Optionally, you can set the **UseFlatBlobListing** parameter of of the **ListBlobs** method to
**true**. This would result in every blob being returned as a **CloudBlockBlob**, regardless of directory.  The following example shows the call to **ListBlobs**.

    // Loop over items within the container and output the length and URI.
	foreach (IListBlobItem item in container.ListBlobs(null, true))
	{
	   ...
	}

And the next example shows the results.

	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2010/architecture/description.txt
	Block blob of length 314618: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo3.jpg
	Block blob of length 522713: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo4.jpg
	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2011/architecture/description.txt
	Block blob of length 419048: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo5.jpg
	Block blob of length 506388: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo6.jpg
	Block blob of length 399751: https://<accountname>.blob.core.windows.net/photos/2011/photo7.jpg
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg



## Download blobs

To download blobs, use the **DownloadToStream** method. The following
example uses the **DownloadToStream** method to transfer the blob
contents to a stream object that you can then persist to a local file.

    // Retrieve a reference to a blob named "photo1.jpg".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

    // Save blob contents to a file.
    using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
    {
        blockBlob.DownloadToStream(fileStream);
    }

You can also use the **DownloadToStream** method to download the contents of a blob as a text string.

	// Retrieve a reference to a blob named "myblob.txt"
	CloudBlockBlob blockBlob2 = container.GetBlockBlobReference("myblob.txt");

	string text;
	using (var memoryStream = new MemoryStream())
	{
		blockBlob2.DownloadToStream(memoryStream);
		text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
	}

## Delete blobs

To delete a blob, use the **Delete** method.

    // Retrieve reference to a blob named "myblob.txt".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

    // Delete the blob.
    blockBlob.Delete();


## List blobs in pages asynchronously

If you are listing a large number of blobs, or you want to control the number of results you return in one listing operation, you can list blobs in pages of results. The following example shows how to return results in pages asynchronously, so that execution is not blocked while waiting to return a large set of results.

This example shows a flat blob listing, but you can also perform a hierarchical listing, by setting the **useFlatBlobListing** parameter of the **ListBlobsSegmentedAsync** method to **false**.

Because the sample method calls an asynchronous method, it must be prefaced with the **async** keyword, and it must return a **Task** object. The await keyword specified for the **ListBlobsSegmentedAsync** method suspends execution of the sample method until the listing task is complete.

    async public static Task ListBlobsSegmentedInFlatListing(CloudBlobContainer container)
    {
        //List blobs to the console window, with paging.
        Console.WriteLine("List blobs in pages:");

        int i = 0;
        BlobContinuationToken continuationToken = null;
        BlobResultSegment resultSegment = null;

        //Call ListBlobsSegmentedAsync and enumerate the result segment returned, while the continuation token is non-null.
        //When the continuation token is null, the last page has been returned and execution can exit the loop.
        do
        {
            //This overload allows control of the page size. You can return all remaining results by passing null for the maxResults parameter,
            //or by calling a different overload.
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
