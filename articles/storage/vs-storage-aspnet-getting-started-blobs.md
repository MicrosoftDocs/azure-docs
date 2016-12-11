---
title: Get started with Azure blob storage and Visual Studio Connected Services (ASP.NET) | Microsoft Docs
description: How to get started using Azure blob storage in an ASP.NET project in Visual Studio after connecting to a storage account using Visual Studio Connected Services
services: storage
documentationcenter: ''
author: TomArcher
manager: douge
editor: ''

ms.assetid: b3497055-bef8-4c95-8567-181556b50d95
ms.service: storage
ms.workload: web
ms.tgt_pltfrm: vs-getting-started
ms.devlang: na
ms.topic: article
ms.date: 12/02/2016
ms.author: tarcher

---
# Get started with Azure blob storage and Visual Studio Connected Services (ASP.NET)
[!INCLUDE [storage-try-azure-tools-blobs](../../includes/storage-try-azure-tools-blobs.md)]

## Overview

Azure blob storage is a service that stores unstructured data in the cloud as objects/blobs. Blob storage can store any type of text or binary data, such as a document, media file, or application installer. Blob storage is also referred to as object storage.

This tutorial shows how to write ASP.NET code for some common scenarios using Azure blob storage. Scenarios include  creating a blob container, and uploading, listing, downloading, and deleting blobs.

##Prerequisites

* [Microsoft Visual Studio](https://www.visualstudio.com/visual-studio-homepage-vs.aspx)
* [Azure storage account](storage-create-storage-account.md#create-a-storage-account)

[!INCLUDE [storage-blob-concepts-include](../../includes/storage-blob-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../includes/vs-storage-aspnet-getting-started-create-azure-account.md)]

[!INCLUDE [storage-development-environment-include](../../includes/vs-storage-aspnet-getting-started-setup-dev-env.md)]

1. Numbering test

## Create a blob container

The following steps illustrate how to programmatically create a blob container. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives: 
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Auth;
        using Microsoft.WindowsAzure.Storage.Blob;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)
   
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));
   
3. Get a **CloudBlobClient** object represents a blob service client.
   
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object that represents a reference to the desired blob container name. The **CloudBlobClient.GetContainerReference** method does not make a request against blob storage. The reference is returned whether or not the blob container exists. (Change *<blob-container-name>* to the name you want to give the new blob container.)  
   
        CloudBlobContainer container = blobClient.GetContainerReference(<blob-container-name>);

5. Call the **CloudBlobContainer.CreateIfNotExists** method to create the container if it does not yet exist.

    	container.CreateIfNotExists();

## Upload a blob into a blob container

The following steps illustrate how to programmatically upload a blob to a blob container. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives: 
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Auth;
        using Microsoft.WindowsAzure.Storage.Blob;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)
   
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));
   
3. Get a **CloudBlobClient** object represents a blob service client.
   
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object that represents a reference to the desired blob container name. (Change *<blob-container-name>* to the name of the blob container into which you are uploading the blob.)
   
        CloudBlobContainer container = blobClient.GetContainerReference(<blob-container-name>);

5. As explained in the article, [Get started with Azure Blob storage using .NET](./storage-dotnet-how-to-use-blobs.md#blob-service-concepts), Azure storage supports different blob types. To retrieve a reference to a page blob, call the **CloudBlobContainer.GetPageBlobReference** method. To retrieve a reference to a block blob, call the **CloudBlobContainer.GetBlockBlobReference** method. Usually, block blob is the recommended type to use. (Change *<blob-name>* to the name you want to give the blob once uploaded.)

        CloudBlockBlob blob = container.GetBlockBlobReference(<blob-name>);

6. Once you have a blob reference, you can upload any data stream to it by calling the blob reference object's **UploadFromStream** method. The **UploadFromStream** method creates the blob if it doesn't exist,
or overwrites it if it does exist. (Change *<file-to-upload>* to a fully qualified path to the file you want to upload.)

	    using (var fileStream = System.IO.File.OpenRead(<file-to-upload>)
	    {
	        blockBlob.UploadFromStream(fileStream);
	    }

## List the blobs in a blob container

The following steps illustrate how to programmatically list all the blobs in a blob container. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives: 
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Auth;
        using Microsoft.WindowsAzure.Storage.Blob;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)
   
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));
   
3. Get a **CloudBlobClient** object represents a blob service client.
   
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object that represents a reference to the desired blob container name. (Change *<blob-container-name>* to the name of the blob container whose blobs you want to list.)
   
        CloudBlobContainer container = blobClient.GetContainerReference(<blob-container-name>);

5. To list the blobs in a blob container, use the **CloudBlobContainer.ListBlobs** method. The **CloudBlobContainer.ListBlobs** method returns an **IListBlobItem** object that you cast to a **CloudBlockBlob**,
**CloudPageBlob**, or **CloudBlobDirectory** object. The following code snippet enumerates
all the blobs in a blob container, casting the returned object to the appropriate object based on its type,
and adds the name (or URI in the case of a **CloudBlobDirectory**) to a list that can be displayed.

        List<string> blobs = new List<string>();

        foreach (IListBlobItem item in container.ListBlobs(null, false))
        {
            if (item.GetType() == typeof(CloudBlockBlob))
            {
                CloudBlockBlob blob = (CloudBlockBlob)item;
                blobs.Add(blob.Name);
            }
            else if (item.GetType() == typeof(CloudPageBlob))
            {
                CloudPageBlob blob = (CloudPageBlob)item;
                blobs.Add(blob.Name);
            }
            else if (item.GetType() == typeof(CloudBlobDirectory))
            {
                CloudBlobDirectory dir = (CloudBlobDirectory)item;
                blobs.Add(dir.Uri.ToString());
            }
        }

	In addition to blobs, blob containers can contain directories. Let's suppose you run the preceding code against a blob container called *myblobs* with the following hierarchy:

		foo.png
		dir1/bar.png
		dir2/baz.png

	The **blobs** string list would contain values similar to the following:

		foo.png
		<storage-account-url>/myblobs/dir1
		<storage-account-url>/myblobs/dir2

	As you can see, the list includes only the top-level entities; not the nested ones (*bar.png* and *baz.png*). In order to list all the entities within a blob container, you must call the **CloudBlobContainer.ListBlobs** method and pass **true** for the **useFlatBlobListing** parameter.    

        ...
		foreach (IListBlobItem item in container.ListBlobs(useFlatBlobListing:true))
		...

	Setting the **useFlatBlobListing** parameter to **true** returns a flat listing of all entities in the blob container, and yields the following results:

		foo.png
		dir1/bar.png
		dir2/baz.png

