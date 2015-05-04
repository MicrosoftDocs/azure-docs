<properties 
    pageTitle="How to use blob storage  (C++) | Microsoft Azure" 
    description="Learn how to use the blob storage service in Azure. Samples are written in C++." 
    services="storage" 
    documentationCenter=".net" 
    authors="tamram" 
    manager="adinah" 
    editor=""/>

<tags 
    ms.service="storage" 
    ms.workload="storage" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/06/2015" 
    ms.author="tamram"/>

# How to use Blob Storage from C++  

[AZURE.INCLUDE [storage-selector-blob-include](../includes/storage-selector-blob-include.md)]

## Overview
This guide will demonstrate how to perform common scenarios using the Azure Blob storage service. The samples are written in C++ and use the [Azure Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp/blob/v1.0.0/README.md). The scenarios covered include **uploading**, **listing**, **downloading**, and **deleting** blobs.  

>[AZURE.NOTE] This guide targets the Azure Storage Client Library for C++ version 1.0.0 and above. The recommended version is Storage Client Library 1.0.0, which is available via [NuGet](http://www.nuget.org/packages/wastorage) or [GitHub](https://github.com/Azure/azure-storage-cpp). 

[AZURE.INCLUDE [storage-blob-concepts-include](../includes/storage-blob-concepts-include.md)]
[AZURE.INCLUDE [storage-create-account-include](../includes/storage-create-account-include.md)]

## Create a C++ application
In this guide, you will use storage features which can be run within a C++ application.  

To do so, you will need to install the Azure Storage Client Library for C++ and create an Azure storage account in your Azure subscription.   

To install the Azure Storage Client Library for C++, you can use the following methods:

-	**Linux:** Follow the instructions given in the [Azure Storage Client Library for C++ README](https://github.com/Azure/azure-storage-cpp/blob/master/README.md) page.  
-	**Windows:** In Visual Studio, click **Tools > NuGet Package Manager > Package Manager Console**. Type the following command into the [NuGet Package Manager console](http://docs.nuget.org/docs/start-here/using-the-package-manager-console) and press **ENTER**.  

		Install-Package wastorage

## Configure your application to access Blob Storage  
Add the following include statements to the top of the C++ file where you want to use the Azure storage APIs to access blobs:  

	#include "was/storage_account.h"
	#include "was/blob.h"

## Setup an Azure storage connection string
An Azure storage client uses a storage connection string to store endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the storage access key for the storage account listed in the Management Portal for the *AccountName* and *AccountKey* values. For information on storage accounts and access keys, see [About Azure Storage Accounts](storage-create-storage-account.md). This example shows how you can declare a static field to hold the connection string:  

	// Define the connection-string with your values.
	const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;AccountName=your_storage_account;AccountKey=your_storage_account_key"));

To test your application in your local Windows computer, you can use the Microsoft Azure [storage emulator](https://msdn.microsoft.com/library/azure/hh403989.aspx)  that is installed with the [Azure SDK](http://azure.microsoft.com/downloads/). The storage emulator is a utility that simulates the Blob, Queue, and Table services available in Azure on your local development machine. The following example shows how you can declare a static field to hold the connection string to your local storage emulator:

	// Define the connection-string with Azure Storage Emulator.
	const utility::string_t storage_connection_string(U("UseDevelopmentStorage=true;"));  

To start the Azure storage emulator, Select the **Start** button or press the **Windows** key. Begin typing **Azure Storage Emulator**, and select **Microsoft Azure Storage Emulator** from the list of applications.  

The following samples assume that you have used one of these two methods to get the storage connection string.  

## Retrieve your connection string
You can use the **cloud_storage_account** class to represent your Storage Account information. To retrieve your storage account information from the storage connection string, you can use the **parse** method.  

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

Next, get a reference to a **cloud_blob_client** class as it allows you to retrieve objects that represent containers and blobs stored within the Blob Storage Service. The following code creates a **cloud_blob_client** object using the storage account object we retrieved above:  

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();  

## How to: Create a container
Every blob in Azure storage must reside in a container. This example shows how to create a container if it does not already exist:  

	try 
	{
		// Retrieve storage account from connection string.
		azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

		// Create the blob client.
		azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

		// Retrieve a reference to a container.
		azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

		// Create the container if it doesn't already exist.
		container.create_if_not_exists();
	}
	catch (const std::exception& e)
	{
		std::wcout << U("Error: ") << e.what() << std::endl;
	}  

By default, the new container is private and you must specify your storage access key to download blobs from this container. If you want to make the files (blobs) within the container available to everyone, you can set the container to be public using the following code:  

	// Make the blob container publicly accessible.
	azure::storage::blob_container_permissions permissions;
	permissions.set_public_access(azure::storage::blob_container_public_access_type::blob);
	container.upload_permissions(permissions);  

Anyone on the Internet can see blobs in a public container, but you can modify or delete them only if you have the appropriate access key.  

## How to: Upload a blob into a container
Azure Blob Storage supports block blobs and page blobs. In the majority of cases, block blob is the recommended type to use.  

To upload a file to a block blob, get a container reference and use it to get a block blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the **upload_from_stream** method. This operation will create the blob if it didn't previously exist, or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.  

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

	// Retrieve a reference to a previously created container.
	azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

	// Retrieve reference to a blob named "my-blob-1".
	azure::storage::cloud_block_blob blockBlob = container.get_block_blob_reference(U("my-blob-1"));

	// Create or overwrite the "my-blob-1" blob with contents from a local file.
	concurrency::streams::istream input_stream = concurrency::streams::file_stream<uint8_t>::open_istream(U("DataFile.txt")).get();
	blockBlob.upload_from_stream(input_stream);
	input_stream.close().wait();

	// Create or overwrite the "my-blob-2" and "my-blob-3" blobs with contents from text.
	// Retrieve a reference to a blob named "my-blob-2".
	azure::storage::cloud_block_blob blob2 = container.get_block_blob_reference(U("my-blob-2"));
	blob2.upload_text(U("more text"));

	// Retrieve a reference to a blob named "my-blob-3".
	azure::storage::cloud_block_blob blob3 = container.get_block_blob_reference(U("my-directory/my-sub-directory/my-blob-3"));
	blob3.upload_text(U("other text"));  

Alternatively, you can use the **upload_from_file** method to upload a file to a block blob.

## How to: List the blobs in a container
To list the blobs in a container, first get a container reference. You can then use the container's **list_blobs** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned **list_blob_item**, you must call the **list_blob_item.as_blob** method to get a  **cloud_blob** object, or the **list_blob.as_directory** method to get a  cloud_blob_directory object. The following code demonstrates how to retrieve and output the URI of each item in the **my-sample-container** container:

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

	// Retrieve a reference to a previously created container.
	azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

	// Output URI of each item.
	azure::storage::list_blob_item_iterator end_of_results;
	for (auto it = container.list_blobs(); it != end_of_results; ++it)
	{
		if (it->is_blob())
		{
			std::wcout << U("Blob: ") << it->as_blob().uri().primary_uri().to_string() << std::endl;
		}
		else
		{
			std::wcout << U("Directory: ") << it->as_directory().uri().primary_uri().to_string() << std::endl;
		}
	}

## How to: Download blobs
To download blobs, first retrieve a blob reference and then call the **download_to_stream** method. The following example uses the **download_to_stream** method to transfer the blob contents to a stream object that you can then persist to a local file.  

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

	// Retrieve a reference to a previously created container.
	azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

	// Retrieve reference to a blob named "my-blob-1".
	azure::storage::cloud_block_blob blockBlob = container.get_block_blob_reference(U("my-blob-1"));

	// Save blob contents to a file.
	concurrency::streams::container_buffer<std::vector<uint8_t>> buffer;
	concurrency::streams::ostream output_stream(buffer);
	blockBlob.download_to_stream(output_stream);

	std::ofstream outfile("DownloadBlobFile.txt", std::ofstream::binary);
	std::vector<unsigned char>& data = buffer.collection();
		
	outfile.write((char *)&data[0], buffer.size());
	outfile.close();  

Alternatively, you can use the **download_to_file** method to download the contents of a blob to a file.
In addition, you can also use the **download_text** method to download the contents of a blob as a text string.  

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

	// Retrieve a reference to a previously created container.
	azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

	// Retrieve reference to a blob named "my-blob-2".
	azure::storage::cloud_block_blob text_blob = container.get_block_blob_reference(U("my-blob-2"));

	// Download the contents of a blog as a text string.
	utility::string_t text = text_blob.download_text();

## How to: Delete blobs
To delete a blob, first get a blob reference and then call the **delete_blob** method on it.  

	// Retrieve storage account from connection string.
	azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);

	// Create the blob client.
	azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();

	// Retrieve a reference to a previously created container.
	azure::storage::cloud_blob_container container = blob_client.get_container_reference(U("my-sample-container"));

	// Retrieve reference to a blob named "my-blob-1".
	azure::storage::cloud_block_blob blockBlob = container.get_block_blob_reference(U("my-blob-1"));

	// Delete the blob.
	blockBlob.delete_blob();

## Next steps
Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

-	[How to use Queue Storage from C++](storage-c-plus-plus-how-to-use-queues.md)
-	[How to use Table Storage from C++](storage-c-plus-plus-how-to-use-tables.md)
-	[Storage Client Library for C++](https://msdn.microsoft.com/library/azure/gg433040.aspx) 
-	[Azure Storage MSDN Reference](https://msdn.microsoft.com/library/azure/gg433040.aspx)
-	[Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)




