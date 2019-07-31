---
title: How to use object (Blob) storage from C++ - Azure | Microsoft Docs
description: Store unstructured data in the cloud with Azure Blob (object) storage.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: conceptual
ms.date: 03/21/2018
ms.author: mhopkins
ms.reviewer: seguler
ms.subservice: blobs
---

# How to use Blob storage from C++

This guide demonstrates how to perform common scenarios using Azure Blob storage. The examples show how to upload, list, download, and delete blobs. The samples are written in C++ and use the [Azure Storage Client Library for C++](https://github.com/Azure/azure-storage-cpp/blob/master/README.md).   

To learn more about Blob storage, see [Introduction to Azure Blob storage](storage-blobs-introduction.md).

> [!NOTE]
> This guide targets the Azure Storage Client Library for C++ version 1.0.0 and above. Microsoft recommends using the latest version of the Storage Client Library for C++, available via [NuGet](https://www.nuget.org/packages/wastorage) or [GitHub](https://github.com/Azure/azure-storage-cpp).

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Create a C++ application
In this guide, you will use storage features which can be run within a C++ application.  

To do so, you will need to install the Azure Storage Client Library for C++ and create an Azure storage account in your Azure subscription.   

To install the Azure Storage Client Library for C++, you can use the following methods:

* **Linux:** Follow the instructions given in the [Azure Storage Client Library for C++ README](https://github.com/Azure/azure-storage-cpp/blob/master/README.md) page.  
* **Windows:** In Visual Studio, click **Tools > NuGet Package Manager > Package Manager Console**. Type the following command into the [NuGet Package Manager console](https://docs.nuget.org/docs/start-here/using-the-package-manager-console) and press **ENTER**.  
  
     Install-Package wastorage

## Configure your application to access Blob storage
Add the following include statements to the top of the C++ file where you want to use the Azure storage APIs to access blobs:  

```cpp
#include <was/storage_account.h>
#include <was/blob.h>
#include <cpprest/filestream.h>  
#include <cpprest/containerstream.h> 
```

## Setup an Azure storage connection string
An Azure storage client uses a storage connection string to store endpoints and credentials for accessing data management services. When running in a client application, you must provide the storage connection string in the following format, using the name of your storage account and the storage access key for the storage account listed in the [Azure Portal](https://portal.azure.com) for the *AccountName* and *AccountKey* values. For information on storage accounts and access keys, see [About Azure Storage Accounts](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json). This example shows how you can declare a static field to hold the connection string:  

```cpp
// Define the connection-string with your values.
const utility::string_t storage_connection_string(U("DefaultEndpointsProtocol=https;AccountName=your_storage_account;AccountKey=your_storage_account_key"));
```

To test your application in your local Windows computer, you can use the Microsoft Azure [storage emulator](../storage-use-emulator.md) that is installed with the [Azure SDK](https://azure.microsoft.com/downloads/). The storage emulator is a utility that simulates the Blob, Queue, and Table services available in Azure on your local development machine. The following example shows how you can declare a static field to hold the connection string to your local storage emulator:

```cpp
// Define the connection-string with Azure Storage Emulator.
const utility::string_t storage_connection_string(U("UseDevelopmentStorage=true;"));  
```

To start the Azure storage emulator, Select the **Start** button or press the **Windows** key. Begin typing **Azure Storage Emulator**, and select **Microsoft Azure Storage Emulator** from the list of applications.  

The following samples assume that you have used one of these two methods to get the storage connection string.  

## Retrieve your storage account
You can use the **cloud_storage_account** class to represent your Storage Account information. To retrieve your storage account information from the storage connection string, you can use the **parse** method.  

```cpp
// Retrieve storage account from connection string.
azure::storage::cloud_storage_account storage_account = azure::storage::cloud_storage_account::parse(storage_connection_string);
```

Next, get a reference to a **cloud_blob_client** class as it allows you to retrieve objects that represent containers and blobs stored within Blob storage. The following code creates a **cloud_blob_client** object using the storage account object we retrieved above:  

```cpp
// Create the blob client.
azure::storage::cloud_blob_client blob_client = storage_account.create_cloud_blob_client();  
```

## How to: Create a container
[!INCLUDE [storage-container-naming-rules-include](../../../includes/storage-container-naming-rules-include.md)]

This example shows how to create a container if it does not already exist:  

```cpp
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
```

By default, the new container is private and you must specify your storage access key to download blobs from this container. If you want to make the files (blobs) within the container available to everyone, you can set the container to be public using the following code:  

```cpp
// Make the blob container publicly accessible.
azure::storage::blob_container_permissions permissions;
permissions.set_public_access(azure::storage::blob_container_public_access_type::blob);
container.upload_permissions(permissions);  
```

Anyone on the Internet can see blobs in a public container, but you can modify or delete them only if you have the appropriate access key.  

## How to: Upload a blob into a container
Azure Blob storage supports block blobs and page blobs. In the majority of cases, block blob is the recommended type to use.  

To upload a file to a block blob, get a container reference and use it to get a block blob reference. Once you have a blob reference, you can upload any stream of data to it by calling the **upload_from_stream** method. This operation will create the blob if it didn't previously exist, or overwrite it if it does exist. The following example shows how to upload a blob into a container and assumes that the container was already created.  

```cpp
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
```

Alternatively, you can use the **upload_from_file** method to upload a file to a block blob.

## How to: List the blobs in a container
To list the blobs in a container, first get a container reference. You can then use the container's **list_blobs** method to retrieve the blobs and/or directories within it. To access the rich set of properties and methods for a returned **list_blob_item**, you must call the **list_blob_item.as_blob** method to get a  **cloud_blob** object, or the **list_blob.as_directory** method to get a  cloud_blob_directory object. The following code demonstrates how to retrieve and output the URI of each item in the **my-sample-container** container:

```cpp
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
```

For more details on listing operations, see [List Azure Storage Resources in C++](../storage-c-plus-plus-enumeration.md).

## How to: Download blobs
To download blobs, first retrieve a blob reference and then call the **download_to_stream** method. The following example uses the **download_to_stream** method to transfer the blob contents to a stream object that you can then persist to a local file.  

```cpp
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
```

Alternatively, you can use the **download_to_file** method to download the contents of a blob to a file.
In addition, you can also use the **download_text** method to download the contents of a blob as a text string.  

```cpp
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
```

## How to: Delete blobs
To delete a blob, first get a blob reference and then call the **delete_blob** method on it.  

```cpp
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
```

## Next steps
Now that you've learned the basics of blob storage, follow these links to learn more about Azure Storage.  

* [How to use Queue Storage from C++](../storage-c-plus-plus-how-to-use-queues.md)
* [How to use Table Storage from C++](../../cosmos-db/table-storage-how-to-use-c-plus.md)
* [List Azure Storage Resources in C++](../storage-c-plus-plus-enumeration.md)
* [Storage Client Library for C++ Reference](https://azure.github.io/azure-storage-cpp)
* [Azure Storage Documentation](https://azure.microsoft.com/documentation/services/storage/)
* [Transfer data with the AzCopy command-line utility](../storage-use-azcopy.md)