## Download blobs

The following steps illustrate how to programmatically download a blob and either persist it to local storage or read the contents into a string. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives: 
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Auth;
        using Microsoft.WindowsAzure.Storage.Blob;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)
   
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));
   
3. Get a **CloudBlobClient** object represents a blob service client.
   
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object that represents a reference to the desired blob container name. (Change *<blob-container-name>* to the name of the blob container from which you are downloading the blob.)
   
        CloudBlobContainer container = blobClient.GetContainerReference(<blob-container-name>);

5. Get a blob reference object by calling **CloudBlobContainer.GetBlockBlobReference** or **CloudBlobContainer.GetPageBlobReference** method. (Change *<blob-name>* to the name of the blob you are downloading.)

	    CloudBlockBlob blob = container.GetBlockBlobReference(<blob-name>);

6. To download a blob, use the **CloudBlockBlob.DownloadToStream** or **CloudPageBlob.DownloadToStream** method, depending on the blob type. The following code snippet uses the **CloudBlockBlob.DownloadToStream** method to transfer a blob's contents to a stream object that is then persisted to a local file. (Change *<local-file-name>* to the fully qualified file name representing where you want the blob downloaded.) 

	    using (var fileStream = System.IO.File.OpenWrite(<local-file-name>))
	    {
	        blob.DownloadToStream(fileStream);
	    }

	You can also use the **DownloadToStream** method to download the contents of a blob as a text string.

	    string contents;
	    using (var memoryStream = new MemoryStream())
	    {
	        blob.DownloadToStream(memoryStream);
	        contents = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
	    }

## Delete blobs

The following steps illustrate how to programmatically delete a blob. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives: 
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Auth;
        using Microsoft.WindowsAzure.Storage.Blob;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)
   
        CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));
   
3. Get a **CloudBlobClient** object represents a blob service client.
   
        CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

4. Get a **CloudBlobContainer** object that represents a reference to the desired blob container name. (Change *<blob-container-name>* to the name of the blob container containing the blob you are deleting.)
   
        CloudBlobContainer container = blobClient.GetContainerReference(<blob-container-name>);

5. Get a blob reference object by calling **CloudBlobContainer.GetBlockBlobReference** or **CloudBlobContainer.GetPageBlobReference** method. (Change *<blob-name>* to the name of the blob you are deleting.)

	    CloudBlockBlob blob = container.GetBlockBlobReference(<blob-name>);

6. To delete a blob, use the **Delete** method.

	    blob.Delete();

## Asynchronously list blobs in pages
If you are listing many blobs, or you want to control the number of results you return in one listing operation, you can list blobs in pages of results. The following example shows how to return results in pages asynchronously, so that execution is not blocked while waiting to return a large set of results.

This example shows a flat blob listing, but you can also perform a hierarchical listing, by setting the **useFlatBlobListing** parameter of the **ListBlobsSegmentedAsync** method to **false**.

Because the sample method calls an asynchronous method, it must be prefaced with the **async** keyword, and it must return a **Task** object. The **await** keyword specified for the **ListBlobsSegmentedAsync** method suspends execution of the sample method until the listing task is complete.

    async public static Task ListBlobsSegmentedInFlatListing(CloudBlobContainer container)
    {
        // List blobs to the console window, with paging.
        Console.WriteLine("List blobs in pages:");

        int i = 0;
        BlobContinuationToken continuationToken = null;
        BlobResultSegment resultSegment = null;

        // Call ListBlobsSegmentedAsync and enumerate the result segment returned, 
		// while the continuation token is non-null.
        // When the continuation token is null, the last page has been returned and 
		// execution can exit the loop.
        do
        {
            // This overload allows control of the page size. You can return all 
			// remaining results by passing null for the maxResults parameter,
            // or by calling a different overload.
            resultSegment = await container.ListBlobsSegmentedAsync("", 
																	true, 
																	BlobListingDetails.All, 
																	10, 
																	continuationToken, 
																	null, 
																	null);
            if (resultSegment.Results.Count<IListBlobItem>() > 0) 
			{ 
				Console.WriteLine("Page {0}:", ++i); 
			}

            foreach (var blobItem in resultSegment.Results)
            {
                Console.WriteLine("\t{0}", blobItem.StorageUri.PrimaryUri);
            }

            Console.WriteLine();

            // Get the continuation token.
            continuationToken = resultSegment.ContinuationToken;
        }
        while (continuationToken != null);
    }

## Next steps
[!INCLUDE [vs-storage-dotnet-blobs-next-steps](../../includes/vs-storage-dotnet-blobs-next-steps.md)]
