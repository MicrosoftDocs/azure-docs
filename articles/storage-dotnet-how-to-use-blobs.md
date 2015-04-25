<properties 
	pageTitle="How to use Blob storage from .NET | Microsoft Azure" 
	description="Learn how to use Microsoft Azure Blob storage to upload, download, list, and delete blob content. Samples are written in C#." 
	services="storage" 
	documentationCenter=".net" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/12/2015" 
	ms.author="tamram"/>


# How to use Blob storage from .NET

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview

This guide will demonstrate how to perform common scenarios using the
Azure Blob storage service. The samples are written in C\# and
use the Azure Storage Client Library for .NET. The scenarios covered include
**uploading**, **listing**, **downloading**, and **deleting** blobs.

> [AZURE.NOTE] This guide targets the Azure .NET Storage Client Library 2.x and above. The recommended version is Storage Client Library 4.x, which is available via [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/) or as part of the [Azure SDK for .NET](/downloads/). See [Programmatically access Blob storage](#programmatically-access-blob-storage) below for more details on obtaining the Storage Client Library.

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]

[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

[AZURE.INCLUDE [storage-configure-connection-string-include](../includes/storage-configure-connection-string-include.md)]

## Programmatically access Blob storage

[AZURE.INCLUDE [storage-dotnet-obtain-assembly](../includes/storage-dotnet-obtain-assembly.md)]

### Namespace declarations
Add the following namespace declarations to the top of any C\# file
in which you wish to programmatically access Azure Storage:

    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Auth;
    using Microsoft.WindowsAzure.Storage.Blob;

Make sure you reference the `Microsoft.WindowsAzure.Storage.dll` assembly.

[AZURE.INCLUDE [storage-dotnet-retrieve-conn-string](../includes/storage-dotnet-retrieve-conn-string.md)]

A **CloudBlobClient** type allows you to retrieve objects that represent
containers and blobs stored within the Blob Storage Service. The
following code creates a **CloudBlobClient** object using the storage
account object we retrieved above:

    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

## Create a container

Every blob in Azure storage must reside in a container. This example shows how to create a container if it does not already exist:

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve a reference to a container. 
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Create the container if it doesn't already exist.
    container.CreateIfNotExists();

By default, the new container is private and you must specify your
storage access key to download blobs from this
container. If you want to make the files within the container available
to everyone, you can set the container to be public using the following
code:

    container.SetPermissions(
        new BlobContainerPermissions { PublicAccess = 
 	    BlobContainerPublicAccessType.Blob }); 

Anyone on the Internet can see blobs in a public container, but you can
modify or delete them only if you have the appropriate access key.

## Upload a blob into a container

Azure Blob Storage supports block blobs and page blobs.  In the majority of cases, block blob is the recommended type to use.

To upload a file to a block blob, get a container reference and use it to get
a block blob reference. Once you have a blob reference, you can upload any
stream of data to it by calling the **UploadFromStream** method. This operation will create the blob if it didn't previously exist,
or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob");

    // Create or overwrite the "myblob" blob with contents from a local file.
    using (var fileStream = System.IO.File.OpenRead(@"path\myfile"))
    {
        blockBlob.UploadFromStream(fileStream);
    } 

## List the blobs in a container

To list the blobs in a container, first get a container reference. You
can then use the container's **ListBlobs** method to retrieve the blobs and/or directories
within it. To access the rich set of properties and methods for a 
returned **IListBlobItem**, you must cast it to a **CloudBlockBlob**, 
**CloudPageBlob**, or **CloudBlobDirectory** object.  If the type is unknown, you can use a 
type check to determine which to cast it to.  The following code 
demonstrates how to retrieve and output the URI of each item in 
the `photos` container:

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client. 
	CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

	// Retrieve reference to a previously created container.
	CloudBlobContainer container = blobClient.GetContainerReference("photos");

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

As shown above, you can name blobs with path information in their names. This creates a virtual directory structure that you can organize and traverse as you would a traditional file system. Note that the directory structure is virtual only - the only resources available in Blob storage are containers and blobs. However, the storage client library offers a **CloudBlobDirectory** object to refer to a virtual directory and simplify the process of working with blobs that are organized in this way.

For example, consider the following set of block blobs in a container named `photos`:

	photo1.jpg
	2010/architecture/description.txt
	2010/architecture/photo3.jpg
	2010/architecture/photo4.jpg
	2011/architecture/photo5.jpg
	2011/architecture/photo6.jpg
	2011/architecture/description.txt
	2011/photo7.jpg

When you call **ListBlobs** on the 'photos' container (as in the above sample), a hierarchical listing is returned. It contains both **CloudBlobDirectory** and **CloudBlockBlob** objects, representing the directories and blobs in the container, respectively. The resulting output looks like:

	Directory: https://<accountname>.blob.core.windows.net/photos/2010/
	Directory: https://<accountname>.blob.core.windows.net/photos/2011/
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg


Optionally, you can set the **UseFlatBlobListing** parameter of of the **ListBlobs** method to 
**true**. In this case, every blob in the container is returned as a **CloudBlockBlob** object. The call to **ListBlobs** to return a flat listing looks like this:

    // Loop over items within the container and output the length and URI.
	foreach (IListBlobItem item in container.ListBlobs(null, true))
	{
	   ...
	}

and the results look like this:

	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2010/architecture/description.txt
	Block blob of length 314618: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo3.jpg
	Block blob of length 522713: https://<accountname>.blob.core.windows.net/photos/2010/architecture/photo4.jpg
	Block blob of length 4: https://<accountname>.blob.core.windows.net/photos/2011/architecture/description.txt
	Block blob of length 419048: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo5.jpg
	Block blob of length 506388: https://<accountname>.blob.core.windows.net/photos/2011/architecture/photo6.jpg
	Block blob of length 399751: https://<accountname>.blob.core.windows.net/photos/2011/photo7.jpg
	Block blob of length 505623: https://<accountname>.blob.core.windows.net/photos/photo1.jpg


## Download blobs

To download blobs, first retrieve a blob reference and then call the **DownloadToStream** method. The following
example uses the **DownloadToStream** method to transfer the blob
contents to a stream object that you can then persist to a local file.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "photo1.jpg".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("photo1.jpg");

    // Save blob contents to a file.
    using (var fileStream = System.IO.File.OpenWrite(@"path\myfile"))
    {
        blockBlob.DownloadToStream(fileStream);
    } 

You can also use the **DownloadToStream** method to download the contents of a blob as a text string.

	// Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

	// Retrieve reference to a blob named "myblob.txt"
	CloudBlockBlob blockBlob2 = container.GetBlockBlobReference("myblob.txt");

	string text;
	using (var memoryStream = new MemoryStream())
	{
		blockBlob2.DownloadToStream(memoryStream);
		text = System.Text.Encoding.UTF8.GetString(memoryStream.ToArray());
	}

## Delete blobs

To delete a blob, first get a blob reference and then call the
**Delete** method on it.

    // Retrieve storage account from connection string.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

    // Create the blob client.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

    // Retrieve reference to a previously created container.
    CloudBlobContainer container = blobClient.GetContainerReference("mycontainer");

    // Retrieve reference to a blob named "myblob.txt".
    CloudBlockBlob blockBlob = container.GetBlockBlobReference("myblob.txt");

    // Delete the blob.
    blockBlob.Delete(); 


## List blobs in pages asynchronously

If you are listing a large number of blobs, or you want to control the number of results you return in one listing operation, you can list blobs in pages of results. This example shows how to return results in pages asynchronously, so that execution is not blocked while waiting to return a large set of results.

This example shows a flat blob listing, but you can also perform a hierarchical listing, by setting the `useFlatBlobListing` parameter of the **ListBlobsSegmentedAsync** method to `false`.

Because the sample method calls an asynchronous method, it must be prefaced with the `async` keyword, and it must return a **Task** object. The await keyword specified for the **ListBlobsSegmentedAsync** method suspends execution of the sample method until the listing task completes.

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

Now that you've learned the basics of blob storage, follow these links
to learn about more complex storage tasks.
<ul>
<li>View the Blob service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409">Storage Client Library for .NET reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/library/azure/dd179355">REST API reference</a></li>
  </ul>
</li>
<li>Learn about more advanced tasks you can perform with Azure Storage at <a href="http://msdn.microsoft.com/library/azure/gg433040.aspx">Storing and Accessing Data in Azure</a>.</li>
<li>Learn how to simplify the code you write to work with Azure Storage by using the <a href="../websites-dotnet-webjobs-sdk/">Azure WebJobs SDK.</li>
<li>View more feature guides to learn about additional options for storing data in Azure.
  <ul>
    <li>Use <a href="/documentation/articles/storage-dotnet-how-to-use-tables/">Table Storage</a> to store structured data.</li>
    <li>Use <a href="/documentation/articles/storage-dotnet-how-to-use-queues/">Queue Storage</a> to store unstructured data.</li>
    <li>Use <a href="/documentation/articles/sql-database-dotnet-how-to-use/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>

  [Blob5]: ./media/storage-dotnet-how-to-use-blobs/blob5.png
  [Blob6]: ./media/storage-dotnet-how-to-use-blobs/blob6.png
  [Blob7]: ./media/storage-dotnet-how-to-use-blobs/blob7.png
  [Blob8]: ./media/storage-dotnet-how-to-use-blobs/blob8.png
  [Blob9]: ./media/storage-dotnet-how-to-use-blobs/blob9.png
  
  [Storing and Accessing Data in Azure]: http://msdn.microsoft.com/library/azure/gg433040.aspx
  [Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Configuring Connection Strings]: http://msdn.microsoft.com/library/azure/ee758697.aspx
  [.NET client library reference]: http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409
  [REST API reference]: http://msdn.microsoft.com/library/azure/dd179355
